import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface ProfessionalExportData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profession?: string;
  category?: string;
  city?: string;
  cityName?: string;
  address?: string;
  area?: string;
  postalCode?: string;
  country?: string;
  businessName?: string;
  serviceName?: string;
  duration?: string;
  price?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any;
}

/**
 * Exports professionals to Excel file
 */
export const exportProfessionalsToExcel = async (
  professionals: ProfessionalExportData[]
): Promise<string> => {
  try {
    // Prepare data for Excel
    const excelData = professionals.map((prof) => {
      // Extract street and number from address if possible
      let streetName = '';
      let number = '';
      
      if (prof.address) {
        const addressParts = prof.address.split(',');
        const firstPart = addressParts[0] || '';
        // Try to split street and number
        const streetMatch = firstPart.match(/^(.+?)\s+(\d+)$/);
        if (streetMatch) {
          streetName = streetMatch[1].trim();
          number = streetMatch[2].trim();
        } else {
          streetName = firstPart.trim();
        }
      }
      
      return {
        'Όνομα': prof.name || '',
        'Email': prof.email || '',
        'Τηλέφωνο': prof.phone || '',
        'Επάγγελμα': prof.profession || prof.category || '',
        'Πόλη': prof.cityName || prof.city || '',
        'Περιοχή': prof.area || '',
        'Οδός': streetName,
        'Αριθμός': number,
        'Ταχυδρομικός Κώδικας': prof.postalCode || '',
        'Χώρα': prof.country || 'Ελλάδα',
        'Επιχείρηση': prof.businessName || '',
        'Υπηρεσία': prof.serviceName || (Array.isArray(prof.services) ? prof.services[0] : '') || '',
        'Διάρκεια (λεπτά)': prof.serviceDuration || prof.duration || '60',
        'Τιμή': prof.price ? prof.price.replace('€', '').trim() : '',
        'Περιγραφή': prof.description || '',
        'Αξιολόγηση': prof.rating || 0,
        'Αριθμός Αξιολογήσεων': prof.reviewCount || 0,
        'Γεωγραφικό Πλάτος': prof.coordinates?.latitude || '',
        'Γεωγραφικό Μήκος': prof.coordinates?.longitude || '',
      };
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = [
      { wch: 25 }, // Όνομα
      { wch: 30 }, // Email
      { wch: 15 }, // Τηλέφωνο
      { wch: 20 }, // Επάγγελμα
      { wch: 20 }, // Πόλη
      { wch: 20 }, // Περιοχή
      { wch: 30 }, // Οδός
      { wch: 10 }, // Αριθμός
      { wch: 15 }, // ΤΚ
      { wch: 15 }, // Χώρα
      { wch: 25 }, // Επιχείρηση
      { wch: 20 }, // Υπηρεσία
      { wch: 15 }, // Διάρκεια
      { wch: 15 }, // Τιμή
      { wch: 40 }, // Περιγραφή
      { wch: 12 }, // Αξιολόγηση
      { wch: 18 }, // Αριθμός Αξιολογήσεων
      { wch: 18 }, // Γεωγραφικό Πλάτος
      { wch: 18 }, // Γεωγραφικό Μήκος
    ];
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Επαγγελματίες');
    
    // Generate Excel file as base64
    const excelBase64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    
    // Create file path
    const fileName = `webnetapp_professionals_${new Date().toISOString().split('T')[0]}.xlsx`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    // Write file
    await FileSystem.writeAsStringAsync(fileUri, excelBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return fileUri;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Share Excel file
 */
export const shareExcelFile = async (fileUri: string): Promise<boolean> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Εξαγωγή Επαγγελματιών',
    });
    
    return true;
  } catch (error) {
    console.error('Error sharing file:', error);
    throw error;
  }
};

