import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Session } from '../types';
import { studentsStorage } from './storage';

export const pdfService = {
  generateDailyReport: async (date: string, sessions: Session[]) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Header
    doc.setFontSize(18);
    doc.text('Mi Cuaderno Digital', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Reporte del ${formattedDate}`, 105, 30, { align: 'center' });

    let yPosition = 45;

    // Sessions table
    if (sessions.length > 0) {
      doc.setFontSize(11);
      doc.text('Sesiones del día:', 15, yPosition);
      yPosition += 10;

      // Table headers
      doc.setFillColor(0, 102, 204);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('Hora', 15, yPosition);
      doc.text('Alumno', 30, yPosition);
      doc.text('Código', 80, yPosition);
      doc.text('Tipo', 110, yPosition);
      yPosition += 8;

      // Table rows
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(240, 240, 240);
      let rowIndex = 0;

      sessions.forEach((session) => {
        const student = studentsStorage.getById(session.studentId);
        const sessionTypeLabel = {
          'class': 'Clase',
          'double_class': 'Clase Doble',
          'exam': 'Examen',
        }[session.type];

        if (rowIndex % 2 === 0) {
          doc.rect(15, yPosition - 6, 180, 7, 'F');
        }

        doc.text(session.time, 15, yPosition);
        doc.text(student?.fullName || 'N/A', 30, yPosition);
        doc.text(student?.internalCode || '', 80, yPosition);
        doc.text(sessionTypeLabel, 110, yPosition);

        yPosition += 8;
        rowIndex++;
      });
    } else {
      doc.setTextColor(128, 128, 128);
      doc.text('No hay sesiones registradas para este día.', 15, yPosition);
    }

    return doc;
  },

  generateMonthlyReport: async (year: number, month: number, sessions: Session[]) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const monthName = new Date(year, month, 1).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });

    // Header
    doc.setFontSize(18);
    doc.text('Mi Cuaderno Digital', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Reporte de ${monthName}`, 105, 30, { align: 'center' });

    let yPosition = 45;

    // Summary statistics
    const totalClasses = sessions.filter(s => s.type === 'class').length;
    const totalDoubleClasses = sessions.filter(s => s.type === 'double_class').length;
    const totalExams = sessions.filter(s => s.type === 'exam').length;
    const totalUnits = totalClasses + totalDoubleClasses * 2 + totalExams;

    doc.setFontSize(11);
    doc.text('Resumen del Mes:', 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Total de Sesiones: ${sessions.length}`, 15, yPosition);
    yPosition += 7;
    doc.text(`Clases: ${totalClasses}`, 15, yPosition);
    yPosition += 7;
    doc.text(`Clases Dobles: ${totalDoubleClasses}`, 15, yPosition);
    yPosition += 7;
    doc.text(`Exámenes: ${totalExams}`, 15, yPosition);
    yPosition += 7;
    doc.text(`Total de Unidades: ${totalUnits}`, 15, yPosition);
    yPosition += 15;

    // Detailed sessions
    if (sessions.length > 0) {
      doc.setFontSize(11);
      doc.text('Detalle de Sesiones:', 15, yPosition);
      yPosition += 10;

      doc.setFillColor(0, 102, 204);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text('Fecha', 15, yPosition);
      doc.text('Hora', 40, yPosition);
      doc.text('Alumno', 55, yPosition);
      doc.text('Tipo', 120, yPosition);
      yPosition += 8;

      doc.setTextColor(0, 0, 0);
      doc.setFillColor(240, 240, 240);
      let rowIndex = 0;

      const sortedSessions = [...sessions].sort((a, b) => {
        return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
      });

      sortedSessions.forEach((session) => {
        const student = studentsStorage.getById(session.studentId);
        const sessionTypeLabel = {
          'class': 'Clase',
          'double_class': 'Clase Doble',
          'exam': 'Examen',
        }[session.type];

        const dateObj = new Date(session.date);
        const formattedDate = dateObj.toLocaleDateString('es-ES');

        if (rowIndex % 2 === 0) {
          doc.rect(15, yPosition - 6, 180, 7, 'F');
        }

        doc.setFontSize(8);
        doc.text(formattedDate, 15, yPosition);
        doc.text(session.time, 40, yPosition);
        doc.text(student?.fullName || 'N/A', 55, yPosition);
        doc.text(sessionTypeLabel, 120, yPosition);

        yPosition += 8;
        rowIndex++;

        // Check if we need a new page
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    return doc;
  },

  downloadPDF: (doc: jsPDF, filename: string) => {
    doc.save(filename);
  },
};
