import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const VerContenedor = ({ route, navigation }) => {
  const { id } = route.params; // Get the ID of the container to view
  const [container, setContainer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the container data
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/58a6bfc2-67f0-4a8c-bd09-d5e0d2300af1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching container data.');
        }
        return response.json();
      })
      .then((data) => setContainer(data))
      .catch((error) => {
        console.error('Error fetching container data:', error);
        setError('Hubo un error al obtener los datos del contenedor.');
      });
  }, [id]);

  if (error) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!container) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>Detalles del Contenedor</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{container.tipo}</Text>
        <Text style={styles.label}>Capacidad:</Text>
        <Text style={styles.value}>{container.capacidad} litros</Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{container.ubicacion}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#025959',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#00a8cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default VerContenedor;
