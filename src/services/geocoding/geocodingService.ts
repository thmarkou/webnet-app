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
        // No mock fallback - return error
        console.error('OpenStreetMap geocoding failed - address not found');
        return {
          latitude: 0,
          longitude: 0,
          formattedAddress: '',
          success: false,
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return {
        latitude: 0,
        longitude: 0,
        formattedAddress: '',
        success: false,
      };
    }
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
