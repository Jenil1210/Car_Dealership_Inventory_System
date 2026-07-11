import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import client from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
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

    expect(screen.getByText(/vehicle inventory/i)).toBeInTheDocument();

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

  it('calls search API with params when search form is submitted', async () => {
    client.get.mockResolvedValueOnce({ data: [] });
    client.get.mockResolvedValueOnce({ data: [] });

    render(<Dashboard />);

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Tesla' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Model Y' } });
    
    const searchBtn = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(client.get).toHaveBeenLastCalledWith('/vehicles/search', {
        params: { make: 'Tesla', model: 'Model Y' },
      });
    });
  });

  // Sprints 84 & 85: Test purchase button triggers API call and refreshes inventory list
  it('calls POST purchase API when purchase button is clicked and refreshes list', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles }); // mount fetch
    client.post.mockResolvedValueOnce({
      data: { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 4 }
    }); // purchase mock
    client.get.mockResolvedValueOnce({
      data: [{ id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 4 }]
    }); // refetch mock

    render(<Dashboard />);

    const purchaseBtn = await screen.findByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/vehicles/1/purchase?quantity=1');
      expect(screen.getByText('4 available')).toBeInTheDocument();
    });
  });
});
