"use client"

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Product = {
    id: number;
    title: string;
    price: number;
    images: string[];
    category: { name: string };
};

const chartData = [38, 55, 44, 67, 59, 78, 70, 88, 76, 96, 84, 100];
const inputClass = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

function Icon({ children }: { children: string }) {
    return <span aria-hidden="true" className="grid size-5 place-items-center text-[15px] leading-none">{children}</span>;
}

function StatCard({ label, value, detail, icon, color }: { label: string; value: string; detail: string; icon: string; color: string }) {
    return <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`grid size-9 place-items-center rounded-xl ${color}`}><Icon>{icon}</Icon></span></div><p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs font-medium text-emerald-600">{detail}</p></article>;
}

export default function DashboardPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [range, setRange] = useState("Last 12 months");
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All categories");
    const [sortOrder, setSortOrder] = useState("a-z");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const productsPerPage = 8;

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://api.escuelajs.co/api/v1/products");
                if (!response.ok) throw new Error("Products request failed");
                setProducts(await response.json() as Product[]);
                setError("");
            } catch {
                setError("Products could not be loaded. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        void loadProducts();
    }, []);

    const categories = useMemo(() => [
        "All categories",
        ...Array.from(new Set(products.map((product) => product.category.name))).sort(),
    ], [products]);

    const filteredProducts = useMemo(() => products
        .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
        .filter((product) => category === "All categories" || product.category.name === category)
        .sort((first, second) => sortOrder === "a-z" ? first.title.localeCompare(second.title) : second.title.localeCompare(first.title)),
    [category, products, query, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
    const visibleProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);

    return (
        <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
            <div className="flex min-h-screen">
                <aside className={`${collapsed ? "w-[76px]" : "w-64"} hidden shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col`}>
                    <div className="flex h-20 items-center border-b border-slate-100 px-5"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">N</div>{!collapsed && <span className="ml-3 text-lg font-bold tracking-tight text-slate-950">Northstar</span>}</div>
                    <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
                        <p className={`${collapsed ? "sr-only" : "px-3"} mb-3 mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400`}>Workspace</p>
                        <a className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-950" href="/dashboard"><Icon>⌂</Icon>{!collapsed && "Overview"}</a>
                        <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950" href="#products"><Icon>▤</Icon>{!collapsed && "Products"}</a>
                        <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950" href="#reports"><Icon>▥</Icon>{!collapsed && "Reports"}</a>
                        <p className={`${collapsed ? "sr-only" : "px-3"} mb-3 mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400`}>Manage</p>
                        <a className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-950" href="#settings"><Icon>⚙</Icon>{!collapsed && "Settings"}</a>
                    </nav>
                    <div className={`${collapsed ? "justify-center" : ""} m-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3`}><div className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">JD</div>{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">Jordan Davis</p><p className="truncate text-[11px] text-slate-400">Admin account</p></div>}</div>
                </aside>

                <section className="min-w-0 flex-1">
                    <header className="flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur sm:px-8"><div className="flex items-center gap-4"><button className="hidden size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:grid" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" type="button"><Icon>{collapsed ? "→" : "←"}</Icon></button><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Monday, September 19, 2026</p><h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Good morning, Jordan</h1></div></div><div className="flex items-center gap-2 sm:gap-4"><button className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100" aria-label="Notifications" type="button"><Icon>♢</Icon></button><div className="grid size-9 place-items-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">JD</div></div></header>

                    <div className="mx-auto max-w-[1500px] space-y-6 p-5 sm:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">Here is what is happening with your workspace today.</p></div><a className="w-fit rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800" href="/products/new">+ Add product</a></div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total revenue" value="$24,780" detail="↑ 12.5% from last month" icon="$" color="bg-emerald-100 text-emerald-700" /><StatCard label="Products" value={isLoading ? "..." : products.length.toLocaleString()} detail="Live catalog items" icon="▤" color="bg-sky-100 text-sky-700" /><StatCard label="Categories" value={categories.length > 0 ? String(categories.length - 1) : "..."} detail="Available product groups" icon="+" color="bg-amber-100 text-amber-700" /><StatCard label="Conversion rate" value="12.8%" detail="↑ 2.4% from last month" icon="↗" color="bg-violet-100 text-violet-700" /></div>

                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
                            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6" id="reports"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="font-bold text-slate-950">Revenue overview</h2><p className="mt-1 text-sm text-slate-500">Monthly revenue performance across all channels.</p></div><select className={inputClass} value={range} onChange={(event) => setRange(event.target.value)}><option>Last 12 months</option><option>Last 6 months</option><option>Last 30 days</option></select></div><div className="mt-8 flex h-56 items-end gap-2 border-b border-l border-slate-200 px-3 sm:gap-4 sm:px-5"><div className="flex h-full flex-col justify-between py-1 text-[10px] text-slate-400"><span>$10k</span><span>$7.5k</span><span>$5k</span><span>$2.5k</span><span>$0</span></div><div className="flex h-full min-w-0 flex-1 items-end justify-between gap-1.5 sm:gap-3">{chartData.map((value, index) => <div className="group flex h-full flex-1 flex-col items-center justify-end gap-2" key={index}><div className="relative w-full max-w-8 rounded-t-md bg-slate-950 transition-all group-hover:bg-amber-500" style={{ height: `${value}%` }} /><span className="text-[10px] text-slate-400">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}</span></div>)}</div></div></article>
                            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6"><h2 className="font-bold text-slate-950">Catalog snapshot</h2><p className="mt-1 text-sm text-slate-500">Your live product inventory.</p><div className="mx-auto mt-8 grid size-40 place-items-center rounded-full" style={{ background: "conic-gradient(#0f172a 0 62%, #f59e0b 62% 81%, #bae6fd 81% 100%)" }}><div className="grid size-24 place-items-center rounded-full bg-white"><p className="text-center text-xl font-bold text-slate-950">{products.length || "..."}<span className="block text-[10px] font-medium text-slate-400">Products</span></p></div></div><div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-600"><span>Clothing <b className="float-right">62%</b></span><span>Electronics <b className="float-right">19%</b></span><span>Furniture <b className="float-right">12%</b></span><span>Other <b className="float-right">7%</b></span></div></article>
                        </div>

                        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40" id="products"><div className="flex flex-col gap-4 p-5 sm:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-bold text-slate-950">Product catalog</h2><p className="mt-1 text-sm text-slate-500">Manage products from the EscuelaJS API.</p></div><span className="text-xs font-medium text-slate-400">{filteredProducts.length} results</span></div><div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_160px]"><label className="sr-only" htmlFor="product-search">Search product name</label><input className={inputClass} id="product-search" placeholder="Search product name..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /><label className="sr-only" htmlFor="product-category">Filter by category</label><select className={inputClass} id="product-category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>{categories.map((item) => <option key={item}>{item}</option>)}</select><label className="sr-only" htmlFor="product-sort">Sort products</label><select className={inputClass} id="product-sort" value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setPage(1); }}><option value="a-z">Name: A to Z</option><option value="z-a">Name: Z to A</option></select></div></div><div className="overflow-x-auto">{isLoading ? <p className="p-10 text-center text-sm text-slate-500">Loading products...</p> : error ? <p className="p-10 text-center text-sm text-rose-600">{error}</p> : <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3 font-semibold">Product</th><th className="px-6 py-3 font-semibold">Category</th><th className="px-6 py-3 font-semibold">Product ID</th><th className="px-6 py-3 text-right font-semibold">Price</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleProducts.map((product) => <tr className="transition hover:bg-slate-50/70" key={product.id}><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.images[0] ? <Image className="size-full object-cover" src={product.images[0]} alt="" width={40} height={40} /> : null}</div><span className="max-w-sm font-semibold text-slate-800">{product.title}</span></div></td><td className="px-6 py-4 text-slate-500">{product.category.name}</td><td className="px-6 py-4 text-slate-500">#{product.id}</td><td className="px-6 py-4 text-right font-semibold text-slate-800">${product.price.toFixed(2)}</td></tr>)}</tbody></table>}{!isLoading && !error && visibleProducts.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No products match your filters.</p>}</div><div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:px-6"><p className="text-xs text-slate-500">Page {page} of {totalPages}</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} type="button">Next</button></div></div></article>
                    </div>
                </section>
            </div>
        </main>
    );
}
