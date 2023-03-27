// import React from 'react';
// import logo from '../../assets/img/icon-128.png';
// import './Newtab.css';

// const Newtab = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Welcome to our MVP 
//         </p>
       
//       </header>
//     </div>
//   );
// };

// export default Newtab;

import React from 'react';
import GoogleLogin from 'react-google-login';

const Newtab = (() => {
   const responseGoogle = (resp) => {
    console.log('response Google', resp)
  }
 
  return (
    <>      
      <GoogleLogin
        clientId="794879507611-dt0gc34te2eqpr9crmequ3irih52t1qr.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </>
  );
});

export default Newtab
