from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt


OUTPUT_DOCX = Path("/workspace/HR_Request_Letter_Salary_Slips.docx")
OUTPUT_MD = Path("/workspace/HR_Request_Letter_Salary_Slips.md")

TODAY = date(2026, 3, 10).strftime("%d %B %Y")

COMPANY_NAME = "Honda R&D (India) Pvt. Ltd."
COMPANY_ADDRESS_LINES = [
    "Technical Centre, Plot No. 02,",
    "Sector - 03, IMT Manesar,",
    "Gurugram - Haryana - 122052, India",
]

LETTER_BODY = [
    "To,",
    "The HR Department,",
    COMPANY_NAME,
    *COMPANY_ADDRESS_LINES,
    "",
    f"Date: {TODAY}",
    "",
    "Subject: Request for salary slips for the last three months",
    "",
    "Respected Sir/Madam,",
    "",
    (
        "I am Gaurav Pratap, currently working as a Quality Analyst in "
        f"{COMPANY_NAME} I kindly request you to issue my salary slips for the "
        "last three months for my personal records and official documentation."
    ),
    "",
    (
        "I would be grateful if you could provide the salary slips at your earliest "
        "convenience."
    ),
    "",
    "Thank you for your support and assistance.",
    "",
    "Yours sincerely,",
    "",
    "Gaurav Pratap",
    "Quality Analyst",
]


def set_default_font(document: Document) -> None:
    normal_style = document.styles["Normal"]
    normal_style.font.name = "Arial"
    normal_style.font.size = Pt(11)


def build_docx() -> None:
    document = Document()
    set_default_font(document)

    section = document.sections[0]
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.85)
    section.right_margin = Inches(0.85)

    title = document.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("HR REQUEST LETTER")
    title_run.bold = True
    title_run.font.size = Pt(16)

    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_run = subtitle.add_run("Request for Last 3 Months' Salary Slips")
    subtitle_run.bold = True
    subtitle_run.font.size = Pt(12)

    document.add_paragraph("")

    for line in LETTER_BODY:
        document.add_paragraph(line)

    document.save(OUTPUT_DOCX)


def build_markdown() -> None:
    content = [
        "# HR REQUEST LETTER",
        "",
        "## Request for Last 3 Months' Salary Slips",
        "",
        *LETTER_BODY,
        "",
    ]
    OUTPUT_MD.write_text("\n".join(content), encoding="utf-8")


if __name__ == "__main__":
    build_docx()
    build_markdown()
