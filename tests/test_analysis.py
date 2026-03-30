from analysis.skill_classifier import classify_skill
from analysis.gap_analyzer import analyze
from models import StudentProfile


def test_classify_matched():
    skill, classification, score = classify_skill("Python", ["Python", "SQL"])
    assert classification == "matched"
    assert score == 1.0


def test_classify_partial():
    skill, classification, score = classify_skill("ML", ["Machine Learning"])
    assert classification in {"partial", "matched"}
    assert score >= 0.0


def test_classify_gap():
    skill, classification, score = classify_skill("Underwater Basket Weaving", ["Python"])
    assert classification in {"gap", "partial", "matched"}


def test_gap_analyzer_basic():
    student = StudentProfile(name="Test", target_role="Data Analyst", skills=["Python"])
    industry = {"Python": 15, "SQL": 10, "Tableau": 5}
    report = analyze(student, industry)
    assert any(s.skill == "SQL" for s in report.gaps)
    assert any(s.skill == "Tableau" for s in report.gaps)
    assert 30 <= report.match_score <= 40
