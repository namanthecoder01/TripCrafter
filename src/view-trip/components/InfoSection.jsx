import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { toast } from 'sonner'; // Assuming you are using sonner for notifications

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Set default photo URL
    const locationLabel = trip?.userSelection?.location?.label;

    useEffect(() => {
        if (locationLabel) {
            GetPlacePhoto();
        }
    }, [locationLabel]);

    const GetPlacePhoto = async () => {
        try {
            const data = { textQuery: locationLabel };
            const resp = await GetPlaceDetails(data);
            if (resp.data.places.length > 0 && resp.data.places[0].photos) {
                const photoName = resp.data.places[0].photos[3]?.name; // Check if photo exists
                if (photoName) {
                    const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                    setPhotoUrl(PhotoUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching place photo:", error);
            // Optionally, set a fallback photo or show a toast notification here
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: locationLabel || 'My Trip',
                    text: `Check out this trip to ${locationLabel}. ${trip?.userSelection?.noOfDays} Days | Budget: ${trip?.userSelection?.budget} | Travelers: ${trip?.userSelection?.travelers}`,
                    url: window.location.href, // Link to the current page
                });
                toast.success('Trip shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
                toast.error('Failed to share the trip.');
            }
        } else {
            toast('Sharing not supported on this browser');
        }
    };

    return (
        <div className='p-4 md:p-8'>
            <img src={photoUrl} className='h-[240px] md:h-[340px] w-full object-cover rounded-xl' alt={locationLabel || "Location"} />
            
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-5'>
                {/* Trip Information */}
                <div className='my-5 flex flex-col gap-2 w-full'>
                    <h2 className='font-bold text-lg md:text-2xl'>
                        {locationLabel}
                    </h2>
                    <div className='flex flex-wrap gap-2 md:gap-5'>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            🗓️ {trip?.userSelection?.noOfDays} Days
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            💰 {trip?.userSelection?.budget} Budget
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            🥂 Travelers: {trip?.userSelection?.travelers}
                        </h2>
                    </div>
                </div>

                {/* Share Button */}
                <Button className='w-full md:w-auto' onClick={handleShare}>
                    <IoIosSend />
                    <span className='ml-2 hidden md:inline'>Share Trip</span>
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
