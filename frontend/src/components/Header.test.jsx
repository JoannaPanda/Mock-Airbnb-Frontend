import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

describe('Header Component', () => {
  // 1. Test if the component renders correctly
  test('renders Header component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Airbrb')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });
  // 2. Test text input
  test('allows text input', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'test' } });
    expect(screen.getByPlaceholderText('Search…').value).toBe('test');
  });
})
