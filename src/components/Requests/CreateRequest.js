import axios from 'axios';
import React, { useState, useEffect } from 'react';

// Placeholder fetch functions
const fetchCustomerData = async () => {
  return { orderId: '12345', name: 'John Doe', orderDate: '2023-11-02', mobile: '123-456-7890' };
};

// const fetchProducts = async () => {
//   return [
//     { id: 1, name: 'Product 1', price: 10 },
//     { id: 2, name: 'Product 2', price: 20 },
//     { id: 3, name: 'Product 3', price: 15 },
//   ];
// };

const CreateRequest = () => {
  const [customer, setCustomer] = useState(null);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      const customerData = await fetchCustomerData();
      setCustomer(customerData);
      try {
        const productResponse = await axios.get('http://localhost:8080/api/products/');
        console.log(productResponse.data);
        setProducts(productResponse.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadData();
  }, []);


  // Handle adding items to cart
  const addItemToCart = () => {
    console.log(selectedProduct);
    if (selectedProduct == null || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (product) {
      const total = product.price * quantity;

      setOrderItems([
        ...orderItems,
        { id: product.id, name: product.name, price: product.price, quantity, total },
      ]);

      setTotalAmount((prev) => prev + total);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  // Handle deleting an item from cart
  const deleteItemFromCart = (itemId) => {
    const updatedItems = orderItems.filter((item) => item.id !== itemId);
    const itemToRemove = orderItems.find((item) => item.id === itemId);
    setOrderItems(updatedItems);

    if (itemToRemove) {
      setTotalAmount((prev) => prev - itemToRemove.total);
    }
  };

  // Handle saving the order
  const saveOrder = async () => {
    if (!customer || orderItems.length === 0) {
      alert("Please add customer and order items before saving.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/requests/', {
        userId: "USER-1", // Assuming orderId is used as customer identifier
        detail: "",
        deposit: 0,
        totalPrice: totalAmount,
        state: "PENDING",
        products: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      console.log("Order saved successfully:", response.data);
      alert("Order saved successfully.");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error saving the order.");
    }
  };

  return (
    <div className="container mx-auto p-4 overflow-hidden bg-stone-500 bg-opacity-60">
        <h1 className="overflow-hidden z-10 px-3.5 pb-0 mt-10 ml-3 text-5xl font-bold border-b border-black text-black text-opacity-90 max-md:pr-5 max-md:pb-2.5 max-md:max-w-full max-md:text-4xl">
          Create new request
        </h1>
      {/* Customer and Order Details */}
      <div className="flex overflow-hidden flex-col pt-12 pb-28 mt-6 ml-3 bg-white max-md:pb-24 max-md:mr-2.5 max-md:max-w-full">
      <div className="flex flex-col px-10 w-full max-md:px-5 max-md:max-w-full">
      <section className="mb-6 border p-4 rounded-md">
        <h2 className="self-start text-3xl mb-3 font-bold leading-none text-red-800 max-md:max-w-full">
          Customer and Order Details
        </h2>
        {customer ? (
          <div>
            <p className="mb-1"><strong>Order ID:</strong> {customer.orderId}</p>
            <p className="mb-1"><strong>Customer Name:</strong> {customer.name}</p>
            <p className="mb-1"><strong>Order Date:</strong> {customer.orderDate}</p>
            <p className="mb-1"><strong>Customer Mobile:</strong> {customer.mobile}</p>
          </div>
        ) : (
          <p>Loading customer data...</p>
        )}
      </section>

      {/* Add Items into Cart */}
      <section className="mb-6 border p-4 rounded-md">
        <h2 className="self-start text-3xl mb-3 font-bold leading-none text-red-800 max-md:mt-10">
          Add Items into Cart
        </h2>
        <div className="flex items-center space-x-4">
          {/* <h2>Select Category</h2>
          <select
            className="border p-2 rounded-md"
            value={selectedCategory || ''}
            onChange={(e) => {
              setSelectedCategory(category.filter((item) => item.id === e.target.value))
            }}
          >
          <option value="">Please select</option>
            {category.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select> */}
          
          <select
            className="border p-2 rounded-md"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
          <option value="">Please select</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.price}VND
              </option>
            ))}
          </select>
          <h2>Enter Quantity</h2>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 rounded-md w-20"
          />
          <button onClick={addItemToCart} className="bg-rose-800 text-white px-4 py-2 rounded-md">
            Add Item
          </button>
        </div>
      </section>

      {/* Order Item Details */}
      <section className="mb-6 border p-4 rounded-md">
        <h2 className="self-start text-3xl mb-3 font-bold leading-none text-red-800">
          Order Items Details
        </h2>
        <div>
          {orderItems.length > 0 ? (
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">PRODUCT</th>
                  <th className="p-2 border">PRICE</th>
                  <th className="p-2 border">QUANTITY</th>
                  <th className="p-2 border">Total cost</th>
                  <th className="p-2 border">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border text-center">{item.id}</td>
                    <td className="p-2 border text-center">{item.name}</td>
                    <td className="p-2 border text-center">{item.price}VND</td>
                    <td className="p-2 border text-center">{item.quantity}</td>
                    <td className="p-2 border text-center">{item.total}VND</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => deleteItemFromCart(item.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>
        <div className="text-right self-end mt-9 mr-40 text-xl font-bold leading-none text-gray-600 max-md:mr-2.5">
          Total Amount: {totalAmount}VND
        </div>
      </section>

      {/* Save Form Button */}
      <div className="text-right">
        <button onClick={saveOrder} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
          Save Sell Details
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default CreateRequest;
