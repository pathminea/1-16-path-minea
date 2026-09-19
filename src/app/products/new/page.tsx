"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Category = {
    id: number;
    name: string;
};

type ProductForm = {
    title: string;
    price: number;
    description: string;
    categoryId: string;
    images: string;
};

type CreatedProduct = {
    id: number;
    title: string;
};

const apiUrl = "https://api.escuelajs.co/api/v1";
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10";
const errorClass = "mt-1.5 text-xs font-medium text-rose-600";

function FieldError({ message }: { message?: string }) {
    return message ? <p className={errorClass}>{message}</p> : null;
}

export default function NewProductPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [submitError, setSubmitError] = useState("");
    const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductForm>({
        defaultValues: { categoryId: "", images: "" },
        mode: "onBlur",
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/categories`);
                if (!response.ok) throw new Error("Categories request failed");
                setCategories(await response.json() as Category[]);
            } catch {
                setSubmitError("Categories could not be loaded. Refresh and try again.");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        void loadCategories();
    }, []);

    const submitProduct = async (values: ProductForm) => {
        setSubmitError("");
        setCreatedProduct(null);
        const imageUrls = values.images.split(",").map((url) => url.trim()).filter(Boolean);

        try {
            const response = await fetch(`${apiUrl}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: values.title.trim(),
                    price: Number(values.price),
                    description: values.description.trim(),
                    categoryId: Number(values.categoryId),
                    images: imageUrls,
                }),
            });
            if (!response.ok) throw new Error("Product creation failed");
            const product = await response.json() as CreatedProduct;
            setCreatedProduct(product);
            reset({ title: "", price: 0, description: "", categoryId: "", images: "" });
        } catch {
            setSubmitError("The product could not be created. Check the details and try again.");
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f8fa] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <Link className="text-sm font-semibold text-slate-500 transition hover:text-slate-950" href="/dashboard">← Back to dashboard</Link>
                        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Product management</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Create a new product</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Add a product to your live catalog using the EscuelaJS API.</p>
                    </div>
                    <div className="hidden rounded-2xl bg-slate-950 px-5 py-4 text-white sm:block"><p className="text-xs text-slate-400">Catalog endpoint</p><p className="mt-1 text-sm font-semibold">POST /products</p></div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <form className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40 sm:p-8" onSubmit={handleSubmit(submitProduct)}>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">Product name</label>
                                <input className={inputClass} id="title" placeholder="e.g. Minimal ceramic vase" {...register("title", { required: "Product name is required.", minLength: { value: 3, message: "Use at least 3 characters." } })} />
                                <FieldError message={errors.title?.message} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="price">Price</label>
                                <div className="relative"><span className="absolute left-4 top-3 text-sm text-slate-400">$</span><input className={`${inputClass} pl-8`} id="price" type="number" min="0.01" step="0.01" placeholder="0.00" {...register("price", { required: "Price is required.", valueAsNumber: true, min: { value: 0.01, message: "Price must be greater than 0." } })} /></div>
                                <FieldError message={errors.price?.message} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="categoryId">Category</label>
                                <select className={inputClass} id="categoryId" disabled={isLoadingCategories} {...register("categoryId", { required: "Please select a category." })}>
                                    <option value="">{isLoadingCategories ? "Loading categories..." : "Select a category"}</option>
                                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </select>
                                <FieldError message={errors.categoryId?.message} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="description">Description</label>
                                <textarea className={`${inputClass} min-h-32 resize-y`} id="description" placeholder="Describe the product, materials, and details..." {...register("description", { required: "Description is required.", minLength: { value: 10, message: "Use at least 10 characters." } })} />
                                <FieldError message={errors.description?.message} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="images">Image URLs</label>
                                <input className={inputClass} id="images" placeholder="https://example.com/product.jpg" {...register("images", { required: "Add at least one image URL.", validate: (value) => value.split(",").every((url) => /^https?:\/\/.+/.test(url.trim())) || "Use valid http(s) image URLs, separated by commas." })} />
                                <p className="mt-1.5 text-xs text-slate-400">Separate multiple image URLs with commas.</p>
                                <FieldError message={errors.images?.message} />
                            </div>
                        </div>
                        {submitError ? <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{submitError}</p> : null}
                        {createdProduct ? <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{createdProduct.title} was created successfully with ID #{createdProduct.id}.</p> : null}
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50" href="/dashboard">Cancel</Link><button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || isLoadingCategories} type="submit">{isSubmitting ? "Creating product..." : "Create product"}</button></div>
                    </form>
                    <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Before you publish</p><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600"><li><b className="block text-slate-900">Use a clear name</b>Make the product easy to find in your catalog.</li><li><b className="block text-slate-900">Add a useful description</b>Include the details customers need to make a decision.</li><li><b className="block text-slate-900">Use public image URLs</b>The API needs URLs that can be loaded by the browser.</li></ul></aside>
                </div>
            </div>
        </main>
    );
}
