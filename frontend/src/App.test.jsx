
import React from 'react';
import { render, screen } from '@testing-library/react';
import 'media-match';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElements = screen.queryAllByText(/o/i);
  expect(linkElements.length).toBeGreaterThan(0);
});
