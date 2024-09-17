import axios from 'axios';
import Polyline from '@mapbox/polyline';

export interface Directions {
  points: { latitude: number; longitude: number }[];
  distance: string;
  duration: string;
}

export const getDirections = async (
  origin: string,
  destination: string
): Promise<Directions> => {
  const options = {
    method: 'GET',
    url: 'https://google-map-places.p.rapidapi.com/maps/api/directions/json',
    params: {
      origin: origin,
      destination: destination,
      mode: 'driving',
      language: 'en',
      units: 'metric'
    },
    headers: {
      'x-rapidapi-key': 'b51e935077msh79a3c686df2175fp132a84jsn92adc2597c23',
      'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.status !== 'OK') {
      throw new Error(`API returned status: ${response.data.status}`);
    }

    if (response.data.routes.length === 0) {
      throw new Error('No routes found in the API response');
    }

    const route = response.data.routes[0];
<<<<<<< HEAD
    const points = Polyline.decode(route.overview_polyline.points).map(([latitude, longitude]) => ({ latitude, longitude }));
    const distance = route.legs[0].distance.text;
    const duration = route.legs[0].duration.text;

    console.log('Directions fetched:', { points, distance, duration });
    return { points, distance, duration };
=======
    const points = Polyline.decode(route.overview_polyline.points).map(
      (point: [number, number]) => ({
        latitude: point[0],
        longitude: point[1],
      })
    );

    return {
      points: points,
      distance: route.legs[0].distance.text,
      duration: route.legs[0].duration.text
    };
>>>>>>> 75ad49a051d961d3304c1554ac4c3782b7e7e4f1
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export const getGeocoding = async (address: string): Promise<GeocodingResult> => {
  const options = {
    method: 'GET',
    url: 'https://google-map-places.p.rapidapi.com/maps/api/geocode/json',
    params: {
      address: address,
      language: 'en',
      region: 'en'
    },
    headers: {
      'x-rapidapi-key': 'b51e935077msh79a3c686df2175fp132a84jsn92adc2597c23',
      'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.status !== 'OK') {
      throw new Error(`API returned status: ${response.data.status}`);
    }

    if (response.data.results.length === 0) {
      throw new Error('No results found');
    }

    const result = response.data.results[0];
<<<<<<< HEAD
    console.log('Geocoding fetched:', result);
=======
>>>>>>> 75ad49a051d961d3304c1554ac4c3782b7e7e4f1
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address
    };
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    throw error;
  }
};
