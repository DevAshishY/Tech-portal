from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt


OUTPUT_DOCX = Path("/workspace/Gaurav_Pratap_Biodata.docx")
OUTPUT_MD = Path("/workspace/Gaurav_Pratap_Biodata.md")

PERSONAL_DETAILS = [
    ("Name", "Gaurav Pratap"),
    ("Father's Name", "Virendra Pratap"),
    ("Mother's Name", "Aansu Devi"),
    ("Date of Birth", "11 July 1993"),
    ("Gender", "Male"),
    ("Nationality", "Indian"),
    (
        "Permanent Address",
        "Village Niwada Deoray, Aunaha, Rasulabad, Kanpur Dehat, Uttar Pradesh",
    ),
]

EDUCATION = [
    ("High School (10th)", "U.P. Board", "2010", "Passed from G.I.C. Naila Katara, Kanpur Dehat"),
    ("Intermediate (12th)", "Not specified", "Not specified", "Completed"),
    ("Bachelor of Arts (B.A.)", "Not specified", "Not specified", "Graduation completed"),
]

CAREER_HISTORY = [
    (
        "Police Job Preparation",
        "1.5 years",
        "Prepared for police job examinations after graduation.",
    ),
    (
        "Quality Analyst",
        "Last 2 years",
        "Honda R&D (India) Pvt. Ltd., Technical Centre, Plot No. 02, Sector - 03, "
        "IMT Manesar, Gurugram - Haryana - 122052, India",
    ),
]

OBJECTIVE = (
    "To work sincerely and responsibly in an organization where I can use my experience, "
    "discipline, and dedication to contribute effectively while continuing to grow professionally."
)

DECLARATION = (
    "I hereby declare that the above information is true and correct to the best of my knowledge "
    "and belief."
)


def set_default_font(document: Document) -> None:
    styles = document.styles
    normal_style = styles["Normal"]
    normal_style.font.name = "Arial"
    normal_style.font.size = Pt(11)


def add_section_heading(document: Document, title: str) -> None:
    paragraph = document.add_paragraph()
    run = paragraph.add_run(title)
    run.bold = True
    run.font.size = Pt(13)


def build_docx() -> None:
    document = Document()
    set_default_font(document)

    section = document.sections[0]
    section.top_margin = Inches(0.6)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

    title = document.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("BIO-DATA")
    title_run.bold = True
    title_run.font.size = Pt(18)

    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_run = subtitle.add_run("Gaurav Pratap")
    subtitle_run.bold = True
    subtitle_run.font.size = Pt(13)

    add_section_heading(document, "Career Objective")
    document.add_paragraph(OBJECTIVE)

    add_section_heading(document, "Personal Details")
    details_table = document.add_table(rows=0, cols=2)
    details_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    details_table.style = "Table Grid"
    for label, value in PERSONAL_DETAILS:
        row_cells = details_table.add_row().cells
        row_cells[0].text = label
        row_cells[1].text = value

    add_section_heading(document, "Educational Qualifications")
    education_table = document.add_table(rows=1, cols=4)
    education_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    education_table.style = "Table Grid"
    header_cells = education_table.rows[0].cells
    header_cells[0].text = "Qualification"
    header_cells[1].text = "Board / University"
    header_cells[2].text = "Year"
    header_cells[3].text = "Remarks"

    for qualification, board, year, remarks in EDUCATION:
        row_cells = education_table.add_row().cells
        row_cells[0].text = qualification
        row_cells[1].text = board
        row_cells[2].text = year
        row_cells[3].text = remarks

    add_section_heading(document, "Career History")
    for role, duration, description in CAREER_HISTORY:
        paragraph = document.add_paragraph(style=None)
        paragraph.style = document.styles["Normal"]
        role_run = paragraph.add_run(f"{role} ({duration})")
        role_run.bold = True
        paragraph.add_run(f": {description}")

    add_section_heading(document, "Declaration")
    document.add_paragraph(DECLARATION)

    signature = document.add_paragraph()
    signature.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    signature.add_run("Signature\nGaurav Pratap")

    document.save(OUTPUT_DOCX)


def build_markdown() -> None:
    lines = [
        "# BIO-DATA",
        "",
        "## Gaurav Pratap",
        "",
        "### Career Objective",
        OBJECTIVE,
        "",
        "### Personal Details",
        "",
        "| Field | Details |",
        "| --- | --- |",
    ]

    for label, value in PERSONAL_DETAILS:
        lines.append(f"| {label} | {value} |")

    lines.extend(
        [
            "",
            "### Educational Qualifications",
            "",
            "| Qualification | Board / University | Year | Remarks |",
            "| --- | --- | --- | --- |",
        ]
    )

    for qualification, board, year, remarks in EDUCATION:
        lines.append(f"| {qualification} | {board} | {year} | {remarks} |")

    lines.extend(["", "### Career History", ""])

    for role, duration, description in CAREER_HISTORY:
        lines.append(f"- **{role} ({duration})**: {description}")

    lines.extend(["", "### Declaration", DECLARATION, "", "**Signature:** Gaurav Pratap", ""])

    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    build_docx()
    build_markdown()
