import { http, HttpResponse } from 'msw';

const mockBlogs = [
  {
    id: 1,
    title: 'First Blog Post',
    content: 'This is the content of the first blog post with enough text for testing.',
    category: 'Technology',
    image_url: null,
    author: {
      id: 1,
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Second Blog Post',
    content: 'This is the content of the second blog post with enough text for testing.',
    category: 'Design',
    image_url: 'https://example.com/image.jpg',
    author: {
      id: 1,
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
];

export const handlers = [
  http.get('/api/blogs', () => {
    return HttpResponse.json(mockBlogs);
  }),

  http.get('/api/blogs/:id', ({ params }) => {
    const id = Number(params.id);
    const blog = mockBlogs.find((b) => b.id === id) ?? mockBlogs[0];
    return HttpResponse.json(blog);
  }),

  http.post('/api/blogs', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 3,
      title: body.title,
      content: body.content,
      category: body.category ?? null,
      image_url: null,
      author: mockBlogs[0].author,
      createdAt: '2025-03-01T00:00:00.000Z',
      updatedAt: '2025-03-01T00:00:00.000Z',
    });
  }),

  http.put('/api/blogs/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    const base = mockBlogs.find(b => b.id === Number(params.id)) ?? mockBlogs[0];
    return HttpResponse.json({ ...base, ...body, id: Number(params.id), updatedAt: '2025-03-01T00:00:00.000Z' });
  }),

  http.delete('/api/blogs/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/meta/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin', created_at: '2025-01-01T00:00:00.000Z' },
    ]);
  }),

  http.post('/api/auth/login', () => {
    // Valid JWT with exp far in the future (year 2096) so AuthProvider doesn't reject it
    return HttpResponse.json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDAzMzk5MDQwMH0.fakesig',
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' },
    });
  }),
];
