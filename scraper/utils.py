import logging
import re
import time
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup

from config.settings import REQUEST_DELAY_SECONDS, SCRAPE_TIMEOUT_SECONDS

LOG_PATH = Path(__file__).resolve().parents[1] / "logs" / "app.log"
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.FileHandler(LOG_PATH), logging.StreamHandler()],
)

logger = logging.getLogger(__name__)


def make_request(
    url: str,
    headers: Optional[dict] = None,
    params: Optional[dict] = None,
    retries: int = 3,
    delay: int = 2,
) -> Optional[requests.Response]:
    last_exc: Optional[Exception] = None
    for attempt in range(retries):
        try:
            resp = requests.get(
                url, headers=headers, params=params, timeout=SCRAPE_TIMEOUT_SECONDS
            )
            return resp
        except Exception as exc:  # noqa: BLE001 - keep broad for scraper resilience
            last_exc = exc
            sleep_for = delay * (2**attempt)
            logger.warning("Request failed (%s). Retrying in %ss", exc, sleep_for)
            time.sleep(sleep_for)
    logger.error("Request failed after %s retries: %s", retries, last_exc)
    return None


def get_chrome_driver():
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    driver.set_page_load_timeout(SCRAPE_TIMEOUT_SECONDS)
    return driver


def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    # Strip HTML tags
    soup = BeautifulSoup(text, "html.parser")
    cleaned = soup.get_text(" ")
    # Normalize whitespace
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned
