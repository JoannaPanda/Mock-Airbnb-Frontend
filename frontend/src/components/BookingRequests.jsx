import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingReqCard from './BookingReqCard';
import Box from '@mui/material/Box';
import { BackendUrl } from './BackendUrl';

const BookingRequests = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);

  useEffect(() => {
    // Fetch booking requests for the specific listing
    const token = localStorage.getItem('token');

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

        userBookings = userBookings.filter(
          (booking) => booking.listingId === listingId
        );

        setBookingRequests(userBookings);
      })
      .catch((error) => {
        console.error('Error fetching booking requests:', error);
      });
  }, [listingId]);

  const handleAcceptBooking = (bookingId) => {
    // the logic to accept the booking
    const token = localStorage.getItem('token');

    fetch(`${BackendUrl}/bookings/accept/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed: ' + response.status);
        }
        // Update the booking status in the state
        setBookingRequests((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'accepted' } : booking
          )
        );
      })
      .catch((error) => {
        console.error('Error accepting booking:', error);
      });
  };

  const handleDeclineBooking = (bookingId) => {
    // the logic to decline the booking
    const token = localStorage.getItem('token');

    fetch(`${BackendUrl}/bookings/decline/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed: ' + response.status);
        }
        // Update the booking status in the state
        setBookingRequests((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'declined' } : booking
          )
        );
      })
      .catch((error) => {
        console.error('Error declining booking:', error);
      });
  };

  const currentYear = new Date().getFullYear();

  const calculateListingUpTime = () => {
    const postedOnDate = new Date(listing.postedOn);
    const currentDate = new Date();

    const duration = currentDate - postedOnDate;
    const years = Math.floor(duration / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((duration % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((duration % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((duration % (60 * 1000)) / 1000);

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const calculateBookedDaysThisYear = () => {
    const bookingsThisYear = bookingRequests.filter((booking) => {
      const startYear = new Date(booking.dateRange.start).getFullYear();
      return startYear === currentYear && booking.status === 'accepted';
    });

    const totalBookedDays = bookingsThisYear.reduce((sum, booking) => {
      const startDate = new Date(booking.dateRange.start);
      const endDate = new Date(booking.dateRange.end);
      const duration = (endDate - startDate) / (24 * 60 * 60 * 1000);
      return sum + duration;
    }, 0);

    return totalBookedDays;
  };

  const calculateProfitThisYear = () => {
    const bookingsThisYear = bookingRequests.filter((booking) => {
      const startYear = new Date(booking.dateRange.start).getFullYear();
      return startYear === currentYear && booking.status === 'accepted';
    });

    const totalProfit = bookingsThisYear.reduce((sum, booking) => {
      return sum + booking.totalPrice;
    }, 0);

    return totalProfit;
  };

  return (
    <Box marginY={3} marginLeft={7} marginRight={7}>
      <h2>Booking Requests for Listing {listingId}</h2>
      {listing
        ? (
        <>
          {listing.postedOn
            ? (
              <p>
                Listing Up Time: {calculateListingUpTime().years > 0 && `${calculateListingUpTime().years} years, `}
                {calculateListingUpTime().months > 0 && `${calculateListingUpTime().months} months, `}
                {calculateListingUpTime().days > 0 && `${calculateListingUpTime().days} days, `}
                {calculateListingUpTime().hours > 0 && `${calculateListingUpTime().hours} hours, `}
                {calculateListingUpTime().minutes > 0 && `${calculateListingUpTime().minutes} minutes, `}
                {calculateListingUpTime().seconds} seconds
              </p>
              )
            : (
              <p>Listing Up Time: Currently, the list is not published.</p>
              )}
          <p>Booked Days This Year: {calculateBookedDaysThisYear()} days</p>
          <p>Profit This Year: ${calculateProfitThisYear()}</p>
        </>
          )
        : (
        <p>Loading...</p>
          )}
      {bookingRequests.length > 0
        ? (
            bookingRequests.map((booking) => (
          <BookingReqCard
            key={booking.id}
            booking={booking}
            onAccept={handleAcceptBooking}
            onDecline={handleDeclineBooking}
          />
            ))
          )
        : (
        <p>Currently there is no booking request for this listing.</p>
          )}
    </Box>
  );
};

export default BookingRequests;
