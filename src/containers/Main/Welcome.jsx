import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Switch from "react-switch";
import { setDisable } from '../../store/popup/popup.reducer'
import { resetToken, resetUser } from '../../store/user/user.reducer'
import { selectToken } from '../../store/user/user.selector'
import { Auth } from "aws-amplify";
import { selectDisable } from '../../store/popup/popup.selector'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { AiOutlineSetting } from "react-icons/ai";

export const Welcome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(selectToken)
  const checked = useSelector(selectDisable)
  const handleClickSignout = async () => {
    await Auth.signOut();
    dispatch(resetUser());
    dispatch(resetToken());
    navigate('/signin')
  }
  const handleChange = () => {
    dispatch(setDisable(!checked));
    localStorage.setItem('disable', !checked)
  }
  const handleSetting = () => {
    navigate('/setting');
  }
  useEffect(() =>{
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, { token: token, disable: checked});
      }
    });
  });
  return (
    <>
      <div className='flex justify-end text-2xl text-white cursor-pointer'>
          <span onClick={handleSetting}><AiOutlineSetting /></span>
      </div>
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
    </>
  )
}