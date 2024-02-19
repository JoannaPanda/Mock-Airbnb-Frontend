import React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const BookingStatusDisplay = ({ bookings }) => {
  return (
    <>
      <Divider />
      <Typography variant="h6" gutterBottom>
        Your Booking Status
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        {bookings.map((booking, index) => (
          <Tooltip
            key={`tooltip-${index}`}
            title={`Booking Status: ${booking.status}, Date Range: ${new Date(
              booking.dateRange.start
            ).toLocaleDateString()} to ${new Date(booking.dateRange.end).toLocaleDateString()}`}
          >
            <Chip
              key={`booking-${index}`}
              label={`Booking Status: ${booking.status}, Date Range: ${new Date(
                booking.dateRange.start
              ).toLocaleDateString()} to ${new Date(booking.dateRange.end).toLocaleDateString()}`}
              color="primary"
              variant="outlined"
              sx={{ marginBottom: { xs: 1, md: 0 }, overflowWrap: 'break-word' }}
            />
          </Tooltip>
        ))}
      </Stack>
    </>
  );
};

export default BookingStatusDisplay;
