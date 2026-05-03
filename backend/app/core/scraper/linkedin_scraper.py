import json
import logging
import time
from pathlib import Path
from typing import List
from urllib.parse import quote_plus

from bs4 import BeautifulSoup

from app.core.config.settings import MAX_JOBS_PER_PLATFORM, REQUEST_DELAY_SECONDS, USE_MOCK_DATA, DATA_STORE_DIR
from app.core.scraper.utils import clean_text, make_request

logger = logging.getLogger(__name__)

MOCK_PATH = DATA_STORE_DIR / "mock_jobs.json"


def _load_mock(role: str, limit: int) -> List[dict]:
    with open(MOCK_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    filtered = [j for j in data if role.lower() in j.get("title", "").lower()]
    return filtered[:limit]


def scrape_linkedin(
    role: str, limit: int = MAX_JOBS_PER_PLATFORM, filters=None
) -> List[dict]:
    if USE_MOCK_DATA:
        return _load_mock(role, limit)

    url = (
        "https://www.linkedin.com/jobs/search/"
        f"?keywords={quote_plus(role)}&location=India&f_TPR=r604800"
    )
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
    }

    resp = make_request(url, headers=headers)
    if resp is None:
        return []
    if resp.status_code in {403, 429}:
        logger.warning("LinkedIn blocked request: %s", resp.status_code)
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    cards = soup.select(".base-search-card")
    results: List[dict] = []

    for card in cards[:limit]:
        title = clean_text(
            card.select_one(".base-search-card__title").get_text()
            if card.select_one(".base-search-card__title")
            else ""
        )
        company = clean_text(
            card.select_one(".base-search-card__subtitle").get_text()
            if card.select_one(".base-search-card__subtitle")
            else ""
        )
        location = clean_text(
            card.select_one(".job-search-card__location").get_text()
            if card.select_one(".job-search-card__location")
            else ""
        )
        link = card.get("href") or None

        description = ""
        if link:
            detail = make_request(link, headers=headers)
            if detail and detail.status_code == 200:
                detail_soup = BeautifulSoup(detail.text, "html.parser")
                desc_el = detail_soup.select_one(".description__text")
                if desc_el:
                    description = clean_text(desc_el.get_text(" "))
            else:
                logger.warning("LinkedIn detail page fetch failed for %s", link)
            time.sleep(REQUEST_DELAY_SECONDS)
        results.append(
            {
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "platform": "linkedin",
                "url": link,
            }
        )

    return results
