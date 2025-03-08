import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2'; 
import '../App';

// Set the root element for accessibility (required by react-modal)
Modal.setAppElement('#root');

const CrudComponent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5001/api/users');
    setUsers(response.data);
    setFilteredUsers(response.data);
  };

  // Open modal for insert or update
  const openModal = (user = null) => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setEditingUser(user);
    } else {
      setName('');
      setEmail('');
      setEditingUser(null);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add new user or update existing user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        await axios.put(`http://localhost:5001/api/users/${editingUser.id}`, { name, email });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User updated successfully!',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Insert user
        await axios.post('http://localhost:5001/api/users', { name, email });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User registered successfully!',
          confirmButtonColor: '#3085d6',
        });
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User deleted successfully!',
        confirmButtonColor: '#3085d6',
      });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => openModal()}
        >
          Insert
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Modal for Insert/Update */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="User Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="border p-2 w-full mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {editingUser ? 'Update' : 'Add'} User
            </button>
          </div>
        </form>
      </Modal>

      {/* Users Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  onClick={() => openModal(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudComponent;