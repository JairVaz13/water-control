import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const VerSensor = ({ route, navigation }) => {
  const { id } = route.params; // ID del sensor
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSensorDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`
        );
        const sensorData = await response.json();

        if (sensorData.id_recipiente) {
          try {
            const containerResponse = await fetch(
              `https://water-efficient-control.onrender.com/containers/${sensorData.id_recipiente}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`
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

    fetchSensorDetails();
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
