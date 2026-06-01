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

  http.post('/api/auth/login', () => {
    // Valid JWT with exp far in the future (year 2096) so AuthProvider doesn't reject it
    return HttpResponse.json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6NDAzMzk5MDQwMH0.fakesig',
      user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' },
    });
  }),
];
