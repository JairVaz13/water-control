import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Regresar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando datos del sensor...</Text>
      </View>
    );
  }

  if (!container) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se encontraron detalles del sensor.</Text>
        <Button title="Regresar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Sensor</Text>
      <Text style={styles.detail}>Tipo: {container.tipo}</Text>
      <Text style={styles.detail}>Ubicación: {container.ubicacion}</Text>
      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Estilos para una mejor presentación
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  error: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    fontSize: 18,
    color: "#777",
  },
});

export default VerSensor;
