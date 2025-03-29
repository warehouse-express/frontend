"use client";

import React from "react";
import { useFetch } from "@/hooks/useApi";
import { productService } from "@/services/api";
import { Product } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  //fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useFetch<Product>(
    () => productService.getProductById(productId),
    [productId]
  );

  //format price
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  //format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error.message}</p>
        </div>
        <button
          onClick={() => router.push("/products")}
          className="text-blue-600 hover:underline"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Product not found</p>
        </div>
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <div className="flex space-x-2">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </Link>
          <Link
            href={`/products/edit/${product.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {product.imageUrl && (
          <div className="w-full p-4 bg-gray-50 dark:bg-gray-900 flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-64 object-contain"
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between mb-4">
            <span className="text-2xl font-bold">
              {formatPrice(product.price)}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full self-start ${
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

          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-1">Description</h3>
            <p className="text-gray-800 dark:text-gray-200">
              {product.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Quantity</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {product.quantity}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Category</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {product.category || "Uncategorized"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Created</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(product.createdAt)}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm text-gray-500 mb-1">Seller</h3>
            <div className="flex items-center">
              <p className="text-gray-800 dark:text-gray-200">
                {product.seller?.companyName || "Unknown seller"}
              </p>
              {product.seller?.id && (
                <Link
                  href={`/sellers/${product.seller.id}`}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  View seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
