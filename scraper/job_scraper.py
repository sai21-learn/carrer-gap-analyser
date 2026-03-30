import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List, Optional

from config.settings import SCRAPE_PLATFORMS, SUPPORTED_ROLES, USE_MOCK_DATA
from models import JobPosting, JobSearchFilters
from scraper.adzuna_scraper import scrape_adzuna
from scraper.linkedin_scraper import scrape_linkedin
from scraper.naukri_scraper import scrape_naukri

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parents[1]
MOCK_PATH = ROOT_DIR / "data" / "mock_jobs.json"

PLATFORM_FUNCS = {
    "adzuna": scrape_adzuna,
    "linkedin": scrape_linkedin,
    "naukri": scrape_naukri,
}


def _load_mock(role: str) -> List[JobPosting]:
    with open(MOCK_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    filtered = [j for j in data if role.lower() in j.get("title", "").lower()]
    return [JobPosting(**job) for job in filtered]


def fetch_jobs(
    role: str, filters: Optional[JobSearchFilters] = None
) -> List[JobPosting]:
    if role not in SUPPORTED_ROLES:
        raise ValueError(
            f"Unsupported role '{role}'. Valid roles: {', '.join(SUPPORTED_ROLES)}"
        )

    if USE_MOCK_DATA:
        return _load_mock(role)

    results: List[dict] = []
    with ThreadPoolExecutor(max_workers=len(SCRAPE_PLATFORMS)) as executor:
        futures = []
        for platform in SCRAPE_PLATFORMS:
            func = PLATFORM_FUNCS.get(platform)
            if func:
                futures.append(executor.submit(func, role, filters=filters))
        for future in as_completed(futures):
            try:
                results.extend(future.result())
            except Exception as exc:  # noqa: BLE001
                logger.error("Scraper failed: %s", exc)

    # Dedupe by title+company
    seen = set()
    deduped: List[dict] = []
    for job in results:
        key = (job.get("title"), job.get("company"))
        if key in seen:
            continue
        seen.add(key)
        deduped.append(job)

    if len(deduped) < 3:
        logger.warning(
            "Low scrape count (%s). Returning live results only.", len(deduped)
        )

    final_jobs = [JobPosting(**job) for job in deduped]
    logger.info("Fetched %s postings for role '%s'", len(final_jobs), role)
    return final_jobs
