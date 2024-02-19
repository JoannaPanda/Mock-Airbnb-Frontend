import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormRegister from './FormRegister'
import { MemoryRouter } from 'react-router-dom';
import { BackendUrl } from './BackendUrl';
global.fetch = require('jest-fetch-mock');
describe('<FormRegister />', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test('renders the registration form with all fields', () => {
    render(
        <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });
  test('allows the user to enter a username', () => {
    render(
        <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });
  test('allows the user to enter an email', () => {
    render(
        <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });
  test('allows the user to enter a password', () => {
    render(
        <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText('Password (Please enter a strong password)');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    expect(passwordInput.value).toBe('Password123!');
  });
  test('displays an error message no email', async () => {
    render(
        <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Password (Please enter a strong password)'), { target: { value: 'weak' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => {
      expect(screen.getByText('Invalid username.')).toBeInTheDocument();
    });
  });
  test('successfully submits the form', async () => {
    fetch.mockResponseOnce(JSON.stringify({ token: 'fake_token' }));

    render(
      <MemoryRouter>
        <FormRegister />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password \(Please enter a strong password\)/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      const expectedBody = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
      };

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toBe(`${BackendUrl}/user/auth/register`);
      expect(fetch.mock.calls[0][1].method).toBe('POST');
      expect(fetch.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'application/json' });
      expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(expectedBody);
    });

    await waitFor(() => {
      expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
    });
  });
})
