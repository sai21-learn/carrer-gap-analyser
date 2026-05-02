import pytest

from backend.core.nlp.skill_extractor import extract_skills, aggregate_skills
from backend.core.nlp.skill_normalizer import normalize, normalize_list
from backend.core.nlp.semantic_matcher import compute_similarity


class TestSkillNormalizer:
    def test_normalizes_alias(self):
        assert normalize("ml") == "Machine Learning"

    def test_already_normalized(self):
        assert normalize("Machine Learning") == "Machine Learning"

    def test_case_insensitive(self):
        assert normalize("PYTHON") == "Python"

    def test_normalize_list_deduplicates(self):
        result = normalize_list(["ml", "Machine Learning", "Python"])
        assert result.count("Machine Learning") == 1
        assert "Python" in result

    def test_unknown_skill_passes_through(self):
        result = normalize("QuantumFoo")
        assert result == "Quantumfoo" or result == "QuantumFoo"


class TestSkillExtractor:
    def test_extracts_python(self):
        skills = extract_skills("We need Python and SQL skills.")
        assert "Python" in skills

    def test_extracts_sql(self):
        skills = extract_skills("Strong SQL and database knowledge required.")
        assert "SQL" in skills

    def test_extracts_alias(self):
        skills = extract_skills("Experience with ML and deep learning frameworks.")
        assert any("Machine Learning" in s or "Deep Learning" in s for s in skills)
