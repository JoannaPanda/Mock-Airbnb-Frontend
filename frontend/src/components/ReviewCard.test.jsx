import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewCard from './ReviewCard';

describe('ReviewCard Component', () => {
  const mockReview = {
    owner: 'User1',
    time: '2023-11-17T12:30:00',
    score: 4.5,
    comment: 'Great review!',
  };

  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(<ReviewCard {...mockReview} />);
    expect(screen.getByText('Written by: User1')).toBeInTheDocument();
    expect(screen.getByText('Rating:')).toBeInTheDocument();
    expect(screen.getByText('Comment:')).toBeInTheDocument();
  });

  // Test 2: Displays the correct review information
  test('displays the correct review information', () => {
    render(<ReviewCard {...mockReview} />);
    expect(screen.getByText('Written by: User1')).toBeInTheDocument();
    expect(screen.getByText('Rating:')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Comment:')).toBeInTheDocument();
    expect(screen.getByText('Great review!')).toBeInTheDocument();
  });
});
