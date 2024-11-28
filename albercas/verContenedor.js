import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const VerContenedor = ({ route, navigation }) => {
  const { id } = route.params; // Get the ID of the container to view
  const [container, setContainer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the container data
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`)
      .then((response) => response.json())
      .then((data) => setContainer(data))
      .catch((error) => {
        console.error('Error fetching container data:', error);
        setError('There was an error fetching the container data.');
      });
  }, [id]);

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  if (!container) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Detalles de Contenedor</Text>
      <Text>Tipo: {container.tipo}</Text>
      <Text>Capacidad: {container.capacidad}</Text>
      <Text>Ubicación: {container.ubicacion}</Text>

      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default VerContenedor;
