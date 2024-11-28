import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrearSensor = () => {
  const [tipo, setTipo] = useState('');
  const [precision, setPrecision] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = '9f17ab0b-d0be-40d5-b9ca-0844645e38d6'; // Example token

  const handleSubmit = () => {
    if (!tipo || !ubicacion || !precision) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    setError('');

    const newSensor = {
      tipo,
      precision,
      ubicacion,
      token, // Include the token in the body
    };

    fetch('https://water-efficient-control.onrender.com/sensors/crear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSensor),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud al servidor.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Nuevo sensor agregado:', data);
        setTipo('');
        setPrecision('');
        setUbicacion('');
        setLoading(false);
        Alert.alert('Éxito', 'Sensor creado con éxito');
      })
      .catch((error) => {
        console.error('Error agregando sensor:', error);
        setError(error.message || 'Hubo un error al enviar el formulario.');
        setLoading(false);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Crear Sensor</Text>

      <View style={styles.container}>
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="Sensor de pH" value="Sensor de pH" />
            <Picker.Item label="Sensor de Nivel" value="Sensor de Nivel" />
            <Picker.Item label="Sensor de Temperatura" value="Sensor de Temperatura" />
          </Picker>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Precisión (%):</Text>
        <TextInput
          style={styles.input}
          value={precision}
          onChangeText={setPrecision}
          placeholder="Precisión del sensor"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Ubicación:</Text>
        <TextInput
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
          placeholder="Ubicación del sensor"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSubmit}
        disabled={loading}
        color="#007BFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#4A5568',
  },
  container: {
    marginBottom: 16,
  },
  error: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default CrearSensor;
