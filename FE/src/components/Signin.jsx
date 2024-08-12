import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({
        officialEmail: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', formData);
            console.log(response.data);
            if (response.status >= 200 && response.status < 300) {
                // Store token and user info in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    officialEmail: response.data.officialEmail
                }));
                
                navigate(`/home/${response.data.userId}`);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <>
           
        <section className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Official Email */}
                        <div>
                            <label htmlFor="officialEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Official Email</label>
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

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
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
                            Sign in
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account? <a href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
};

export default SignIn;
