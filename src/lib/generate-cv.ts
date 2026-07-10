import { jsPDF } from 'jspdf';
import { cvData, type CvData, type CvExperience } from '@/data/portfolio';

export const stripPdfText = (text: string) =>
    text
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
        .replace(/\u2013/g, '-')
        .replace(/\u2014/g, '-')
        .replace(/\u00b7/g, ' | ')
        .replace(/\s+/g, ' ')
        .trim();

export const parseCertificationLine = (cert: string) => {
    const urlMatch = cert.match(/(?:—\s*|\()(https?:\/\/[^\s)]+)\)?/);
    const url = urlMatch ? urlMatch[1] : null;
    const label = cert
        .split(urlMatch ? urlMatch[0] : '___nonexistent___')[0]
        .replace(/\s*—\s*$/, '')
        .trim();
    return { label, url };
};

export type CvOutputType = 'preview' | 'download';

export function generateCv(
    outputType: CvOutputType,
    data: CvData = cvData
): void {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const FONT = 'helvetica';

    const PAGE_W = doc.internal.pageSize.getWidth();
    const PAGE_H = doc.internal.pageSize.getHeight();
    const MARGIN = 46;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const LINE_H = 11.5;
    const DATE_COL_W = 118;
    const TITLE_COL_W = CONTENT_W - DATE_COL_W - 10;

    const COLORS = {
        ACCENT: [31, 78, 121] as [number, number, number],
        LIGHT: [46, 117, 182] as [number, number, number],
        GRAY: [85, 85, 85] as [number, number, number],
        BLACK: [17, 17, 17] as [number, number, number],
        BLUE_LINE: [46, 117, 182] as [number, number, number],
    };

    let currentY = MARGIN;

    const ensureSpace = (needed: number) => {
        if (currentY + needed > PAGE_H - MARGIN) {
            doc.addPage();
            currentY = MARGIN;
        }
    };

    const addSectionHeader = (title: string) => {
        ensureSpace(40);
        currentY += 18;
        doc.setFont(FONT, 'bold');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
        doc.text(stripPdfText(title).toUpperCase(), MARGIN, currentY);

        currentY += 4;
        doc.setDrawColor(COLORS.BLUE_LINE[0], COLORS.BLUE_LINE[1], COLORS.BLUE_LINE[2]);
        doc.setLineWidth(1);
        doc.line(MARGIN, currentY, PAGE_W - MARGIN, currentY);
        currentY += 14;
    };

    const addWrappedText = (
        text: string,
        x: number,
        maxWidth: number,
        fontSize: number,
        style: 'normal' | 'bold' | 'italic' = 'normal',
        color: [number, number, number] = COLORS.BLACK
    ) => {
        const clean = stripPdfText(text);
        doc.setFont(FONT, style);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(clean, maxWidth);
        lines.forEach((line: string) => {
            ensureSpace(LINE_H + 2);
            doc.text(line, x, currentY);
            currentY += LINE_H;
        });
    };

    const addBullet = (text: string) => {
        const clean = stripPdfText(text);
        doc.setFont(FONT, 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
        const lines = doc.splitTextToSize(clean, CONTENT_W - 25);
        ensureSpace(lines.length * LINE_H + 4);
        doc.text('•', MARGIN + 8, currentY);
        doc.text(lines, MARGIN + 18, currentY);
        currentY += lines.length * LINE_H + 2;
    };

    const addJobEntry = (exp: CvExperience) => {
        ensureSpace(40);

        const rowStartY = currentY;
        const titleText = stripPdfText(exp.title);
        const durationText = stripPdfText(exp.duration);

        doc.setFont(FONT, 'bold');
        doc.setFontSize(10);
        const titleLines: string[] = doc.splitTextToSize(titleText, TITLE_COL_W);

        doc.setFont(FONT, 'italic');
        doc.setFontSize(9);
        const durationLines: string[] = doc.splitTextToSize(durationText, DATE_COL_W);

        const headerRows = Math.max(titleLines.length, durationLines.length, 1);
        ensureSpace(headerRows * LINE_H + 6);

        titleLines.forEach((line, index) => {
            doc.setFont(FONT, 'bold');
            doc.setFontSize(10);
            doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
            doc.text(line, MARGIN, rowStartY + index * LINE_H);
        });

        durationLines.forEach((line, index) => {
            doc.setFont(FONT, 'italic');
            doc.setFontSize(9);
            doc.setTextColor(COLORS.LIGHT[0], COLORS.LIGHT[1], COLORS.LIGHT[2]);
            doc.text(line, PAGE_W - MARGIN, rowStartY + index * LINE_H, { align: 'right' });
        });

        currentY = rowStartY + headerRows * LINE_H;

        addWrappedText(exp.company, MARGIN, CONTENT_W, 9.5, 'normal', COLORS.GRAY);
        if (exp.location) {
            addWrappedText(exp.location, MARGIN, CONTENT_W, 9, 'italic', COLORS.GRAY);
        }
        exp.details.forEach((detail) => addBullet(detail));
        if (exp.tags?.length) {
            addWrappedText(
                `Focus: ${exp.tags.join(' | ')}`,
                MARGIN + 10,
                CONTENT_W - 10,
                9,
                'italic',
                COLORS.GRAY
            );
        }
        currentY += 6;
    };

    const addSkillRow = (label: string, value: string) => {
        ensureSpace(LINE_H * 2);
        doc.setFont(FONT, 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
        doc.text(`${stripPdfText(label)}:`, MARGIN, currentY);

        doc.setFont(FONT, 'normal');
        doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
        const lines = doc.splitTextToSize(stripPdfText(value), CONTENT_W - 100);
        doc.text(lines, MARGIN + 100, currentY);
        currentY += lines.length * LINE_H + 2;
    };

    const addCertification = (cert: string) => {
        const { label, url } = parseCertificationLine(cert);
        addBullet(label);
        if (url) {
            addWrappedText(url, MARGIN + 18, CONTENT_W - 18, 8.5, 'normal', COLORS.GRAY);
        }
    };

    currentY = MARGIN + 10;
    doc.setFont(FONT, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
    doc.text(stripPdfText(data.name).toUpperCase(), PAGE_W / 2, currentY, { align: 'center' });
    currentY += 20;

    addWrappedText(data.jobTitle, MARGIN, CONTENT_W, 10.5, 'normal', COLORS.LIGHT);
    currentY += 2;
    addWrappedText(`${data.location}  |  ${data.email}`, MARGIN, CONTENT_W, 9, 'normal', COLORS.GRAY);
    addWrappedText(data.phones.join('  /  '), MARGIN, CONTENT_W, 9, 'normal', COLORS.GRAY);
    addWrappedText(
        `${data.github}  |  ${data.portfolio}  |  ${data.linkedin}`,
        MARGIN,
        CONTENT_W,
        9,
        'normal',
        COLORS.GRAY
    );
    currentY += 4;

    addSectionHeader('Professional Summary');
    addWrappedText(data.summary, MARGIN, CONTENT_W, 9.5, 'normal', COLORS.BLACK);
    currentY += 4;

    addSectionHeader('Core Competencies');
    data.skillCategories.forEach((cat) => addSkillRow(cat.label, cat.value));

    addSectionHeader('Professional Experience');
    data.experience.forEach((exp) => addJobEntry(exp));

    addSectionHeader('Community Involvement & Volunteering');
    data.community.forEach((vol) => addJobEntry(vol));

    addSectionHeader('Education');
    data.education.forEach((edu) => {
        addJobEntry({
            title: edu.degree,
            company: edu.university,
            duration: edu.duration,
            details: edu.note ? [edu.note] : [],
        });
    });

    addSectionHeader('Awards & Achievements');
    data.awards.forEach((award) => addBullet(award));

    addSectionHeader('Licences & Certifications');
    data.certifications.forEach((cert) => addCertification(cert));

    ensureSpace(30);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
    doc.text('Postgraduate Diplomas & Certificates (2023):', MARGIN, currentY);
    currentY += 14;
    data.diplomas.forEach((diploma) => addBullet(diploma));

    addSectionHeader('Professional References');
    data.references.forEach((ref) => {
        ensureSpace(36);
        doc.setFont(FONT, 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
        doc.text(stripPdfText(ref.name), MARGIN, currentY);
        currentY += LINE_H;

        addWrappedText(`${ref.title}, ${ref.company}`, MARGIN, CONTENT_W, 9.5, 'normal', COLORS.GRAY);
        const contact = [ref.email, ref.phone].filter(Boolean).join('  |  ');
        if (contact) {
            addWrappedText(contact, MARGIN, CONTENT_W, 9, 'normal', COLORS.GRAY);
        }
        currentY += 6;
    });

    if (outputType === 'preview') {
        doc.output('dataurlnewwindow');
    } else {
        doc.save(`${data.name.replace(/\s+/g, '_')}_CV.pdf`);
    }
}
