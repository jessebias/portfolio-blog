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

/**
 * UserListDTO
 * Formats a list of users.
 */
export const UserListDTO = (users) => {
    if (!Array.isArray(users)) return [];
    return users.map(user => UserDTO(user));
};
