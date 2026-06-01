import { describe, it, expect, beforeAll, afterEach, afterAll, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { renderWithProviders } from './renderWithProviders';
import AdminDashboard from '../pages/AdminDashboard';

const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDAzMzk5MDQwMH0.fakesig';

beforeAll(() => server.listen());
beforeEach(() => { localStorage.setItem('token', ADMIN_TOKEN); });
afterEach(() => { server.resetHandlers(); localStorage.clear(); vi.restoreAllMocks(); });
afterAll(() => server.close());

describe('AdminDashboard', () => {
  it('renders the CREATE NEW POST heading', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByText('CREATE NEW POST')).toBeInTheDocument();
  });

  it('renders title and category input fields', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByPlaceholderText('Enter title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Technology')).toBeInTheDocument();
  });

  it('loads and displays posts from GET /api/blogs on mount', async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });
  });

  it('loads and displays users from GET /api/meta/users on mount', async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  it('shows "No posts yet" when API returns empty array', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json([])));
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });

  it('shows posts error when API fails', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json({}, { status: 500 })));
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting without a title', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);
    await user.click(screen.getByText('PUBLISH POST'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('shows content validation error when title is set but content unchanged', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);
    await user.type(screen.getByPlaceholderText('Enter title...'), 'My Title');
    await user.click(screen.getByText('PUBLISH POST'));
    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  it('clicking EDIT populates the title field', async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
    const editButtons = screen.getAllByText('EDIT');
    await userEvent.click(editButtons[0]);
    expect(screen.getByPlaceholderText('Enter title...')).toHaveValue('First Blog Post');
  });

  it('clicking EDIT switches heading to EDIT POST', async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getAllByText('EDIT')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByText('EDIT')[0]);
    expect(screen.getByText('EDIT POST')).toBeInTheDocument();
  });

  it('clicking CANCEL resets to create mode', async () => {
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getAllByText('EDIT')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByText('EDIT')[0]);
    await userEvent.click(screen.getByText('CANCEL'));
    expect(screen.getByText('CREATE NEW POST')).toBeInTheDocument();
  });

  it('clicking DELETE with confirm=true removes the post from the list', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText('DELETE');
    await userEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText('First Blog Post')).not.toBeInTheDocument();
    });
  });

  it('clicking DELETE with confirm=false keeps the post in the list', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderWithProviders(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByText('DELETE')[0]);
    expect(screen.getByText('First Blog Post')).toBeInTheDocument();
  });

  it('publishes a new post and adds it to the list', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<AdminDashboard />);
    await user.type(screen.getByPlaceholderText('Enter title...'), 'New Post Title');
    const editor = container.querySelector('[contenteditable]') as HTMLDivElement;
    editor.innerHTML = '<p>Some real content here</p>';
    fireEvent.input(editor);
    await user.click(screen.getByText('PUBLISH POST'));
    await waitFor(() => {
      expect(screen.getByText('New Post Title')).toBeInTheDocument();
    });
  });
});
