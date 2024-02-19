import React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const AvailabilityDisplay = ({ availability }) => {
  return (
    <>
      <Divider />
      <Typography variant="h6" gutterBottom>
        Availabilities
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        {availability.map((dateRange, index) => (
          <Chip
            key={`availability-${index}`}
            label={`${new Date(dateRange.start).toLocaleDateString()} to ${new Date(
              dateRange.end
            ).toLocaleDateString()}`}
            color="secondary"
            variant="outlined"
            sx={{ marginBottom: { xs: 1, md: 0 }, overflowWrap: 'break-word' }}
          />
        ))}
      </Stack>
    </>
  );
};

export default AvailabilityDisplay;
