import streamlit as st

from config.settings import ADZUNA_DEFAULT_LOCATION, ROLE_SKILLS, SUPPORTED_ROLES
from models import JobSearchFilters, StudentProfile

# UI Constants
SKILLS_COLUMNS = 3


def render_skills_selection(role: str) -> list[str]:
    """Render skills selection checkboxes based on selected role.
    
    Args:
        role: The selected target role
        
    Returns:
        List of selected skills
    """
    st.subheader("Select Your Current Skills")
    available_skills = ROLE_SKILLS.get(role, [])
    
    if not available_skills:
        st.warning("No skills defined for this role yet.")
        return []
    
    st.caption(f"Choose the skills you already have for {role}")
    
    # Create columns for better layout
    cols = st.columns(SKILLS_COLUMNS)
    skill_checkboxes = {}
    
    for i, skill in enumerate(available_skills):
        col_idx = i % SKILLS_COLUMNS
        with cols[col_idx]:
            is_selected = skill in st.session_state.selected_skills
            skill_checkboxes[skill] = st.checkbox(
                skill, 
                value=is_selected, 
                key=f"skill_{skill}"
            )
    
    # Update selected skills only if changed
    selected_skills = [skill for skill, checked in skill_checkboxes.items() if checked]
    if selected_skills != st.session_state.selected_skills:
        st.session_state.selected_skills = selected_skills
    
    # Show selected skills count
    if st.session_state.selected_skills:
        st.success(f"✅ {len(st.session_state.selected_skills)} skill(s) selected")
    else:
        st.info("Select the skills you currently have")
    
    return st.session_state.selected_skills


def render_input_form() -> tuple[StudentProfile, JobSearchFilters] | None:
    st.title("🎯 AI Skill Gap Analyzer")
    st.caption(
        "Discover what skills you need for your dream role — powered by real job market data."
    )

    name = st.text_input("Your Name *", max_chars=100)
    
    # Initialize session state for role and skills
    if 'selected_role' not in st.session_state:
        st.session_state.selected_role = SUPPORTED_ROLES[0]
    if 'selected_skills' not in st.session_state:
        st.session_state.selected_skills = []

    # Role selection
    role = st.selectbox(
        "Target Role *", 
        SUPPORTED_ROLES, 
        index=SUPPORTED_ROLES.index(st.session_state.selected_role),
        key='role_select'
    )
    
    # Update session state when role changes
    if role != st.session_state.selected_role:
        st.session_state.selected_role = role
        st.session_state.selected_skills = []  # Reset skills when role changes
        st.rerun()

    # Skills selection based on role
    skills_list = render_skills_selection(role)

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
        if not name.strip():
            st.error("Please enter your name.")
            return None
        if not skills_list:
            st.error("Please select at least one skill.")
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
