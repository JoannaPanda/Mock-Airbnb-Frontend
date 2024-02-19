import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HostedListingCard from './HostedListingCard';
import { MemoryRouter } from 'react-router-dom';

const mockListing = {
  id: 1,
  title: 'Sample Listing',
  metadata: {
    type: 'Apartment',
    singleBedrooms: 2,
    doubleBedrooms: 1,
    bathrooms: 2,
  },
  published: true,
  thumbnail: 'https://www.youtube.com/watch?v=EKaHDu5ebqg',
  reviews: [{ score: 4 }, { score: 5 }],
  price: 100,
};

// Mock functions
const mockHandleCardClick = jest.fn();
const mockHandleBookClick = jest.fn();
const mockHandlePublishClick = jest.fn();
const mockHandleUnpublishListing = jest.fn();
const mockHandleDeleteListing = jest.fn();

describe('HostedListingCard Component', () => {
  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Sample Listing')).toBeInTheDocument();
  });

  // Test 2: displays publish/unpublish buttons
  test('displays publish/unpublish buttons', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Unpublish Listing')).toBeInTheDocument();

    // Clicking on unpublish button should trigger handleUnpublishListing
    fireEvent.click(screen.getByLabelText('Unpublish Listing'));
    expect(mockHandleUnpublishListing).toHaveBeenCalledWith(1);
  });

  // Test 3: Displays bookmark button
  test('displays bookmark button', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
        </MemoryRouter>
    );
    expect(screen.getByLabelText('bookmark-Sample Listing')).toBeInTheDocument();
  });

  // Test 4: Displays thumbnail correctly
  test('displays thumbnail correctly', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
      </MemoryRouter>
    );
    expect(screen.getByTitle('YouTube video player')).toBeInTheDocument();
  });

  // Test 5: Displays price information
  test('displays price information', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('per night')).toBeInTheDocument();
  });

  // Test 6: Clicking on delete button should trigger handleDeleteListing
  test('triggers handleDeleteListing when clicking delete button', () => {
    render(
      <MemoryRouter>
        <HostedListingCard
          listing={mockListing}
          handleCardClick={mockHandleCardClick}
          handleBookClick={mockHandleBookClick}
          handlePublishClick={mockHandlePublishClick}
          handleUnpublishListing={mockHandleUnpublishListing}
          handleDeleteListing={mockHandleDeleteListing}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText('Delete Listing'));
    expect(mockHandleDeleteListing).toHaveBeenCalledWith(1);
  });
});
