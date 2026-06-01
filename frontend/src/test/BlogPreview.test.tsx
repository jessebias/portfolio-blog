import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { renderWithProviders } from './renderWithProviders';
import Blog from '../components/Blog';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Blog (home preview)', () => {
  it('renders the BLOG section heading', () => {
    renderWithProviders(<Blog />);
    expect(screen.getByText('BLOG')).toBeInTheDocument();
  });

  it('shows placeholder cards initially (before fetch resolves)', () => {
    renderWithProviders(<Blog />);
    expect(screen.getByText('ENTRY_001_NULL')).toBeInTheDocument();
  });

  it('replaces placeholders with real posts after fetch', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('FIRST BLOG POST')).toBeInTheDocument();
      expect(screen.getByText('SECOND BLOG POST')).toBeInTheDocument();
    });
  });

  it('shows 2 placeholder cards for the unfilled slots when API returns 2 posts', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('FIRST BLOG POST')).toBeInTheDocument();
    });
    expect(screen.getByText('ENTRY_003_NULL')).toBeInTheDocument();
    expect(screen.getByText('ENTRY_004_NULL')).toBeInTheDocument();
  });

  it('shows all 4 placeholder cards when API returns empty array', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json([])));
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('ENTRY_001_NULL')).toBeInTheDocument();
      expect(screen.getByText('ENTRY_002_NULL')).toBeInTheDocument();
      expect(screen.getByText('ENTRY_003_NULL')).toBeInTheDocument();
      expect(screen.getByText('ENTRY_004_NULL')).toBeInTheDocument();
    });
  });

  it('shows all 4 placeholders gracefully when API errors', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json({}, { status: 500 })));
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('ENTRY_001_NULL')).toBeInTheDocument();
    });
  });

  it('real post cards link to /blogs/:id', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('FIRST BLOG POST')).toBeInTheDocument();
    });
    const links = screen.getAllByRole('link');
    const blogLinks = links.filter(l => l.getAttribute('href')?.startsWith('/blogs/'));
    expect(blogLinks.length).toBeGreaterThan(0);
    expect(blogLinks[0].getAttribute('href')).toBe('/blogs/1');
  });

  it('shows category prefix on post cards that have a category', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('/// TECHNOLOGY')).toBeInTheDocument();
    });
  });

  it('renders READ MORE button linking to /blogs', () => {
    renderWithProviders(<Blog />);
    const link = screen.getByRole('link', { name: /READ MORE/i });
    expect(link.getAttribute('href')).toBe('/blogs');
  });
});
