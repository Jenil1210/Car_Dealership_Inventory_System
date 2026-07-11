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
    put: vi.fn(),
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

  it('calls DELETE API when delete button is clicked and refreshes inventory list', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles });
    client.delete.mockResolvedValueOnce({});
    client.get.mockResolvedValueOnce({ data: [] });

    render(<AdminDashboard />);

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(client.delete).toHaveBeenCalledWith('/vehicles/1');
      expect(screen.queryByText('Tesla Model 3')).toBeNull();
    });
  });

  // Sprint 86 RED: Test restocking action
  it('calls restock POST API when restock button is clicked with entered quantity', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles }); // mount fetch
    client.post.mockResolvedValueOnce({
      data: { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 15 }
    }); // restock mock
    client.get.mockResolvedValueOnce({
      data: [{ id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 15 }]
    }); // refetch mock

    render(<AdminDashboard />);

    // Wait for list to load
    await screen.findByText('Tesla Model 3');

    // Input quantity
    const quantityInput = screen.getByPlaceholderText('Qty');
    fireEvent.change(quantityInput, { target: { value: '10' } });

    // Click restock button
    const restockBtn = screen.getByRole('button', { name: /restock/i });
    fireEvent.click(restockBtn);

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith('/vehicles/1/restock?quantity=10');
      expect(screen.getByText(/Qty: 15/i)).toBeInTheDocument();
    });
  });

  // Sprint 88 RED: Test updating a vehicle
  it('populates edit form, calls PUT API on submission, and refreshes inventory list', async () => {
    const fakeVehicles = [
      { id: '1', make: 'Tesla', model: 'Model 3', category: 'Electric', price: 45000, quantity: 5 },
    ];
    client.get.mockResolvedValueOnce({ data: fakeVehicles }); // mount fetch
    client.put.mockResolvedValueOnce({
      data: { id: '1', make: 'Tesla', model: 'Model 3 S', category: 'Electric', price: 46000, quantity: 5 }
    }); // update mock
    client.get.mockResolvedValueOnce({
      data: [{ id: '1', make: 'Tesla', model: 'Model 3 S', category: 'Electric', price: 46000, quantity: 5 }]
    }); // refetch mock

    render(<AdminDashboard />);

    // Wait for list to load
    await screen.findByText('Tesla Model 3');

    // Click edit button
    const editBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);

    // Verify fields are populated
    expect(screen.getByLabelText(/manufacturer/i).value).toBe('Tesla');
    expect(screen.getByLabelText(/model/i).value).toBe('Model 3');
    expect(screen.getByLabelText(/category/i).value).toBe('Electric');
    expect(screen.getByLabelText(/price/i).value).toBe('45000');
    expect(screen.getByLabelText(/quantity/i).value).toBe('5');

    // Modify model and price
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Model 3 S' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '46000' } });

    // Submit form (which should now say "Save Changes")
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(client.put).toHaveBeenCalledWith('/vehicles/1', {
        make: 'Tesla',
        model: 'Model 3 S',
        category: 'Electric',
        price: '46000',
        quantity: '5',
      });
      expect(screen.getByText('Tesla Model 3 S')).toBeInTheDocument();
    });
  });
});
