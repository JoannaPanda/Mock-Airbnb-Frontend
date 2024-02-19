import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HostedList from './HostedList';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  localStorage.clear();
});

describe('HostedList Component', () => {
  // Test 1: Renders without crashing
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <HostedList />
      </MemoryRouter>
    );
    expect(screen.getByText('Create new Hosted')).toBeInTheDocument();
  });
  // Test 2: Displays the create new hosted button
  test('displays the create new hosted button', () => {
    render(
        <MemoryRouter>
          <HostedList />
        </MemoryRouter>
    );
    expect(screen.getByText('Create new Hosted')).toBeVisible();
  });
  // Test 3: Fetches listings on component mount
  test('fetches listings on component mount', async () => {
    fetch.mockResponseOnce(JSON.stringify({ listings: [] }));
    render(
        <MemoryRouter>
          <HostedList />
        </MemoryRouter>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/listings'), expect.objectContaining({ method: 'GET' })));
  });
})
