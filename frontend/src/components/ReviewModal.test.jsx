import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewModal from './ReviewModal';

describe('ReviewModal Component', () => {
  const mockReviews = [
    { owner: 'User1', time: Date.now(), score: 4, comment: 'Good review' },
    { owner: 'User2', time: Date.now(), score: 4, comment: 'Another good review' },
    { owner: 'User3', time: Date.now(), score: 5, comment: 'Excellent review' },
  ];

  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<ReviewModal isOpen onClose={() => {}} selectedRating={4} reviews={mockReviews} />);
    expect(screen.getByText('Reviews for 4 Stars')).toBeInTheDocument();
  });

  // Test 2: Displays reviews for the selected rating
  test('displays reviews for the selected rating', () => {
    render(<ReviewModal isOpen onClose={() => {}} selectedRating={4} reviews={mockReviews} />);
    expect(screen.getAllByText(/Good review|Another good review/).length).toBe(2);
  });

  // Test 3: Does not display reviews for other ratings
  test('does not display reviews for other ratings', () => {
    render(<ReviewModal isOpen onClose={() => {}} selectedRating={4} reviews={mockReviews} />);
    expect(screen.queryByText('Excellent review')).toBeNull();
  });
});
