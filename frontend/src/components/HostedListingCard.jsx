import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import AspectRatio from '@mui/joy/AspectRatio';
import { extractYoutubeVideoId } from './Helpers';
import { Link } from 'react-router-dom';

const HostedListingCard = ({ listing, handleCardClick, handleBookClick, handlePublishClick, handleUnpublishListing, handleDeleteListing }) => {
  return (
    <Card sx={{ width: '100%' }} onClick={() => handleCardClick(listing.id)}>
      <div>
        <Typography level="title-lg">{listing.title}</Typography>
        <Typography level="body-sm">
          {listing.metadata.type}, {listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2} beds, {listing.metadata.bathrooms} baths
        </Typography>
        {!listing.published && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent event bubbling
              handlePublishClick(listing.id);
            }}
            aria-label="Publish Listing"
          >
            <PublishIcon />
          </IconButton>
        )}

        {listing.published && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent event bubbling
              handleUnpublishListing(listing.id);
            }}
            aria-label="Unpublish Listing"
          >
            <DoDisturbAltIcon />
          </IconButton>
        )}
        <IconButton
          aria-label={`bookmark-${listing.title}`}
          variant="plain"
          color="neutral"
          size="sm"
          className="viewBooking"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
          onClick={(event) => {
            event.stopPropagation();
            handleBookClick(listing.id);
          }}
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
          id="edit-listing"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="Delete Listing"
          color="error"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteListing(listing.id)
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

// Function to calculate the average rating from reviews
const calculateAverageRating = (reviews) => {
  const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
  return totalRating / reviews.length;
}

export default HostedListingCard;
