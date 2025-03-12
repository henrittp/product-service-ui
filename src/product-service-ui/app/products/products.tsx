// app/products/products.tsx
import { useState, useEffect } from "react";
import logoLight from "../welcome/5087579.png";
import { getAuthToken, isAuthenticated, removeAuthToken } from "../utils/auth";

/**
 * Data fetching function - separate from component rendering
 */
async function fetchProducts() {
  const token = getAuthToken();
  if (!token) return { error: "No authentication token", products: [] };

  try {
    const response = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: error.message, products: [] };
  }
}

/**
 * Products component that works in both server and client environments
 */
export default function Products() {
  // Start with empty state that's safe for server rendering
  const [productsData, setProductsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for CRUD operations
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Check auth and load data after component mounts (client-side only)
  useEffect(() => {
    async function loadData() {
      // Check authentication
      if (!isAuthenticated()) {
        window.location.href = "/";
        return;
      }

      // Fetch products
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        if (data.error) {
          setError(data.error);
        } else {
          setProductsData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle product editing
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditingProduct(true);
  };

  // Handle product deletion
  const handleDelete = async (product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch(`/api/products/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete product");

        // Success - refresh product list
        const data = await fetchProducts();
        setProductsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (formData, isEdit) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const url = isEdit ? `/api/products/${formData.id}` : "/api/products";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`Failed to ${isEdit ? "update" : "create"} product`);

      // Success - refresh product list
      const data = await fetchProducts();
      setProductsData(data);

      // Close modal
      setIsAddingProduct(false);
      setIsEditingProduct(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    removeAuthToken();
    window.location.href = "/";
  };

  return (
    <main className="flex items-center justify-center w-full min-h-svh bg-[#fff1de] font-[--font-apple] py-4 px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-[800px]">
        {/* Header with logo */}
        <div className="flex items-center justify-center mb-3 sm:mb-6">
          <img
            src={logoLight}
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 mr-3 object-contain"
          />

          <h1 className="text-3xl sm:text-3xl font-medium font-[--font-tiempos] text-gray-900">
            Product <span className="text-indigo-500">Management</span>
          </h1>
        </div>

        {/* Logout button */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-white/30 hover:bg-white/50 text-gray-700 text-sm 
              rounded-xl border border-white/50 shadow-sm
              transform transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Main content card */}
        <div
          className="w-full overflow-hidden bg-white/20 backdrop-blur-xl 
          rounded-2xl shadow-gray-500/40 shadow-2xl
          border border-white/20"
        >
          {/* Card header */}
          <div className="pt-6 sm:pt-7 pb-2 sm:pb-3 px-6 sm:px-8">
            <p className="text-ls sm:text-sm text-gray-500 font-[--font-tiempos] text-center mt-0.5 sm:mt-1">
              Manage your product inventory
            </p>
          </div>

          {/* Card content */}
          <div className="px-6 sm:px-8 pt-4 sm:pt-5 pb-6 sm:pb-8">
            {isLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-6">{error}</div>
            ) : (
              <>
                {/* Add Product button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium
                      rounded-xl shadow-lg shadow-indigo-500/25
                      transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add Product
                  </button>
                </div>
                <ProductsContent
                  data={productsData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </>
            )}
          </div>
        </div>

        <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-600">
          made late at night, but with ❤️ by Henri
        </p>
      </div>

      {/* Add Product Modal */}
      {isAddingProduct && (
        <ProductForm
          product={null}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddingProduct(false)}
          isEdit={false}
        />
      )}

      {/* Edit Product Modal */}
      {isEditingProduct && currentProduct && (
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditingProduct(false)}
          isEdit={true}
        />
      )}
    </main>
  );
}

/**
 * Product Form component for creating and editing products
 */
function ProductForm({ product, onSubmit, onCancel, isEdit }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        id: product?.id, // Include ID for edit operations
      },
      isEdit
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder=" "
              required
              value={formData.name}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 bg-white/40 border border-indigo-300/50 rounded-xl text-gray-800
                text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                shadow-sm"
            />
            <label
              className="absolute text-sm text-gray-500 left-4 
              transition-all duration-150
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
              peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
              peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
            >
              Product Name
            </label>
          </div>

          <div className="relative">
            <textarea
              name="description"
              placeholder=" "
              value={formData.description}
              onChange={handleChange}
              className="peer w-full px-4 pt-5 pb-2 bg-white/40 border border-indigo-300/50 rounded-xl text-gray-800
                text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                shadow-sm min-h-[80px]"
            />
            <label
              className="absolute text-sm text-gray-500 left-4 
              transition-all duration-150
              peer-placeholder-shown:top-8 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
              peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
              peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
            >
              Description
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder=" "
                required
                value={formData.price}
                onChange={handleChange}
                className="peer w-full px-4 pt-5 pb-2 bg-white/40 border border-indigo-300/50 rounded-xl text-gray-800
                  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                  shadow-sm"
              />
              <label
                className="absolute text-sm text-gray-500 left-4 
                transition-all duration-150
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
                peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
              >
                Price ($)
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                name="stock"
                min="0"
                placeholder=" "
                required
                value={formData.stock}
                onChange={handleChange}
                className="peer w-full px-4 pt-5 pb-2 bg-white/40 border border-indigo-300/50 rounded-xl text-gray-800
                  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/60 focus:border-transparent
                  shadow-sm"
              />
              <label
                className="absolute text-sm text-gray-500 left-4 
                transition-all duration-150
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-indigo-500
                peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs"
              >
                Stock
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/25
                transform transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Helper component to handle the resolved products data
 */
function ProductsContent({ data, onEdit, onDelete }) {
  // Ensure we have a proper array
  let products = [];

  if (data) {
    if (Array.isArray(data)) {
      // If data is already an array
      products = data;
    } else if (data.products && Array.isArray(data.products)) {
      // If data has a products property that's an array
      products = data.products;
    } else {
      // Try to convert object to array if it looks like a collection
      if (typeof data === "object" && data !== null) {
        try {
          const possibleArray = Object.values(data);
          if (
            Array.isArray(possibleArray) &&
            possibleArray.length > 0 &&
            typeof possibleArray[0] === "object"
          ) {
            products = possibleArray;
          }
        } catch (err) {
          console.error("Failed to convert object to array:", err);
        }
      }
    }
  }

  // Handle empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        No products found. Add your first product!
      </div>
    );
  }

  // Render responsive layout - table for desktop, cards for mobile
  return (
    <div>
      {/* Table for desktop/tablet (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-500/10">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-gray-700">Stock</th>
              <th className="px-4 py-2 text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id || Math.random()}
                className="border-b border-gray-200/30"
              >
                <td className="px-4 py-3 text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-gray-800">
                  $
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : product.price}
                </td>
                <td className="px-4 py-3 text-gray-800">{product.stock}</td>
                <td className="px-4 py-3 flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile (hidden on desktop/tablet) */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id || Math.random()}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm"
          >
            <div className="font-medium text-base text-gray-800 mb-2">
              {product.name}
            </div>

            <div className="text-sm text-gray-700 mb-1 line-clamp-2">
              {product.description && (
                <span className="text-xs text-gray-500">
                  {product.description}
                </span>
              )}
            </div>

            <div className="flex justify-between text-sm my-3">
              <div className="text-gray-700">
                <span className="text-gray-500 text-xs mr-1">Price:</span>
                <span className="font-medium">
                  $
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : product.price}
                </span>
              </div>

              <div className="text-gray-700">
                <span className="text-gray-500 text-xs mr-1">Stock:</span>
                <span className="font-medium">{product.stock}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => onEdit(product)}
                className="px-4 py-1.5 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product)}
                className="px-4 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Keep the loader function for React Router, but make it compatible with SSR
export async function loader() {
  // For server-side rendering, return empty state
  if (typeof window === "undefined") {
    return { productsData: [] };
  }

  // For client-side, let component handle data fetching
  return { productsData: [] };
}
