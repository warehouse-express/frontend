"use client";

import React, { useState } from "react";
import { useFetch, useMutation } from "@/hooks/useApi";
import { productService } from "@/services/api";
import { Product } from "@/types/models";
import Link from "next/link";

export default function ProductsPage() {
  //state to trigger data refetching (incremented when we need to refresh the product list)
  //the increment is used to force the useFetch hook to re-fetch the data
  const [reloadTrigger, setReloadTrigger] = useState(0);

  //fetch all products from the API using custom hook
  //will re-fetch whenever reloadTrigger changes
  const {
    data: products,
    isLoading,
    error,
  } = useFetch<Product[]>(
    () => productService.getAllProducts(),
    [reloadTrigger]
  );

  //setup mutation hook for deleting products
  //takes a product ID (number) and returns void
  const deleteProductMutation = useMutation<void, number>((id) =>
    productService.deleteProduct(id)
  );

  //handler function for deleting a product
  const handleDeleteProduct = async (id: number) => {
    //show confirmation dialog before deletion
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        //call the delete API via the mutation hook
        await deleteProductMutation.mutate(id);
        //increment the reload trigger to refresh the product list
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        //log errors to console for debugging
        console.error("Failed to delete product:", error);
      }
    }
  };

  //utility function to format prices as US currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="container">
      {/*header section with title and add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href="/products/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Add Product
        </Link>
      </div>

      {/* loading state - shows spinner while data is being fetched */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* error state - shows error message if API request fails */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* empty state - shows message when no products exist */}
      {!isLoading && !error && products?.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-gray-500 dark:text-gray-400">No products found.</p>
          <Link
            href="/products/create"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Add your first product
          </Link>
        </div>
      )}

      {/* products grid - displays when products exist */}
      {!isLoading && !error && products && products.length && Array.isArray(products) && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* map through each product to create product cards */}
            {products.map((product) => (
              <div
                key={product.id} //react requires a unique key for list items
                className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
              >
                {/* product header with name and status badge */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-medium text-lg truncate">
                    {product.name}
                  </h2>
                  {/* status badge with conditional styling based on product status */}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : product.status === "OUT_OF_STOCK"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* product category */}
                <div className="text-sm text-gray-500 mb-1">
                  {product.category || "No category"}
                </div>

                {/* price and inventory information */}
                <div className="flex justify-between mb-3">
                  <div className="font-semibold">
                    {formatPrice(product.price)}
                  </div>
                  <div>In stock: {product.quantity}</div>
                </div>

                {/* seller information */}
                <div className="text-sm mb-4 flex-grow">
                  Seller: {product.seller?.companyName || "Unknown"}
                </div>

                {/* action buttons */}
                <div className="flex justify-end space-x-2 mt-auto">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
