import React, { useState, useEffect } from "react";

const EditForm = ({ userData, onClose }) => {
  // Initialize form data with userData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    birthday: "",
    officialEmail: "",
    alternateEmail: "",
    contactNumber: "",
    alternateContactNumber: "",
    password: "",
  });

  useEffect(() => {
    if (userData) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Convert to yyyy-MM-dd format
      };
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        bloodGroup: userData.bloodGroup || "",
        birthday: userData.birthday || "",
        officialEmail: userData.officialEmail || "",
        alternateEmail: userData.alternateEmail || "",
        contactNumber: userData.contactNumber || "",
        alternateContactNumber: userData.alternateContactNumber || "",
        password: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    // Close the form on successful submission
    onClose();
  };

  return (
    <section className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-h-screen overflow-auto">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Edit Your Details
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your last name"
                required
              />
            </div>

            {/* Blood Group */}
            <div>
              <label
                htmlFor="bloodGroup"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Blood Group
              </label>
              <input
                type="text"
                name="bloodGroup"
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your blood group"
                required
              />
            </div>

            {/* Birthday */}
            <div>
              <label
                htmlFor="birthday"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                id="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            {/* Official Email */}
            <div>
              <label
                htmlFor="officialEmail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Official Email
              </label>
              <input
                type="email"
                name="officialEmail"
                id="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your official email"
                required
              />
            </div>

            {/* Alternate Email */}
            <div>
              <label
                htmlFor="alternateEmail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Alternate Email (Optional)
              </label>
              <input
                type="email"
                name="alternateEmail"
                id="alternateEmail"
                value={formData.alternateEmail}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your alternate email"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your contact number"
                required
              />
            </div>

            {/* Alternate Contact Number */}
            <div>
              <label
                htmlFor="alternateContactNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Alternate Contact Number (Optional)
              </label>
              <input
                type="tel"
                name="alternateContactNumber"
                id="alternateContactNumber"
                value={formData.alternateContactNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your alternate contact number"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Update Details
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-sm font-light text-gray-500 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditForm;
