import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/');
      return;
    }
    
    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
      const querySnapshot = await getDocs(q);
      const trips = [];
      
      querySnapshot.forEach((doc) => {
        trips.push(doc.data());
      });
      
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  return (
    <div className='px-4 sm:px-5 md:px-10 lg:px-20 xl:px-24 mt-10'>
      <h2 className='font-bold text-2xl sm:text-3xl'>My Trips</h2>
      <div className='grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className='h-[220px] sm:h-[180px] bg-slate-200 animate-pulse rounded-xl'></div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTrips;
