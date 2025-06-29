import React from "react";

function DeleteConfirmationModal({
  isOpen,
  userToDelete,
  onConfirm,
  onCancel,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm mx-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Confirm Deletion
        </h3>
        <p className="text-gray-700 mb-6 text-center">
          Are you sure you want to delete user with email: "
          {userToDelete?.email}"? This action cannot be undone!.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
        {isLoading && (
          <p className="text-center text-blue-600 text-sm mt-4">
            Processing deletion...
          </p>
        )}
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
