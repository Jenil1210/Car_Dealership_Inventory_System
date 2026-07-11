import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import client from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('fetches vehicles and renders them in a list', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
      { id: '2', make: 'Ford', model: 'Mustang', category: 'Sports', price: 55000, quantity: 2 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles });

    render(<Dashboard />);

    // Check loading or header state
    expect(screen.getByText(/vehicle inventory/i)).toBeInTheDocument();

    // Verify API call on mount
    await waitFor(() => {
      expect(client.get).toHaveBeenCalledWith('/vehicles');
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
      expect(screen.getByText('Ford Mustang')).toBeInTheDocument();
    });
  });

  it('clears localStorage and redirects on logout click', async () => {
    client.get.mockResolvedValueOnce({ data: [] });
    localStorage.setItem('token', 'some-token');

    render(<Dashboard />);
    
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull();
  });
});
