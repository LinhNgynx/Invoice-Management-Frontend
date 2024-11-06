import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';

const CreateRequest = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deposit, setDeposit] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isCateDropdownOpen, setIsCateDropdownOpen] = useState(false);

  const [searchProductTerm, setSearchProductTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isProDropdownOpen, setIsProDropdownOpen] = useState(false);

  const {user} = useContext(AuthContext);

  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsCateDropdownOpen(false);
      setIsProDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:8080/api/categories/');
        setCategories(categoryResponse.data.items);
        const productResponse = await axios.get('http://localhost:8080/api/products/');
        setProducts(productResponse.data.items);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    loadData();
  }, []);


  // Handle adding items to cart
  const addItemToCart = () => {
    if (selectedProduct == null || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (product) {
      const total = product.price * quantity;

      setOrderItems([
        ...orderItems,
        { id: product.id, name: product.name, price: product.price, quantity, total},
      ]);

      setTotalAmount((prev) => prev + total);
      setSelectedProduct(null);
      setSearchCategoryTerm('');
      setSearchProductTerm('');
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

  // Filter categories based on the search term
  const handleCategorySearchChange = (e) => {
    const term = e.target.value;
    setSearchCategoryTerm(term);

    if (term) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCategories(filtered);
      setIsCateDropdownOpen(true);
    } else {
      setFilteredCategories(categories);
      setIsCateDropdownOpen(false);
    }
  };

  // Select a category and close the dropdown
  const handleSelectCategory = (category) => {
    setSearchCategoryTerm(category.name);
    console.log(category);
    setSelectedCategory(category.id);
    setIsCateDropdownOpen(false);
  };

  // Filter products based on the search term
  const handleProductSearchChange = (e) => {
    const term = e.target.value;
    setSearchProductTerm(term);

    if (term) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsProDropdownOpen(true);
    } else {
      setFilteredProducts(products);
      setIsProDropdownOpen(false);
    }
  };

  // Select a product and close the dropdown
  const handleSelectProduct = (product) => {
    setSearchProductTerm(product.name);
    console.log(product);
    setSelectedProduct(product.id);
    setIsProDropdownOpen(false);
  };

  // Handle saving the order
  const saveOrder = async () => {
    if (!user || orderItems.length === 0) {
      alert("Please add user and order items before saving.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/requests/', {
        userId: user.id,
        detail: "",
        deposit: deposit,
        totalPrice: totalAmount,
        state: "PENDING",
        products: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      toast.success("Order saved successfully.");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("There was an error saving the order.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className='text-2xl font-bold'>Create new request</h2>
      {/* User and Order Details */}
      <div className="flex overflow-hidden flex-col py-8">
        <div className="flex flex-col px-10 w-full">
          <section className="bg-white mb-6 border p-4 rounded-md">
          <h2 className="self-start text-2xl mb-3 pb-3 font-bold leading-none text-red-800 max-md:mt-10 border-b-2 border-grey">
              Order details
            </h2>
            {user ? (
              <div>
                <p className="mb-1"><strong>Order date:</strong> {moment().format('DD-MM-YYYY')}</p>
                <p className="mb-1"><strong>Order by:</strong> {user.name}</p>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </section>

          {/* Add Items into Cart */}
          <section className="bg-white mb-6 border p-4 rounded-md">
            <h2 className="self-start text-2xl mb-3 pb-3 font-bold leading-none text-red-800 max-md:mt-10 border-b-2 border-grey">
              Add Items into Cart
            </h2>
            {/* big div */}
            <div className="space-y-2">
              {/* category */}
              {/* <h2 className='pt-1 font-bold'>Category</h2>
              <div className='flex justify-between items-center space-x-4'>
                <div ref={dropdownRef} className="relative w-1/2">
                  <input
                    type="text"
                    value={searchCategoryTerm}
                    onChange={handleCategorySearchChange}
                    placeholder="Search categories..."
                    className="w-full border px-4 py-2 rounded-md"
                    onFocus={() => setIsCateDropdownOpen(true)}
                  />

                  {isCateDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                          <div
                            key={category.id}
                            onClick={() => handleSelectCategory(category)}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                          >
                            {category.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No categories found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span>or see all categories</span>

                <select
                  className="border p-2 rounded-md w-1/4"
                  value={selectedCategory || ''}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSearchCategoryTerm('');
                  }}
                >
                  <option value="">Please select</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* product */}
              <h2 className='pt-1 font-bold'>Product</h2>
              <div className='flex justify-between items-center space-x-4'>
                <div ref={dropdownRef} className="relative w-1/2">
                  <input
                    type="text"
                    value={searchProductTerm}
                    onChange={handleProductSearchChange}
                    placeholder="Search products..."
                    className="w-full border px-4 py-2 rounded-md"
                    onFocus={() => setIsProDropdownOpen(true)}
                  />

                  {isProDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                          >
                            {product.name} - {product.price} VND
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span>or see all products</span>

                <select
                  className="border p-2 rounded-md w-1/4"
                  value={selectedProduct || ''}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    setSearchProductTerm('');
                  }}
                >
                  <option value="">Please select</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price} VND
                    </option>
                  ))}
                </select>
              </div>

              <h2 className='pt-1 font-bold'>Quantity</h2>
              <div>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border p-2 rounded-md w-20"
                />
              </div>

              <div className="flex flex-row items-top justify-end gap-4">
                <button onClick={addItemToCart} className="bg-green-600 text-white px-4 py-2 rounded-md">
                  Add Item
                </button>
              </div>
              
            </div>
          </section>

          {/* Order Item Details */}
          <section className="bg-white mb-6 border p-4 rounded-md">
            <h2 className="self-start text-2xl mb-3 pb-3 font-bold leading-none text-red-800 max-md:mt-10 border-b-2 border-grey">
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
                      <th className="p-2 border">TOTAL COST</th>
                      <th className="p-2 border">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2 border text-center">{item.id}</td>
                        <td className="p-2 border text-center">{item.name}</td>
                        <td className="p-2 border text-center">{item.price} VND</td>
                        <td className="p-2 border text-center">{item.quantity}</td>
                        <td className="p-2 border text-center">{item.total} VND</td>
                        <td className="p-2 border text-center">
                          <button 
                            className='text-red-500' 
                            onClick={() => deleteItemFromCart(item.id)}
                          >
                              <TrashIcon className='size-6'/>
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
              Total Amount: {totalAmount} VND
            </div>
          </section>

          <section className="bg-white mb-6 border p-4 rounded-md">
            <h2 className="self-start text-2xl mb-3 pb-3 font-bold leading-none text-red-800 max-md:mt-10 border-b-2 border-grey">
              Deposit
            </h2>
            <div className='flex items-center space-x-4'>
              <h2 className='font-bold'>Deposit</h2>
              <input
                type="number"
                min="0"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="border p-2 rounded-md w-40"
              />
              <span>VND</span>
            </div>
          </section>

          {/* Save Form Button */}
          <div className="flex flex-row items-top justify-end gap-4">
            <button onClick={saveOrder} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
              Save Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
