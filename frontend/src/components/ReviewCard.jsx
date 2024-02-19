import React from 'react';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const ReviewCard = ({ owner, time, score, comment, onClick }) => (
  <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
    <Typography variant="body1" fontWeight="bold">
      Written by: {owner}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: 'small', color: 'gray' }}>{time}</Typography>
    <Typography variant="body2" fontWeight="bold">
      Rating:
    </Typography>
    <Box display="flex" alignItems="center">
    <Rating
        name="rating"
        value={score}
        precision={0.1}
        readOnly={!onClick}
        size="small"
        onClick={onClick}
      />
      <Typography variant="body2" fontWeight="bold" marginLeft="8px">
        {score}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight="bold">
      Comment:
    </Typography>
    <Typography variant="body2">{comment}</Typography>
  </Paper>
);

export default ReviewCard;
