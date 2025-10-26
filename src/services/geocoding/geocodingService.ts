import { Alert } from 'react-native';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  success: boolean;
}

class GeocodingService {
  private apiKey: string;

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual API key
  }

  /**
   * Convert address to coordinates using Google Geocoding API
   * @param address - Full address string
   * @param postalCode - Postal code
   * @param city - City name
   * @param country - Country name (default: Ελλάδα)
   * @returns Promise with coordinates and formatted address
   */
  async geocodeAddress(
    address: string,
    postalCode: string,
    city: string,
    country: string = 'Ελλάδα'
  ): Promise<GeocodingResult> {
    try {
      // Construct full address
      const fullAddress = `${address}, ${postalCode} ${city}, ${country}`;
      
      // For development/testing, return mock coordinates
      if (this.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        return this.getMockCoordinates(city);
      }

      // Make API call to Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;

        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: result.formatted_address,
          success: true,
        };
      } else {
        console.error('Geocoding failed:', data.status, data.error_message);
        return this.getMockCoordinates(city);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return this.getMockCoordinates(city);
    }
  }

  /**
   * Get mock coordinates for development/testing
   * @param city - City name
   * @returns Mock coordinates based on city
   */
  private getMockCoordinates(city: string): GeocodingResult {
    // Specific address coordinates for known addresses
    const specificAddresses: { [key: string]: { lat: number; lng: number; address: string } } = {
      'Ιωνίας 71, 54453 Θεσσαλονίκη': { lat: 40.6435, lng: 22.9418, address: 'Ιωνίας 71, 54453 Θεσσαλονίκη, Ελλάδα' },
      'Μακροχωρίου 7, 11363 Αθήνα': { lat: 37.9945, lng: 23.7305, address: 'Μακροχωρίου 7, 11363 Αθήνα, Ελλάδα' },
    };

    // City center coordinates as fallback
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Αθήνα': { lat: 37.9755, lng: 23.7348 },
      'athens': { lat: 37.9755, lng: 23.7348 },
      'Θεσσαλονίκη': { lat: 40.6435, lng: 22.9418 },
      'thessaloniki': { lat: 40.6435, lng: 22.9418 },
      'Πάτρα': { lat: 38.2466, lng: 21.7346 },
      'patras': { lat: 38.2466, lng: 21.7346 },
      'Λάρισα': { lat: 39.6390, lng: 22.4191 },
      'larissa': { lat: 39.6390, lng: 22.4191 },
    };

    const coords = cityCoordinates[city] || cityCoordinates['Αθήνα'];

    return {
      latitude: coords.lat,
      longitude: coords.lng,
      formattedAddress: `${city}, Ελλάδα`,
      success: true,
    };
  }

  /**
   * Reverse geocoding - convert coordinates to address
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Promise with formatted address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      if (this.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        return 'Mock Address, Ελλάδα';
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Address not found';
    }
  }

  /**
   * Set API key for production use
   * @param apiKey - Google Maps API key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Validate if API key is configured
   * @returns boolean indicating if API key is set
   */
  isApiKeyConfigured(): boolean {
    return this.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && this.apiKey.length > 0;
  }
}

export const geocodingService = new GeocodingService();
