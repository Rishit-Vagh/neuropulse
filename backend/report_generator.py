"""
PDF Report Generator for Medical Scan Results
Creates professional-looking diagnostic reports using ReportLab.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import io
from datetime import datetime


# Color palette matching the frontend
CYAN = HexColor("#06b6d4")
BLUE = HexColor("#3b82f6")
DARK_BG = HexColor("#0a0a1a")
DARK_CARD = HexColor("#111827")
GREEN = HexColor("#10b981")
YELLOW = HexColor("#f59e0b")
RED = HexColor("#ef4444")
GRAY = HexColor("#6b7280")
LIGHT_GRAY = HexColor("#e5e7eb")

SEVERITY_COLORS = {
    "normal": GREEN,
    "warning": YELLOW,
    "critical": RED,
}


def generate_pdf_report(scan_result: dict, scan_id: str) -> bytes:
    """Generate a PDF diagnostic report from scan results.
    
    Returns the PDF as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # Custom styles
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=28,
        textColor=CYAN,
        spaceAfter=6,
        fontName="Helvetica-Bold",
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=GRAY,
        spaceAfter=20,
        fontName="Helvetica",
        leading=14,
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=BLUE,
        spaceBefore=20,
        spaceAfter=10,
        fontName="Helvetica-Bold",
        borderWidth=0,
        borderPadding=0,
    )

    body_style = ParagraphStyle(
        "BodyText",
        parent=styles["Normal"],
        fontSize=10,
        textColor=black,
        leading=16,
        fontName="Helvetica",
    )

    small_style = ParagraphStyle(
        "SmallText",
        parent=styles["Normal"],
        fontSize=8,
        textColor=GRAY,
        leading=12,
        fontName="Helvetica",
    )

    # ── Header ──────────────────────────────────────────────
    elements.append(Paragraph("PulseCore Neural Diagnostics", title_style))
    elements.append(Paragraph(
        f"AI-Powered Medical Image Analysis Report<br/>"
        f"Model: {scan_result.get('model_version', 'PulseCore v4.2')} | "
        f"Scan ID: {scan_id}<br/>"
        f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}",
        subtitle_style,
    ))
    elements.append(HRFlowable(width="100%", thickness=2, color=CYAN, spaceAfter=20))

    # ── Primary Diagnosis ───────────────────────────────────
    elements.append(Paragraph("PRIMARY DIAGNOSIS", heading_style))

    primary = scan_result["primary_diagnosis"]
    confidence = scan_result["confidence_score"]
    severity = scan_result.get("severity", "normal")
    severity_color = SEVERITY_COLORS.get(severity, GRAY)

    diagnosis_data = [
        ["Condition", primary],
        ["Confidence", f"{confidence}%"],
        ["Severity", severity.upper()],
        ["Processing Time", f"{scan_result.get('processing_time', 'N/A')}s"],
        ["Conditions Screened", str(scan_result.get("conditions_screened", 6))],
    ]

    diagnosis_table = Table(diagnosis_data, colWidths=[120, 350])
    diagnosis_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 0), (1, 0), severity_color),
        ("TEXTCOLOR", (1, 1), (1, 1), CYAN),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, LIGHT_GRAY),
    ]))
    elements.append(diagnosis_table)
    elements.append(Spacer(1, 10))

    # ── Prediction Breakdown ────────────────────────────────
    elements.append(Paragraph("CONDITION ANALYSIS BREAKDOWN", heading_style))

    pred_header = ["Condition", "Probability", "Severity", "Assessment"]
    pred_rows = [pred_header]

    for pred in scan_result.get("predictions", []):
        prob = pred["probability"]
        sev = pred["severity"]
        desc = pred["description"][:80] + "..." if len(pred["description"]) > 80 else pred["description"]
        pred_rows.append([
            pred["condition"],
            f"{prob}%",
            sev.upper(),
            desc,
        ])

    pred_table = Table(pred_rows, colWidths=[80, 70, 60, 260])
    pred_table.setStyle(TableStyle([
        # Header
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
        ("TOPPADDING", (0, 0), (-1, 0), 10),
        # Body
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
        ("TOPPADDING", (0, 1), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        # Alternating row colors
        ("BACKGROUND", (0, 1), (-1, 1), HexColor("#f0fdfa")),
        ("BACKGROUND", (0, 3), (-1, 3), HexColor("#f0fdfa")),
        ("BACKGROUND", (0, 5), (-1, 5), HexColor("#f0fdfa")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    elements.append(pred_table)
    elements.append(Spacer(1, 10))

    # ── Recommendations ─────────────────────────────────────
    elements.append(Paragraph("CLINICAL RECOMMENDATIONS", heading_style))

    for i, rec in enumerate(scan_result.get("recommendations", []), 1):
        elements.append(Paragraph(f"{i}. {rec}", body_style))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 15))

    # ── Full Report Summary ─────────────────────────────────
    elements.append(Paragraph("DETAILED REPORT", heading_style))
    report_text = scan_result.get("report_summary", "No report generated.")
    for line in report_text.split("\n"):
        if line.strip():
            elements.append(Paragraph(line, body_style))
        else:
            elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 30))

    # ── Footer / Disclaimer ─────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY, spaceAfter=10))

    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=7,
        textColor=GRAY,
        leading=10,
        fontName="Helvetica-Oblique",
        alignment=TA_CENTER,
    )

    elements.append(Paragraph(
        "DISCLAIMER: This report is generated by an AI-powered diagnostic system (PulseCore v4.2) "
        "and is intended for screening purposes only. All findings must be reviewed and confirmed by "
        "a board-certified radiologist or qualified medical professional. Clinical decisions should "
        "not be based solely on this automated analysis. This system is not a substitute for "
        "professional medical judgment. © 2026 PulseCore Neural Diagnostics.",
        disclaimer_style,
    ))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer.read()
