import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '../../containers/Auth';
import { Welcome } from '../../containers/Main/Welcome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const contextClass = {
//   success: "bg-gray-400",
//   error: "bg-red-600",
//   info: "bg-gray-600",
//   warning: "bg-orange-400",
//   default: "bg-indigo-600",
//   dark: "bg-white-600 font-gray-300",
// };

const Popup = () => {  
  return (
    <div className='h-full p-4 bg-gray-700'>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to={'/signin'} />} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/welcome' element={<Welcome/>} />
        </Routes>
      </Router>
      {/* <MainComponent position={curPosition}/> */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"   
        hideProgressBar
        toastClassName=" bg-gray-100"        
        bodyClassName={() => "text-sm font-white font-med block p-3"}
      />
    </div>
  );
};

export default Popup;
