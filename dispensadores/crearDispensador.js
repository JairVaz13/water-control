import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrearContenedor = ({ navigation }) => {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(10);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = '9f17ab0b-d0be-40d5-b9ca-0844645e38d6'; // Example token

  const handleSubmit = () => {
    if (!tipo || !ubicacion) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    setError('');

    const newContainer = {
      tipo,
      capacidad,
      ubicacion,
      token, // Include the token in the body
    };

    fetch('https://water-efficient-control.onrender.com/containers/crear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContainer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud al servidor.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('New container added:', data);
        setTipo('');
        setCapacidad(10);
        setUbicacion('');
        setLoading(false);
        Alert.alert('Éxito', 'Contenedor creado con éxito', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Home screen after creation
              navigation.navigate('Contenedores');
            },
          },
        ]);
      })
      .catch((error) => {
        console.error('Error adding container:', error);
        setError(error.message || 'Hubo un error al enviar el formulario.');
        setLoading(false);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Crear Contenedor</Text>

      <View style={styles.container}>
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

      <View style={styles.container}>
        <Text style={styles.label}>Capacidad en litros:</Text>
        <TextInput
          style={styles.input}
          value={capacidad.toString()}
          onChangeText={(text) => setCapacidad(Number(text))}
          placeholder="Capacidad"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Ubicación:</Text>
        <TextInput
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
          placeholder="Ubicación del contenedor"
        />
      </View>

      {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}

      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#fsf',
    borderRadius: 8,
    padding: 5,
  },
  label: {
    marginBottom: 8,
    color: '#6c757d',
  },
  container: {
    marginBottom: 16,
  },
});

export default CrearContenedor;
