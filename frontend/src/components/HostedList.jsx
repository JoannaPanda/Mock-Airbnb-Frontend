import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Calendar, DateObject } from 'react-multi-date-picker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HostedListingCard from './HostedListingCard';
import AdvancedGraph from './advancedGraph';
import { BackendUrl } from './BackendUrl';

const HostedList = () => {
  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // Track selected dates
  const [allHostedListings, setAllHostedListings] = useState(null);
  const token = localStorage.getItem('token');

  let userEmail = null;
  if (token) {
    userEmail = JSON.parse(localStorage.getItem('userinfo')).email;
  }

  const handleCardClick = (listingId) => {
    window.location.href = `/listing/${listingId}`;
  };

  const handleBookClick = (listingId) => {
    window.location.href = `/bookings/${listingId}`;
  };

  const handlePublishClick = (listingId) => {
    setSelectedListingId(listingId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedDates([]);
  };

  const handleCalendarChange = (dates) => {
    setSelectedDates(dates);
  };

  // Function to handle the submission of availability date ranges
  const handlePublishListing = () => {
    if (selectedDates.length > 0) {
      const formattedAvailability = selectedDates.map((dateRange) => ({
        start: new DateObject(dateRange[0]).toDate(), // Convert DateObject to Date
        end: new DateObject(dateRange[1]).toDate(),
      }));

      fetch(`${BackendUrl}/listings/publish/${selectedListingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ availability: formattedAvailability }), // Pass selected dates
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed: ' + response.status);
          }
          toast.success('Publish Successful!', {
            position: 'bottom-left',
            autoClose: 100,
            hideProgressBar: false,
            closeOnClick: true,
          });
          setListings((prevListings) =>
            prevListings.map((listing) =>
              listing.id === selectedListingId ? { ...listing, published: true } : listing
            )
          );
        })
        .catch((error) => {
          console.error('Error publishing listing:', error);
        });

      setOpenDialog(false);
      setSelectedDates([]);
    }
  };
  const handleUnpublishListing = (listingId) => {
    setSelectedListingId(listingId);

    fetch(`${BackendUrl}/listings/unpublish/${listingId}`, {
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
        toast.success('Unpublish Successful!', {
          position: 'bottom-left',
          autoClose: 100,
          hideProgressBar: false,
          closeOnClick: true,
        });
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId ? { ...listing, published: false } : listing
          )
        );
      })
      .catch((error) => {
        console.error('Error publishing listing:', error);
      });
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
        // Filter listings for the current user
        const userHostedListings = allListings.filter((listing) => listing.owner === userEmail);
        setAllHostedListings(userHostedListings);

        // Fetch additional details for each hosted listing
        const hostedListingsWithDetails = userHostedListings.map((listing) => {
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
                published: details.listing.published
              };
            })
            .catch((error) => {
              console.error('Error fetching listing details:', error);
              return listing;
            });
        });

        // Wait for all detail fetches to complete
        Promise.all(hostedListingsWithDetails).then((listingsWithDetails) => {
          // Update the state with hosted listings and their details
          setListings(listingsWithDetails);
        });
      })
      .catch((error) => {
        console.error('Error fetching hosted listings:', error);
      });
  }, [token, userEmail]);

  // Function to delete a listing
  const handleDeleteListing = (listingId) => {
    fetch(`${BackendUrl}/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed: ' + response.status);
        }
        // Remove the deleted listing from the state
        setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
      })
      .catch((error) => {
        console.error('Error deleting listing:', error);
      });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link to="/hosted-create" className="create-link">
          <Button variant="solid" size="md" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
            Create new Hosted
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        {allHostedListings && <AdvancedGraph userHostedListings={allHostedListings} />}
      </Grid>
      {listings.map((listing) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
          <HostedListingCard
            listing={listing}
            handleCardClick={handleCardClick}
            handleBookClick={handleBookClick}
            handlePublishClick={handlePublishClick}
            handleUnpublishListing={handleUnpublishListing}
            handleDeleteListing={handleDeleteListing}
          />
        </Grid>
      ))}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Select Availability</DialogTitle>
        <DialogContent>
        {/* Reference: https://shahabyazdi.github.io/react-multi-date-picker/multiple-range/ */}
          <Calendar
            multiple // Allow multiple date ranges to be selected
            value={selectedDates}
            onChange={handleCalendarChange} // Handle date changes
            range
          />
        </DialogContent>
        <DialogActions>
          <Button id='publish-submit' onClick={handlePublishListing} color="primary">
            Publish
          </Button>
          <Button onClick={handleDialogClose} color="info">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Grid>
  );
};

export default HostedList;
