import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditarContenedor = ({ route, navigation }) => {
  const { id } = route.params; // Get the ID of the container to edit
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(10);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the existing data for the selected container
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`)
      .then((response) => response.json())
      .then((data) => {
        setTipo(data.tipo);
        setCapacidad(data.capacidad);
        setUbicacion(data.ubicacion);
      })
      .catch((error) => {
        console.error('Error fetching container data:', error);
        setError('Hubo un error al cargar los datos del contenedor.');
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const updatedContainer = {
      tipo,
      capacidad,
      ubicacion,
    };

    // Submit the updated container to the server
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContainer),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Container updated:', data);
        setLoading(false);
        Alert.alert('Éxito', 'Contenedor actualizado con éxito', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Home screen after creation
              navigation.navigate('Contenedores');
            },
          },
        ]); // Go back to the previous screen after saving
      })
      .catch((error) => {
        console.error('Error updating container:', error);
        setError('Hubo un error al actualizar el contenedor.');
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Contenedor</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="Alberca" value="Alberca" />
            <Picker.Item label="Tinaco" value="Tinaco" />
            <Picker.Item label="Contenedor" value="Contenedor" />
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Capacidad:</Text>
        <TextInput
          style={styles.input}
          value={capacidad.toString()}
          onChangeText={(text) => setCapacidad(Number(text))}
          placeholder="Capacidad"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ubicación:</Text>
        <TextInput
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
          placeholder="Ubicación de la alberca"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSubmit}
        disabled={loading}
      />
      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#64142b',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#64142b',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default EditarContenedor;