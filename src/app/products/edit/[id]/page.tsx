"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { productService } from "@/services/api";
import { ProductUpdateDto } from "@/types/api";
import { Product } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [formData, setFormData] = useState<ProductUpdateDto>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
  });

  //fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useFetch<Product>(
    () => productService.getProductById(productId),
    [productId]
  );

  //update form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        quantity: product.quantity,
        category: product.category || "",
      });
    }
  }, [product]);

  //update product mutation
  const {
    mutate: updateProduct,
    isLoading: isUpdating,
    error: updateError,
    isSuccess,
  } = useMutation<Product, ProductUpdateDto>((data) =>
    productService.updateProduct(productId, data)
  );

  //uedirect after successful update
  useEffect(() => {
    if (isSuccess) {
      router.push(`/products/${productId}`);
    }
  }, [isSuccess, router, productId]);

  //handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    //convert numeric values
    if (name === "price") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === "quantity") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProduct(formData);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
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
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Edit Product: {product?.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/products/${productId}`}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Cancel
          </Link>
        </div>
      </div>

      {updateError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{updateError.message}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1" htmlFor="name">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm text-gray-500 mb-1"
                htmlFor="price"
              >
                Price ($) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm text-gray-500 mb-1"
                htmlFor="quantity"
              >
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right border-t border-gray-200 dark:border-gray-600">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
