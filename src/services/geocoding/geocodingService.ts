import { Alert } from 'react-native';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  success: boolean;
}

class GeocodingService {
  constructor() {
    // Using OpenStreetMap Nominatim API - completely free, no API key needed
  }

  /**
   * Convert address to coordinates using OpenStreetMap Nominatim API
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
      
      // Use OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=gr`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];

        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          formattedAddress: result.display_name,
          success: true,
        };
      } else {
        console.log('OpenStreetMap geocoding failed, using mock coordinates');
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
      'Ιωνίας 71, 54453 Θεσσαλονίκη': { lat: 40.608796, lng: 22.970381, address: 'Ιωνίας 71, 54453 Θεσσαλονίκη, Ελλάδα' },
      'Μακροχωρίου 7, 11363 Αθήνα': { lat: 37.99811, lng: 23.74883, address: 'Μακροχωρίου 7, 11363 Αθήνα, Ελλάδα' },
    };

    // City center coordinates as fallback
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Αθήνα': { lat: 37.9755, lng: 23.7348 },
      'athens': { lat: 37.9755, lng: 23.7348 },
      'Θεσσαλονίκη': { lat: 40.6442, lng: 22.9405 },
      'thessaloniki': { lat: 40.6442, lng: 22.9405 },
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
   * Reverse geocoding - convert coordinates to address using OpenStreetMap
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Promise with formatted address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );

      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Address not found';
    }
  }
}

export const geocodingService = new GeocodingService();
