"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { sellerService } from "@/services/api";
import { SellerUpdateDto } from "@/types/api";
import { Seller } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditSellerPage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = Number(params.id);

  const [formData, setFormData] = useState<SellerUpdateDto>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    companyDescription: "",
    contactPhone: "",
    businessAddress: "",
    taxId: "",
  });

  //fetch seller details
  const {
    data: seller,
    isLoading,
    error,
  } = useFetch<Seller>(() => sellerService.getSellerById(sellerId), [sellerId]);

  //update form data when seller is loaded
  useEffect(() => {
    if (seller) {
      setFormData({
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        companyName: seller.companyName,
        companyDescription: seller.companyDescription || "",
        contactPhone: seller.contactPhone || "",
        businessAddress: seller.businessAddress || "",
        taxId: seller.taxId || "",
      });
    }
  }, [seller]);

  //update seller mutation
  const {
    mutate: updateSeller,
    isLoading: isUpdating,
    error: updateError,
    isSuccess,
  } = useMutation<Seller, SellerUpdateDto>((data) =>
    sellerService.updateSeller(sellerId, data)
  );

  //redirect after successful update, when isSuccess is true
  useEffect(() => {
    if (isSuccess) {
      router.push(`/sellers/${sellerId}`);
    }
  }, [isSuccess, router, sellerId]);

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
      await updateSeller(formData);
    } catch (error) {
      console.log(formData);
      console.error("Failed to update seller:", error);
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
        <Link href="/sellers" className="text-blue-600 hover:underline">
          Back to sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          Edit seller: {seller?.companyName}
        </h1>
        <div className="flex space-x-2">
          <Link
            href={`/sellers/${sellerId}`}
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
              htmlFor="companyName"
            >
              Company Name *
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="companyDescription"
            >
              Company Description
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="contactPhone"
            >
              Contact Phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="businessAddress"
            >
              Business Address
            </label>
            <input
              id="businessAddress"
              name="businessAddress"
              type="text"
              value={formData.businessAddress}
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
