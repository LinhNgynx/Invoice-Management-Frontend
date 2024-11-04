import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';

Modal.setAppElement('#root');

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    userName: '',
    password: '',
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/');
        setMembers(response.data.items);
      } catch (error) {
        console.error('Error fetching requests', error);
      }
    };
    fetchRequests();
  }, []);

  // Function to handle adding a new member
  const addMember = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/users/',
        newMember,
      );
      if (res.status === 200) {
        const updatedMembers = [
          ...members,
          {
            id: members.length + 1,
            ...newMember,
          },
        ];
        setMembers(updatedMembers);
        toast.success('Thêm thành viên thành công');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }

    closeModal();
  };

  // Function to handle deleting a member
  const deleteMember = async id => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/users/${id}`);
      if (res.status === 200) {
        const updatedMembers = members.filter(member => member.id !== id);
        setMembers(updatedMembers);
        toast.success('Xóa thành viên thành công');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewMember({ name: '', userName: '', password: '' });
  };

  // Handle form changes in modal
  const handleChange = e => {
    const { name, value } = e.target;
    setNewMember(prevMember => ({
      ...prevMember,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen">
      <ToastContainer></ToastContainer>
      <h1 className="text-2xl font-bold text-gray-800">Member List</h1>

      {/* Add Member Button */}
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
        >
          Add Member
        </button>
      </div>

      {/* Member List Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-6 text-center font-semibold">ID</th>
              <th className="py-3 px-6 font-semibold">Username</th>
              <th className="py-3 px-6 font-semibold">Name</th>
              <th className="py-3 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} className="border-b last:border-none">
                <td className="py-4 px-6 text-center">{member.id}</td>
                <td className="py-4 px-6">{member.userName}</td>
                <td className="py-4 px-6">{member.name}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Member"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              addMember();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newMember.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="userName"
                value={newMember.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={newMember.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default MemberList;