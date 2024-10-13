import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Set placeholder as default
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hotel) {
            GetPlacePhoto();
        }
    }, [hotel]);

    const GetPlacePhoto = async () => {
        try {
            const data = {
                textQuery: hotel?.name,
            };
            const result = await GetPlaceDetails(data);
            if (result?.data?.places?.[0]?.photos?.[3]?.name) {
                const photoRef = result.data.places[0].photos[3].name;
                const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
                setPhotoUrl(photoUrl);
            } 
        } catch (error) {
            console.error('Error fetching place photo:', error);
            // Fallback to placeholder if there's an error or no photo
            setPhotoUrl('/placeholder.jpg');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Link
                to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.name + hotel?.address}
                target='_blank' className="text-black"
            >
                <div className={`transition-all cursor-pointer ${loading ? 'animate-pulse' : 'hover:scale-105'}`}>
                    <img
                        src={photoUrl}
                        alt={hotel?.name || 'Hotel Image'}
                        className='rounded-xl my-2 h-[180px] w-full object-cover'
                    />
                    <div className='my-2 flex flex-col gap-2'>
                        <h2 className='font-medium'>{hotel?.name}</h2>
                        <h2 className='text-xs text-gray-500'>📍 {hotel?.address}</h2>
                        <h2 className='text-sm'>💰 {hotel?.price || 'Price range not available'}</h2>
                        <h2>⭐ {hotel?.rating || 'No ratings available'}</h2>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default HotelCardItem;