import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingButton from './BookingButton';

// mocking the fetch function
jest.mock('node-fetch');

describe('BookingButton Component', () => {
  const localStorageMock = {
    getItem: jest.fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<BookingButton listingId="123" pricePerNight={50} />);
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  // Test 2: Opens the dialog
  test('opens and closes the dialog', () => {
    render(<BookingButton listingId="123" pricePerNight={50} />);
    fireEvent.click(screen.getByText('Book Now'));

    expect(screen.getByText('Book Listing')).toBeInTheDocument();
  });

  // Test 3: Inputs are working correctly
  test('inputs are working correctly', () => {
    render(<BookingButton listingId="123" pricePerNight={50} />);
    fireEvent.click(screen.getByText('Book Now'));

    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    fireEvent.change(startDateInput, { target: { value: '2023-11-01' } });
    fireEvent.change(endDateInput, { target: { value: '2023-11-05' } });

    expect(startDateInput.value).toBe('2023-11-01');
    expect(endDateInput.value).toBe('2023-11-05');
  });

  // Test 4: Handles booking correctly
  test('handles booking correctly', async () => {
    render(<BookingButton listingId="123" pricePerNight={50} />);
    fireEvent.click(screen.getByText('Book Now'));

    localStorageMock.getItem.mockReturnValueOnce('fake-token');

    // mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bookingId: '456' }),
      })
    );

    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2023-11-01' } });
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2023-11-05' } });

    fireEvent.click(screen.getByText('Book'));

    // await for api resolve
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        const normalizedText = content.trim().replace(/\s+/g, ' ');
        return normalizedText.includes('You have made a new booking request with id 456!');
      })).toBeInTheDocument();

      expect(screen.queryByText('Book Listing')).not.toBeInTheDocument();
    });
  });

  // Test 5: Shows error message for invalid inputs
  test('shows error message for invalid inputs', async () => {
    render(<BookingButton listingId="123" pricePerNight={50} />);
    fireEvent.click(screen.getByText('Book Now'));

    fireEvent.click(screen.getByText('Book'));

    await waitFor(() => {
      expect(screen.getByText('Please input valid start and end date')).toBeInTheDocument();
    });
  });

  // Cleanup
  afterEach(() => {
    jest.clearAllMocks();
  });
});
