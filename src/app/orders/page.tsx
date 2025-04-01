"use client";

import React, { useState } from "react";
import { useFetch, useMutation } from "@/hooks/useApi";
import { orderService } from "@/services/api";
import { Order } from "@/types/models";
import Link from "next/link";

export default function OrdersPage() {
  //state to trigger data refetching (incremented when we need to refresh the order list)
  //the increment is used to force the useFetch hook to re-fetch the data
  const [reloadTrigger, setReloadTrigger] = useState(0);

  //fetch all orders from the API using custom hook
  //will re-fetch whenever reloadTrigger changes
  const {
    data: orders,
    isLoading,
    error,
  } = useFetch<Order[]>(() => orderService.getAllOrders(), [reloadTrigger]);

  //setup mutation hook for deleting orders
  //takes a order ID (number) and returns void
  const deleteOrderMutation = useMutation<void, number>((id) =>
    orderService.cancelOrder(id)
  );

  //handler function for deleting a order
  const handleDeleteOrder = async (id: number) => {
    //show confirmation dialog before deletion
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        //call the delete API via the mutation hook
        await deleteOrderMutation.mutate(id);
        //increment the reload trigger to refresh the order list
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        //log errors to console for debugging
        console.error("Failed to delete order:", error);
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
        <h1 className="text-xl font-semibold">Orders</h1>
        <Link
          href="/orders/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Add Order
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

      {/* empty state - shows message when no orders exist */}
      {!isLoading && !error && orders?.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
          <Link
            href="/orders/create"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Add your first order
          </Link>
        </div>
      )}

      {/* orders grid - displays when orders exist */}
      {!isLoading &&
        !error &&
        orders &&
        orders.length &&
        Array.isArray(orders) && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* map through each order to create order cards */}
            {orders.map((order) => (
              <div
                key={order.id} //react requires a unique key for list items
                className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
              >
                {/* Order header with order number and status badge */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-medium text-lg truncate">
                    {order.orderNumber}
                  </h2>
                </div>

                {/* Order Status */}
                <div className="text-sm text-gray-500 mb-1">
                  {order.status|| "No order status"}
                </div>

                {/* Buyer Name */}
                <div className="flex justify-between mb-3">
                  <div className="font-semibold">
                    {order.buyer.firstName + " " + order.buyer.lastName || "No Buyer Name"}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex justify-end space-x-2 mt-auto">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/orders/edit/${order.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
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
