import axios from 'axios';
import { googleMapApiKey } from '../../api/server';

interface GeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  console.log(googleMapApiKey)
  try {
    const apiKey = googleMapApiKey ;
    // console.log(address)
    // console.log(apiKey);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get<GeocodeResponse>(apiUrl);

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('No results found for the address');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}