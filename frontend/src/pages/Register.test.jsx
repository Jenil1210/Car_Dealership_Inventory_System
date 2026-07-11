import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from './Register';
import client from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders name, email, password, confirm password inputs and register button', () => {
    render(<Register />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  // Sprint 74 RED: Test that submit calls Register API, stores token/role, and redirects
  it('submits form, calls register API, and saves credentials on success', async () => {
    const fakeToken = 'fake-jwt-token';
    const fakeRole = 'USER';
    client.post.mockResolvedValueOnce({
      data: { token: fakeToken, role: fakeRole },
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'password123',
        role: 'USER',
      });
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(localStorage.getItem('role')).toBe(fakeRole);
    });
  });

  // Sprint 74 RED: Test that confirms validation error when passwords do not match
  it('displays validation error if passwords do not match', async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'mismatch' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(client.post).not.toHaveBeenCalled();
  });
});
