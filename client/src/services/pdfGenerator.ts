import jsPDF from 'jspdf';
import { GeneratedDocument } from '../../../shared/types';

export function downloadLegalNoticePdf(doc: GeneratedDocument, caseRef: string = 'NY-8821') {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  // Header Banner: AI-GENERATED DRAFT
  pdf.setFillColor(241, 245, 249); // slate-100
  pdf.rect(margin, cursorY, contentWidth, 10, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(margin, cursorY, contentWidth, 10, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(30, 58, 138); // Primary Navy #1e3a8a
  pdf.text('NYAYAAI  •  AI-GENERATED DRAFT  •  REVIEW ALL DETAILS BEFORE USE', pageWidth / 2, cursorY + 6.5, { align: 'center' });

  cursorY += 18;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(0, 35, 111);
  const splitTitle = pdf.splitTextToSize(doc.title.toUpperCase(), contentWidth);
  pdf.text(splitTitle, margin, cursorY);
  cursorY += splitTitle.length * 7 + 3;

  // Case Reference & Date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Case Dossier: #${caseRef}  |  Generated on: ${new Date(doc.createdAt).toLocaleDateString('en-IN')}`, margin, cursorY);
  cursorY += 6;

  // Divider line
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 8;

  // Verified Facts Summary Box
  if (doc.verifiedFields && Object.keys(doc.verifiedFields).length > 0) {
    pdf.setFillColor(250, 250, 255);
    pdf.rect(margin, cursorY, contentWidth, 24, 'F');
    pdf.setDrawColor(182, 196, 255);
    pdf.rect(margin, cursorY, contentWidth, 24, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(0, 108, 74); // Emerald #006c4a
    pdf.text('VERIFIED CITIZEN FACTS (REVIEWED)', margin + 4, cursorY + 5.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);

    let factX = margin + 4;
    let factY = cursorY + 11;
    const entries = Object.entries(doc.verifiedFields).slice(0, 6);
    entries.forEach(([key, val], idx) => {
      const text = `${key}: ${val}`;
      if (idx % 2 === 0 && idx !== 0) {
        factY += 5;
        factX = margin + 4;
      }
      pdf.text(text.length > 40 ? text.slice(0, 40) + '...' : text, factX, factY);
      factX += (contentWidth / 2);
    });

    cursorY += 30;
  }

  // Document Body Content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(19, 27, 46); // on-surface

  const splitContent = pdf.splitTextToSize(doc.content, contentWidth);
  for (let i = 0; i < splitContent.length; i++) {
    if (cursorY > pageHeight - 25) {
      // Add new page
      pdf.addPage();
      cursorY = 20;

      // Repeat running header
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`NyayaAI Legal Draft — Case #${caseRef} (Continued)`, margin, cursorY);
      cursorY += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(19, 27, 46);
    }
    pdf.text(splitContent[i], margin, cursorY);
    cursorY += 5.2;
  }

  // Footer on all pages
  const totalPages = (pdf.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      'Notice Disclaimer: AI-generated draft. Review all information before use. Does not constitute formal advocate representation under the Advocates Act, 1961.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    pdf.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save the PDF
  const filename = `${doc.type}_${caseRef}_Draft.pdf`;
  pdf.save(filename);
}
