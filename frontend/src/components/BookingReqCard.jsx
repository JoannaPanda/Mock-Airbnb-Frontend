import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';

const BookingReqCard = ({ booking, onAccept, onDecline }) => {
  return (
    <Card key={booking.id} sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h6">Booking ID: {booking.id}</Typography>
        <Typography>Date Range: {booking.dateRange.start} to {booking.dateRange.end}</Typography>
        <Typography>Total Price: ${booking.totalPrice}</Typography>
        <Typography>Status: {booking.status}</Typography>
        {(booking.status === 'pending') && (
          <>
            <Button aria-label="Accept Booking" onClick={() => onAccept(booking.id)} >
              Accept
            </Button>
            <Button aria-label="Decline Booking" onClick={() => onDecline(booking.id)}>
              Decline
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingReqCard;
