import React from 'react';
import { ticketService } from '../services/ticketService';

const TicketDownload = ({ ticketId, ticketCode, eventTitle }) => {
  const handleDownload = async () => {
    try {
      const pdfBlob = await ticketService.downloadTicketPdf(ticketId);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticketCode}.pdf`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download PDF Ticket for {eventTitle}
    </button>
  );
};

export default TicketDownload;