import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserFormModal from "../../components/UserFormModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Footer from "../../components/Footer";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      setListLoading(true);
      setListError(null);
      setDeleteError(null);
      setDeleteSuccess(null);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }).toString();

      const res = await fetch(`/api/admin/dashboard?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to fetch users");
      }

      setUsers(responseData.users);
      setCurrentPage(responseData.currentPage);
      setTotalPages(responseData.totalPages);
      setTotalUsers(responseData.totalUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setListError(err.message || "Failed to load users.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const confirmDelete = (user) => {
    if (user._id === currentUser._id) {
      alert("You cannot delete your own admin account.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);
      setDeleteSuccess(null);

      const res = await fetch(`/api/admin/delete-user/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setDeleteSuccess(data.message || "User deleted successfully!");

      setIsDeleteModalOpen(false);
      setUserToDelete(null);

      setTimeout(() => {
        setDeleteSuccess(null);
        fetchUsers();
      }, 2000);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setDeleteError(err.message || "Failed to delete user.");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreateNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleModalCloseAndRefresh = (success = false) => {
    setIsModalOpen(false);
    setEditingUser(null);
    if (success) {
      fetchUsers();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Admin Dashboard
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full md:w-2/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleCreateNewUser}
              className="w-full md:w-auto bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Add New User
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-700">
              Total Users: <span className="font-semibold">{totalUsers}</span>
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-gray-700">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {deleteLoading && (
            <p className="text-center text-blue-600 text-lg mt-4">
              Deleting user...
            </p>
          )}
          {deleteError && (
            <p className="text-center text-red-600 text-lg mt-4">
              Delete Error: {deleteError}
            </p>
          )}
          {deleteSuccess && (
            <p className="text-center text-green-600 text-lg mt-4">
              {deleteSuccess}
            </p>
          )}

          {listLoading && (
            <p className="text-center text-blue-600 text-lg">
              Loading users...
            </p>
          )}
          {listError && (
            <p className="text-center text-red-600 text-lg">
              Error fetching users: {listError}
            </p>
          )}

          {!listLoading && (
            <div className="overflow-x-auto">
              {users.length === 0 && searchTerm === "" ? (
                <p className="text-center text-gray-600 text-lg mt-8">
                  No users found.
                </p>
              ) : users.length === 0 && searchTerm !== "" ? (
                <p className="text-center text-gray-600 text-lg mt-8">
                  No users found matching "{searchTerm}".
                </p>
              ) : (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                        Username
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                        Admin
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-700 truncate max-w-[100px]">
                          {user._id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {user.username}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {user.isAdmin ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Yes
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                            >
                              <span className="md:hidden">
                                <FaRegEdit />
                              </span>
                              <span className="hidden md:inline-flex items-center gap-1">
                                <FaRegEdit />
                                <span>Edit</span>
                              </span>
                            </button>
                            <button
                              onClick={() => confirmDelete(user)}
                              className="flex items-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200"
                            >
                              <span className="md:hidden">
                                <MdDeleteForever />
                              </span>
                              <span className="hidden md:inline-flex items-center gap-1">
                                <MdDeleteForever />
                                <span>Delete</span>
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {!listLoading && !listError && totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={false}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index + 1
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {isModalOpen && (
          <UserFormModal
            user={editingUser}
            onClose={handleModalCloseAndRefresh}
          />
        )}

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          userToDelete={userToDelete}
          onConfirm={executeDelete}
          onCancel={cancelDelete}
          isLoading={deleteLoading}
        />
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
