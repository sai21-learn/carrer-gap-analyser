import streamlit as st

from analysis.gap_analyzer import analyze
from nlp.skill_extractor import aggregate_skills
from recommender.resource_recommender import recommend_all
from scraper.job_scraper import fetch_jobs
from ui.input_form import render_input_form
from ui.report_view import render_report

st.set_page_config(
    page_title="AI Skill Gap Analyzer",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
<style>
    .main { background-color: #0f1117; }
    .stButton > button {
        background-color: #4f46e5;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.6em 2em;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    .stButton > button:hover { background-color: #4338ca; }
    .skill-tag {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 500;
        margin: 3px;
    }
    .tag-matched { background-color: #166534; color: #bbf7d0; }
    .tag-partial  { background-color: #78350f; color: #fde68a; }
    .tag-gap      { background-color: #7f1d1d; color: #fecaca; }
</style>
""",
    unsafe_allow_html=True,
)

form_result = render_input_form()

if form_result:
    profile, filters = form_result
    with st.spinner("🔍 Fetching live job data..."):
        jobs = fetch_jobs(profile.target_role, filters=filters)

    with st.spinner("🧠 Analyzing your skills with NLP..."):
        industry_skills = aggregate_skills(jobs)
        gap_report = analyze(profile, industry_skills)
        resources = recommend_all([s.skill for s in gap_report.gaps])

    render_report(gap_report, resources, jobs)
