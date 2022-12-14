import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContextComp';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import Loading from './Loading';

const GoogleSignIn = ({ from }) => {
  const { userSocialLogin, getUserJwt, userLoading, setUserLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    userSocialLogin('google')
      .then(result => {
        const user = {
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
          role: 'buyer',
          verified: 'false',
          uid: result.user.uid
        }

        fetch('https://antique-watches.vercel.app/users/social', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(user)
        })
          .then(res => res.json())
          .then(data => {
            if (data.acknowledged) {
              toast.success('Successfully logged in!!');
              getUserJwt(result.user.email)
                .then(data => {
                  localStorage.setItem('antique-token', data.token);
                  navigate(from, { replace: true });
                })

            }
          })
      })
      .catch(err => {
        toast.error('Something is wrong!!');
        setUserLoading(false);
      })
  }

  if (userLoading) {
    return (
      <Loading></Loading>
    );
  }


  return (
    <>
      <button onClick={handleGoogleSignIn} className='btn btn-primary w-full'>
        <FcGoogle className='inline mr-2'></FcGoogle> Login With Google
      </button>
    </>
  );
};

export default GoogleSignIn;