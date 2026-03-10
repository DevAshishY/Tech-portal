from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt


OUTPUT_DOCX = Path("/workspace/Unofficial_February_2026_Salary_Statement.docx")
OUTPUT_MD = Path("/workspace/Unofficial_February_2026_Salary_Statement.md")

NAME = "Gaurav Pratap"
ROLE = "Quality Analyst"
REFERENCE_MONTH = "February 2026"
EMPLOYER = "Honda R&D (India) Pvt. Ltd."
WORK_LOCATION = (
    "Technical Centre, Plot No. 02, Sector - 03, IMT Manesar, "
    "Gurugram - Haryana - 122052, India"
)

BASIC_SALARY = 45000
INCENTIVE = 8000
TOTAL_EARNINGS = BASIC_SALARY + INCENTIVE

DISCLAIMER_LINES = [
    "PERSONAL REFERENCE ONLY",
    "This is an unofficial self-declared salary statement prepared from user-provided information.",
    "It is not a company-issued payslip, salary certificate, or legal/official proof of income.",
]


def set_default_font(document: Document) -> None:
    normal_style = document.styles["Normal"]
    normal_style.font.name = "Arial"
    normal_style.font.size = Pt(11)


def format_currency(amount: int) -> str:
    return f"Rs. {amount:,.0f}"


def add_heading(document: Document, text: str, size: int = 13) -> None:
    paragraph = document.add_paragraph()
    run = paragraph.add_run(text)
    run.bold = True
    run.font.size = Pt(size)


def build_docx() -> None:
    document = Document()
    set_default_font(document)

    section = document.sections[0]
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

    title = document.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("UNOFFICIAL SALARY STATEMENT")
    title_run.bold = True
    title_run.font.size = Pt(17)

    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_run = subtitle.add_run(f"{REFERENCE_MONTH} - Personal Reference Only")
    subtitle_run.bold = True
    subtitle_run.font.size = Pt(12)

    for line in DISCLAIMER_LINES:
        paragraph = document.add_paragraph()
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = paragraph.add_run(line)
        run.bold = True if line == DISCLAIMER_LINES[0] else False

    add_heading(document, "Individual Details")
    details_table = document.add_table(rows=0, cols=2)
    details_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    details_table.style = "Table Grid"

    details = [
        ("Name", NAME),
        ("Role", ROLE),
        ("Reference Month", REFERENCE_MONTH),
        ("Employer (as stated by user)", EMPLOYER),
        ("Work Location", WORK_LOCATION),
    ]

    for label, value in details:
        row_cells = details_table.add_row().cells
        row_cells[0].text = label
        row_cells[1].text = value

    add_heading(document, "Declared Earnings Summary")
    earnings_table = document.add_table(rows=1, cols=2)
    earnings_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    earnings_table.style = "Table Grid"
    earnings_table.rows[0].cells[0].text = "Component"
    earnings_table.rows[0].cells[1].text = "Amount"

    earnings_rows = [
        ("Monthly Salary", format_currency(BASIC_SALARY)),
        ("Incentive", format_currency(INCENTIVE)),
        ("Total Declared Earnings", format_currency(TOTAL_EARNINGS)),
    ]

    for label, value in earnings_rows:
        row_cells = earnings_table.add_row().cells
        row_cells[0].text = label
        row_cells[1].text = value

    add_heading(document, "Note")
    document.add_paragraph(
        "This statement is created only for personal reference and summary purposes. "
        "For any official requirement, please obtain an authentic salary slip or salary "
        "certificate from the employer or HR department."
    )

    signature = document.add_paragraph()
    signature.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    signature.add_run(f"Self-declared by\n{NAME}")

    document.save(OUTPUT_DOCX)


def build_markdown() -> None:
    content = [
        "# UNOFFICIAL SALARY STATEMENT",
        "",
        f"## {REFERENCE_MONTH} - Personal Reference Only",
        "",
        f"**{DISCLAIMER_LINES[0]}**",
        "",
        DISCLAIMER_LINES[1],
        DISCLAIMER_LINES[2],
        "",
        "### Individual Details",
        "",
        "| Field | Value |",
        "| --- | --- |",
        f"| Name | {NAME} |",
        f"| Role | {ROLE} |",
        f"| Reference Month | {REFERENCE_MONTH} |",
        f"| Employer (as stated by user) | {EMPLOYER} |",
        f"| Work Location | {WORK_LOCATION} |",
        "",
        "### Declared Earnings Summary",
        "",
        "| Component | Amount |",
        "| --- | --- |",
        f"| Monthly Salary | {format_currency(BASIC_SALARY)} |",
        f"| Incentive | {format_currency(INCENTIVE)} |",
        f"| Total Declared Earnings | {format_currency(TOTAL_EARNINGS)} |",
        "",
        "### Note",
        "",
        "This statement is created only for personal reference and summary purposes. "
        "For any official requirement, please obtain an authentic salary slip or salary "
        "certificate from the employer or HR department.",
        "",
        f"**Self-declared by:** {NAME}",
        "",
    ]

    OUTPUT_MD.write_text("\n".join(content), encoding="utf-8")


if __name__ == "__main__":
    build_docx()
    build_markdown()
