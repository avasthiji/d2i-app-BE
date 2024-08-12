// src/components/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ userId, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bloodGroup: '',
        officialEmail: '',
        alternateEmail: '',
        contactNumber: '',
        alternateContactNumber: '',
        birthday: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/user/${userId}`, formData);
            onUpdate();  // Notify parent component to update user data
            onClose();   // Close the form
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </label>
                            <input
                                type={key === 'birthday' ? 'date' : 'text'}
                                name={key}
                                id={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="border rounded-lg py-2 px-3 w-full"
                                required
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
