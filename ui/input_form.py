import streamlit as st

from config.settings import SUPPORTED_ROLES
from models import StudentProfile


def render_input_form() -> StudentProfile | None:
    st.title("🎯 AI Skill Gap Analyzer")
    st.caption("Discover what skills you need for your dream role — powered by real job market data.")

    name = st.text_input("Your Name *", max_chars=100)
    role = st.selectbox("Target Role *", SUPPORTED_ROLES)
    skills_input = st.text_area(
        "Your Current Skills *",
        placeholder="comma-separated, e.g., Python, SQL, Excel",
        height=120,
    )

    submitted = st.button("🔍  Analyze My Skills")

    if submitted:
        skills_list = [s.strip() for s in skills_input.split(",") if s.strip()]
        if not name.strip():
            st.error("Please enter your name.")
            return None
        if not skills_list:
            st.error("Please enter at least one skill.")
            return None
        return StudentProfile(name=name, target_role=role, skills=skills_list)

    return None
