import React from 'react';
import { render, screen } from '@testing-library/react';
import PublishedListingCard from './PublishedListingCard';

const mockListing = {
  id: 1,
  title: 'Sample Listing',
  metadata: {
    type: 'Apartment',
    singleBedrooms: 2,
    doubleBedrooms: 1,
    bathrooms: 2,
  },
  reviews: [
    { score: 4 },
    { score: 5 },
  ],
  thumbnail: 'https://www.youtube.com/watch?v=videoId1',
  price: 100,
};

describe('PublishedListingCard Component', () => {
  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<PublishedListingCard listing={mockListing} />);
    expect(screen.getByText('Sample Listing')).toBeInTheDocument();
  });

  // Test 2: Displays correct listing details
  test('displays correct listing details', () => {
    render(<PublishedListingCard listing={mockListing} />);
    expect(screen.getByText('Total reviews: 2')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  // Test 3: Displays YouTube video correctly
  test('displays YouTube video correctly', () => {
    render(<PublishedListingCard listing={mockListing} />);
    const youtubeVideo = screen.getByTitle('YouTube video player');
    expect(youtubeVideo).toBeInTheDocument();
    expect(youtubeVideo.src).toBe('https://www.youtube.com/embed/videoId1');
  });
});
