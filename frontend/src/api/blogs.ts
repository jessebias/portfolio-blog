import axios from 'axios';

export interface Blog {
    id: number;
    title: string;
    category?: string | null;
    image_url?: string | null;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    author?: { id: number; name: string; email: string; role: string; createdAt: string; };
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBlogs = async (): Promise<Blog[]> => {
    const response = await axios.get('/api/blogs');
    return response.data;
};

export const getBlogById = async (id: string | number): Promise<Blog> => {
    const response = await axios.get(`/api/blogs/${id}`);
    return response.data;
};

export const createBlog = async (blogData: Partial<Blog>): Promise<Blog> => {
    const response = await axios.post('/api/blogs', blogData, { headers: getAuthHeaders() });
    return response.data;
};

export const updateBlog = async (id: string | number, blogData: Partial<Blog>): Promise<Blog> => {
    const response = await axios.put(`/api/blogs/${id}`, blogData, { headers: getAuthHeaders() });
    return response.data;
};

export const deleteBlog = async (id: string | number): Promise<void> => {
    await axios.delete(`/api/blogs/${id}`, { headers: getAuthHeaders() });
};
