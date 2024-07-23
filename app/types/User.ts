export interface User {
    userId?: number;
    username: string;
    password: string;
    email: string;
    avatar: string | null;
    phone?: number | string | null;
}