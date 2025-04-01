"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { orderService } from "@/services/api";
import { Order } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [formData, setState] = useState({
    status: "",
    trackingNumber: "",
  });

  //fetch order details
  const {
    data: order,
    isLoading,
    error,
  } = useFetch<Order>(() => orderService.getOrderById(orderId), [orderId]);

  //update form data when order is loaded
  useEffect(() => {
    if (order) {
      setState({
        status: order.status || "",
        trackingNumber: order.trackingNumber || "",
      });
    }
  }, [order]);

  //update order status mutation
  const {
    mutate: updateStatus,
    isLoading: isUpdatingStatus,
    error: updateStatusError,
    isSuccess: isStatusUpdateSuccess,
  } = useMutation<Order, string>((status) =>
    orderService.updateOrderStatus(orderId, status)
  );

  //update tracking info mutation
  const {
    mutate: updateTracking,
    isLoading: isUpdatingTracking,
    error: updateTrackingError,
    isSuccess: isTrackingUpdateSuccess,
  } = useMutation<Order, string>((trackingNumber) =>
    orderService.updateTrackingInfo(orderId, trackingNumber)
  );

  //redirect after successful updates
  useEffect(() => {
    if (isStatusUpdateSuccess || isTrackingUpdateSuccess) {
      router.push(`/orders/${orderId}`);
    }
  }, [isStatusUpdateSuccess, isTrackingUpdateSuccess, router, orderId]);

  //handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState({ ...formData, [name]: value });
  };

  //handle form submission for status update
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatus(formData.status);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  //handle form submission for tracking update
  const handleTrackingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTracking(formData.trackingNumber);
    } catch (error) {
      console.error("Failed to update tracking info:", error);
    }
  };

  //handle order cancellation
  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await orderService.cancelOrder(orderId);
        router.push(`/orders/${orderId}`);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
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
        <Link href="/orders" className="text-blue-600 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          Edit Order: {order?.orderNumber}
        </h1>
        <div className="flex space-x-2">
          <Link
            href={`/orders/${orderId}`}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Order Information Summary */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-3">Order Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium">{order?.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-medium">{order?.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Placed On</p>
            <p className="font-medium">
              {order?.placedAt
                ? new Date(order.placedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="font-medium">{order?.trackingNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">
              {order?.buyer?.firstName} {order?.buyer?.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium">
              ${order?.totalAmount?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Status Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Update Status</h2>
            {updateStatusError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{updateStatusError.message}</p>
              </div>
            )}
            <form onSubmit={handleStatusUpdate}>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-500 mb-1"
                  htmlFor="status"
                >
                  Order Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Update Tracking Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Update Tracking</h2>
            {updateTrackingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{updateTrackingError.message}</p>
              </div>
            )}
            <form onSubmit={handleTrackingUpdate}>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-500 mb-1"
                  htmlFor="trackingNumber"
                >
                  Tracking Number
                </label>
                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  type="text"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={isUpdatingTracking}
                >
                  {isUpdatingTracking ? "Updating..." : "Update Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Cancel Order Section */}
      {order?.status !== "CANCELLED" && order?.status !== "DELIVERED" && (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3 text-red-600">
            Cancel Order
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Cancelling an order will return all items to inventory
          </p>
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
