import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { renderWithProviders } from './renderWithProviders';
import Blog from '../components/Blog';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Sample entries fill empty slots (see translations.ts → blog.samples).
const SAMPLES = [
  'Building an AI-Native Company OS',
  'What Vertical Streaming Gets Right',
  'Memory, Agents, and Context',
  'The Future of Creator-Owned Media',
];

describe('Blog (home preview)', () => {
  it('renders the BLOG section heading', () => {
    renderWithProviders(<Blog />);
    expect(screen.getByText('BLOG')).toBeInTheDocument();
  });

  it('shows sample entries initially (before fetch resolves)', () => {
    renderWithProviders(<Blog />);
    expect(screen.getByText(SAMPLES[0])).toBeInTheDocument();
  });

  it('replaces sample entries with real posts after fetch', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });
  });

  it('fills the 2 remaining slots with sample entries when API returns 2 posts', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
    expect(screen.getByText(SAMPLES[2])).toBeInTheDocument();
    expect(screen.getByText(SAMPLES[3])).toBeInTheDocument();
  });

  it('shows all 4 sample entries when API returns empty array', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json([])));
    renderWithProviders(<Blog />);
    await waitFor(() => {
      SAMPLES.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  it('shows sample entries gracefully when API errors', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json({}, { status: 500 })));
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText(SAMPLES[0])).toBeInTheDocument();
    });
  });

  it('real post cards link to /blogs/:id', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
    const links = screen.getAllByRole('link');
    const blogLinks = links.filter((l) => l.getAttribute('href')?.startsWith('/blogs/'));
    expect(blogLinks.length).toBeGreaterThan(0);
    expect(blogLinks[0].getAttribute('href')).toBe('/blogs/1');
  });

  it('shows category and date meta on post cards that have a category', async () => {
    renderWithProviders(<Blog />);
    await waitFor(() => {
      expect(screen.getByText('Technology • January 2025')).toBeInTheDocument();
    });
  });

  it('renders READ MORE button linking to /blogs', () => {
    renderWithProviders(<Blog />);
    const link = screen.getByRole('link', { name: /READ MORE/i });
    expect(link.getAttribute('href')).toBe('/blogs');
  });
});
