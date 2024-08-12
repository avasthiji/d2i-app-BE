import React, { useEffect, useState } from "react";
import { getMetrics } from "../api/metricApis";
import ProfileImg from "../assets/profileDefault.jpg";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditForm from "./EditForm";

import { BasicDropdown } from "./BasicDropdown";
import { fetchUserData } from "../api/userApis";

const Home = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  const [metrics, setMetrics] = useState([]);

  const [showEditForm, setShowEditForm] = useState(false);
  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
  };

  const handleUpdate = () => {
    fetchUserData(); // Refresh user data after updating
  };

  useEffect(() => {
    fetchMetrics();
  }, []);
  const fetchMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (error) {
      console.log("error in fetching metrics:", error);
    }
  };

  // Fetch logged in user
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData(userId); 
        setUser(data);
      } catch (error) {
        console.error("Error in fetching user data", error);
      }
    };
    loadUserData();
  }, [userId]);

  console.log("userdata is:");
  console.log(JSON.stringify(user));

  const parentMetrics = metrics.filter((metric) => metric.parent_id === null);
  // console.log(JSON.stringify(parentMetrics));

  const childMetrics = metrics.filter((metric) => metric.parent_id !== null);
  // console.log(childMetrics);

  return (
    <>
      <div className="bg-slate-300 h-8">
        <div className="flex justify-end mr-10">
          <h3
            className="hover:bg-gray-400 px-4 py-1 cursor-pointer rounded-lg"
            onClick={handleEditClick}
          >
            Edit Details
          </h3>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        {/* Profile Card */}
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg mb-6">
          <div className="flex flex-col md:flex-row p-6">
            <div className="flex flex-col md:w-2/3">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Name:</h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user ? user.firstName + " " + user.lastName : "John Doe"}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Role:</h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  Software Developer
                </span>
              </div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Department:
                </h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  Engineering
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center md:w-1/3">
              <img
                src={ProfileImg}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col mb-4 md:mb-0 md:w-1/2">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Official Email:
                </h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user ? user.officialEmail : "john.doe@example.com"}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Alternate Email:
                </h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user && user.alternateEmail
                    ? user.alternateEmail
                    : "john.doe@alter.com"}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Phone:</h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user && user.contactNumber
                    ? user.contactNumber
                    : "+123-456-7890"}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:w-1/2">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Blood Group:
                </h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user ? user.bloodGroup : "O+"}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Date of Birth:
                </h2>
                <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">
                  {user && user.birthday
                    ? new Date(user.birthday).toLocaleDateString()
                    : "January 1, 1990"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditForm && <EditForm userData={user} onClose={handleCloseForm} />}

      <div className="p-4 mb-40">
        <h1>New dropdown</h1>
        <BasicDropdown />
      </div>
    </>
  );
};

export default Home;
