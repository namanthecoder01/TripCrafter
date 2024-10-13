import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer, LoadScript, Marker } from '@react-google-maps/api';

const TripMap = ({ tripDetails }) => {
    const [directions, setDirections] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false); // State to check if map is loaded

    const mapContainerStyle = {
        height: '400px',
        width: '100%',
    };

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting current location:', error);
                }
            );
        }
    }, []);

    useEffect(() => {
        // Calculate the route if current location and destination are available
        if (currentLocation && mapLoaded) {
            calculateRoute();
        }
    }, [currentLocation, mapLoaded]);

    const calculateRoute = () => {
        if (!window.google) {
            console.error("Google Maps is not loaded");
            return; // Prevent further execution if Google Maps isn't loaded
        }

        const directionsService = new window.google.maps.DirectionsService();

        const destination = tripDetails.trip_details.destination; // Extract destination from tripDetails

        const request = {
            origin: currentLocation, // User's current location
            destination: destination, // Destination from trip details
            travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);

                // Calculate total distance and duration
                let totalDistance = 0;
                let totalTime = 0;

                result.routes[0].legs.forEach((leg) => {
                    totalDistance += leg.distance.value; // meters
                    totalTime += leg.duration.value; // seconds
                });

                const distanceInKm = totalDistance / 1000; // Convert meters to kilometers
                setTotalDistance(distanceInKm); // Set total distance

                const timeInMinutes = totalTime / 60; // Convert seconds to minutes
                setTotalTime(timeInMinutes); // Set total time

                // Calculate total cost assuming a fixed rate of 10 Rs per km
                const costPerKm = 10; // Cost in Rs per kilometer
                const calculatedCost = distanceInKm * costPerKm; // Total cost in Rs
                setTotalCost(calculatedCost); // Set total cost in Rs
            } else {
                console.error(`Error fetching directions: ${status}`);
            }
        });
    };

    return (
        <div>
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                onLoad={() => setMapLoaded(true)} // Set mapLoaded to true when the script loads
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={currentLocation || { lat: 0, lng: 0 }} // Center to user's location or default
                    zoom={14}
                >
                    {directions && <DirectionsRenderer directions={directions} />}

                    {/* Standard Marker for current location */}
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            title="You are here"
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom blue marker
                                scaledSize: new window.google.maps.Size(30, 30), // Size of the marker
                            }}
                        />
                    )}

                    {/* Marker for the destination */}
                    {tripDetails && (
                        <Marker
                            position={{
                                lat: parseFloat(tripDetails.trip_details.destination_latitude), // Latitude from tripDetails
                                lng: parseFloat(tripDetails.trip_details.destination_longitude), // Longitude from tripDetails
                            }}
                            title={tripDetails.trip_details.destination}
                        />
                    )}
                </GoogleMap>
            </LoadScript>

            <div className="summary">
                <h3>Total Cost: ₹{totalCost.toFixed(2)}</h3> {/* Display cost in Rs */}
                <h3>Total Distance: {totalDistance.toFixed(2)} km</h3> {/* Formatting distance */}
                <h3>Total Time: {totalTime.toFixed(2)} mins</h3> {/* Formatting time */}
            </div>
        </div>
    );
};

export default TripMap;
