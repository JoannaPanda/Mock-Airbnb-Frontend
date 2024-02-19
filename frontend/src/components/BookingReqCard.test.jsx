import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingReqCard from './BookingReqCard';

describe('BookingReqCard Component', () => {
  const booking = {
    id: '123',
    dateRange: {
      start: '2023-11-01',
      end: '2023-11-05',
    },
    totalPrice: 200,
    status: 'pending',
  };

  // mock functions for onAccept and onDecline
  const onAccept = jest.fn();
  const onDecline = jest.fn();

  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<BookingReqCard booking={booking} onAccept={onAccept} onDecline={onDecline} />);
    expect(screen.getByText(`Booking ID: ${booking.id}`)).toBeInTheDocument();
  });

  // Test 2: Displays Date Range, Total Price, and Status
  test('displays date range, total price, and status', () => {
    render(<BookingReqCard booking={booking} onAccept={onAccept} onDecline={onDecline} />);
    expect(screen.getByText(`Date Range: ${booking.dateRange.start} to ${booking.dateRange.end}`)).toBeInTheDocument();
    expect(screen.getByText(`Total Price: $${booking.totalPrice}`)).toBeInTheDocument();
    expect(screen.getByText(`Status: ${booking.status}`)).toBeInTheDocument();
  });

  // Test 3: Displays Accept and Decline buttons for pending status
  test('displays Accept and Decline buttons for pending status', () => {
    render(<BookingReqCard booking={booking} onAccept={onAccept} onDecline={onDecline} />);

    const acceptButton = screen.getByLabelText('Accept Booking');
    const declineButton = screen.getByLabelText('Decline Booking');

    expect(acceptButton).toBeInTheDocument();
    expect(declineButton).toBeInTheDocument();

    // Simulate click events
    fireEvent.click(acceptButton);
    fireEvent.click(declineButton);

    // Check if the mock functions were called with the correct booking id
    expect(onAccept).toHaveBeenCalledWith(booking.id);
    expect(onDecline).toHaveBeenCalledWith(booking.id);
  });

  // Test 4: Does not display Accept and Decline buttons for a status other than pending
  test('does not display Accept and Decline buttons for a status other than pending', () => {
    const nonPendingBooking = {
      ...booking,
      status: 'approved',
    };

    render(<BookingReqCard booking={nonPendingBooking} onAccept={onAccept} onDecline={onDecline} />);

    const acceptButton = screen.queryByLabelText('Accept Booking');
    const declineButton = screen.queryByLabelText('Decline Booking');

    expect(acceptButton).not.toBeInTheDocument();
    expect(declineButton).not.toBeInTheDocument();
  });
});
