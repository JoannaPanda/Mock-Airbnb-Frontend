import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Box from '@mui/material/Box';
import { calculateBookingLength, formatDate } from './Helpers';
import { BackendUrl } from './BackendUrl';
import BookingButton from './BookingButton';
import ReviewCard from './ReviewCard';
import Divider from '@mui/material/Divider';
import Button from '@mui/joy/Button';
import WriteComment from './WriteComment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewModal from './ReviewModal';
import RatingBreakdownTooltip from './RatingBreakdownTooltip';

import AvailabilityDisplay from './AvailabilityDisplay';
import BookingStatusDisplay from './BookingStatusDisplay';
import ImageSlider from './ImageSlider';

const ListingDetails = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  const [listing, setListing] = useState(null);
  const [bookingDisplay, setBookingDisplay] = useState(null);
  const token = localStorage.getItem('token');
  // manage the write comment dialog
  const [writeCommentOpen, setWriteCommentOpen] = useState(false);
  // manage advanced modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  // Function to handle clicking a star rating
  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  let stayLength = null;
  if (startDate && endDate) {
    stayLength = calculateBookingLength(formatDate(startDate, false), formatDate(endDate, false));
  }

  useEffect(() => {
    // Fetch listing details based on listingId
    fetch(`${BackendUrl}/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error('Failed: ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setListing(data.listing);
      })
      .catch((error) => {
        console.error('Error fetching listing details:', error);
      });

    let userBookings = [];
    if (token) {
    // Fetch user email
      const userEmail = JSON.parse(localStorage.getItem('userinfo')).email;

      // Fetch user bookings
      fetch(`${BackendUrl}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw Error('Failed: ' + response.status);
          }
          return response.json();
        })
        .then((bookingData) => {
          userBookings = bookingData.bookings;

          // Check if there's any booking for the current listing for the current user
          userBookings = userBookings.filter(
            (booking) => booking.owner === userEmail && booking.listingId === listingId
          );
          setBookingDisplay(userBookings);
        })
        .catch((error) => {
          console.error('Error fetching user bookings:', error);
        });
    }
  }, [listingId]);

  if (!listing) {
    return <div>Loading...</div>;
  }

  // Function to handle submitting a review
  const handleReviewSubmit = (review) => {
    const { score, comment } = review;
    const acceptedBookings = bookingDisplay.filter(
      (booking) => booking.status === 'accepted'
    );
    const bookingId = acceptedBookings[0].id; // Use any bookingId from the accepted booking
    if (token && bookingId) {
      const userEmail = JSON.parse(localStorage.getItem('userinfo')).email;

      // Prepare the review object
      const newReview = {
        review: {
          score,
          comment,
          owner: userEmail,
          time: Date.now(),
        },
      };

      // optimistic UI update - Add the new review to the local state
      setListing((prevListing) => ({
        ...prevListing,
        reviews: [...prevListing.reviews, newReview.review],
      }));

      fetch(`${BackendUrl}/listings/${listingId}/review/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(newReview)
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }
          // Reload the listing details to update the reviews
          return response.json();
        })
        .catch((error) => {
          // if there's an error, roll back the update
          setListing((prevListing) => ({
            ...prevListing,
            reviews: prevListing.reviews.filter((r) => r !== newReview.review),
          }));
          toast.error(`Review failed, ${error}`, {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        });
    }
  };

  return (
    <Box marginY={3} marginLeft={7} marginRight={7}>
      <Typography variant="h4">{listing.title}</Typography>
      <Typography variant="body1">
        {listing.metadata.type}, {listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2} beds, {listing.metadata.bathrooms} baths
      </Typography>
      <Typography variant="body2">Total reviews: {listing.reviews.length}</Typography>
      {/* Booking the listing, display only when user log in */}
      {token && <BookingButton listingId={listingId} pricePerNight={listing.price} />}

      <Box marginY={2} marginLeft={4} marginRight={4}>
        {/* Image slider */}
      {listing.thumbnail || (listing.metadata.listingImgs && listing.metadata.listingImgs.length > 0)
        ? (
        <ImageSlider
          images={[
            listing.thumbnail,
            ...(listing.metadata.listingImgs || []),
          ]}
        />
          )
        : (
        <Typography variant="h5"> No images available</Typography>
          )}
      </Box>

      <CardContent>
        <div>
          <Typography variant="body2">Rating:</Typography>
          {/* advanced rating */}
          <RatingBreakdownTooltip
            rating={listing.reviews.length > 0 ? calculateAverageRating(listing.reviews) : 0}
            reviews={listing.reviews}
          />
        </div>
        <div>
          <Typography variant="body2">Price:</Typography>
          <Typography variant="h5">${startDate && endDate ? listing.price * stayLength : listing.price}</Typography>
          {/* Display per stay or per night based on the search */}
          <Typography variant="body2">{startDate && endDate ? `per stay (for ${stayLength} days: ${formatDate(startDate, true)} to ${formatDate(endDate, true)} ) ` : 'per night'}</Typography>
        </div>
        <Typography variant="body2">Address: {formatAddress(listing.address)}</Typography>
        <Typography variant="body2">Amenities: {listing.metadata.amenities.join(', ')}</Typography>
        <Typography variant="body2">Bedrooms: {listing.metadata.singleBedrooms} Single-bed bedrooms, {listing.metadata.doubleBedrooms} Double-bed bedrooms</Typography>
        <Typography variant="body2">Number of beds: {listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2}</Typography>
        <Typography variant="body2">Number of bathrooms: {listing.metadata.bathrooms}</Typography>
        {/* Booking status */}
        {bookingDisplay && bookingDisplay.length > 0 && (
          <BookingStatusDisplay bookings={bookingDisplay} />
        )}
        {/* Availability display */}
        {listing.availability && listing.availability.length > 0 && (
          <AvailabilityDisplay availability={listing.availability} />
        )}
        <Divider />
        <Typography variant="h6" gutterBottom>
          Reviews
        </Typography>
        {/* Button trigger the write comment dialog */}
        {token && bookingDisplay && bookingDisplay.some(booking =>
          booking.status === 'accepted'
        ) && (
          <Button
            onClick={() => setWriteCommentOpen(true)}
            sx={{ marginBottom: '16px' }}
          >
            Write a Comment
          </Button>
        )}
        {/* Write Comment Dialog */}
        <WriteComment
          open={writeCommentOpen}
          onClose={() => setWriteCommentOpen(false)}
          onSubmit={handleReviewSubmit}
        />
        {/* reviews */}
        {listing.reviews.length > 0
          ? (
              listing.reviews.map((review, index) => (
                <ReviewCard
                  key={`review-${index}`}
                  owner={review.owner}
                  time={new Date(review.time).toLocaleString()}
                  score={review.score}
                  comment={review.comment}
                  onClick={() => handleRatingClick(review.score)}
                />
              ))
            )
          : (
          <Typography variant="body2"> Currently there is no reviews for this listing.</Typography>
            )}
      </CardContent>
      <ToastContainer />
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedRating={selectedRating} reviews={listing.reviews} />
      </Box>
  );
};

const calculateAverageRating = (reviews) => {
  const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
  return totalRating / reviews.length;
};

const formatAddress = (address) => {
  return `${address.street} Street, ${address.city}, ${address.state} ${address.postcode}, ${address.country}`;
};

export default ListingDetails;
