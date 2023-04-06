import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Switch from "react-switch";
import { setDisable } from '../../store/popup/popup.reducer'
import { resetToken, resetUser } from '../../store/user/user.reducer'
import { selectToken } from '../../store/user/user.selector'
import { api } from '../../store/api';
import { useMemo } from 'react'
import { selectRefreshInterval, selectDisable } from '../../store/popup/popup.selector'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'

export const Welcome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(selectToken)
  const refresher = useSelector(selectRefreshInterval)
  const checked = useSelector(selectDisable)
  const [ signout ] = api.useSignoutMutation()
  const handleClickSignout = async () => {
    const resp = await signout({
      token:token.JWT_token, 
      data:{
        refresh_Token : token.refresh_Token
      }
    })
    if(resp){
      dispatch(resetUser());
      dispatch(resetToken());
      navigate('/signin')
      clearInterval(refresher);
    }
  }
  const handleChange = () => {
    dispatch(setDisable(!checked));
    localStorage.setItem('disable', !checked)
  }
  useEffect(() =>{
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, { token: token, disable: checked});
      }
    });
  });
  return (
    <div className='flex items-center justify-center min-h-[350px]'>
      <div>
        <p className='flex justify-center items-center mb-6 text-xl font-bold text-center text-white uppercase sm:text-lg sm:leading-14'>
          <span className='mr-2'>Disable?</span>
          <Switch onChange={handleChange} checked={checked}/>
        </p>
        <button
          onClick={handleClickSignout}
          className="flex justify-center w-full font-semibold text-gray-300 underline"
        >
          Sign out
        </button> 
      </div>       
    </div>
  )
}