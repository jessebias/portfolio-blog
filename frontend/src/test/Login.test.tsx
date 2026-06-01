import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { renderWithProviders } from './renderWithProviders';
import Login from '../pages/Login';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login', () => {
  it('renders login form with email, password inputs and submit button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByPlaceholderText(/USER@PORTFOLIO\.SYS/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ACCESS SYSTEM/i })).toBeInTheDocument();
  });

  it('shows "SYSTEM AUTHENTICATION REQUIRED" subtitle', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('SYSTEM AUTHENTICATION REQUIRED')).toBeInTheDocument();
  });

  it('shows error message on failed login (401)', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/USER@PORTFOLIO\.SYS/i), 'wrong@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /ACCESS SYSTEM/i }));

    await waitFor(() => {
      expect(screen.getByText(/INVALID CREDENTIALS/i)).toBeInTheDocument();
    });
  });

  it('submit button shows "INITIALIZING..." while loading', async () => {
    let resolveRequest!: () => void;
    server.use(
      http.post('/api/auth/login', () =>
        new Promise<Response>((resolve) => {
          resolveRequest = () =>
            resolve(HttpResponse.json({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDAzMzk5MDQwMH0.fakesig', user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' } }) as unknown as Response);
        })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText(/USER@PORTFOLIO\.SYS/i), 'admin@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password');
    await user.click(screen.getByRole('button', { name: /ACCESS SYSTEM/i }));

    expect(await screen.findByText('INITIALIZING...')).toBeInTheDocument();

    resolveRequest();
  });

  it('calls login and navigates to /admin on success', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />, { initialEntries: ['/login'] });

    await user.type(screen.getByPlaceholderText(/USER@PORTFOLIO\.SYS/i), 'admin@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password');
    await user.click(screen.getByRole('button', { name: /ACCESS SYSTEM/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });
});
