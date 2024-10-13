import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FcGoogle } from "react-icons/fc";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => {
      console.error(error);
      setError('Failed to log in. Please try again.');
    }
  });

  const GetUserProfile = async (tokenInfo) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
        }
      });
      console.log(response);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setOpenDialog(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="shadow-sm flex justify-between items-center pr-5">
      <img src="/logo.svg" alt="Logo" className="h-20" />
      <div className="flex items-center">
        {user ? (
          <div className='flex items-center gap-3'>
            {/* Hide these buttons on small screens */}
            <a href='/create-trip' className='hidden md:inline'>
              <Button variant='outline' className='rounded-full'>
                + Create Trip
              </Button>
            </a>
            <a href='/my-trips' className='hidden md:inline'>
              <Button variant='outline' className='rounded-full'>
                My Trips
              </Button>
            </a>
            
            <Popover>
              <PopoverTrigger>
                <img 
                  src={user?.picture} 
                  alt="User Profile" 
                  className='h-[35px] w-[35px] rounded-full md:h-[40px] md:w-[40px] lg:h-[45px] lg:w-[45px]'
                />
              </PopoverTrigger>
              <PopoverContent className='bg-white'>
                {/* Add My Trips and Create Trip inside the login menu for small screens */}
                <div className='flex flex-col gap-2'>
                  <a href='/create-trip' className='md:hidden'>
                    <Button variant='outline' className='w-full'>
                      + Create Trip
                    </Button>
                  </a>
                  <a href='/my-trips' className='md:hidden'>
                    <Button variant='outline' className='w-full'>
                      My Trips
                    </Button>
                  </a>
                  <h2 className='cursor-pointer' onClick={handleLogout}>Logout</h2>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src='/logo.svg' alt="Logo" className='h-10' />
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign In to the App with Google Authentication securely</p>
              {error && <p className='text-red-500'>{error}</p>}
              <Button 
                onClick={login} 
                className='w-full mt-5 flex gap-4 items-center'
                disabled={loading}
              >
                {loading ? 'Signing In...' : <FcGoogle className='h-7 w-7' />} 
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
