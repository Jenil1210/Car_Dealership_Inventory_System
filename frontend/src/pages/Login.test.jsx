import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import client from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders email and password inputs and a submit button', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // Sprint 70 RED: Test that submit calls API, stores token/role, and redirects
  it('submits form, calls login API, and saves credentials on success', async () => {
    const fakeToken = 'fake-jwt-token';
    const fakeRole = 'USER';
    client.post.mockResolvedValueOnce({
      data: { token: fakeToken, role: fakeRole },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com',
        password: 'password123',
      });
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(localStorage.getItem('role')).toBe(fakeRole);
    });
  });
});
