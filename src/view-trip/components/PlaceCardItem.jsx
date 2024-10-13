import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Set a default photo URL

    useEffect(() => {
        if (place) {
            GetPlacePhoto(); // Fetch the photo when the place prop changes
        }
    }, [place]);

    const GetPlacePhoto = async () => {
        try {
            const data = { textQuery: place.name };
            const resp = await GetPlaceDetails(data);

            // Check if the response contains places and the required photo
            if (resp.data.places.length > 0 && resp.data.places[0].photos) {
                const photoName = resp.data.places[0].photos[3]?.name; // Check if the photo exists
                if (photoName) {
                    const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                    setPhotoUrl(PhotoUrl); // Update the photo URL state
                }
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
            // Optionally, you could set a fallback image or show a toast notification here
        }
    };

    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place?.name)} target='_blank' rel="noopener noreferrer">
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
                <img 
                    src={photoUrl} 
                    className='w-[130px] h-[130px] rounded-xl object-cover' 
                    alt={place?.name || "Place"} 
                />
                <div className='mt-5'>
                    <h2 className='font-bold text-lg'>
                        {place?.name}
                    </h2>
                    <p className='text-sm text-gray-400'>
                        {place?.details || "No details available"} {/* Fallback for details */}
                    </p>
                    <h2 className='mt-2'>
                        🕒 {place?.travel_time || "Travel time not specified"} {/* Fallback for travel time */}
                    </h2>
                </div>
            </div>
        </Link>
    );
}

export default PlaceCardItem;
