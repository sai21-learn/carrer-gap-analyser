import pytest

from scraper.utils import clean_text
from scraper.job_scraper import fetch_jobs
from config.settings import SUPPORTED_ROLES


class TestCleanText:
    def test_removes_html_tags(self):
        result = clean_text("<p>Hello <b>World</b></p>")
        assert "<" not in result
        assert "Hello" in result
        assert "World" in result

    def test_strips_whitespace(self):
        result = clean_text("  lots   of   spaces  ")
        assert result == "lots of spaces"

    def test_handles_empty_string(self):
        assert clean_text("") == ""

    def test_handles_none_input(self):
        assert clean_text(None) == ""


class TestFetchJobs:
    def test_returns_list(self, monkeypatch):
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        jobs = fetch_jobs("Data Analyst")
        assert isinstance(jobs, list)

    def test_returns_job_postings(self, monkeypatch):
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        from models import JobPosting
        jobs = fetch_jobs("Data Analyst")
        assert len(jobs) > 0
        assert all(isinstance(j, JobPosting) for j in jobs)

    def test_raises_on_invalid_role(self):
        with pytest.raises(ValueError):
            fetch_jobs("Underwater Archaeologist")

    def test_filters_by_role(self, monkeypatch):
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        jobs = fetch_jobs("Machine Learning Engineer")
        assert len(jobs) > 0
