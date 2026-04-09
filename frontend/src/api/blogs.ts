import axios from 'axios';

// Define the Blog interface to match your database schema
export interface Blog {
    id: number;
    title: string;
    category: string;
    image_url?: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    user?: {
        name: string;
        email: string;
    };
}

// Fetch all blogs
export const getBlogs = async (): Promise<Blog[]> => {
    const response = await axios.get('/api/blogs');
    return response.data;
};

// Fetch a single blog by its ID
export const getBlogById = async (id: string | number): Promise<Blog> => {
    const response = await axios.get(`/api/blogs/${id}`);
    return response.data;
};

// Create a new blog post
export const createBlog = async (blogData: Partial<Blog>): Promise<Blog> => {
    const response = await axios.post('/api/blogs', blogData);
    return response.data;
};

// Update an existing blog
export const updateBlog = async (id: string | number, blogData: Partial<Blog>): Promise<Blog> => {
    const response = await axios.put(`/api/blogs/${id}`, blogData);
    return response.data;
};

// Delete a blog post
export const deleteBlog = async (id: string | number): Promise<void> => {
    await axios.delete(`/api/blogs/${id}`);
};
