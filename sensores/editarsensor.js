import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditarSensor = ({ route, navigation }) => {
  const { id } = route.params; // Obtiene el ID del sensor a editar
  const [tipo, setTipo] = useState('');
  const [rango, setRango] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener los datos existentes del sensor seleccionado
    fetch(`https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`)
      .then((response) => response.json())
      .then((data) => {
        setTipo(data.tipo);
        setRango(data.rango);
        setUbicacion(data.ubicacion);
      })
      .catch((error) => {
        console.error('Error fetching sensor data:', error);
        setError('Hubo un error al cargar los datos del sensor.');
      });
  }, [id]);

  const handleSubmit = () => {
    setLoading(true);
    setError('');

    const updatedSensor = {
      tipo,
      rango,
      ubicacion,
    };

    // Enviar los datos actualizados del sensor al servidor
    fetch(`https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSensor),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Sensor updated:', data);
        setLoading(false);
        navigation.goBack(); // Volver a la pantalla anterior después de guardar
      })
      .catch((error) => {
        console.error('Error updating sensor:', error);
        setError('Hubo un error al actualizar el sensor.');
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Sensor</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="pH" value="pH" />
            <Picker.Item label="Temperatura" value="Temperatura" />
            <Picker.Item label="Conductividad" value="Conductividad" />
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Rango:</Text>
        <TextInput
          style={styles.input}
          value={rango}
          onChangeText={setRango}
          placeholder="Rango (por ejemplo: 0-14)"
        />
      </View>
      <View style={styles.inputGroup}>
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
      />
      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Definición de estilos
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
    color: '#6c757d',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default EditarSensor;
