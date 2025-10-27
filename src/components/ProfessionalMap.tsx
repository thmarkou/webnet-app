import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface ProfessionalMapProps {
  professional: {
    id: string;
    name: string;
    profession: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function ProfessionalMap({ professional }: ProfessionalMapProps) {
  const { name, profession, address, coordinates } = professional;

  const handleGetDirections = () => {
    // Use coordinates for consistent behavior across all locations
    const url = Platform.OS === 'ios'
      ? `http://maps.apple.com/?ll=${coordinates.latitude},${coordinates.longitude}&q=${coordinates.latitude},${coordinates.longitude}`
      : `https://maps.google.com/maps?daddr=${coordinates.latitude},${coordinates.longitude}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Σφάλμα', 'Δεν μπορεί να ανοίξει το Χάρτες');
        }
      })
      .catch((err) => {
        Alert.alert('Σφάλμα', 'Παρουσιάστηκε σφάλμα κατά το άνοιγμα του Χαρτών');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 Τοποθεσία</Text>
      </View>
      
      <Text style={styles.address}>{address}</Text>
      
      {/* Native Apple Maps on iOS */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          <Marker
            coordinate={coordinates}
            title={name}
            description={`${profession} - ${address}`}
          />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  directionsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  mapInstructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  androidPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  androidPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  androidPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
