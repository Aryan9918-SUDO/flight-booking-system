const PDFDocument = require('pdfkit');
const path = require('path');

class PDFService {
  static generateTicket(data) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A5', margin: 40 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(24).fillColor('#2563eb').text('FLIGHT TICKET', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#64748b').text('XTechon Airlines', { align: 'center' });
        doc.moveDown();

        // PNR and Barcode equivalent
        doc.fontSize(16).fillColor('#0f172a').text(`PNR: ${data.pnr || 'BOOKING'}`, { align: 'center' });
        doc.moveDown();

        // Passenger info
        doc.fontSize(12).fillColor('#475569');
        doc.text(`Passenger: ${data.passengerName}`, { continued: true });
        doc.text(`Date: ${new Date(data.bookingDate).toLocaleDateString('en-IN')}`, { align: 'right' });
        doc.moveDown();

        // Flight details
        doc.rect(40, doc.y, doc.page.width - 80, 100).stroke('#cbd5e1');
        doc.moveDown(0.5);

        doc.fontSize(14).fillColor('#0f172a').text('FLIGHT DETAILS', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Airline: ${data.airline}`, { indent: 10 });
        doc.text(`Flight: ${data.flightId}`, { indent: 10 });
        doc.text(`${data.departureCity} → ${data.arrivalCity}`, { indent: 10, bold: true });
        doc.moveDown();

        // Price section
        doc.fillColor('#0f172a');
        const basePrice = data.basePrice || data.finalPrice || 0;
        const finalPrice = data.finalPrice || data.basePrice || 0;

        doc.text(`Base Price: ₹${basePrice.toLocaleString('en-IN')}`, { indent: 10 });

        if (finalPrice > basePrice) {
          doc.fillColor('#dc2626');
          doc.text(`Surge Price: +₹${(finalPrice - basePrice).toLocaleString('en-IN')}`, { indent: 10 });
        }

        doc.moveDown(0.5);
        doc.fontSize(16).fillColor('#0f172a').text(`TOTAL: ₹${finalPrice.toLocaleString('en-IN')}`, {
          align: 'right',
          bold: true
        });
        doc.moveDown();

        // Footer
        doc.fontSize(10).fillColor('#64748b');
        doc.text('This is an electronic ticket. No signature required.', { align: 'center' });
        doc.moveDown(0.5);
        doc.text('Present this ticket at the airport check-in counter', { align: 'center' });
        doc.moveDown(0.5);
        doc.text(`Issued on: ${new Date().toLocaleString('en-IN')}`, { align: 'center' });

        // Decorative elements
        doc.moveDown();
        doc.lineWidth(2).strokeColor('#2563eb').moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).fillColor('#64748b').text('XTechon Flight Booking System • www.xtechon-flights.com', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;