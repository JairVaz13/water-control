import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      console.log('Token recuperado:', token);
      return token; // Devuelve el token
    } else {
      console.log('No se encontró ningún token');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const EditarSensor = ({ route, navigation }) => {
  const { id } = route.params; // ID del sensor a editar
  const [sensor, setSensor] = useState(null); // Información del sensor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState(''); // Valor de tipo para el Picker
  const [recipiente, setRecipiente] = useState(''); // Recipiente solo para visualización
  const [token, setToken] = useState(null); // Almacena el token

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await getToken();
      if (!userToken) {
        setError('No se encontró un token válido.');
        setLoading(false);
        return;
      }

      setToken(userToken); // Establecer el token en el estado

      setLoading(true);
      setError('');
      try {
        const sensorResponse = await fetch(
          `https://water-efficient-control.onrender.com/sensors/${id}/${userToken}`
        );
        const sensorData = await sensorResponse.json();
        setSensor(sensorData);

        // Establecer el valor de "tipo" con el tipo del sensor actual
        setTipo(sensorData.tipo);

        if (sensorData.id_recipiente) {
          const recipienteResponse = await fetch(
            `https://water-efficient-control.onrender.com/containers/${sensorData.id_recipiente}/${userToken}`
          );
          const recipienteData = await recipienteResponse.json();
          setRecipiente(`${recipienteData.tipo || "No disponible"} - ${sensorData.id_recipiente} (${recipienteData.ubicacion || "No disponible"})`);
        } else {
          setRecipiente("No asignado");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los datos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Dependiendo del `id` del sensor, se vuelve a cargar la información

  const handleSubmit = () => {
    if (!token) {
      setError('No se encontró un token válido.');
      return;
    }

    setLoading(true);
    setError('');

    const updatedSensor = {
      tipo,
    };

    fetch(
      `https://water-efficient-control.onrender.com/sensors/${id}/${token}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSensor),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setLoading(false);
        navigation.navigate('Sensores'); // Redirigir a la página de sensores
      })
      .catch((error) => {
        console.error('Error updating sensor:', error);
        setError('Error al actualizar el sensor. Intenta nuevamente.');
        setLoading(false);
      });
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

  if (error) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalles del Sensor</Text>
        
        {/* Mostrar los detalles del sensor */}
        {sensor && (
          <>
            <Text style={styles.label}>Tipo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue)} // Actualizar el estado tipo
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un tipo" value="" />
                <Picker.Item label="Sensor de pH" value="Sensor de pH" />
                <Picker.Item label="Sensor de TDS" value="Sensor de TDS" />
              </Picker>
            </View>
          </>
        )}

        {/* Mostrar el recipiente, pero no permitir modificarlo */}
        <Text style={styles.label}>Recipiente:</Text>
        <Text style={styles.detail}>{recipiente}</Text>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
        
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
    paddingHorizontal: width * 0.05,  // 5% del ancho de la pantalla para el padding
  },
  title: {
    fontSize: width * 0.08,  // 8% del ancho de la pantalla
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: height * 0.05, // 5% del alto de la pantalla
  },
  label: {
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
    color: '#ccc',
    marginBottom: height * 0.01,  // 1% del alto de la pantalla
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: height * 0.02,  // 2% del alto de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    marginBottom: height * 0.02, // 2% del alto de la pantalla
    width: '100%',
  },
  picker: {
    color: '#fff',
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
  },
  detail: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: height * 0.02,  // 2% del alto de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    marginBottom: height * 0.02, // 2% del alto de la pantalla
    color: '#fff',
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00a8cc',
    paddingVertical: height * 0.02,  // 2% del alto de la pantalla
    paddingHorizontal: width * 0.1, // 10% del ancho de la pantalla
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.03, // 3% del alto de la pantalla
  },
  saveButtonDisabled: {
    backgroundColor: '#00a8cc80',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: height * 0.03, // 3% del alto de la pantalla
  },
  backButtonText: {
    color: '#00e5ff',
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
    marginTop: 10,
  },
});

export default EditarSensor;
