import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

// Axios config for requests
const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.photos,places.displayName,places.id' // Field mask as a string
    }
};

// Function to get place details
export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

// URL for fetching photos
export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=${API_KEY}`;

// Function to get nearby places
export const GetNearbyPlaces = async ({ lat, lng }) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe|adventure|games&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching nearby places:", error);
        throw error; // Re-throw error for further handling if needed
    }
};
