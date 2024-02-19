import React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ReviewCard from './ReviewCard';

const ReviewModal = ({ isOpen, onClose, selectedRating, reviews }) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    aria-labelledby="rating-modal"
    aria-describedby="star-rating-modal"
  >
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 370, maxHeight: '80vh', overflowY: 'auto' }}>
      <Typography variant="h6">
        Reviews for {selectedRating} Stars
      </Typography>
      {reviews
        .filter((review) => review.score === selectedRating)
        .map((review, index) => (
            <ReviewCard key={`modal-review-${index}`} owner={review.owner} time={new Date(review.time).toLocaleString()} score={review.score} comment={review.comment} />
        ))}
    </Box>
  </Modal>
);

export default ReviewModal;
