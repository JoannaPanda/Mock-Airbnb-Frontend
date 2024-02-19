import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const RatingBreakdownTooltip = ({ rating, reviews }) => {
  const roundedRating = rating.toFixed(2);
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body1">Breakdown for {roundedRating} Stars:</Typography>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
            <div key={star}>
              {star} Stars: {calculatePercentage(reviews, star)}% ({getStarCount(reviews, star)} reviews)
            </div>
          ))}
        </Box>
      }
    >
      <Typography variant="body1" sx={{ fontSize: 'small', color: 'gray' }}>hover to see rating breakdown</Typography>
      <Rating
        name={`rating-${roundedRating}`}
        value={rating}
        precision={0.1}
        readOnly
      />
    </Tooltip>
  );
};

// Helper functions
const calculatePercentage = (reviews, star) => {
  const starReviews = reviews.filter((review) => review.score === star);
  return ((starReviews.length / reviews.length) * 100).toFixed(2);
};

const getStarCount = (reviews, star) => {
  const starReviews = reviews.filter((review) => review.score === star);
  return starReviews.length;
};

export default RatingBreakdownTooltip;
