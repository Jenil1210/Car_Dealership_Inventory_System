import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

/**
 * TDD - Sprint 89 RED: Test that the routing structure works and redirects unauthenticated users.
 */
describe('App Component Routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Welcome Back when navigating to root / while unauthenticated', () => {
    render(<App />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
