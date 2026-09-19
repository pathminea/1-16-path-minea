"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation, useRegisterMutation } from "../login-register";
import type { LoginForm, RegisterForm } from "../types";

const inputClassName = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";
const errorClassName = "mt-1.5 text-xs font-medium text-rose-600";

function FieldError({ message }: { message?: string }) {
    return message ? <p className={errorClassName}>{message}</p> : null;
}

function LoginFields({ onSuccess, onError }: { onSuccess: (message: string) => void; onError: (message: string) => void }) {
    const [login, { isLoading }] = useLoginMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ mode: "onBlur" });

    const submit = async (values: LoginForm) => {
        try {
            await login(values).unwrap();
            onSuccess("You are signed in successfully.");
        } catch {
            onError("Unable to sign in. Please check your details and try again.");
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(submit)}>
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="login-email">Email address</label>
                <input className={inputClassName} id="login-email" type="email" placeholder="you@example.com" {...register("email", { required: "Email address is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } })} />
                <FieldError message={errors.email?.message} />
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="login-password">Password</label>
                <input className={inputClassName} id="login-password" type="password" placeholder="Enter your password" {...register("password", { required: "Password is required." })} />
                <FieldError message={errors.password?.message} />
            </div>
            <button className="w-full rounded-xl bg-teal-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
                {isLoading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}

function RegisterFields({ onSuccess, onError }: { onSuccess: (message: string) => void; onError: (message: string) => void }) {
    const [registerUser, { isLoading }] = useRegisterMutation();
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterForm>({ mode: "onBlur" });

    const submit = async (values: RegisterForm) => {
        try {
            await registerUser(values).unwrap();
            onSuccess("Your account has been created successfully.");
        } catch {
            onError("Unable to create your account. Please try again.");
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="full-name">Full name</label>
                <input className={inputClassName} id="full-name" type="text" placeholder="Alex Morgan" {...register("fullName", { required: "Full name is required.", minLength: { value: 2, message: "Enter at least 2 characters." } })} />
                <FieldError message={errors.fullName?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="gender">Gender</label>
                    <select className={inputClassName} id="gender" defaultValue="" {...register("gender", { required: "Please select your gender." })}>
                        <option value="" disabled>Select gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    <FieldError message={errors.gender?.message} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="date-of-birth">Date of birth</label>
                    <input className={inputClassName} id="date-of-birth" type="date" {...register("dateOfBirth", { required: "Date of birth is required." })} />
                    <FieldError message={errors.dateOfBirth?.message} />
                </div>
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="register-password">Password</label>
                <input className={inputClassName} id="register-password" type="password" placeholder="At least 8 characters" {...register("password", { required: "Password is required.", minLength: { value: 8, message: "Password must be at least 8 characters." }, pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)/, message: "Use at least one letter and one number." } })} />
                <FieldError message={errors.password?.message} />
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="confirm-password">Confirm password</label>
                <input className={inputClassName} id="confirm-password" type="password" placeholder="Repeat your password" {...register("confirmPassword", { required: "Please confirm your password.", validate: (value) => value === getValues("password") || "Passwords do not match." })} />
                <FieldError message={errors.confirmPassword?.message} />
            </div>
            <button className="w-full rounded-xl bg-teal-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
                {isLoading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}

export function AuthForm() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const switchMode = (nextMode: "login" | "register") => {
        setMode(nextMode);
        setMessage("");
        setError("");
    };

    const handleSuccess = (nextMessage: string) => {
        setError("");
        setMessage(nextMessage);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f3f7f5] px-4 py-10 text-slate-900 sm:px-6">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-teal-900 p-10 text-white lg:flex">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-teal-700/50" />
                    <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[48px] border-amber-300/20" />
                    <div className="relative"><p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Northstar</p><h1 className="mt-16 max-w-xs text-4xl font-semibold leading-tight tracking-tight">A calmer place to manage your day.</h1></div>
                    <p className="relative max-w-xs text-sm leading-6 text-teal-100/80">One account for your personal workspace, plans, and progress.</p>
                </div>
                <div className="p-6 sm:p-10 lg:p-14">
                    <div className="mb-8 lg:hidden"><p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">Northstar</p></div>
                    <div className="mb-8">
                        <div className="mb-7 grid grid-cols-2 border-b border-slate-200">
                            <button className={`border-b-2 pb-3 text-sm font-bold transition ${mode === "login" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-400 hover:text-slate-600"}`} onClick={() => switchMode("login")} type="button">Sign in</button>
                            <button className={`border-b-2 pb-3 text-sm font-bold transition ${mode === "register" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-400 hover:text-slate-600"}`} onClick={() => switchMode("register")} type="button">Create account</button>
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{mode === "login" ? "Sign in to continue to your workspace." : "Set up your profile and get started in minutes."}</p>
                    </div>
                    {message ? <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{message}</div> : null}
                    {error ? <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error}</div> : null}
                    {mode === "login" ? <LoginFields onSuccess={handleSuccess} onError={setError} /> : <RegisterFields onSuccess={handleSuccess} onError={setError} />}
                    <p className="mt-7 text-center text-sm text-slate-500">{mode === "login" ? "New to Northstar?" : "Already have an account?"}{" "}<button className="font-bold text-teal-700 hover:text-teal-900" onClick={() => switchMode(mode === "login" ? "register" : "login")} type="button">{mode === "login" ? "Create an account" : "Sign in"}</button></p>
                </div>
            </section>
        </main>
    );
}
