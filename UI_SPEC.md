# UI_SPEC.md — Streamlit UI Specification

---

## Page Configuration

```python
st.set_page_config(
    page_title="AI Skill Gap Analyzer",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="collapsed"
)
```

---

## Global Styling (inject via st.markdown)

```python
st.markdown("""
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
    .stButton > button:hover {
        background-color: #4338ca;
    }
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
""", unsafe_allow_html=True)
```

---

## Screen 1: Input Form (ui/input_form.py)

### Layout

```
┌─────────────────────────────────────────────────┐
│                                                   │
│   🎯  AI Skill Gap Analyzer                       │  ← st.title()
│   Discover what skills you need for your dream    │  ← st.caption()
│   role — powered by real job market data.         │
│                                                   │
├─────────────────────────────────────────────────┤
│                                                   │
│   Your Name *                                     │  ← st.text_input()
│   [_______________________________]               │
│                                                   │
│   Target Role *                                   │  ← st.selectbox()
│   [Data Analyst              ▼]                   │
│                                                   │
│   Your Current Skills *                           │  ← st.text_area()
│   (comma-separated, e.g., Python, SQL, Excel)     │
│   [_______________________________]               │
│   [_______________________________]               │
│                                                   │
│        [ 🔍  Analyze My Skills ]                  │  ← st.button(), centered
│                                                   │
└─────────────────────────────────────────────────┘
```

### Validation Rules
- Name: non-empty, max 100 chars
- Role: must be in SUPPORTED_ROLES (enforced by selectbox)
- Skills: non-empty, at least 1 skill after parsing

### On Submit
```python
skills_list = [s.strip() for s in skills_input.split(",") if s.strip()]
if not name.strip():
    st.error("Please enter your name.")
elif not skills_list:
    st.error("Please enter at least one skill.")
else:
    return StudentProfile(name=name, target_role=role, skills=skills_list)
return None
```

---

## Screen 2: Loading State

Between form submit and report render, show:
```python
with st.spinner("🔍 Fetching live job data..."):
    jobs = fetch_jobs(profile.target_role)

with st.spinner("🧠 Analyzing your skills with NLP..."):
    industry_skills = aggregate_skills(jobs)
    gap_report = analyze(profile, industry_skills)
    resources = recommend_all([s.skill for s in gap_report.gaps])
```

---

## Screen 3: Report Dashboard (ui/report_view.py)

### Section 1: Header

```
┌─────────────────────────────────────────────────┐
│  📊 Skill Gap Report for [Name]                   │  ← st.header()
│  Role: [Target Role]  •  Based on [N] job posts   │  ← st.caption()
│  Generated: [datetime]                             │
└─────────────────────────────────────────────────┘
```

---

### Section 2: Summary Metrics Row

```python
col1, col2, col3, col4 = st.columns(4)

col1.metric("🎯 Match Score",     f"{gap_report.match_score:.1f}%")
col2.metric("✅ Matched Skills",   len(gap_report.matched))
col3.metric("⚠️ Partial Matches",  len(gap_report.partial))
col4.metric("❌ Skill Gaps",        len(gap_report.gaps))
```

---

### Section 3: Charts Row

```python
col_left, col_right = st.columns([1, 2])

with col_left:
    st.plotly_chart(skill_match_gauge(gap_report.match_score), use_container_width=True)

with col_right:
    st.plotly_chart(gap_priority_chart(gap_report), use_container_width=True)
```

**Gauge Chart Spec:**
- Range: 0–100
- Color zones: 0–40 = red, 40–70 = yellow, 70–100 = green
- Show score value in center
- Title: "Overall Match Score"

**Gap Priority Chart Spec:**
- Horizontal bar chart
- X-axis: Industry Frequency (demand)
- Y-axis: Skill name (top 10 gaps only)
- Color: `#ef4444` (red)
- Title: "Top Missing Skills by Industry Demand"

---

### Section 4: Skill Breakdown Bar Chart

```python
st.plotly_chart(skill_breakdown_bar(gap_report), use_container_width=True)
```

**Spec:**
- Grouped bar chart with 3 groups: Matched, Partial, Gap
- Each group shows count
- Colors: green (`#22c55e`), yellow (`#eab308`), red (`#ef4444`)
- Title: "Your Skill Profile Breakdown"

---

### Section 5: Detailed Skill Lists

```python
st.subheader("📋 Detailed Skill Analysis")

tab1, tab2, tab3 = st.tabs(["✅ Matched", "⚠️ Partial Match", "❌ Gaps"])

with tab1:
    # Render skill tags for each matched skill
    for skill in gap_report.matched:
        st.markdown(f'<span class="skill-tag tag-matched">{skill.skill}</span>', unsafe_allow_html=True)
    if not gap_report.matched:
        st.info("No matched skills found for this role.")

with tab2:
    for skill in gap_report.partial:
        col_a, col_b = st.columns([3, 1])
        col_a.markdown(f'<span class="skill-tag tag-partial">{skill.skill}</span>', unsafe_allow_html=True)
        col_b.write(f"Similarity: {skill.similarity_score:.0%}")
    if not gap_report.partial:
        st.info("No partial matches found.")

with tab3:
    for skill in gap_report.top_gaps:
        st.markdown(f'<span class="skill-tag tag-gap">{skill.skill}</span>', unsafe_allow_html=True)
    if not gap_report.gaps:
        st.success("🎉 No skill gaps found! You're a great match for this role.")
```

---

### Section 6: Learning Resources

```python
st.subheader("📚 Recommended Learning Resources")
st.caption("Curated resources to close your skill gaps — prioritized by demand.")

for skill_result in gap_report.top_gaps:
    skill_name = skill_result.skill
    skill_resources = resources.get(skill_name, [])
    
    with st.expander(f"📖 {skill_name}  —  Frequency: {skill_result.industry_frequency} postings"):
        if skill_resources:
            for res in skill_resources:
                st.markdown(f"**[{res.title}]({res.url})**  `{res.platform}` · *{res.type}*")
        else:
            st.write("No specific resources found. Try searching online.")
```

---

### Section 7: Footer

```python
st.divider()
st.caption("⚡ Built with Python, spaCy, and Streamlit · Data sourced from live job postings · For educational use")
```

---

## Responsiveness Notes

- All charts must use `use_container_width=True`
- Column layouts adapt automatically in Streamlit — no custom CSS needed for layout
- On mobile (narrow screens), Streamlit stacks columns automatically — this is acceptable behavior

---

## Error States

| Scenario | UI Response |
|----------|-------------|
| Scraping fails completely | `st.warning("Using mock data — live scraping unavailable.")` above report |
| No jobs found for role | `st.error("No job data found for this role. Try a different role.")` — stop render |
| NLP extraction returns 0 skills | `st.warning("Could not extract skills from job data. Results may be limited.")` |
| General exception | `st.error(f"Something went wrong: {str(e)}")` — show traceback in expander |
