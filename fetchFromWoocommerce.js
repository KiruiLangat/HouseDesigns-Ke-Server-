import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();


const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

const fetchFromWooCommerce = async (endpoint, params = {}) => {
    const url = new URL(`https://housedesigns.co.ke/CMS/wp-json/wc/v3/${endpoint}`);
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'));

    params.fields = 'id,name,slug,price,images,attributes, options,short_description,description,categories, variations, thumbnails';

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
        }
        console.log(response);
        return await response.json();
        
        
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default fetchFromWooCommerce;