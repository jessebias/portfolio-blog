import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { AuthProvider } from '../context/AuthProvider';
import BlogPost from '../pages/BlogPost';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderBlogPost = (id = '1') =>
  render(
    <MemoryRouter initialEntries={[`/blogs/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/blogs/:id" element={<BlogPost />} />
          <Route path="/blogs" element={<div>Blog List</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe('BlogPost', () => {
  it('shows loading state initially', () => {
    renderBlogPost('1');
    expect(screen.getByText(/RETRIEVING DATA FROM SECTOR/i)).toBeInTheDocument();
  });

  it('renders the blog title after fetch', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });
  });

  it('renders the blog content after fetch', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText(/This is the content of the first blog post/i)).toBeInTheDocument();
    });
  });

  it('renders the author name from blog.author', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText(/BY ADMIN USER/i)).toBeInTheDocument();
    });
  });

  it('renders the category', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });

  it('shows error state on 500', async () => {
    server.use(http.get('/api/blogs/:id', () => HttpResponse.json({ message: 'Server error' }, { status: 500 })));
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText(/POST_NOT_FOUND/i)).toBeInTheDocument();
    });
  });

  it('shows back link to /blogs on error', async () => {
    server.use(http.get('/api/blogs/:id', () => HttpResponse.json({}, { status: 404 })));
    renderBlogPost('999');
    await waitFor(() => {
      expect(screen.getByText(/Return to Blog Subsystem/i)).toBeInTheDocument();
    });
  });

  it('shows back navigation link to /blogs on success', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText(/RETURN TO BLOG/i)).toBeInTheDocument();
    });
    const link = screen.getByRole('link', { name: /RETURN TO BLOG/i });
    expect(link.getAttribute('href')).toBe('/blogs');
  });

  it('renders the formatted date from blog.createdAt', async () => {
    renderBlogPost('1');
    await waitFor(() => {
      expect(screen.getByText('JAN 10, 2025')).toBeInTheDocument();
    });
  });
});
