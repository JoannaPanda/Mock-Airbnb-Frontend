import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/joy/Button';
import AspectRatio from '@mui/joy/AspectRatio';
import Grid from '@mui/material/Grid';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Calendar, DateObject } from 'react-multi-date-picker';
import { ToastContainer, toast } from 'react-toastify';
import { extractYoutubeVideoId } from '../components/Helpers';

import { BackendUrl } from '../components/BackendUrl'

const SearchPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // Track selected dates
  const token = localStorage.getItem('token');
  const location = useLocation();
  const { text, price, priceCheck, bedrooms, bedroomsCheck, startDate, endDate, dateCheck, ranking, rankingCheck } = location.state || {};

  const navigate = useNavigate();

  const handleCardClick = (listingId) => {
    const route = `/listing/${listingId}`;
    if (startDate && endDate && dateCheck) {
      navigate(route, { state: { startDate, endDate } });
    } else {
      window.location.href = route;
    }
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
      console.log(formattedAvailability);

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
        })
        .catch((error) => {
          console.error('Error publishing listing:', error);
        });

      setOpenDialog(false);
      setSelectedDates([]);
    }
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
        let userHostedListings = allListings;
        if (text.trim().length !== 0) {
          const searchString = text.toLowerCase();
          userHostedListings = data.listings.filter(listing => {
            const streetLower = listing.address.street.toLowerCase();
            const titleLower = listing.title.toLowerCase();
            return streetLower.includes(searchString) || titleLower.includes(searchString);
          });
        }
        if (priceCheck) {
          userHostedListings = data.listings.filter(listing => {
            return listing.price >= price[0] && listing.price <= price[1];
          });
        }
        console.log(userHostedListings);
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
                availability: details.listing.availability,
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
          let filteredListings = listingsWithDetails.filter(
            (listing) => listing.published === true
          );
          console.log(filteredListings);
          if (dateCheck) {
            const startISO = startDate ? new Date(startDate).toISOString() : null;
            const endISO = endDate ? new Date(endDate).toISOString() : null;
            filteredListings = filteredListings.filter(listing => {
              if (listing.availability && listing.availability.length > 0) {
                return listing.availability.some(element => {
                  return startISO && endISO && element.start <= startISO && element.end >= endISO;
                });
              } else {
                return false;
              }
            });
          }
          if (bedroomsCheck) {
            filteredListings = filteredListings.filter(listing => {
              return (listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2) >= bedrooms[0] && (listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2) <= bedrooms[1];
            });
          }
          if (rankingCheck) {
            if (ranking === 'high to low') {
              filteredListings.sort((a, b) => calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews));
            }
            if (ranking === 'low to high') {
              filteredListings.sort((a, b) => calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews));
            }
          }
          setListings(filteredListings);
        });
      })
      .catch((error) => {
        console.error('Error fetching hosted listings:', error);
      });
  }, [token, text, price, priceCheck, bedrooms, bedroomsCheck, startDate, endDate, dateCheck, ranking, rankingCheck]);

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
            <h2>{listings.length === 0 ? 'Opps, no found' : 'Here are the results'}</h2>
      </Grid>
      {listings.map((listing) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
          <Card sx={{ width: '100%' }} onClick={() => handleCardClick(listing.id)}>
            <div>
              <Typography level="title-lg">{listing.title}</Typography>
              <Typography level="body-sm">
                {listing.metadata.type}, {listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2} beds, {listing.metadata.bathrooms} baths
              </Typography>
              <IconButton
                onClick={() => handlePublishClick(listing.id)}
                aria-label="Publish Listing"
              >
                <PublishIcon />
              </IconButton>
              <IconButton
                aria-label={`bookmark-${listing.title}`}
                variant="plain"
                color="neutral"
                size="sm"
                sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
              >
                <BookmarkAdd />
              </IconButton>
            </div>
            {/* Check if thumbnail is a YouTube video URL */}
            {listing.thumbnail && listing.thumbnail.includes('https://') && (
              <AspectRatio minHeight="120px" maxHeight="200px">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractYoutubeVideoId(listing.thumbnail)}`}
                  title="YouTube video player"
                  allowFullScreen
                ></iframe>
              </AspectRatio>
            )}

            {/* Check if thumbnail is an image */}
            {listing.thumbnail && !listing.thumbnail.includes('https://') && (
              <AspectRatio minHeight="120px" maxHeight="200px">
                <img src={listing.thumbnail} loading="lazy" alt={listing.title} />
              </AspectRatio>
            )}
            {/* Check if no thumbnail exists */}
            {!listing.thumbnail && (
              <AspectRatio minHeight="120px" maxHeight="200px">
                {/* Use default thumbnail image, Credit: AFP/Getty Images */}
                <img src={require('../assets/default-thumbnail.jpeg')} loading="lazy" alt={listing.title} />
              </AspectRatio>
            )}
            <CardContent orientation="horizontal">
              <div>
                <Typography level="body-xs">Total reviews: {listing.reviews.length} </Typography>
                <Rating
                  name={`rating-${listing.id}`}
                  value={listing.reviews.length > 0 ? calculateAverageRating(listing.reviews) : 0}
                  precision={0.1}
                  readOnly
                />
              </div>
              <div>
                <Typography level="body-xs">Price:</Typography>
                <Typography fontSize="lg" fontWeight="bold">
                  ${listing.price}
                </Typography>
                <Typography fontSize="small" fontWeight="normal">
                  per night
                </Typography>
              </div>
              <IconButton
                component={Link}
                to={`/edit-listing/${listing.id}`}
                aria-label="Edit Listing"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete Listing"
                color="error"
                onClick={() => handleDeleteListing(listing.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
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
          <Button onClick={handlePublishListing} color="primary">
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

// Function to calculate the average rating from reviews
const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  }
  const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
  return totalRating / reviews.length;
}

export default SearchPage;
