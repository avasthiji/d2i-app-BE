// import React, { useState } from 'react';

// const Dropdown = ({ parentMetrics, childMetrics }) => {
//     const [dropdownVisible, setDropdownVisible] = useState(false);
//     const [expandedParentId, setExpandedParentId] = useState(null);

//     const toggleDropdown = () => {
//         setDropdownVisible(!dropdownVisible);
//     };

//     const toggleExpand = (id) => {
//         setExpandedParentId(expandedParentId === id ? null : id);
//     };

//     return (
//         <div className="relative inline-block text-left">
//             <button
//                 id="dropdownDefaultButton"
//                 onClick={toggleDropdown}
//                 className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//                 type="button"
//             >
//                 Dropdown button
//                 <svg
//                     className="w-2.5 h-2.5 ms-3"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 10 6"
//                 >
//                     <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="m1 1 4 4 4-4"
//                     />
//                 </svg>
//             </button>

//             {dropdownVisible && (
//                 <div
//                     id="dropdown"
//                     className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2"
//                 >
//                     <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
//                         {parentMetrics.map((parentMetric) => (
//                             <li key={parentMetric._id}>
//                                 <a
//                                     href="#"
//                                     onClick={() => toggleExpand(parentMetric._id)}
//                                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                                 >
//                                     {parentMetric.label}
//                                 </a>
//                                 {expandedParentId === parentMetric._id && (
//                                     <ul className="pl-4 pt-2">
//                                         {childMetrics
//                                             .filter(child => child.parent_id === parentMetric._id)
//                                             .map(childMetric => (
//                                                 <li key={childMetric._id} className="pb-1">
//                                                     <a
//                                                         href="#"
//                                                         className="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                                                     >
//                                                         {childMetric.label}
//                                                     </a>
//                                                 </li>
//                                             ))}
//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dropdown;
import React, { useState } from 'react';

const Dropdown = ({ parentMetrics, childMetrics }) => {
    const [dropdowns, setDropdowns] = useState([{ visible: true, parentId: null, level: 0 }]);

    const handleDropdownClick = (parentId, level) => {
        // Check if child metrics are available for the selected parent
        const hasChildMetrics = childMetrics.some(child => child.parent_id === parentId);

        if (hasChildMetrics) {
            // Update existing dropdowns or add a new dropdown level
            const newDropdowns = dropdowns.slice(0, level + 1);
            // Ensure no duplicate levels are added
            if (newDropdowns.length <= level) {
                newDropdowns.push({ visible: true, parentId, level: level + 1 });
            } else {
                newDropdowns[level] = { ...newDropdowns[level], parentId, visible: true };
            }
            setDropdowns(newDropdowns);
        } else {
            // If no child metrics, close the dropdown
            const newDropdowns = dropdowns.slice(0, level + 1);
            newDropdowns[level] = { ...newDropdowns[level], visible: false };
            setDropdowns(newDropdowns);
        }
    };

    return (
        <div>
            {dropdowns.map((dropdown, index) => {
                // Determine metrics to display based on the level
                const metrics = index === 0
                    ? parentMetrics
                    : childMetrics.filter(child => child.parent_id === dropdown.parentId);

                return (
                    <div key={index} className="relative inline-block text-left mb-4">
                        <button
                            onClick={() => handleDropdownClick(dropdown.parentId, index)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {index === 0 ? "Select Parent Metric" : `Select Level ${index + 1} Metric`}
                        </button>
                        {dropdown.visible && (
                            <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    {metrics.length > 0 ? (
                                        metrics.map((metric) => (
                                            <li key={metric._id}>
                                                <a
                                                    href="#"
                                                    onClick={() => handleDropdownClick(metric._id, index)}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    {metric.label}
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <p className="block px-4 py-2 text-red-500">No child created</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Dropdown;
