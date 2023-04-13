import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Collapse } from 'react-collapse';
import { toast } from 'react-toastify';
import { Auth } from "aws-amplify";
import { EMAIL_REGEX } from '../../helpers/constants.helper';
import { api } from '../../store/api';
import { signinWithFaceBook, signInWithGoogle } from '../../store';
import { setRefreshInterval } from '../../store/popup/popup.reducer';

import { Input } from '../UI';
import { useNavigate } from 'react-router';

export const SignUp = (({ email }) => {
  const [pending, setPending] = useState({
    google: false,
    facebook: false
  })
  
  // const [signup, { isLoading }] = api.useSignupMutation();
  const [showMore, setShowMore] =useState(false)
  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: {
      email,
      password: '',
      rePassword: '',
    },
  });
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onSubmit = async () => {       
    const { rePassword, ...values } = getValues();
    try {
      console.log(values);
      const user = await Auth.signUp({
        username: values.email,
        password: values.password,
        autoSignIn: { enabled: true },
      });
      const JWT_token = (await Auth.currentSession()).getIdToken().getJwtToken()
      console.log(JWT_token)
      navigate('/welcome')
    } catch (error) {
      toast.error(error.message)
      return error;
    }
   };
  const [ refreshToken ] = api.useRefreshTokenMutation()
  const [ signinGoogle ] = api.useSigninGoogleMutation()
  
  const handleClickSignin = () => {
    navigate('/signin')
  }

  const handleClickGoogleSignin = async () =>
  {
    setPending((pending)=>({...pending, google:true}))
    // const resp = await signInWithGoogle()
    // if(!resp.error){
    //   const {
    //     data:{
    //       JWT_token,
    //       refresh_Token,
    //       success
    //     }
    //   } = await signinGoogle({token: resp.data.token})
      
    //   if(success){
    //     createRefreshTokenInterval({JWT_token, refresh_Token})
    //     navigate('/welcome')
    //   }
    // }else{
    //   toast("Something went wrong")
    //   console.log(resp.data)
    // } 
    const bgPage = chrome.extension.getBackgroundPage();
    console.log(bgPage)
    bgPage.signInWithPopup(); 
    setPending((pending)=>({...pending, google:false}))
  }

  const handleClickFacebookSignin = async () => {
    
  }
  const createRefreshTokenInterval = ( { JWT_token, refresh_Token } )=>{
    const refreshInt = setInterval(async()=>{  
      await refreshToken({ 
        token: JWT_token,
        data:{
          refresh_Token: refresh_Token
        }        
      })
    },[5*1000])   
    dispatch(setRefreshInterval(refreshInt))    
  }

  return (
    <>
      <h3 className="mb-6 text-2xl font-bold text-center text-white uppercase sm:text-4xl sm:leading-14">
        Create an account
      </h3>
      <form
        className="flex flex-col gap-2 space-y-2 sm:space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >        
        <Input
          type="email"
          placeholder="E-mail"
          autoComplete="off"
          {...register('email', { required: true, pattern: EMAIL_REGEX })}
        />
        <Input
          type="password"
          placeholder="Password"
          {...register('password', { required: true, minLength: 6 })}
        />
        <Input
          type="password"
          placeholder="Re-Password"
          {...register('rePassword', {
            required: true,
            deps: ['password'],
            validate(value, values) {
              return value === values.password;
            },
          })}
        />
        <p className="flex justify-center font-semibold text-gray-300 ">
          Already have an account?&nbsp;
          <button
            className="underline text-brand-200"    
            onClick={handleClickSignin}        
          >
            Sign In
          </button>
        </p>
        <input
          type="submit"
          disabled={!formState.isValid}
          value="Sign Up"
          className="w-full py-3 font-semibold transition-all bg-gray-200 rounded-3xl hover:cursor-pointer hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
        />              
      </form>
      <button 
          onClick={()=>setShowMore((v)=>!v)}
          className='text-left text-gray-300'
        >
          More Options
        </button>
        <Collapse isOpened={ showMore }>
          <div className='flex flex-col space-y-1'>
            <button
              onClick={handleClickGoogleSignin}
              disabled={pending.google || pending.facebook}
              className="w-full py-3 font-semibold transition-all bg-gray-200 rounded-3xl hover:scale-105 hover:cursor-pointer disabled:cursor-not-allowed disabled:scale-100 "
            >
              {
                pending.google ? 'Processing...' : 'Sign Un with Google'
              }              
            </button>
            <button
              onClick={handleClickFacebookSignin}
              disabled={pending.google || pending.facebook}
              className="w-full py-3 font-semibold transition-all bg-gray-200 rounded-3xl hover:scale-105 hover:cursor-pointer disabled:cursor-not-allowed disabled:scale-100 "
            >
              {
                pending.facebook ? 'Processing...' : 'Sign in with Facebook'
              }
            </button>
          </div>
        </Collapse>
    </>
  );
});
