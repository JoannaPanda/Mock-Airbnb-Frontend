import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WriteComment = ({ open, onClose, onSubmit }) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  const handleScoreChange = (event) => {
    setScore(parseInt(event.target.value, 10));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    // Validate and submit the review
    if (score >= 0 && score <= 5 && comment.trim() !== '') {
      onSubmit({ score, comment });
      onClose();
    } else {
      // Display an error
      toast.error('Invalid review inputs, please enter valid score and comment text.', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Write a Comment</DialogTitle>
      <DialogContent>
        <Rating name="score" label="Score" value={score} onChange={handleScoreChange} />
        <TextField
          multiline
          rows={4}
          label="Comment"
          variant="outlined"
          fullWidth
          value={comment}
          onChange={handleCommentChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default WriteComment;
