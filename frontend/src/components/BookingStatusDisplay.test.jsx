import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingStatusDisplay from './BookingStatusDisplay';

describe('BookingStatusDisplay Component', () => {
  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    const bookings = [
      {
        status: 'Confirmed',
        dateRange: {
          start: new Date('2023-11-01'),
          end: new Date('2023-11-05'),
        },
      },
      {
        status: 'Pending',
        dateRange: {
          start: new Date('2023-11-10'),
          end: new Date('2023-11-15'),
        },
      },
    ];

    render(<BookingStatusDisplay bookings={bookings} />);
    expect(screen.getByText('Your Booking Status')).toBeInTheDocument();
  });

  // Test 2: Displays Booking Chips
  test('displays booking chips with correct information', () => {
    const bookings = [
      {
        status: 'accepted',
        dateRange: {
          start: new Date('2023-11-01'),
          end: new Date('2023-11-05'),
        },
      },
      {
        status: 'pending',
        dateRange: {
          start: new Date('2023-11-10'),
          end: new Date('2023-11-15'),
        },
      },
    ];

    render(<BookingStatusDisplay bookings={bookings} />);

    expect(screen.getByText('Booking Status: accepted, Date Range: 11/1/2023 to 11/5/2023')).toBeInTheDocument();
    expect(screen.getByText('Booking Status: pending, Date Range: 11/10/2023 to 11/15/2023')).toBeInTheDocument();
  });

  // Test 3: Displays Tooltip with Date Range
  test('displays tooltip with correct date range', () => {
    const bookings = [
      {
        status: 'Confirmed',
        dateRange: {
          start: new Date('2023-11-01'),
          end: new Date('2023-11-05'),
        },
      },
    ];

    render(<BookingStatusDisplay bookings={bookings} />);

    const tooltipText = 'Booking Status: Confirmed, Date Range: 11/1/2023 to 11/5/2023';
    expect(screen.getByText(tooltipText)).toBeInTheDocument();
  });
});
