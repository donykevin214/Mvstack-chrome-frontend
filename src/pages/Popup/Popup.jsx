import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '../../containers/Auth';
import { Welcome } from '../../containers/Main/Welcome';
import { Setting } from '../../containers/Main/Setting';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Amplify } from 'aws-amplify';
import awsExports from '../../pages/Popup/aws-exports';
Amplify.configure({
    Auth: {
        region: awsExports.REGION,
        userPoolId: awsExports.USER_POOL_ID,
        userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
        authenticationFlowType: "USER_PASSWORD_AUTH"
    }
})

const Popup = () => {  
  useEffect(()=>{

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      console.log('message', message)
      sendResponse({
          data: "I am fine, thank you. How is life in the background?"
      }); 
  });
  
  },[])
  return (
    <div className='h-full p-4 bg-gray-700'>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to={'/signin'} />} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/welcome' element={<Welcome/>} />
          <Route path='/setting' element={<Setting/>} />
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
