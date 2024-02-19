import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BackendUrl } from './BackendUrl';
import { calculateBookingLength } from './Helpers';

const BookingButton = ({ listingId, pricePerNight }) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDatesValid = () => {
    return startDate && endDate && startDate < endDate;
  };

  const handleBook = () => {
    const token = localStorage.getItem('token');

    if (isDatesValid()) {
      const params = {
        start: startDate,
        end: endDate,
      };

      const bookingLength = calculateBookingLength(startDate, endDate);

      // Calculate total price
      const totalPrice = pricePerNight * bookingLength;
      fetch(`${BackendUrl}/bookings/new/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ dateRange: params, totalPrice }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }
          return response.json();
        })
        .then((data) => {
          toast.success(`You have made a new booking request with id ${data.bookingId}! Date range: from ${startDate} to ${endDate}, the total price is ${totalPrice}`, {
            position: 'middle',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
          });
          handleClose();
        })
        .catch((error) => {
          toast.error(`Booking failed, ${error}`, {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        });
    } else {
      toast.error('Please input valid start and end date', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <Button className="bookButton" variant="outlined" color="primary" onClick={handleOpen}>
        Book Now
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book Listing</DialogTitle>
        <DialogContent>
          <TextField
            sx ={{ margin: '10px' }}
            label="Start Date"
            id="start-date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx ={{ margin: '10px' }}
            label="End Date"
            id="end-date-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button id="submit-booking-button" onClick={handleBook} color="primary">
            Book
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default BookingButton;
