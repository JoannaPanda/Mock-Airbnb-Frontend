import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WriteComment from './WriteComment';
import { act } from 'react-dom/test-utils';
import { toast } from 'react-toastify';

// Mock the toast.error function
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    error: jest.fn(),
  },
}));

describe('WriteComment Component', () => {
  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<WriteComment open onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByText('Write a Comment')).toBeInTheDocument();
  });

  // Test 2: Displays the Comment TextField
  test('displays the Comment TextField', () => {
    render(<WriteComment open onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  });

  // Test 3: Shows an error for invalid inputs
  test('shows an error for invalid inputs', async () => {
    const mockOnSubmit = jest.fn();
    render(<WriteComment open onClose={() => {}} onSubmit={mockOnSubmit} />);

    // Submit the form without entering a comment
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Wait for the mock function to be called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for async operations to complete
    });

    // Check if the mock function was called with the correct message
    expect(toast.error).toHaveBeenCalledWith('Invalid review inputs, please enter valid score and comment text.', {
      position: 'bottom-left',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
    });
  });
});
