import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Función para recuperar el token de AsyncStorage
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

const VerDispensador = ({ route, navigation }) => {
  const { id } = route.params; // ID del Dispensador
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchTokenAndDispensadorDetails = async () => {
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
        // Obtener detalles del Dispensador
        const response = await fetch(
          `https://water-efficient-control.onrender.com/dispensadores/${id}?token=${token}`
        );
        const dispensadorData = await response.json();

        if (dispensadorData.id_recipiente) {
          try {
            // Obtener detalles del contenedor
            const containerResponse = await fetch(
              `https://water-efficient-control.onrender.com/containers/${dispensadorData.id_recipiente}/${token}`
            );
            const containerDetails = await containerResponse.json();
            setContainer({
              ...dispensadorData,
              ubicacion: `${containerDetails.tipo || "No disponible"} - ${dispensadorData.id_recipiente} (${containerDetails.ubicacion || "No disponible"})`,
            });
          } catch (containerError) {
            console.error("Error fetching container details:", containerError);
            setContainer({
              ...dispensadorData,
              ubicacion: `${dispensadorData.id_recipiente} - No disponible`,
            });
          }
        } else {
          setContainer({
            ...dispensadorData,
            ubicacion: "No asignado",
          });
        }
      } catch (dispensadorError) {
        console.error("Error fetching dispensador details:", dispensadorError);
        setError("Error cargando datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndDispensadorDetails();
  }, [id]);

  if (error) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loading}>Cargando datos del Dispensador...</Text>
      </LinearGradient>
    );
  }

  if (!container) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <Text style={styles.error}>No se encontraron detalles del Dispensador.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>Detalles del Dispensador</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Dispensador:</Text>
        <Text style={styles.value}>{container.id_dispensador || "No disponible"}</Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>
          {container.estado === "1" ? "Activo" : container.estado === "0" ? "Inactivo" : "No disponible"}
        </Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{container.ubicacion}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Estilos mejorados con la animación y el diseño anterior
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
  error: {
    color: '#ff4d4d',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});

export default VerDispensador;
