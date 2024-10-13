import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip, onSelectPlace }) {
    let tripData = null;

    // Safe JSON parsing
    if (trip && trip.tripData) {
        try {
            tripData = JSON.parse(trip.tripData);
        } catch (error) {
            console.error("Error parsing trip data:", error);
            tripData = {}; // Default to an empty object in case of parsing error
        }
    }

    return (
        <div>
            <h2 className='font-bold text-xl mt-3'>Places to Visit</h2>
            <div>
                {tripData?.itinerary?.length > 0 ? (
                    tripData.itinerary.map((item, dayIndex) => (
                        <div key={dayIndex}>
                            <h2 className='font-medium text-md my-1'>{`Day ${item.day}`}</h2>
                            <div className='grid xl:grid-cols-2 sm:grid-cols-1 gap-5'>
                                {item.plan?.length > 0 ? (
                                    item.plan.map((place, placeIndex) => (
                                        <div key={placeIndex}>
                                            <h2 className='font-medium text-sm text-orange-600'>
                                                {place?.bestTime || "Best time not specified"}
                                            </h2>
                                            <PlaceCardItem 
                                                place={{
                                                    name: place.placeName, // Corrected property name
                                                    details: place.placeDetails, // Corrected property name
                                                    imageUrl: place.placeImageUrl, // Corrected property name
                                                    latitude: place.geoCoordinates[0], // Latitude from geoCoordinates
                                                    longitude: place.geoCoordinates[1], // Longitude from geoCoordinates
                                                    travel_time: place.timeTravel, // Corrected property name
                                                }} 
                                                onClick={() => onSelectPlace({ 
                                                    name: place.placeName, // Assuming place has a name property
                                                    latitude: place.geoCoordinates[0], // Latitude
                                                    longitude: place.geoCoordinates[1] // Longitude
                                                })} 
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-500'>No activities available for this day.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500'>No itinerary available for this trip.</p>
                )}
            </div>
        </div>
    );
}

export default PlacesToVisit;
