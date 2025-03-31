"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { sellerService, productService } from "@/services/api";
import { Seller, Product } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SellerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = Number(params.id);

  //fetch seller details
  const {
    data: seller,
    isLoading,
    error,
  } = useFetch<Seller>(() => sellerService.getSellerById(sellerId), [sellerId]);

  //fetch products for selllers directly
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useFetch<Product[]>(
    () => productService.getProductsBySeller(sellerId),
    [sellerId]
  );

  //format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  //if data is loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  //if there is an error, show error message and button with link to sellers page
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error.message}</p>
        </div>
        <button
          onClick={() => router.push("/sellers")}
          className="text-blue-600 hover:underline"
        >
          Back to sellers
        </button>
      </div>
    );
  }

  //if seller is not found, show error message and link to sellers page
  if (!seller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>seller not found</p>
        </div>
        <Link href="/sellers" className="text-blue-600 hover:underline">
          Back to sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{seller.companyName}</h1>
        <div className="flex space-x-2">
          <Link
            href="/sellers"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </Link>
          <Link
            href={`/sellers/edit/${seller.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="p-4">
          <div className="flex justify-between mb-4"></div>

          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-1">Description</h3>
            <p className="text-gray-800 dark:text-gray-200">
              {seller.companyDescription || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Contact Phone</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {seller.contactPhone || "No phone number"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Business Address</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {seller.businessAddress || "No address"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Tax ID</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {seller.taxId || "No tax ID"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-gray-800 dark:text-gray-200">{seller.email}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">First Name</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {seller.firstName}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Name</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {seller.lastName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Created</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(seller.createdAt)}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(seller.updatedAt)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm text-gray-500 mb-1">Products</h3>
            {isLoadingProducts ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading products...
              </p>
            ) : productsError ? (
              <p className="text-red-600 dark:text-red-400">
                Error loading products
              </p>
            ) : products && products.length > 0 ? (
              <div className="mt-2">
                {/* Dropdown for selecting a product */}
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/products/${e.target.value}`);
                    }
                  }}
                  defaultValue=""
                >
                  {/* Once user selects a product, redirect to that product page */}
                  <option value="" disabled>
                    Select a product to view
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price.toFixed(2)} (
                      {product.status})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No products listed by this seller
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
