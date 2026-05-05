import { UserDTO } from "./UserDTO.js";

/**
 * BlogDTO (Data Transfer Object)
 * Formats blog post data for API responses.
 */
export const BlogDTO = (blog) => {
    if (!blog) return null;

    return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author: UserDTO(blog.user), // Use UserDTO for the nested author
        createdAt: blog.created_at || blog.createdAt,
        updatedAt: blog.updated_at || blog.updatedAt
    };
};

/**
 * BlogListDTO
 * Formats a list of blog posts.
 */
export const BlogListDTO = (blogs) => {
    if (!Array.isArray(blogs)) return [];
    return blogs.map(blog => BlogDTO(blog));
};
