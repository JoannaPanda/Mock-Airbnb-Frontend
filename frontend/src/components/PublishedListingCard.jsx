import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Rating from '@mui/material/Rating';
import AspectRatio from '@mui/joy/AspectRatio';
import { extractYoutubeVideoId } from './Helpers';

const PublishedListingCard = ({ listing, onClick }) => {
  return (
    <Card sx={{ width: '100%' }} className="published-card" onClick={onClick}>
      <div>
        <Typography level="title-lg">{listing.title}</Typography>
        <Typography level="body-sm">
          {listing.metadata.type}, {listing.metadata.singleBedrooms + listing.metadata.doubleBedrooms * 2} beds, {listing.metadata.bathrooms} baths
        </Typography>
        <Typography level="body-xs">Total reviews: {listing.reviews.length}</Typography>
      </div>
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
          <Rating
            name={`rating-${listing.id}`}
            value= {listing.reviews.length > 0 ? calculateAverageRating(listing.reviews) : 0}
            reviews={listing.reviews}
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
      </CardContent>
    </Card>
  );
};

// Function to calculate the average rating from reviews
const calculateAverageRating = (reviews) => {
  const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
  return totalRating / reviews.length;
};

export default PublishedListingCard;
