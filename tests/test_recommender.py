from backend.core.recommender.resource_recommender import get_resources, recommend_all


def test_get_resources_known():
    res = get_resources("Python")
    assert len(res) >= 1


def test_get_resources_fallback():
    res = get_resources("TotallyUnknownSkill")
    assert len(res) == 1
    assert "Learn" in res[0].title


def test_recommend_all():
    recs = recommend_all(["Python", "SQL"])
    assert "Python" in recs
    assert "SQL" in recs
