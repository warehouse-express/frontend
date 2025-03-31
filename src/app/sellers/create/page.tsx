"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { sellerService } from "@/services/api";
import { Seller } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SellerDto } from "@/types/api";

export default function SellerDetailPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<SellerDto>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        companyName: "",
        companyDescription: "",
        contactPhone: "",
        businessAddress: "",
        taxId: "",
    });

   //create seller mutation
    const {
        mutate: createSeller,
        isLoading,
        error,
        isSuccess,
    } = useMutation(sellerService.createSeller);

    //redirect after successful creation
    useEffect(() => {
        if (isSuccess) {
            router.push("/sellers");
        }
    }, [isSuccess, router]);

    //handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }


    //handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.companyName.trim()) {
            alert("Company name is required");
            return;
        }

        if (!formData.password.trim()) {
            alert("Password is required");
            return;
        }   

        if (!formData.firstName.trim()) {
            alert("First name is required");
            return;
        }

        if (!formData.lastName.trim()) {
            alert("Last name is required");
            return;
        }

        if (!formData.email.trim()) {
            alert("Email is required");
            return;
        }

        try {
            await createSeller(formData);
        } catch (error) {
            console.error("Failed to create seller:", error);
        }  
    };
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Create New Seller</h1>
                <Link
                    href="/sellers"
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
                        htmlFor="companyName"
                    >
                        Company Name *
                    </label>
                    <input
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="companyName"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
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
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="companyDescription"
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleInputChange}
                        placeholder="Enter company description"
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
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="contactPhone"
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="Enter contact phone"
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
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="businessAddress"
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        placeholder="Enter business address"
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm text-gray-500 mb-1"
                        htmlFor="taxId"
                    >
                        Tax ID
                    </label>
                    <input
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="taxId"
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        placeholder="Enter tax ID"
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
                        placeholder="Enter first name"
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
                        className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-sm text-gray-500 mb-1"
                        htmlFor="email"
                    >
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

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Seller"}
                    </button>
                </div>
            </form>
        </div>
    );
}   