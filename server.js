import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/nearby-places', async (req, res) => {
    const { location } = req.query;

    try {
        const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY; // Update with your actual environment variable
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=cafe|adventure|games&key=${apiKey}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching nearby places:', error.message);
        res.status(500).json({ error: 'Failed to fetch nearby places' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
