/**
 * UserDTO (Data Transfer Object)
 * Filters and formats user data for API responses.
 */
export const UserDTO = (user) => {
    if (!user) return null;
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at || user.createdAt
    };
};

