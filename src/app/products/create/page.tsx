"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { productService, sellerService } from "@/services/api";
import { ProductDto } from "@/types/api";
import { Seller } from "@/types/models";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductDto>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    sellerId: 0,
  });

  //fetch sellers for dropdown
  const { data: sellers } = useFetch<Seller[]>(
    () => sellerService.getAllSellers(),
    []
  );

  //create product mutation
  const {
    mutate: createProduct,
    isLoading,
    error,
    isSuccess,
  } = useMutation(productService.createProduct);

  //redirect after successful creation
  useEffect(() => {
    if (isSuccess) {
      router.push("/products");
    }
  }, [isSuccess, router]);

  //handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    //convert numeric values
    if (name === "price") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === "quantity" || name === "sellerId") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (formData.sellerId === 0) {
      alert("Please select a seller");
      return;
    }

    try {
      await createProduct(formData);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Create New Product</h1>
        <Link
          href="/products"
          className="text-gray-600 hover:text-gray-900 text-sm"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error.message}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow rounded p-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
            htmlFor="name"
          >
            Product Name *
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
              htmlFor="price"
            >
              Price ($) *
            </label>
            <input
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
              htmlFor="quantity"
            >
              Quantity *
            </label>
            <input
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
              id="quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
            htmlFor="category"
          >
            Category
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter product category"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
            htmlFor="sellerId"
          >
            Seller *
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="sellerId"
            name="sellerId"
            value={formData.sellerId}
            onChange={handleInputChange}
            required
          >
            <option value="0">Select a seller</option>
            {Array.isArray(sellers) &&
              sellers?.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.companyName}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
