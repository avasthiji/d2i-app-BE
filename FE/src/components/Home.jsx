import React, { useEffect, useState } from 'react'
import Dropdown from './DropDown';
import { getMetrics } from '../services/metricService';
import ProfileImg from '../assets/profileDefault.jpg'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfile from './EditeProfile';
import EditForm from './EditForm';

import { BasicDropdown } from './BasicDropdown';

const Home = () => {
    const [user,setUser] = useState(null);
    const { userId } = useParams();

    const [metrics,setMetrics]=useState([]);

    // const [showEditProfile, setShowEditProfile] = useState(false);
    
    // const handleEditClick = () => {
        //     setShowEditProfile(true);
        // };
        
        // const handleCloseEdit = () => {
            //     setShowEditProfile(false);
            // };
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


    // useEffect(()=>{
    //     const storedUser = JSON.parse(localStorage.getItem('user'));
    //     if(storedUser){
    //         setUser(storedUser);
    //     }
    // },[]);
    
    

    useEffect(()=>{
        fetchMetrics();
    },[]);
    const fetchMetrics = async()=>{
        try{
            const data = await getMetrics();
            setMetrics(data);
        }catch(error){
            console.log('error in fetching metrics:',error);
        }
    }

    //Fetch logged In User
    useEffect(()=>{
        const fetchUserData = async(req,res)=>{
            try{
                const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
                setUser(response.data);
            }catch(error){
                console.error('Error in fetching user data',error);
            }
        }
        fetchUserData();
    },[])

    console.log("userdata is:");
    console.log(JSON.stringify(user));
    

    // console.log(metrics);
    
    // const metrics = [
    //     // Example metrics data
    //     { _id: '1', label: 'Parent Skill 1', parent_id: null },
    //     { _id: '2', label: 'Parent Skill 2', parent_id: null },
    //     { _id: '3', label: 'Child Skill 1', parent_id: '1' },
    //     { _id: '4', label: 'Child Skill 2', parent_id: '1' },
    //     { _id: '5', label: 'Child Skill 3', parent_id: '2' },
    // ];

    

    const parentMetrics = metrics.filter(metric => metric.parent_id === null);
    // console.log(JSON.stringify(parentMetrics));
    
    const childMetrics = metrics.filter(metric => metric.parent_id !== null);
    // console.log(childMetrics);



  return (
    <>

    {/* <div className='bg-slate-300  h-8 '>
        <div className='flex justify-end mr-10'>
            <h3 className=''>Edit Details</h3>
        </div>
    </div> */}
          <div className='bg-slate-300 h-8'>
              <div className='flex justify-end mr-10'>
                  <h3
                      className='hover:bg-gray-400 px-4 py-1 cursor-pointer rounded-lg'
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
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{user ? (user.firstName+" "+user.lastName): 'John Doe'}</span>
                          </div>
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Role:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">Software Developer</span>
                          </div>
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Department:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">Engineering</span>
                          </div>
                      </div>
                      <div className="flex justify-center items-center md:w-1/3">
                          <img src={ProfileImg} alt="Profile" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-200" />
                      </div>
                  </div>
              </div>

              {/* Contact Information Card */}
              <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
                  <div className="flex flex-col md:flex-row">
                      <div className="flex flex-col mb-4 md:mb-0 md:w-1/2">
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Official Email:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{user? user.officialEmail:'john.doe@example.com'}</span>
                          </div>
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Alternate Email:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{( user && user.alternateEmail)? user.alternateEmail :'john.doe@alter.com'}</span>
                          </div>
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Phone:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{user && user.contactNumber ? user.contactNumber : '+123-456-7890'}</span>
                          </div>
                          
                      </div>
                      <div className="flex flex-col md:w-1/2">
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Blood Group:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{user ? user.bloodGroup : 'O+'}</span>
                          </div>
                          <div className="flex items-center mb-4">
                              <h2 className="text-xl font-semibold text-gray-700">Date of Birth:</h2>
                              <span className="text-xl font-bold ml-2 bg-gray-200 border border-gray-300 rounded-lg px-3 py-1">{user && user.birthday ? new Date(user.birthday).toLocaleDateString() : 'January 1, 1990'}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>


          {/* Conditional Rendering of EditProfile Component */}
          {/* {showEditProfile && (
              <EditProfile
                  userId={userId}
                  onClose={handleCloseEdit}
                  onUpdate={handleUpdate}
              />
          )} */}

          {showEditForm && <EditForm userData={user} onClose={handleCloseForm} />}

          {/* <div>
        {/* <div className='flex border-2 border-b-0 rounded-md p-5 max-w-4xl mx-auto h-full justify-between'>
            <div className='flex flex-col items-start p-4'>
                <div className='flex items-center mb-4'>
                  <h2 className='text-xl font-semibold '>Name:</h2> 
                  <span className='text-xl font-bold ml-2 border-2 rounded-lg p-2 w-40'>John Doe</span>
                </div>     
            </div> */}

            {/* -------- */}
              {/* <div className='flex flex-col items-center p-4'> */}
                  {/* <div className='flex items-center'>
                      <h2 className='text-xl font-semibold'>Role:</h2> <span className='text-xl font-bold ml-2'>SDE</span>
                  </div> */}
              {/* </div> */}
            {/* --------- */}

            {/* <div className='border-2 rounded-lg'>
                    <img src={ProfileImg} className='w-40 h-40' />
            </div>
        </div>
        <div className='flex flex-col border-2 border-t-0 rounded-md p-5 max-w-4xl mx-auto h-full '>
              <div className='flex items-center mb-4'>
                  <h2 className='text-xl font-semibold '>Official Email:</h2>
                  <span className='text-xl font-bold ml-2 border-2 rounded-lg p-2 w-fit'>JohnDoe@gmail.com</span>
              </div>
              <div className='flex items-center mb-4'>
                  <h2 className='text-xl font-semibold '>Alternate Email:</h2>
                  <span className='text-xl font-bold ml-2 border-2 rounded-lg p-2 w-fit'>John@Doe.com</span>
              </div>
              <div className='flex items-center mb-4'>
                  <h2 className='text-xl font-semibold '>Bood Group:</h2>
                  <span className='text-xl font-bold ml-2 border-2 rounded-lg p-2 w-40'>John Doe</span>
              </div>     

        </div> */}

      {/* <div className=" flex flex-col justify-start items-center">
          <h1 className="text-2xl font-bold">Welcome to the Home Page!</h1>
          {user && (
              <div className="mt-4 text-lg">
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  {console.log(user)}
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                  <p><strong>Email:</strong> {user.officialEmail}</p>
              </div>
          )}
      </div> */}
          {/* </div> */} 


      {/* ------------------ */}
      {/* <div>
      {/* <div className='border-t-2 bordder-gray-500 mb-40 '>
        <h2 className='font-semibold text-2xl text-center p-4'>Metric Management</h2>
              <div className="p-4">
                  <Dropdown parentMetrics={parentMetrics} childMetrics={childMetrics} />
              </div>
      </div>  */}
       {/*</div> */}
       {/* ------------------ */}

          <h1>New dropdown</h1>
          <div className="p-4">
              <BasicDropdown />
          </div>
          
          <div className='border-t-2 border-gray-500 mb-40'>
              <h2 className='font-semibold text-2xl text-center p-4'>Metric Management</h2>
              <div className="p-4">
                  <Dropdown parentMetrics={parentMetrics} childMetrics={childMetrics} />
              </div>
          </div>

         
    </>
  )
}

export default Home