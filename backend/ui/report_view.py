import streamlit as st

from backend.app.models import GapReport, JobPosting, Resource
from ui.charts import gap_priority_chart, skill_breakdown_bar, skill_match_gauge


def _format_salary(salary_min: float | None, salary_max: float | None) -> str | None:
    if salary_min is None and salary_max is None:
        return None
    if salary_min is not None and salary_max is not None:
        return f"₹{salary_min:,.0f} - ₹{salary_max:,.0f}"
    if salary_min is not None:
        return f"₹{salary_min:,.0f}+"
    return f"Up to ₹{salary_max:,.0f}"


def render_report(
    gap_report: GapReport,
    resources: dict[str, list[Resource]],
    job_postings: list[JobPosting],
):
    st.header(f"📊 Skill Gap Report for {gap_report.student_name}")
    st.caption(
        f"Role: {gap_report.target_role}  •  Based on {gap_report.total_jobs_analyzed} job posts"
    )
    st.caption(f"Generated: {gap_report.generated_at}")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("🎯 Match Score", f"{gap_report.match_score:.1f}%")
    col2.metric("✅ Matched Skills", len(gap_report.matched))
    col3.metric("⚠️ Partial Matches", len(gap_report.partial))
    col4.metric("❌ Skill Gaps", len(gap_report.gaps))

    col_left, col_right = st.columns([1, 2])
    with col_left:
        st.plotly_chart(
            skill_match_gauge(gap_report.match_score), use_container_width=True
        )
    with col_right:
        st.plotly_chart(gap_priority_chart(gap_report), use_container_width=True)

    st.plotly_chart(skill_breakdown_bar(gap_report), use_container_width=True)

    st.subheader("📋 Detailed Skill Analysis")
    tab1, tab2, tab3 = st.tabs(["✅ Matched", "⚠️ Partial Match", "❌ Gaps"])

    with tab1:
        for skill in gap_report.matched:
            st.markdown(
                f'<span class="skill-tag tag-matched">{skill.skill}</span>',
                unsafe_allow_html=True,
            )
        if not gap_report.matched:
            st.info("No matched skills found for this role.")

    with tab2:
        for skill in gap_report.partial:
            label = (
                f"{skill.skill} (≈ {skill.matched_to})"
                if skill.matched_to
                else skill.skill
            )
            st.markdown(
                f'<span class="skill-tag tag-partial">{label}</span>',
                unsafe_allow_html=True,
            )
        if not gap_report.partial:
            st.info("No partial matches found for this role.")

    with tab3:
        for skill in gap_report.gaps:
            st.markdown(
                f'<span class="skill-tag tag-gap">{skill.skill}</span>',
                unsafe_allow_html=True,
            )
        if not gap_report.gaps:
            st.info("No gaps found. Great job!")

    st.subheader("📚 Recommended Resources")
    for skill, res_list in resources.items():
        st.markdown(f"**{skill}**")
        for res in res_list:
            st.markdown(f"- {res.title} ({res.platform})")

    st.subheader("🧾 Sample Jobs")
    if not job_postings:
        st.info("No live job postings were found.")
        return

    for job in job_postings[:10]:
        salary = _format_salary(job.salary_min, job.salary_max)
        posted = job.posted_at.date().isoformat() if job.posted_at else "Unknown"
        contract = ", ".join([p for p in [job.contract_time, job.contract_type] if p])
        st.markdown(f"**{job.title}** — {job.company}")
        st.markdown(f"{job.location} • Posted: {posted}")
        if salary:
            st.markdown(f"Salary: {salary}")
        if contract:
            st.markdown(f"Contract: {contract}")
        if job.url:
            st.markdown(f"Apply: {job.url}")
        st.markdown("---")
