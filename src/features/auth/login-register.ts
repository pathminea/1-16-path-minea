import { api } from "@/src/service/api";
import type { AuthResponse, LoginForm, RegisterForm } from "./types";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginForm>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterForm>({
            query: (body) => {
                const { confirmPassword, ...payload } = body;
                void confirmPassword;
                return {
                    url: "/auth/register",
                    method: "POST",
                    body: payload,
                };
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
