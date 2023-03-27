import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurPosition } from '../../store/popup/popup.reducer'
import { resetToken, resetUser } from '../../store/user/user.reducer'
import { selectToken } from '../../store/user/user.selector'
import { api } from '../../store/api';
import { useMemo } from 'react'
import { selectRefreshInterval } from '../../store/popup/popup.selector'
import { useNavigate } from 'react-router'

export const Welcome = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(selectToken)
  const refresher = useSelector(selectRefreshInterval)
  const [ signout, { isLoading } ] = api.useSignoutMutation()
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

  return (
    <div className='flex items-center justify-center min-h-[350px]'>
      <div>
        <p className='mb-6 text-2xl font-bold text-center text-white uppercase sm:text-4xl sm:leading-14'>
          You are logged in screen !
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