import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const BasicDropdown = () => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption]=useState('');

    // const [childOptions, setChildOptions] = use

    useEffect(()=>{
        //fucntion to fetch parentMetrics
        const fetchParentMetrics = async()=>{
            try{
                const response = await axios.get("http://localhost:3000/api/metrics/parent-metrics");
                setOptions(response.data);
            }catch(error){
                console.log('Error fetching parent metrics:',error);
            }
        };
        fetchParentMetrics();
    },[]);

    useEffect(()=>{
        if(selectedOption){
            const fetchChildMetrics = async()=>{
                const response = await axios.get(`http://localhost:3000/api/metrics/child-metrics/${selectedOption}`);
                seC
            }
        }
    })

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };
  return (
    <div>
          <label htmlFor="metrics" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Metric</label>
          <select id='metrics' name='metrics' value={selectedOption} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">

                <option value="" disabled>Select an Option</option>
                {options.map((option)=>(
                    <option key={option._id} value={option._id}>
                        {option.label}
                    </option>
                ))}

            </select>
        
    </div>
  )
};
