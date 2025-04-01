"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useFetch } from "@/hooks/useApi";
import { orderService, buyerService, productService } from "@/services/api";
import { Buyer, Product } from "@/types/models";
import { OrderDto, OrderItemDto } from "@/types/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderCreatePage() {
  const router = useRouter();
  //creates state for form data with default values
  const [formData, setFormData] = useState<OrderDto>({
    buyerId: 0,
    shippingAddress: "",
    items: [] as OrderItemDto[],
  });

  //creates state for selected product with default values
  const [selectedProduct, setSelectedProduct] = useState<OrderItemDto>({
    productId: 0,
    quantity: 1,
  });

  //fetch buyers for dropdown that runs on component mount
  const { data: buyers } = useFetch<Buyer[]>(
    () => buyerService.getAllBuyers(),
    []
  );

  //fetch products for dropdown that runs on component mount
  const { data: products } = useFetch<Product[]>(
    () => productService.getAllProducts(),
    []
  );

  //create order mutation
  const {
    mutate: createOrder,
    isLoading,
    error,
    isSuccess,
  } = useMutation(orderService.createOrder);

  //format price as currency
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  //calculate total order value
  const calculateTotal = () => {
    //if no products or orderitems, return 0
    if (!products || !formData.items.length) return 0;

    //uses javascript reduce method on formdata items to calculate total to iterate over
    //the each item in the array and calculate the total price
    return formData.items.reduce((total, item) => {
      //for each item in the formdata items, find the product in the products array
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
      //zero is starting value for the reduce method
    }, 0);
  };

  //redirect after successful creation
  useEffect(() => {
    if (isSuccess) {
      router.push("/orders");
    }
  }, [isSuccess, router]);

  //handle input changes for main form fields
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "buyerId") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });

      //auto-fill shipping address if a buyer is selected
      if (parseInt(value) > 0) {
        const selectedBuyer = buyers?.find(
          (buyer) => buyer.id === parseInt(value)
        );
        if (selectedBuyer && selectedBuyer.shippingAddress) {
          setFormData({
            ...formData,
            buyerId: parseInt(value),
            shippingAddress: selectedBuyer.shippingAddress,
          });
        } else {
          setFormData({
            ...formData,
            buyerId: parseInt(value),
          });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //      <Need to read over and add comments to this section>
  //----------------------------------------------------------------------------------














  
  //----------------------------------------------------------------------------------


  //handle changes for the product selection form
  const handleProductChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "productId") {
      setSelectedProduct({ ...selectedProduct, [name]: parseInt(value) || 0 });
    } else if (name === "quantity") {
      setSelectedProduct({ ...selectedProduct, [name]: parseInt(value) || 1 });
    }
  };

  //add selected product to order items
  const handleAddProduct = () => {
    if (selectedProduct.productId === 0) {
      alert("Please select a product");
      return;
    }

    if (selectedProduct.quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    //check if the product is already in the order
    const existingItemIndex = formData.items.findIndex(
      (item) => item.productId === selectedProduct.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += selectedProduct.quantity;
      setFormData({ ...formData, items: updatedItems });
    } else {
      // Add new item
      setFormData({
        ...formData,
        items: [...formData.items, { ...selectedProduct }],
      });
    }

    // Reset product selection
    setSelectedProduct({ productId: 0, quantity: 1 });
  };

  // Remove an item from the order
  const handleRemoveItem = (productId: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.productId !== productId),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.buyerId === 0) {
      alert("Please select a buyer");
      return;
    }

    if (!formData.shippingAddress.trim()) {
      alert("Shipping address is required");
      return;
    }

    if (formData.items.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    try {
      await createOrder(formData);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  // Get product details by ID
  const getProductById = (productId: number) => {
    return products?.find((product) => product.id === productId);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Create New Order</h1>
        <Link
          href="/orders"
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
        {/* Customer Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Customer Information</h2>
          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="buyerId"
            >
              Select Customer *
            </label>
            <select
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
              id="buyerId"
              name="buyerId"
              value={formData.buyerId}
              onChange={handleInputChange}
              required
            >
              <option value="0">Select a customer</option>
              {Array.isArray(buyers) &&
                buyers?.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.firstName} {buyer.lastName} ({buyer.email})
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-gray-500 mb-1"
              htmlFor="shippingAddress"
            >
              Shipping Address *
            </label>
            <textarea
              className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter shipping address"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Product Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Order Items</h2>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7">
                <label
                  className="block text-sm text-gray-500 mb-1"
                  htmlFor="productId"
                >
                  Product
                </label>
                <select
                  className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                  id="productId"
                  name="productId"
                  value={selectedProduct.productId}
                  onChange={handleProductChange}
                >
                  <option value="0">Select a product</option>
                  {Array.isArray(products) &&
                    products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)} (
                        {product.quantity} in stock)
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-span-3">
                <label
                  className="block text-sm text-gray-500 mb-1"
                  htmlFor="quantity"
                >
                  Quantity
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700"
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="1"
                  value={selectedProduct.quantity}
                  onChange={handleProductChange}
                />
              </div>

              <div className="col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded w-full"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Selected Products Table */}
          {formData.items.length > 0 ? (
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.items.map((item) => {
                    const product = getProductById(item.productId);
                    return (
                      <tr key={item.productId}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {product?.name || `Product #${item.productId}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                          {formatPrice(product?.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          {formatPrice(
                            product ? product.price * item.quantity : 0
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-sm font-medium text-right"
                    >
                      Order Total:
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-100 text-right">
                      {formatPrice(calculateTotal())}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-500 dark:text-gray-400">
                No items added to this order yet
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={isLoading || formData.items.length === 0}
          >
            {isLoading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
