import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthProvider';

const VALID_ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDAzMzk5MDQwMH0.fakesig';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc4MDI4NDM5NX0.fakesig';

const VALID_USER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlVzZXIiLCJlbWFpbCI6InVzZXJAdGVzdC5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6NDAzMzk5MDQwMH0.fakesig';

const TestConsumer = () => {
  const { isLoggedIn, isAdmin, user, token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
      <span data-testid="isAdmin">{String(isAdmin)}</span>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <span data-testid="token">{token ?? 'none'}</span>
      <button
        onClick={() =>
          login(VALID_ADMIN_TOKEN, {
            id: 1,
            name: 'Admin',
            email: 'admin@test.com',
            role: 'admin',
            exp: 4033990400,
          })
        }
      >
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderAuth = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('AuthProvider', () => {
  it('isLoggedIn is false when no token in localStorage', async () => {
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn').textContent).toBe('false');
    });
  });

  it('login() stores token and sets user', async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole('button', { name: 'login' }));

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toBe('admin@test.com');
      expect(localStorage.getItem('token')).toBe(VALID_ADMIN_TOKEN);
    });
  });

  it('logout() removes token and clears user', async () => {
    localStorage.setItem('token', VALID_ADMIN_TOKEN);
    const user = userEvent.setup();
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn').textContent).toBe('true');
    });

    await user.click(screen.getByRole('button', { name: 'logout' }));

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('none');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('isAdmin is true when user role is "admin"', async () => {
    localStorage.setItem('token', VALID_ADMIN_TOKEN);
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId('isAdmin').textContent).toBe('true');
    });
  });

  it('isAdmin is false when user role is not "admin"', async () => {
    localStorage.setItem('token', VALID_USER_TOKEN);
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId('isAdmin').textContent).toBe('false');
    });
  });

  it('expired token triggers logout', async () => {
    localStorage.setItem('token', EXPIRED_TOKEN);
    renderAuth();

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn').textContent).toBe('false');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
