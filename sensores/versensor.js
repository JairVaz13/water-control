import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      console.log('Token recuperado:', token);
      return token; // Aquí devuelves el token
    } else {
      console.log('No se encontró ningún token');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const VerSensor = ({ route, navigation }) => {
  const { id } = route.params; // ID del sensor
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Obtener el token y luego proceder con la carga del sensor
    const fetchTokenAndSensorDetails = async () => {
      const token = await getToken();
      if (!token) {
        setError("No se encontró un token válido.");
        setLoading(false);
        return;
      }
      setToken(token);

      setLoading(true);
      setError("");
      try {
        // Obtener detalles del sensor
        const response = await fetch(
          `https://water-efficient-control.onrender.com/sensors/${id}/${token}`
        );
        const sensorData = await response.json();

        if (sensorData.id_recipiente) {
          try {
            // Obtener detalles del contenedor
            const containerResponse = await fetch(
              `https://water-efficient-control.onrender.com/containers/${sensorData.id_recipiente}/${token}`
            );
            const containerDetails = await containerResponse.json();
            setContainer({
              ...sensorData,
              ubicacion: `${containerDetails.tipo || "No disponible"} - ${sensorData.id_recipiente} (${containerDetails.ubicacion || "No disponible"})`,
            });
          } catch (containerError) {
            console.error("Error fetching container details:", containerError);
            setContainer({
              ...sensorData,
              ubicacion: `${sensorData.id_recipiente} - No disponible`,
            });
          }
        } else {
          setContainer({
            ...sensorData,
            ubicacion: "No asignado",
          });
        }
      } catch (sensorError) {
        console.error("Error fetching sensor details:", sensorError);
        setError("Error cargando datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndSensorDetails();
  }, [id]);

  if (error) {
    return (
      <LinearGradient
        colors={['#0f8c8c', '#025959', '#012840']}
        style={styles.container}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <LinearGradient
        colors={['#0f8c8c', '#025959', '#012840']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando datos del sensor...</Text>
      </LinearGradient>
    );
  }

  if (!container) {
    return (
      <LinearGradient
        colors={['#0f8c8c', '#025959', '#012840']}
        style={styles.container}
      >
        <Text style={styles.errorText}>No se encontraron detalles del sensor.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f8c8c', '#025959', '#012840']}
      style={styles.container}
    >
      <Text style={styles.title}>Detalles del Sensor</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{container.tipo}</Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{container.ubicacion}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Estilos para una mejor presentación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#00a8cc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#025959',
    marginBottom: 6,
  },
  value: {
    fontSize: 17,
    color: '#333',
    marginBottom: 18,
    paddingLeft: 8,
  },
  backButton: {
    backgroundColor: '#00a8cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 17,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default VerSensor;
