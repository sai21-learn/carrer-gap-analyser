import streamlit as st

from config.settings import ADZUNA_DEFAULT_LOCATION, SUPPORTED_ROLES
from models import JobSearchFilters, StudentProfile


def render_input_form() -> tuple[StudentProfile, JobSearchFilters] | None:
    st.title("🎯 AI Skill Gap Analyzer")
    st.caption(
        "Discover what skills you need for your dream role — powered by real job market data."
    )

    name = st.text_input("Your Name *", max_chars=100)
    role = st.selectbox("Target Role *", SUPPORTED_ROLES)
    skills_input = st.text_area(
        "Your Current Skills *",
        placeholder="comma-separated, e.g., Python, SQL, Excel",
        height=120,
    )

    with st.expander("Job filters (optional)", expanded=False):
        location = st.text_input("Location", value=ADZUNA_DEFAULT_LOCATION or "")
        sort_label = st.selectbox(
            "Sort by",
            ["Default", "Salary (Adzuna)"],
            help="Uses Adzuna's sort_by parameter. Choose Default to let the API decide.",
        )
        sort_override = st.text_input(
            "Custom sort_by (optional)",
            help="Advanced: enter any Adzuna sort_by value to override the selection above.",
        )
        what_exclude = st.text_input(
            "Exclude keywords", help="Comma or space separated."
        )
        salary_min = st.number_input(
            "Minimum salary (annual)", min_value=0, step=1000, value=0
        )
        salary_max = st.number_input(
            "Maximum salary (annual)", min_value=0, step=1000, value=0
        )
        col1, col2 = st.columns(2)
        with col1:
            full_time = st.checkbox("Full-time only")
            permanent = st.checkbox("Permanent only")
        with col2:
            part_time = st.checkbox("Part-time only")
            contract = st.checkbox("Contract only")

    submitted = st.button("🔍  Analyze My Skills")

    if submitted:
        skills_list = [s.strip() for s in skills_input.split(",") if s.strip()]
        if not name.strip():
            st.error("Please enter your name.")
            return None
        if not skills_list:
            st.error("Please enter at least one skill.")
            return None
        sort_by = ""
        if sort_label == "Salary (Adzuna)":
            sort_by = "salary"
        if sort_override.strip():
            sort_by = sort_override.strip()

        filters = JobSearchFilters(
            location=location.strip() or None,
            sort_by=sort_by or None,
            what_exclude=what_exclude.strip() or None,
            salary_min=int(salary_min) if salary_min > 0 else None,
            salary_max=int(salary_max) if salary_max > 0 else None,
            full_time=full_time or None,
            part_time=part_time or None,
            permanent=permanent or None,
            contract=contract or None,
        )
        return StudentProfile(name=name, target_role=role, skills=skills_list), filters

    return None
