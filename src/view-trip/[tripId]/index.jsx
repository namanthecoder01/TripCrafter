import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import TripMap from '../components/TripMap';

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (tripId) {
            getTripData();
        }
    }, [tripId]);

    const getTripData = async () => {
        try {
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTrip(docSnap.data());
            } else {
                toast.error('No Trip Found!');
            }
        } catch (error) {
            toast.error('Error fetching trip data!');
            console.error("Error fetching trip data: ", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Render loading state if data is still being fetched
    if (loading) {
        return <div className="text-center">Loading trip details...</div>;
    }

    // Prepare selected places and destination for TripMap
    const selectedPlaces = trip.places || []; // Ensure selected places is always an array
    const tripDetails = {
        trip_details: {
            destination: trip.userSelection?.location?.label || '', // Modify based on your data structure
            destination_latitude: trip.userSelection?.location?.latitude || 0, // Ensure default value if not available
            destination_longitude: trip.userSelection?.location?.longitude || 0 // Ensure default value if not available
        }
    };

    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56 pb-0'>
            {trip ? (
                <>
                    <InfoSection trip={trip} />
                    <TripMap tripDetails={tripDetails} /> {/* Pass trip details to the map */}
                    <Hotels trip={trip} />
                    <PlacesToVisit trip={trip} />
                </>
            ) : (
                <div className="text-center">No trip details available.</div>
            )}
            <Footer />
        </div>
    );
}

export default ViewTrip;
