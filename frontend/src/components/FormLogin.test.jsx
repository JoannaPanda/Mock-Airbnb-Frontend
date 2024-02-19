import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormLogin from '../components/FormLogin';
// import userEvent from '@testing-library/user-event';
// Mocking the react-router-dom module
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => children,
}));

describe('<FormLogin />', () => {
  test('renders without crashing', () => {
    render(<FormLogin />);
    expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
  });

  test('allows email to be set', () => {
    render(<FormLogin />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    expect(screen.getByLabelText(/Email/i).value).toBe('test@example.com');
  });

  test('allows password to be set', () => {
    render(<FormLogin />);
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Wtf.123456' } });
    expect(screen.getByLabelText(/Password/i).value).toBe('Wtf.123456');
  });

  // Add more tests here...
  test('displays an error message for invalid email', async () => {
    render(<FormLogin />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
  });

  test('prevents form submission with empty fields', async () => {
    render(<FormLogin />);
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    // Assuming an error message is shown for empty fields
    await waitFor(() => expect(screen.getByText(/Invalid email address./i)).toBeInTheDocument());
  });
});
