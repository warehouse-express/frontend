"use client";

import React from "react";
import { useFetch } from "@/hooks/useApi";
import { orderService } from "@/services/api";
import { Order } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  //fetch order details
  const {
    data: order,
    isLoading,
    error,
  } = useFetch<Order>(() => orderService.getOrderById(orderId), [orderId]);

  //format price as currency
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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

  //if there is an error, show error message and button with link to orders page
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error.message}</p>
        </div>
        <button
          onClick={() => router.push("/orders")}
          className="text-blue-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  //if order is not found, show error message and link to orders page
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Order not found</p>
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
        <h1 className="text-xl font-semibold">Order #{order.orderNumber}</h1>
        <div className="flex space-x-2">
          <Link
            href="/orders"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Order Total</h3>
              <p className="text-xl font-bold">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Status</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "PROCESSING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-1">Customer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-800 dark:text-gray-200">
                  {order.buyer?.firstName} {order.buyer?.lastName}
                </p>
              </div>
              <div className="text-right">
                {order.buyer?.id && (
                  <Link
                    href={`/buyers/${order.buyer.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Customer
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Order Date</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(order.placedAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Shipping Address</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {order.shippingAddress || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Tracking Number</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {order.trackingNumber || "Not available"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-800 dark:text-gray-200">
                {formatDate(order.updatedAt)}
              </p>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm text-gray-500 mb-1">Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3 mt-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded p-3"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(Number(item.price))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                        {item.product?.id && (
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            View Product
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No items in this order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
