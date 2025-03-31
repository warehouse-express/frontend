"use client";

import React, { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useApi";
import { buyerService, orderService } from "@/services/api";
import { Buyer, Order } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BuyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const buyerId = Number(params.id);

  //fetch buyer details
  const {
    data: buyer,
    isLoading,
    error,
  } = useFetch<Buyer>(() => buyerService.getBuyerById(buyerId), [buyerId]);

  //fetch orders for buyer directly 
  const {
    data: orders,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useFetch<Order[]>(
    () => orderService.getOrdersByBuyer(buyerId),
    [buyerId]
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

  //if there is an error, show error message and button with link to buyers page
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error.message}</p>
        </div>
        <button
          onClick={() => router.push("/buyers")}
          className="text-blue-600 hover:underline"
        >
          Back to buyers
        </button>
      </div>
    );
  }

  //if buyer is not found, show error message and link to buyers page
  if (!buyer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>buyer not found</p>
        </div>
        <Link href="/buyers" className="text-blue-600 hover:underline">
          Back to buyers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{buyer.firstName}</h1>
        <div className="flex space-x-2">
          <Link
            href="/buyers"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </Link>
          <Link
            href={`/buyers/edit/${buyer.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="p-4">
          <div className="flex justify-between mb-4"></div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Buyer ID</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {buyer.id|| "No Buyer ID"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Phone Number</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {buyer.phoneNumber || "No phone number"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Shipping Address</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {buyer.shippingAddress || "No Shipping Address"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-gray-800 dark:text-gray-200">{buyer.email}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">First Name</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {buyer.firstName}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Name</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {buyer.lastName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Created</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(buyer.createdAt)}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(buyer.updatedAt)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm text-gray-500 mb-1">Orders</h3>
            {isLoadingOrders ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading orders...
              </p>
            ) : ordersError ? (
              <p className="text-red-600 dark:text-red-400">
                Error loading orders
              </p>
            ) : orders && orders.length > 0 ? (
              <div className="mt-2">
                {/* Dropdown for selecting a product */}
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/orders/${e.target.value}`);
                    }
                  }}
                  defaultValue=""
                >
                  {/* Once user selects a product, redirect to that product page */}
                  <option value="" disabled>
                    Select a order to view
                  </option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - ${order.totalAmount} ({order.status}
                      )
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No orders listed by this buyer
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
