import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';

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

const EditarContenedor = ({ route, navigation }) => {
  const { id } = route.params; // ID del contenedor a editar
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(10); // Valor inicial
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContainerData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Token no disponible. Por favor, inicia sesión.');
        }

        const response = await fetch(
          `https://water-efficient-control.onrender.com/containers/${id}/${token}`
        );

        if (!response.ok) {
          throw new Error('Error al obtener los datos del contenedor.');
        }

        const data = await response.json();
        setTipo(data.tipo);
        setCapacidad(data.capacidad || 10); // Valor predeterminado
        setUbicacion(data.ubicacion);
      } catch (error) {
        console.error(error);
        setError('Hubo un error al cargar los datos del contenedor.');
      } finally {
        setLoading(false);
      }
    };

    fetchContainerData();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    if (!tipo || !ubicacion || capacidad <= 0) {
      setError('Por favor, completa todos los campos correctamente.');
      setSubmitting(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión.');
      }

      const updatedContainer = {
        tipo,
        capacidad,
        ubicacion,
      };

      const response = await fetch(
        `https://water-efficient-control.onrender.com/containers/${id}/${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedContainer),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el contenedor.');
      }

      const data = await response.json();
      console.log('Contenedor actualizado:', data);
      Alert.alert('Éxito', 'Contenedor actualizado con éxito', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to Home screen after creation
            navigation.navigate('Contenedores');
          },
        },
      ]); // Regresar a la pantalla anterior
    } catch (error) {
      console.error(error);
      setError('Hubo un error al actualizar el contenedor.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
        <View style={styles.container}>
          <Animated.View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Contenedor</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
              style={styles.picker}
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
            value={String(capacidad)}
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
            placeholder="Ubicación"
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Animated.View style={submitting ? styles.disabledButton : styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  picker: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  saveButtonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#00a8cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonDisabled: {
    backgroundColor: '#00a8cc80',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#00e5ff',
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transform: [{ translateY: 50 }],
    animation: 'fadeInUp',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
});

export default EditarContenedor;
