"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price,
          stock,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Hiba történt!");
      }
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8" style={{ background: '#d1fae5', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#14532d' }}>Új termék hozzáadása</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium" style={{ color: '#14532d' }}>Név</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ color: '#14532d', background: '#f0fdf4' }}
          />
        </div>
        <div>
          <label className="block font-medium" style={{ color: '#14532d' }}>Leírás</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ color: '#14532d', background: '#f0fdf4' }}
          />
        </div>
        <div>
          <label className="block font-medium" style={{ color: '#14532d' }}>Ár</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            style={{ color: '#14532d', background: '#f0fdf4' }}
          />
        </div>
        <div>
          <label className="block font-medium" style={{ color: '#14532d' }}>Készlet</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
            min="0"
            step="1"
            style={{ color: '#14532d', background: '#f0fdf4' }}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          disabled={loading}
        >
          {loading ? "Mentés..." : "Mentés"}
        </button>
      </form>
    </div>
  );
} 