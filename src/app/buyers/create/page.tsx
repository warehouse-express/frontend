"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { buyerService } from "@/services/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BuyerDto } from "@/types/api";

export default function buyerCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BuyerDto>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    shippingAddress: "",
    billingAddress: "",
    phoneNumber: "",
  });

  //create buyer mutation
  const {
    mutate: createbuyer,
    isLoading,
    error,
    isSuccess,
  } = useMutation(buyerService.createBuyer);

  //redirect after successful creation
  useEffect(() => {
    if (isSuccess) {
      router.push("/buyers");
    }
  }, [isSuccess, router]);

  //handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      alert("First Name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      alert("Last Name is required");
      return;
    }

    if (!formData.email.trim()) {
      alert("Emailis required");
      return;
    }

    if (!formData.password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      await createbuyer(formData);
    } catch (error) {
      console.error("Failed to create buyer:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Create New buyer</h1>
        <Link
          href="/buyers"
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
            className="block text-sm text-gray-500 mb-1"
            htmlFor="firstName"
          >
            First Name *
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm text-gray-500 mb-1"
            htmlFor="lastName"
          >
            Last Name *
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter Last Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1" htmlFor="email">
            Email *
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm text-gray-500 mb-1"
            htmlFor="password"
          >
            Password *
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm text-gray-500 mb-1"
            htmlFor="shippingAddress"
          >
            Shipping Address
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="shippingAddress"
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleInputChange}
            placeholder="Enter Shipping Address"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm text-gray-500 mb-1"
            htmlFor="billingAddress"
          >
            Billing Address
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="billingAddress"
            type="text"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
            placeholder="Enter Billing Address"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm text-gray-500 mb-1"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create buyer"}
          </button>
        </div>
      </form>
    </div>
  );
}
