import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import PublishedListingCard from './PublishedListingCard';

import { BackendUrl } from './BackendUrl';

const PublishedList = () => {
  const [listings, setListings] = useState([]);
  const token = localStorage.getItem('token');

  const handleCardClick = (listingId) => {
    window.location.href = `/listing/${listingId}`;
  };

  useEffect(() => {
    // Fetch all listings data
    fetch(`${BackendUrl}/listings`, {
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
        const allListings = data.listings;
        // Fetch additional details for each hosted listing
        const getListingsWithDetails = allListings.map((listing) => {
          return fetch(`${BackendUrl}/listings/${listing.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed: ' + response.status);
              }
              return response.json();
            })
            .then((details) => {
              return {
                ...listing,
                metadata: details.listing.metadata,
                published: details.listing.published,
              };
            })
            .catch((error) => {
              console.error('Error fetching listing details:', error);
              return listing;
            });
        });

        // Wait for all detail fetches to complete
        Promise.all(getListingsWithDetails).then((listingsWithDetails) => {
          // Filter published listings
          const filteredListings = listingsWithDetails.filter(
            (listing) => listing.published === true
          );

          // Filter listings with status accepted or pending bookings
          let userBookings = [];
          if (token) {
            const userEmail = JSON.parse(localStorage.getItem('userinfo')).email;
            // Fetch bookings
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
                  (booking) =>
                    booking.owner === userEmail &&
                    (booking.status === 'accepted' || booking.status === 'pending')
                );
                // Filter listings with accepted or pending bookings
                const userBookingsIds = userBookings.map((booking) => booking.listingId);

                const relevantListings = filteredListings.filter((listing) =>
                  userBookingsIds.includes(String(listing.id))
                );
                relevantListings.sort((a, b) => a.title.localeCompare(b.title));

                // Filter and sort remaining listings by title
                const remainingListings = filteredListings.filter(
                  (listing) => !userBookingsIds.includes(String(listing.id))
                );
                remainingListings.sort((a, b) => a.title.localeCompare(b.title));

                const combinedListings = [...relevantListings, ...remainingListings];

                // Set the state with the combined listings
                setListings(combinedListings);
              })
              .catch((error) => {
                console.error('Error fetching user bookings:', error);
              });
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching listings:', error);
      });
  }, [token]);

  return (
    <Grid container spacing={2}>
      {listings.map((listing) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
          <PublishedListingCard listing={listing} onClick={() => handleCardClick(listing.id)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PublishedList;
