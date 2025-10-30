# Ticket PDF Download Integration Guide

## Overview
This guide explains how to integrate the PDF ticket download feature in the Onvent frontend application.

## Component Usage

### TicketDownload Component
A reusable React component is provided to handle PDF ticket downloads:

```jsx
import TicketDownload from './components/TicketDownload';

// In your JSX
<TicketDownload 
  ticketId={ticket.id}
  ticketCode={ticket.ticketCode}
  eventTitle={ticket.eventTitle}
/>
```

### Props
- `ticketId` (required): The ID of the ticket to download
- `ticketCode` (required): The ticket reference code (used for filename)
- `eventTitle` (required): The name of the event (used for display)

## Service Integration

### ticketService.downloadTicketPdf()
The ticket service includes a method for downloading PDF tickets:

```javascript
import ticketService from '../services/ticketService';

// Download a ticket PDF
const downloadTicket = async (ticketId) => {
  try {
    const pdfBlob = await ticketService.downloadTicketPdf(ticketId);
    
    // Create and trigger download
    const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-${ticketId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

## API Endpoint
The backend provides a dedicated endpoint for PDF downloads:
```
GET /tickets/{ticketId}/pdf
```

This endpoint:
- Requires authentication
- Validates ticket ownership
- Returns PDF content as binary data
- Sets appropriate HTTP headers for file download

## Error Handling
The component handles common error scenarios:
- Network failures
- Authentication issues
- Ticket not found
- Permission denied

## Styling
The component uses Tailwind CSS classes for styling. You can customize the appearance by modifying the CSS classes in the component.

## Integration Example
Here's a complete example of how to integrate the download feature in a ticket list:

```jsx
import React, { useEffect, useState } from 'react';
import ticketService from '../services/ticketService';
import TicketDownload from './TicketDownload';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ticketService.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map(booking => (
        <div key={booking.ticketId} className="border p-4 mb-4">
          <h3>{booking.eventTitle}</h3>
          <p>Date: {new Date(booking.eventDate).toLocaleString()}</p>
          <p>Reference: {booking.ticketCode}</p>
          <TicketDownload 
            ticketId={booking.ticketId}
            ticketCode={booking.ticketCode}
            eventTitle={booking.eventTitle}
          />
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
```