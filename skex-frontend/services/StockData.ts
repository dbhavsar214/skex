import axios from 'axios';

const API_KEY = 'HANpwneMzBkWenSTSfUF6ZtCzIkgypUj'; // Replace with your Polygon.io API key
const BASE_URL = 'https://api.polygon.io/v3/reference/tickers';

const fetchStockList = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apiKey: API_KEY,
                limit: 50, // Adjust the limit as needed
            },
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching stock list:', error);
    }
};

// Set interval to trigger the API call 5 times per minute (every 12 seconds)
setInterval(fetchStockList, 12000);

// Initial call
fetchStockList();
