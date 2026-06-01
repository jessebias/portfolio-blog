import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../api/blogs';

beforeAll(() => server.listen());
afterEach(() => { server.resetHandlers(); localStorage.clear(); });
afterAll(() => server.close());

describe('getBlogs', () => {
  it('returns array of blogs from GET /api/blogs', async () => {
    const blogs = await getBlogs();
    expect(blogs).toHaveLength(2);
    expect(blogs[0].title).toBe('First Blog Post');
    expect(blogs[1].title).toBe('Second Blog Post');
  });

  it('throws on server error', async () => {
    server.use(http.get('/api/blogs', () => HttpResponse.json({}, { status: 500 })));
    await expect(getBlogs()).rejects.toThrow();
  });
});

describe('getBlogById', () => {
  it('returns a single blog by numeric id', async () => {
    const blog = await getBlogById(1);
    expect(blog.id).toBe(1);
    expect(blog.title).toBe('First Blog Post');
  });

  it('accepts a string id', async () => {
    const blog = await getBlogById('2');
    expect(blog).toBeDefined();
    expect(blog.title).toBe('Second Blog Post');
  });

  it('throws on 404', async () => {
    server.use(http.get('/api/blogs/:id', () => HttpResponse.json({ message: 'Not found' }, { status: 404 })));
    await expect(getBlogById(999)).rejects.toThrow();
  });
});

describe('createBlog', () => {
  it('sends Authorization header when token is in localStorage', async () => {
    localStorage.setItem('token', 'test-token');
    let capturedAuth: string | null = null;
    server.use(
      http.post('/api/blogs', ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ id: 3, title: 'New', content: 'Body', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' });
      })
    );
    await createBlog({ title: 'New', content: 'Body' });
    expect(capturedAuth).toBe('Bearer test-token');
  });

  it('sends no Authorization header when no token', async () => {
    let capturedAuth: string | null = 'sentinel';
    server.use(
      http.post('/api/blogs', ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ id: 3, title: 'New', content: 'Body', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' });
      })
    );
    await createBlog({ title: 'New', content: 'Body' });
    expect(capturedAuth).toBeNull();
  });

  it('returns the created blog', async () => {
    const blog = await createBlog({ title: 'New Post', content: 'Content here', category: 'Tech' });
    expect(blog.id).toBe(3);
    expect(blog.title).toBe('New Post');
  });
});

describe('updateBlog', () => {
  it('sends PUT to /api/blogs/:id with auth header', async () => {
    localStorage.setItem('token', 'test-token');
    let capturedAuth: string | null = null;
    server.use(
      http.put('/api/blogs/:id', ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ id: 1, title: 'Updated', content: 'Body', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' });
      })
    );
    const result = await updateBlog(1, { title: 'Updated' });
    expect(result.title).toBe('Updated');
    expect(capturedAuth).toBe('Bearer test-token');
  });

  it('returns updated blog from server', async () => {
    const result = await updateBlog(1, { title: 'Updated Title', content: 'Updated content' });
    expect(result).toBeDefined();
  });
});

describe('deleteBlog', () => {
  it('sends DELETE to /api/blogs/:id with auth header', async () => {
    localStorage.setItem('token', 'test-token');
    let capturedAuth: string | null = null;
    server.use(
      http.delete('/api/blogs/:id', ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return new HttpResponse(null, { status: 204 });
      })
    );
    await deleteBlog(1);
    expect(capturedAuth).toBe('Bearer test-token');
  });

  it('resolves without a return value', async () => {
    const result = await deleteBlog(1);
    expect(result).toBeUndefined();
  });
});
