import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';
import client from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, vehicle list, and add vehicle form', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles });

    render(<AdminDashboard />);

    expect(screen.getByText(/admin control panel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/manufacturer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(client.get).toHaveBeenCalledWith('/vehicles');
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    });
  });

  it('calls POST API on form submission, clears fields, and refreshes inventory list', async () => {
    client.get.mockResolvedValueOnce({ data: [] });
    client.post.mockResolvedValueOnce({
      data: { id: '2', make: 'BMW', model: 'i4', category: 'Electric', price: 60000, quantity: 3 }
    });
    client.get.mockResolvedValueOnce({
      data: [{ id: '2', make: 'BMW', model: 'i4', category: 'Electric', price: 60000, quantity: 3 }]
    });

    render(<AdminDashboard />);

    fireEvent.change(screen.getByLabelText(/manufacturer/i), { target: { value: 'BMW' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'i4' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Electric' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/vehicles', {
        make: 'BMW',
        model: 'i4',
        category: 'Electric',
        price: '60000',
        quantity: '3',
      });
      expect(screen.getByText('BMW i4')).toBeInTheDocument();
    });
  });

  // Sprint 83 RED: Test that delete vehicle button calls DELETE API and re-fetches inventory list
  it('calls DELETE API when delete button is clicked and refreshes inventory list', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles }); // Mount fetch
    client.delete.mockResolvedValueOnce({}); // DELETE mock
    client.get.mockResolvedValueOnce({ data: [] }); // Refetch mock (empty list after deletion)

    render(<AdminDashboard />);

    // Wait for initial render of list
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(client.delete).toHaveBeenCalledWith('/vehicles/1');
      expect(screen.queryByText('Tesla Model 3')).toBeNull();
    });
  });
});
