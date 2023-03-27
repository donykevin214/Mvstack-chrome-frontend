import { signInWithCredential, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup  } from 'firebase/auth';
import { firebaseAuth } from '../helpers/constants.helper';

const makeResponse = ({ error, data }) => (
  {
    error,
    data
  }
)

export const signInWithGoogle = () =>
  {    
    return new Promise( resolve => {
      console.log('res')
      chrome.identity.getAuthToken({ interactive: true }, token =>
        {
          if ( chrome.runtime.lastError || ! token ) {        
            resolve (makeResponse({ error: true, data: `SSO ended with an error: ${JSON.stringify(chrome.runtime.lastError)}`}))
          }
          signInWithCredential(firebaseAuth, GoogleAuthProvider.credential(null, token))
          .then(res =>
          {
            console.log('res',res)
            resolve (makeResponse({ error:false, data: { token: res.user.accessToken }}))
          })
          .catch(err =>
          {
            resolve (makeResponse({ error:true, data:`SSO ended with an error: ${err}`}))
          })
        })
    })
   
}

export const signinWithFaceBook = () => {
  var clientId = '739873557308883';
  var clientSecret = 'b330b2199284b92626475107d7858962';
  var redirectUri = encodeURIComponent(chrome.identity.getRedirectURL("MVP_Extension"));
  var url = 'https://www.facebook.com/dialog/oauth?client_id=' + clientId +
        '&reponse_type=token&access_type=online&display=popup' +
        '&scope=email' +
        '&redirect_uri=' + redirectUri;
        
  return new Promise( resolve => {
    resolve ("success")  
   
  })
}