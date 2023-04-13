import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Collapse } from 'react-collapse';
import { Auth } from "aws-amplify";
import { EMAIL_REGEX } from '../../helpers/constants.helper';
import { api } from '../../store/api';
import { Input } from '../UI';
import { setRefreshInterval } from '../../store/popup/popup.reducer';
import { signInWithGoogle } from '../../store';
import './index.css'
import { toast } from 'react-toastify';
import { setToken, setUser } from '../../store/user/user.reducer';
import { selectToken, selectUser } from '../../store/user/user.selector';
import { selectRefreshInterval } from '../../store/popup/popup.selector';



export const SignIn = (() => {
  const [pending, setPending] = useState({
    google: false,
    facebook: false
  })
  const [showMore, setShowMore] =useState(false)

  const dispatch = useDispatch()
  
  const [ signinGoogle ] = api.useSigninGoogleMutation()
  
  const navigate = useNavigate()

  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: {
      email:'',
      password: '',
    },
  }); 
  
  const onSubmit = async () => {
    const {email, password} = getValues();
    try {
      const user = await Auth.signIn(email, password);
      const JWT_token = (await Auth.currentSession()).getIdToken().getJwtToken()
      localStorage.setItem('JWT_token', JWT_token);
      dispatch(setUser(user.attribute));
      dispatch(setToken(JWT_token));
      navigate('/welcome')
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };  
  const handleClickFacebookSignin = async () => {   
  }
  const handleClickGoogleSignin = async () =>
  {
    setPending((pending)=>({...pending, google:true}))
    const resp = await signInWithGoogle()
    if(!resp.error){
      const {
        data:{
          JWT_token,
          refresh_Token,
          success
        }
      } = await signinGoogle({token: resp.data.token})
      
      if(success){
        createRefreshTokenInterval({JWT_token, refresh_Token})
        navigate('/welcome')
      }
    }else{
      toast("Something went wrong")
      console.log(resp.data)
    }  
    setPending((pending)=>({...pending, google:false}))
  }
  const handleClickSignup = () => {
    navigate('/signup')
  }  

  return (
    <>
      <h3 className="mb-6 text-2xl font-bold text-center text-white uppercase sm:text-4xl sm:leading-14">
        Sign in to your account
      </h3>
      <form
        className="flex flex-col gap-2 space-y-2 sm:space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          autoFocus
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
        
        <input
          type="submit"
          disabled={!formState.isValid}
          value="Sign In"
          className="w-full py-3 font-semibold transition-all bg-gray-200 rounded-3xl hover:scale-105 hover:cursor-pointer disabled:cursor-not-allowed disabled:scale-100"
        />
        <div className="flex justify-center gap-10 font-semibold text-gray-300 text-brand-200">
          {/* <button type="button">Forgot Password?</button> */}
          <p className="flex justify-center font-semibold text-gray-300 ">
            Create a new account? &nbsp;
            <button
              className="underline"    
              onClick={handleClickSignup}        
            >
              SignUp
            </button>
          </p>
        </div>
      </form>

      <button 
          onClick={()=>setShowMore((v)=>!v)}
          className='text-left text-gray-300 underline'
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
                pending.google ? 'Processing...' : 'Sign in with Google'
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


