import json
import logging
from pathlib import Path
from typing import List

from config.settings import MAX_JOBS_PER_PLATFORM, USE_MOCK_DATA
from scraper.utils import clean_text, get_chrome_driver

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).resolve().parents[1]
MOCK_PATH = ROOT_DIR / "data" / "mock_jobs.json"


def _load_mock(role: str, limit: int) -> List[dict]:
    with open(MOCK_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    filtered = [j for j in data if role.lower() in j.get("title", "").lower()]
    return filtered[:limit]


def scrape_naukri(
    role: str, limit: int = MAX_JOBS_PER_PLATFORM, filters=None
) -> List[dict]:
    if USE_MOCK_DATA:
        return _load_mock(role, limit)

    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait

    role_slug = role.lower().replace(" ", "-")
    url = f"https://www.naukri.com/{role_slug}-jobs"

    driver = None
    results: List[dict] = []
    try:
        driver = get_chrome_driver()
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".jobTuple"))
        )
        cards = driver.find_elements(By.CSS_SELECTOR, ".jobTuple")
        for card in cards[:limit]:
            title_el = card.find_elements(By.CSS_SELECTOR, ".title")
            company_el = card.find_elements(By.CSS_SELECTOR, ".companyName")
            location_el = card.find_elements(By.CSS_SELECTOR, ".location")
            desc_el = card.find_elements(By.CSS_SELECTOR, ".job-desc")

            title = clean_text(title_el[0].text if title_el else "")
            company = clean_text(company_el[0].text if company_el else "")
            location = clean_text(location_el[0].text if location_el else "")
            description = clean_text(desc_el[0].text if desc_el else "")

            results.append(
                {
                    "title": title,
                    "company": company,
                    "location": location,
                    "description": description,
                    "platform": "naukri",
                    "url": None,
                }
            )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Naukri scrape failed: %s", exc)
        return []
    finally:
        if driver:
            driver.quit()

    return results
