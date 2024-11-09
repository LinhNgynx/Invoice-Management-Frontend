import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils';

const CreateRequest = () => {
  const [categories, setCategories] = useState([]);
  const [productCategory, setProductCategory] = useState([])
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [detail, setDetail] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isCateDropdownOpen, setIsCateDropdownOpen] = useState(false);

  const [searchProductTerm, setSearchProductTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isProDropdownOpen, setIsProDropdownOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const dropdownRef = useRef(null); // Ref for the dropdown container
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  const handleClickOutside = event => {
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
        const categoryResponse = await axios.get(
          'http://localhost:8080/api/categories/',
        );
        setCategories(categoryResponse.data.items);
        const productResponse = await axios.get(
          'http://localhost:8080/api/products/',
        );
        setProducts(productResponse.data.items);
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    loadData();
  }, []);

  // Handle adding items to cart
  const addItemToCart = () => {
    if (selectedProduct == null || quantity <= 0) return;

    const product = products.find(p => p.id === selectedProduct);
    if (product) {
      const total = price * quantity;

      if(orderItems.find(p => product.id === p.id)) {
        toast.warn("Product is already in cart, if you want to change, remove it first");
        return;
      }

      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          name: product.name,
          price,
          quantity,
          total,
        },
      ]);

      setTotalAmount(prev => prev + total);
      setSelectedProduct(null);
      setSelectedCategory(null);
      setSearchCategoryTerm('');
      setSearchProductTerm('');
      setQuantity(1);
      setPrice(0);
    }
  };

  // Handle deleting an item from cart
  const deleteItemFromCart = itemId => {
    const updatedItems = orderItems.filter(item => item.id !== itemId);
    const itemToRemove = orderItems.find(item => item.id === itemId);
    setOrderItems(updatedItems);

    if (itemToRemove) {
      setTotalAmount(prev => prev - itemToRemove.total);
    }
  };

  // Filter categories based on the search term
  const handleCategorySearchChange = e => {
    const term = e.target.value;
    setSearchCategoryTerm(term);

    if (term) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredCategories(filtered);
      setIsCateDropdownOpen(true);
    } else {
      setFilteredCategories(categories);
      setIsCateDropdownOpen(false);
    }
  };

  // Select a category and close the dropdown
  const handleSelectCategory = category => {
    setSearchCategoryTerm(category.name);
    setSelectedCategory(category.id);
    setIsCateDropdownOpen(false);
  };

  // Handle category selection and set products
  const handleCategorySelect = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(category);
    setProductCategory(category ? category.products : []);
  };


  // Filter products based on the search term
  const handleProductSearchChange = e => {
    const term = e.target.value;
    setSearchProductTerm(term);

    if (term) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredProducts(filtered);
      setIsProDropdownOpen(true);
    } else {
      setFilteredProducts(products);
      setIsProDropdownOpen(false);
    }
  };

  // Select a product and close the dropdown
  const handleSelectProduct = product => {
    setSearchProductTerm(product.name);
    setSelectedProduct(product.id);
    setIsProDropdownOpen(false);
  };

  // Handle saving the order
  const saveOrder = async () => {
    if (!user || orderItems.length === 0) {
      alert('Please add user and order items before saving.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/requests/', {
        userId: user.id,
        detail: detail,
        deposit: deposit,
        totalPrice: totalAmount,
        state: 'PENDING',
        products: orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      if (res.status === 200) {
        // toast.success('Create request successfully.');
        navigate('/member/requests');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "An unknown error has occurred");
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Create new request</h2>
        <div className="flex overflow-hidden flex-col py-8">
          <div className="flex flex-col w-full">
            {/* Add Items into Cart */}
            <section className="bg-white mb-6 border p-4 rounded-md">
              <h2 className="self-start mb-3 pb-3 leading-none border-b-2 border-grey text-lg font-semibold text-sky-700">
                Add Product
              </h2>
              {/* big div */}
              <div className="flex flex-col space-y-2">
                {/* Category */}
                <h2 className="mb-2 font-bold">Category</h2>
                <div className="w-full max-w-sm">
                  {/* Category Dropdown */}
                  <label className="block mb-2 font-medium">See products by category:</label>
                  <select 
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Product List */}
                  {selectedCategory && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        Products in {selectedCategory.name}:
                      </h3>
                      {productCategory.length > 0 ? (
                        <ul className="space-y-2 mt-2">
                          {productCategory.map(product => (
                            <li 
                              key={product.id} 
                              className="flex justify-between items-center border p-2 rounded-md"
                            >
                              <span>{product.name}</span>
                              <button 
                                onClick={() => handleSelectProduct(product)} 
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                              >
                                Select
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No products available</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Product */}
                <div className="flex flex-row justify-between mb-4">
                  <div>
                    <h2 className="mb-2 font-bold">Product</h2>
                    <div className="flex justify-between items-center space-x-4">
                      <div ref={dropdownRef} className="relative">
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
                                  {product.name}
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
                        className="border p-2 rounded-md"
                        value={selectedProduct || ''}
                        onChange={e => {
                          setSelectedProduct(e.target.value);
                          const product = products.find(p => p.id === e.target.value);
                          if (product?.name) {
                            setSearchProductTerm(product.name);
                          } else {
                            setSearchProductTerm('');
                          }
                        }}
                      >
                        <option value="">Please select</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-2 font-bold">Price</h2>
                    <div>
                      <input
                        min="1"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="border p-2 rounded-md w-20"
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-2 font-bold">Quantity</h2>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="border p-2 rounded-md w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-top justify-end gap-4">
                  <button
                    onClick={addItemToCart}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </section>

            {/* Order Item Details */}
            <section className="bg-white mb-6 border p-4 rounded-md">
              <h2 className="self-start mb-3 pb-3 leading-none border-b-2 border-grey text-lg font-semibold text-sky-700">
                Order Items Details
              </h2>
              <div>
                {orderItems.length > 0 ? (
                  <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-200 text-left">
                        <th className="py-3 px-6 text-center font-semibold">
                          ID
                        </th>
                        <th className="py-3 px-6 text-center font-semibold">
                          Product
                        </th>
                        <th className="py-3 px-6 text-center font-semibold">
                          Price
                        </th>
                        <th className="py-3 px-6 text-center font-semibold">
                          Quantity
                        </th>
                        <th className="py-3 px-6 text-center font-semibold">
                          Total Price
                        </th>
                        <th className="py-3 px-6 text-center font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map(item => (
                        <tr key={item.id} className="border-b last:border-none">
                          <td className="py-4 px-6 text-center">{item.id}</td>
                          <td className="py-4 px-6 text-center">{item.name}</td>
                          <td className="py-4 px-6 text-center">{formatPrice(item.price)} VND</td>
                          <td className="py-4 px-6 text-center">{item.quantity}</td>
                          <td className="py-4 px-6 text-center">{item.total} VND</td>
                          <td className="py-4 px-6 text-center">
                            <button
                              className="text-red-500"
                              onClick={() => deleteItemFromCart(item.id)}
                            >
                              <TrashIcon className="size-6" />
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
              <div className="text-right self-end mt-9 text-xl font-bold leading-none max-md:mr-2.5">
                Total Amount :{' '}
                <span className="text-green-600">{totalAmount} VND</span>
              </div>
            </section>

            <section className="bg-white mb-6 border p-4 rounded-md">
              <h2 className="self-start mb-3 pb-3 leading-none border-b-2 border-grey text-lg font-semibold text-sky-700">
                Request Information
              </h2>
              <div className="flex flex-row justify-between">
                <div className="">
                  <h2 className="font-bold mb-2">Detail</h2>
                  <input
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    className="border p-2 rounded-md w-80"
                  />
                </div>

                <div className="">
                  <h2 className="font-bold mb-2">Deposit</h2>
                  <input
                    type="number"
                    min="0"
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    className="border p-2 rounded-md w-40"
                  />
                  <span className="ml-2">VND</span>
                </div>
              </div>
            </section>

            {/* Save Form Button */}
            <div className="flex flex-row items-top justify-end gap-4">
              <button
                onClick={saveOrder}
                className="bg-sky-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
