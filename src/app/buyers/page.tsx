"use client";

import React, { useState } from "react";
import { useFetch, useMutation } from "@/hooks/useApi";
import { buyerService } from "@/services/api";
import { Buyer } from "@/types/models";
import Link from "next/link";

export default function BuyersPage() {
  //state to trigger data refetching (incremented when we need to refresh the buyer list)
  //the increment is used to force the useFetch hook to re-fetch the data
  const [reloadTrigger, setReloadTrigger] = useState(0);

  //fetch all buyers from the API using custom hook
  //will re-fetch whenever reloadTrigger changes
  const {
    data: buyers,
    isLoading,
    error,
  } = useFetch<Buyer[]>(() => buyerService.getAllBuyers(), [reloadTrigger]);

  //setup mutation hook for deleting buyers
  //takes a buyer ID (number) and returns void
  const deletebuyerMutation = useMutation<void, number>((id) =>
    buyerService.deleteBuyer(id)
  );

  //handler function for deleting a buyer
  const handleDeletebuyer = async (id: number) => {
    //show confirmation dialog before deletion
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      try {
        //call the delete API via the mutation hook
        await deletebuyerMutation.mutate(id);
        //increment the reload trigger to refresh the buyer list
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        //log errors to console for debugging
        console.error("Failed to delete buyer:", error);
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
        <h1 className="text-xl font-semibold">buyers</h1>
        <Link
          href="/buyers/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Add Buyer
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

      {/* empty state - shows message when no buyers exist */}
      {!isLoading && !error && buyers?.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-gray-500 dark:text-gray-400">No buyers found.</p>
          <Link
            href="/sllers/create"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Add your first buyer
          </Link>
        </div>
      )}

      {/* buyers grid - displays when buyers exist */}
      {!isLoading &&
        !error &&
        buyers &&
        buyers.length &&
        Array.isArray(buyers) && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* map through each buyer to create buyer cards */}
            {buyers.map((buyer) => (
              <div
                key={buyer.id} //react requires a unique key for list items
                className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
              >
                {/* buyer header with name and status badge */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-medium text-lg truncate">
                    {buyer.firstName}
                  </h2>
                </div>

                {/* buyer phone number */}
                <div className="text-sm text-gray-500 mb-1">
                  {buyer.phoneNumber || "No phone number"}
                </div>

                {/* Buyer address */}
                <div className="flex justify-between mb-3">
                  <div className="font-semibold">
                    {buyer.shippingAddress || "No address"}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex justify-end space-x-2 mt-auto">
                  <Link
                    href={`/buyers/${buyer.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/buyers/edit/${buyer.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeletebuyer(buyer.id)}
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
