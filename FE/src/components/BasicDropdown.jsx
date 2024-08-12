import axios from "axios";
import React, { useEffect, useState } from "react";

export const BasicDropdown = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const [childOptions, setChildOptions] = useState([]);
  const [selectedChildOptions, setSelectedChildOptions] = useState("");

  const [hasChildMetrics, setHasChildMetrics] = useState(false);

  useEffect(() => {
    //fucntion to fetch parentMetrics
    const fetchParentMetrics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/metrics/parent-metrics"
        );
        setOptions(response.data);
      } catch (error) {
        console.log("Error fetching parent metrics:", error);
      }
    };
    fetchParentMetrics();
  }, []);

  // Fetch child metrics when a parent metric is selected
  useEffect(() => {
    if (selectedOption) {
      const fetchChildMetrics = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/metrics/child-metrics/${selectedOption}`
          );
          const childData = response.data;
          setChildOptions(childData);
          // setChildOptions(response.data);
          setHasChildMetrics(childData.length > 0);
        } catch (error) {
          console.log("Error fetching child metrics:", error);
        }
      };
      fetchChildMetrics();
    } else {
      setChildOptions([]);
      setHasChildMetrics(false);
    }
  }, [selectedOption]);

  const handleParentChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedChildOptions(""); // Reset selected child option
  };

  const handleChildChange = (e) => {
    setSelectedChildOptions(e.target.value);
  };
  return (
    <div>
      <label
        htmlFor="metrics"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select Metric
      </label>
      <select
        id="metrics"
        name="metrics"
        value={selectedOption}
        onChange={handleParentChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      >
        <option value="" disabled>
          Select an Option
        </option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Child Dropdown */}
      {selectedOption && (
        <>
          <label
            htmlFor="childMetrics"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-4"
          >
            Select Child Metric
          </label>
          {hasChildMetrics ? (
            <select
              id="childMetrics"
              name="childMetrics"
              value={selectedChildOptions}
              onChange={handleChildChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="" disabled>
                Select an Option
              </option>
              {childOptions.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.label}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No child created
            </p>
          )}
        </>
      )}
    </div>
  );
};
