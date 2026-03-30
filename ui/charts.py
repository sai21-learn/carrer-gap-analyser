import plotly.graph_objects as go

from models import GapReport


def skill_match_gauge(score: float) -> go.Figure:
    fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=score,
            title={"text": "Overall Match Score"},
            gauge={
                "axis": {"range": [0, 100]},
                "bar": {"color": "#22c55e"},
                "steps": [
                    {"range": [0, 40], "color": "#ef4444"},
                    {"range": [40, 70], "color": "#eab308"},
                    {"range": [70, 100], "color": "#22c55e"},
                ],
            },
        )
    )
    fig.update_layout(margin=dict(l=10, r=10, t=40, b=10), height=280)
    return fig


def skill_breakdown_bar(gap_report: GapReport) -> go.Figure:
    categories = ["Matched", "Partial", "Gap"]
    values = [len(gap_report.matched), len(gap_report.partial), len(gap_report.gaps)]
    colors = ["#22c55e", "#eab308", "#ef4444"]

    fig = go.Figure(
        data=[
            go.Bar(
                x=values,
                y=categories,
                orientation="h",
                marker_color=colors,
            )
        ]
    )
    fig.update_layout(
        title="Your Skill Profile Breakdown",
        xaxis_title="Count",
        yaxis_title="",
        margin=dict(l=10, r=10, t=40, b=10),
        height=300,
    )
    return fig


def gap_priority_chart(gap_report: GapReport) -> go.Figure:
    top_gaps = gap_report.top_gaps
    skills = [g.skill for g in top_gaps]
    freqs = [g.industry_frequency for g in top_gaps]

    fig = go.Figure(
        data=[
            go.Bar(
                x=freqs,
                y=skills,
                orientation="h",
                marker_color="#ef4444",
            )
        ]
    )
    fig.update_layout(
        title="Top Missing Skills by Industry Demand",
        xaxis_title="Industry Frequency",
        yaxis_title="",
        margin=dict(l=10, r=10, t=40, b=10),
        height=320,
    )
    return fig
