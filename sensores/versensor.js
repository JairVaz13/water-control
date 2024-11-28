import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const VerContenedor = ({ route, navigation }) => {
  const { id } = route.params; // Obtiene el ID del contenedor a visualizar
  const [container, setContainer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch de los datos del contenedor
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del contenedor');
        }
        return response.json();
      })
      .then((data) => setContainer(data))
      .catch((error) => {
        console.error('Error fetching container data:', error);
        setError('Hubo un problema al obtener los datos del contenedor.');
      });
  }, [id]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Regresar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (!container) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando datos del contenedor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Alberca</Text>
      <Text style={styles.detail}>Tipo: {container.tipo}</Text>
      <Text style={styles.detail}>Capacidad: {container.capacidad} litros</Text>
      <Text style={styles.detail}>Ubicación: {container.ubicacion}</Text>

      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Estilos para una mejor presentación
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    fontSize: 18,
    color: '#777',
  },
});

export default VerContenedor;
