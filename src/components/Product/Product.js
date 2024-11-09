/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ClipLoader from 'react-spinners/ClipLoader';

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [productNames, setProductNames] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://invoice-backend-v1.onrender.com/api/categories/',
        );
        setLoading(false);
        setCategories(response.data.items);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, []);

  const handleAddCategory = async () => {
    if (categoryName == null || categoryName === '') {
      return;
    }
    try {
      const data = { name: categoryName };
      const res = await axios.post(
        'https://invoice-backend-v1.onrender.com/api/categories/',
        data,
      );
      if (res.status === 200) {
        setCategories([...categories, res.data.items]);
        setCategoryName('');
        toast.success('Add category successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? 'An unknown error has occurred',
      );
    }
  };

  const handleDeleteCategory = async categoryId => {
    try {
      const res = await axios.delete(
        `https://invoice-backend-v1.onrender.com/api/categories/${categoryId}`,
      );
      if (res.status === 200) {
        const updatedCategories = categories.filter(
          category => category.id !== categoryId,
        );
        setCategories(updatedCategories);
        toast.success('Delete category successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? 'An unknown error has occurred',
      );
    }
  };

  const handleAddProduct = async categoryId => {
    if (productNames[categoryId] == null || productNames[categoryId] === '') {
      return;
    }
    try {
      const data = { name: productNames[categoryId], categoryId };
      const res = await axios.post(
        'https://invoice-backend-v1.onrender.com/api/products/',
        data,
      );

      if (res.status === 200) {
        setCategories(
          categories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  products: category.products
                    ? [...category.products, res.data.items]
                    : [res.data.items],
                }
              : category,
          ),
        );
        setProductNames({ ...productNames, [categoryId]: '' });
        toast.success('Add product successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const handleDeleteProduct = async (categoryId, productId) => {
    try {
      const res = await axios.delete(
        `https://invoice-backend-v1.onrender.com/api/products/${productId}`,
      );
      if (res.status === 200) {
        setCategories(
          categories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  products: category.products.filter(
                    product => product.id !== productId,
                  ),
                }
              : category,
          ),
        );
        toast.success('Delete product successfully');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? 'An unknown error has occurred',
      );
    }
  };

  const toggleExpand = categoryId => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Filter categories and products based on search query
  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.products.some(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Category & Product Management
        </h1>

        {loading ? (
          <div className="flex w-full justify-center">
            <ClipLoader
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="flex items-center mb-6 justify-between">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Search categories or products"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full flex-1 px-3 py-2 border border-gray-300 rounded mr-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="">
                <input
                  type="text"
                  placeholder="Add new category"
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded mr-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Category
                </button>
              </div>
            </div>

            {/* Filtered Categories List */}
            <div className="space-y-4 overflow-y-auto max-h-[70vh]">
              {filteredCategories.map(category => (
                <div
                  key={category.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {category.name}
                    </h2>
                    <div>
                      {!category.products || category.products.length === 0 ? (
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleExpand(category.id)}
                          className="text-gray-600 text-sm hover:text-gray-800 flex items-center"
                        >
                          {expandedCategories[category.id] ? (
                            <FiChevronUp size={16} />
                          ) : (
                            <FiChevronDown size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedCategories[category.id] && (
                    <div className="overflow-y-auto max-h-40 space-y-2">
                      <ul className="space-y-2 mb-4">
                        {category.products.map(product => (
                          <li
                            key={product.id}
                            className="flex justify-between items-center p-2 bg-white border rounded shadow-sm"
                          >
                            {product.name}
                            <button
                              onClick={() =>
                                handleDeleteProduct(category.id, product.id)
                              }
                              className="text-red-500 text-sm hover:underline"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Add Product Input for Each Category */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Add new product"
                      value={productNames[category.id] || ''}
                      onChange={e =>
                        setProductNames({
                          ...productNames,
                          [category.id]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded mr-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddProduct(category.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Add Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Product;
