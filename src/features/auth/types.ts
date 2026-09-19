export type LoginForm = {
    email: string;
    password: string;
};

export type RegisterForm = {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
};

export type AuthResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};
