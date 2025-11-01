import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { createProfessional } from '../firebase/firestore';
import { geocodingService } from '../geocoding/geocodingService';
import { getCities } from '../storage/tableManager';
import { useAuthStore } from '../../store/auth/authStore';

export interface ExcelProfessionalRow {
  [key: string]: any;
}

export interface ProfessionalImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

/**
 * Maps Excel column names (case-insensitive, flexible) to professional data fields
 */
const mapExcelColumn = (columnName: string): string | null => {
  const normalized = columnName.toLowerCase().trim();
  
  // Name fields
  if (normalized.includes('όνομα') || normalized.includes('name') || normalized.includes('firstname')) {
    return 'firstName';
  }
  if (normalized.includes('επώνυ') || normalized.includes('surname') || normalized.includes('lastname')) {
    return 'lastName';
  }
  if (normalized.includes('full name') || normalized.includes('ονοματεπώνυ')) {
    return 'fullName';
  }
  
  // Contact fields
  if (normalized.includes('email') || normalized.includes('e-mail')) {
    return 'email';
  }
  if (normalized.includes('τηλέφωνο') || normalized.includes('phone') || normalized.includes('mobile')) {
    return 'phone';
  }
  
  // Profession fields
  if (normalized.includes('επάγγελμα') || normalized.includes('profession') || normalized.includes('category')) {
    return 'profession';
  }
  if (normalized.includes('επιχείρηση') || normalized.includes('business') || normalized.includes('company')) {
    return 'businessName';
  }
  
  // Location fields
  if (normalized.includes('πόλη') || normalized.includes('city')) {
    return 'city';
  }
  if (normalized.includes('περιοχή') || normalized.includes('area') || normalized.includes('region')) {
    return 'area';
  }
  if (normalized.includes('οδός') || normalized.includes('street') || normalized.includes('address')) {
    return 'streetName';
  }
  if (normalized.includes('αριθμός') || normalized.includes('number') || normalized.includes('no')) {
    return 'number';
  }
  if (normalized.includes('ταχυδρομικός') || normalized.includes('postal') || normalized.includes('zip')) {
    return 'postalCode';
  }
  if (normalized.includes('χώρα') || normalized.includes('country')) {
    return 'country';
  }
  
  // Service fields
  if (normalized.includes('υπηρεσία') || normalized.includes('service')) {
    return 'serviceName';
  }
  if (normalized.includes('διάρκεια') || normalized.includes('duration')) {
    return 'duration';
  }
  if (normalized.includes('τιμή') || normalized.includes('price') || normalized.includes('κόστος')) {
    return 'price';
  }
  if (normalized.includes('περιγραφή') || normalized.includes('description') || normalized.includes('about')) {
    return 'description';
  }
  
  return null;
};

/**
 * Converts Excel row to professional data format
 */
const convertRowToProfessional = async (
  row: ExcelProfessionalRow,
  headerMap: Map<string, string>,
  cities: any[]
): Promise<any> => {
  const professionalData: any = {};
  
  // Map all columns
  headerMap.forEach((fieldName, excelColumn) => {
    const value = row[excelColumn];
    if (value !== undefined && value !== null && value !== '') {
      professionalData[fieldName] = String(value).trim();
    }
  });
  
  // Handle fullName -> split to firstName/lastName
  if (professionalData.fullName && !professionalData.firstName) {
    const nameParts = professionalData.fullName.split(/\s+/);
    professionalData.firstName = nameParts[0] || '';
    professionalData.lastName = nameParts.slice(1).join(' ') || '';
    delete professionalData.fullName;
  }
  
  // Ensure required fields
  if (!professionalData.name && professionalData.firstName) {
    professionalData.name = `${professionalData.firstName} ${professionalData.lastName || ''}`.trim();
  }
  
  // Default values
  professionalData.country = professionalData.country || 'Ελλάδα';
  professionalData.duration = professionalData.duration || '60';
  professionalData.price = professionalData.price || '0';
  
  // Find city ID
  const cityName = professionalData.city;
  if (cityName) {
    const city = cities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase() ||
      c.id.toLowerCase() === cityName.toLowerCase().replace(/\s+/g, '_')
    );
    professionalData.city = city?.id || cityName.toLowerCase().replace(/\s+/g, '_');
    professionalData.cityName = cityName;
  }
  
  // Geocode address
  if (professionalData.streetName && professionalData.city) {
    const fullAddress = `${professionalData.streetName} ${professionalData.number || ''}`;
    const cityForGeocode = professionalData.cityName || cityName || professionalData.city;
    const geocodingResult = await geocodingService.geocodeAddress(
      fullAddress,
      professionalData.postalCode || '',
      cityForGeocode,
      professionalData.country
    );
    
    if (geocodingResult.success) {
      professionalData.coordinates = {
        latitude: geocodingResult.latitude,
        longitude: geocodingResult.longitude,
      };
    }
  }
  
  // Build full address
  if (professionalData.streetName) {
    professionalData.address = [
      professionalData.streetName,
      professionalData.number,
      professionalData.postalCode,
      professionalData.city,
      professionalData.country
    ].filter(Boolean).join(', ');
  }
  
  return professionalData;
};

/**
 * Imports professionals from Excel file
 */
export const importProfessionalsFromExcel = async (
  fileUri: string,
  onProgress?: (current: number, total: number) => void
): Promise<ProfessionalImportResult> => {
  const result: ProfessionalImportResult = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
  };
  
  try {
    // Read Excel file
    let workbook: XLSX.WorkBook;
    
    if (fileUri.startsWith('http://') || fileUri.startsWith('https://')) {
      // Remote file - fetch and read as array
      const response = await fetch(fileUri);
      const arrayBuffer = await response.arrayBuffer();
      workbook = XLSX.read(arrayBuffer, { type: 'array' });
    } else {
      // Local file - use Expo FileSystem to read as base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // XLSX can read base64 directly
      workbook = XLSX.read(base64, { type: 'base64' });
    }
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data: ExcelProfessionalRow[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      throw new Error('Το Excel file δεν περιέχει δεδομένα');
    }
    
    // Map headers
    const headers = Object.keys(data[0]);
    const headerMap = new Map<string, string>();
    
    headers.forEach(header => {
      const mappedField = mapExcelColumn(header);
      if (mappedField) {
        headerMap.set(header, mappedField);
      }
    });
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'profession', 'city'];
    const missingFields = requiredFields.filter(field => !Array.from(headerMap.values()).includes(field));
    
    if (missingFields.length > 0 && !headerMap.has('fullName')) {
      throw new Error(`Λείπουν υποχρεωτικά πεδία: ${missingFields.join(', ')}`);
    }
    
    // Get cities for mapping
    const cities = await getCities();
    
    // Get current user for createdBy
    const { user } = useAuthStore.getState();
    
    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      onProgress?.(i + 1, data.length);
      
      try {
        // Convert row to professional data
        const professionalData = await convertRowToProfessional(row, headerMap, cities);
        
        // Validate required data
        if (!professionalData.name && !professionalData.firstName) {
          throw new Error('Λείπει όνομα');
        }
        if (!professionalData.email) {
          throw new Error('Λείπει email');
        }
        if (!professionalData.profession) {
          throw new Error('Λείπει επάγγελμα');
        }
        if (!professionalData.city) {
          throw new Error('Λείπει πόλη');
        }
        
        // Prepare professional data for Firestore
        const professionalName = professionalData.name || 
          (professionalData.firstName ? 
            `${professionalData.firstName} ${professionalData.lastName || ''}`.trim() : 
            professionalData.email?.split('@')[0] || 'Επαγγελματίας');
        
        const professionalDataToSave = {
          name: professionalName,
          profession: professionalData.profession,
          createdBy: user?.id || 'admin',
          category: professionalData.profession.toLowerCase().replace(/\s+/g, '_'),
          city: professionalData.city,
          cityName: professionalData.cityName || professionalData.city,
          rating: 0,
          reviewCount: 0,
          price: professionalData.price ? `€${professionalData.price}` : '€0-0',
          distance: '0 km',
          availability: 'Διαθέσιμος',
          services: professionalData.serviceName ? [professionalData.serviceName] : [],
          serviceDuration: professionalData.duration || '60',
          description: professionalData.description || `Επαγγελματίας ${professionalData.profession}`,
          image: '👨‍💼',
          verified: false,
          responseTime: '2 ώρες',
          completionRate: '0%',
          phone: professionalData.phone || '',
          email: professionalData.email,
          area: professionalData.area || '',
          address: professionalData.address || professionalData.city,
          coordinates: professionalData.coordinates || {
            latitude: 37.9755,
            longitude: 23.7348,
          },
          businessName: professionalData.businessName || '',
        };
        
        // Create professional in Firestore
        await createProfessional(professionalDataToSave);
        result.imported++;
        
      } catch (error: any) {
        result.failed++;
        result.errors.push({
          row: i + 2, // +2 because Excel rows start at 2 (1 is header)
          error: error.message || 'Άγνωστο σφάλμα',
        });
      }
    }
    
    result.success = result.failed === 0;
    
  } catch (error: any) {
    result.success = false;
    result.errors.push({
      row: 0,
      error: error.message || 'Σφάλμα κατά την ανάγνωση του Excel file',
    });
  }
  
  return result;
};

