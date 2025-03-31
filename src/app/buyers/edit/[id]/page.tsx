"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { buyerService } from "@/services/api";
import { BuyerUpdateDto } from "@/types/api";
import { Buyer } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditBuyerPage() {
  const params = useParams();
  const router = useRouter();
  const BuyerId = Number(params.id);

  const [formData, setFormData] = useState<BuyerUpdateDto>({
    firstName: "",
    lastName: "",
    shippingAddress: "",
    billingAddress: "",
    phoneNumber: "",
  });

  //fetch Buyer details
  const {
    data: Buyer,
    isLoading,
    error,
  } = useFetch<Buyer>(() => buyerService.getBuyerById(BuyerId), [BuyerId]);

  //update form data when Buyer is loaded
  useEffect(() => {
    if (Buyer) {
      setFormData({
        firstName: Buyer.firstName,
        lastName: Buyer.lastName,
        shippingAddress: Buyer.shippingAddress || "",
        billingAddress: Buyer.billingAddress || "",
        phoneNumber: Buyer.phoneNumber || "",
      });
    }
  }, [Buyer]);

  //update Buyer mutation
  const {
    mutate: updateBuyer,
    isLoading: isUpdating,
    error: updateError,
    isSuccess,
  } = useMutation<Buyer, BuyerUpdateDto>((data) =>
    buyerService.updateBuyer(BuyerId, data)
  );

  //redirect after successful update, when isSuccess is true
  useEffect(() => {
    if (isSuccess) {
      router.push(`/buyers/${BuyerId}`);
    }
  }, [isSuccess, router, BuyerId]);

  //handle input changes
  //responsible for handling the form state when the user types in the input fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //this uses obkect destructuring to extract the name and value of the input field
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBuyer(formData);
    } catch (error) {
      console.log(formData);
      console.error("Failed to update Buyer:", error);
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
        <Link href="/buyers" className="text-blue-600 hover:underline">
          Back to Buyers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Edit Buyer: {Buyer?.id}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/buyers/${BuyerId}`}
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
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="firstName"
            >
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
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
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="shippingAddress"
            >
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="billingAddress"
            >
              Billing Address
            </label>
            <textarea
              id="billingAddress"
              name="billingAddress"
              value={formData.billingAddress}
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