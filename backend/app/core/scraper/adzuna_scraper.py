import logging
from datetime import datetime
from typing import List, Optional

from app.core.config.settings import (
    ADZUNA_APP_ID,
    ADZUNA_APP_KEY,
    ADZUNA_CONTRACT,
    ADZUNA_COUNTRY,
    ADZUNA_DEFAULT_LOCATION,
    ADZUNA_FULL_TIME,
    ADZUNA_PART_TIME,
    ADZUNA_PERMANENT,
    ADZUNA_SALARY_MAX,
    ADZUNA_SALARY_MIN,
    ADZUNA_SORT_BY,
    ADZUNA_WHAT_EXCLUDE,
    MAX_JOBS_PER_PLATFORM,
)
from app.schemas import JobSearchFilters
from app.core.scraper.utils import make_request

logger = logging.getLogger(__name__)


def _apply_bool_param(params: dict, key: str, value: Optional[bool | str]) -> None:
    if value is None:
        return
    if isinstance(value, bool):
        if value:
            params[key] = "1"
        return
    if str(value).strip():
        params[key] = value


def _apply_text_param(params: dict, key: str, value: Optional[str]) -> None:
    if value and str(value).strip():
        params[key] = value


def _build_params(role: str, limit: int, filters: Optional[JobSearchFilters]) -> dict:
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": limit,
        "what": role,
        "content-type": "application/json",
    }
    _apply_text_param(params, "where", ADZUNA_DEFAULT_LOCATION)
    _apply_text_param(params, "what_exclude", ADZUNA_WHAT_EXCLUDE)
    _apply_text_param(params, "sort_by", ADZUNA_SORT_BY)
    _apply_text_param(params, "salary_min", ADZUNA_SALARY_MIN)
    _apply_text_param(params, "salary_max", ADZUNA_SALARY_MAX)
    _apply_bool_param(params, "full_time", ADZUNA_FULL_TIME)
    _apply_bool_param(params, "part_time", ADZUNA_PART_TIME)
    _apply_bool_param(params, "permanent", ADZUNA_PERMANENT)
    _apply_bool_param(params, "contract", ADZUNA_CONTRACT)

    if filters:
        _apply_text_param(params, "where", filters.location)
        _apply_text_param(params, "sort_by", filters.sort_by)
        _apply_text_param(params, "what_exclude", filters.what_exclude)
        if filters.salary_min is not None:
            params["salary_min"] = str(filters.salary_min)
        if filters.salary_max is not None:
            params["salary_max"] = str(filters.salary_max)
        _apply_bool_param(params, "full_time", filters.full_time)
        _apply_bool_param(params, "part_time", filters.part_time)
        _apply_bool_param(params, "permanent", filters.permanent)
        _apply_bool_param(params, "contract", filters.contract)
    return params


def _parse_posted_at(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _parse_number(value: Optional[object]) -> Optional[float]:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def scrape_adzuna(
    role: str,
    limit: int = MAX_JOBS_PER_PLATFORM,
    filters: Optional[JobSearchFilters] = None,
) -> List[dict]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        logger.warning(
            "Adzuna credentials missing. Set ADZUNA_APP_ID and ADZUNA_APP_KEY."
        )
        return []

    url = f"https://api.adzuna.com/v1/api/jobs/{ADZUNA_COUNTRY}/search/1"
    headers = {"Accept": "application/json"}
    params = _build_params(role, limit, filters)

    resp = make_request(url, headers=headers, params=params)
    if resp is None:
        return []

    if resp.status_code != 200:
        logger.warning(
            "Adzuna request failed: %s %s", resp.status_code, resp.text[:200]
        )
        return []

    payload = resp.json()
    results = payload.get("results", [])
    jobs: List[dict] = []
    for item in results:
        company = item.get("company", {}) or {}
        location = item.get("location", {}) or {}
        jobs.append(
            {
                "title": item.get("title", ""),
                "company": company.get("display_name", ""),
                "location": location.get("display_name", ""),
                "description": item.get("description", ""),
                "platform": "adzuna",
                "url": item.get("redirect_url"),
                "posted_at": _parse_posted_at(item.get("created")),
                "salary_min": _parse_number(item.get("salary_min")),
                "salary_max": _parse_number(item.get("salary_max")),
                "contract_type": item.get("contract_type"),
                "contract_time": item.get("contract_time"),
            }
        )

    return jobs
