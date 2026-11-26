import { useEffect, useState } from "react";
import "./ProductCatalog.css";

const API_BASE = "http://localhost:8080/api/products";

export default function ProductCatalog() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("id");
  const [category, setCategory] = useState("");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        q,
        sort,
        category,
      });

      try {
        const res = await fetch(`${API_BASE}?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch products");
          setItems([]);
          setTotal(0);
          setTotalPages(0);
          return;
        }

        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Cannot reach server on port 8080.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, [page, size, q, sort, category]);

  const handleSearchChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>Product Catalog</h1>
        <p className="catalog-summary">
          {total > 0
            ? `Page ${page} of ${totalPages}. ${total} results`
            : "0 results"}
        </p>
      </header>

      <div className="catalog-controls">
        <input
          type="text"
          className="catalog-search"
          placeholder="Search products by name..."
          value={q}
          onChange={handleSearchChange}
        />

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Audio">Audio</option>
          <option value="Wearables">Wearables</option>
        </select>

        <select value={sort} onChange={handleSortChange}>
          <option value="id">Sort: Default (ID)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>

        <select value={size} onChange={handleSizeChange}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {error && <div className="catalog-banner error">{error}</div>}

      {loading ? (
        <div className="catalog-status">Loading...</div>
      ) : items.length === 0 ? (
        <div className="catalog-status">No products found</div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-top">
                <span className="product-badge">{product.category}</span>
                <span className="product-id">#{product.id}</span>
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <button
          disabled={loading || page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </span>
        <button
          disabled={loading || totalPages === 0 || page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}