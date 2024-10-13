import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (trip) {
            GetPlacePhoto();
        }
    }, [trip]);

    const GetPlacePhoto = async () => {
        try {
            const data = {
                textQuery: trip?.userSelection?.location?.label
            };
            const response = await GetPlaceDetails(data);
            if (response.data.places.length > 0 && response.data.places[0].photos.length > 3) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[3].name);
                setPhotoUrl(PhotoUrl);
            } else {
                setPhotoUrl('/placeholder.jpg'); // Default placeholder image if no photo is found
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            setError('Failed to fetch photo'); // Set error state if fetching fails
        } finally {
            setLoading(false); // Always set loading to false after fetching
        }
    };

    return (
        <Link to={'/view-trip/' + trip?.id}>
            <div className='hover:scale-105 transition-all'>
                <div className='relative h-[220px] rounded-xl overflow-hidden'>
                    {loading ? (
                        <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
                    ) : error ? (
                        <div className='absolute inset-0 bg-red-200 flex items-center justify-center'>
                            {error}
                        </div>
                    ) : (
                        <img
                            src={photoUrl ? photoUrl : '/placeholder.jpg'}
                            alt='Trip Photo'
                            className='object-cover w-full h-full'
                        />
                    )}
                </div>
                <div className='mt-3'>
                    <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
                    <p className='text-sm text-gray-500'>
                        {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection.budget} Budget
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default UserTripCardItem;
