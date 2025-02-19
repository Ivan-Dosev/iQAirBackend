const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));

let cachedData = null;
let lastFetchTime = null;

const fetchAirQualityData = async () => {
  try {
    const response = await axios.get(
      `http://api.airvisual.com/v2/city?city=Veliko%20Turnovo&state=Veliko%20Tarnovo&country=Bulgaria&key=${process.env.API_KEY}`
    );
    cachedData = response.data;
    lastFetchTime = new Date();
    console.log('Data fetched at:', lastFetchTime);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Don't update cachedData if there's an error, keep the old data
  }
};

// Fetch data every 5 minutes
setInterval(fetchAirQualityData, 300000);
// Initial fetch
fetchAirQualityData();

app.get('/api/air-quality', (req, res) => {
    if (cachedData) {
        res.json(cachedData);
    } else {
        res.status(404).json({ error: 'No data available' });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 