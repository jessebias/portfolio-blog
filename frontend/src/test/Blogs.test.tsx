import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { renderWithProviders } from './renderWithProviders';
import Blogs from '../pages/Blogs';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Blogs', () => {
  it('shows loading skeleton while fetching', () => {
    renderWithProviders(<Blogs />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders blog cards after data loads', async () => {
    renderWithProviders(<Blogs />);

    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });
  });

  it('shows error message when API returns 500', async () => {
    server.use(
      http.get('/api/blogs', () => HttpResponse.json({ message: 'Server error' }, { status: 500 }))
    );

    renderWithProviders(<Blogs />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load blog posts substrate/i)
      ).toBeInTheDocument();
    });
  });

  it('blog cards link to /blogs/:id', async () => {
    renderWithProviders(<Blogs />);

    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });

    const links = screen.getAllByRole('link');
    const blogLinks = links.filter((link) => link.getAttribute('href')?.startsWith('/blogs/'));
    expect(blogLinks.length).toBeGreaterThan(0);
    expect(blogLinks[0].getAttribute('href')).toBe('/blogs/1');
  });
});
