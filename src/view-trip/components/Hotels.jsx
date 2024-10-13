import { Target } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
    // Safely parse trip data and ensure it contains hotels
    const tripData = trip ? JSON.parse(trip.tripData) : null;
    const hotels = tripData?.hotels || [];

    return (
        <div>
            <h2 className='font-bold text-xl mt-5'>
                Hotel Recommendations
            </h2>
            {/* Conditional rendering for hotels list */}
            {hotels.length > 0 ? (
                <div className='grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5'>
                    {hotels.map((hotel, index) => (
                        <HotelCardItem hotel={hotel} key={index} />
                    ))}
                </div>
            ) : (
                <p className='mt-4 text-gray-500'>No hotel recommendations available for this trip.</p>
            )}
        </div>
    );
}

export default Hotels;
