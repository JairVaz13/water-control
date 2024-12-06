import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const EditarContenedor = ({ route, navigation }) => {
  const { id } = route.params; // Get the ID of the container to edit
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(10); // Make sure it's initialized
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the existing data for the selected container
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/58a6bfc2-67f0-4a8c-bd09-d5e0d2300af1`)
      .then((response) => response.json())
      .then((data) => {
        setTipo(data.tipo);
        setCapacidad(data.capacidad || 10); // Set a fallback value if `capacidad` is missing
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
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/58a6bfc2-67f0-4a8c-bd09-d5e0d2300af1`, {
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
        navigation.goBack(); // Go back to the previous screen after saving
      })
      .catch((error) => {
        console.error('Error updating container:', error);
        setError('Hubo un error al actualizar el contenedor.');
        setLoading(false);
      });
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Alberca</Text>
        
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
            value={String(capacidad)} // Ensure capacidad is always a string
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

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00a8cc',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#00a8cc80',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#00e5ff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default EditarContenedor;
