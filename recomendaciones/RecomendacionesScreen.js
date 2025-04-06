import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token || null;
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const RecomendacionesScreen = ({ navigation }) => {
  const [contenedores, setContenedores] = useState([]);
  const [contenedorSeleccionado, setContenedorSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const BASE_URL = 'https://water-efficient-control.onrender.com/';

  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No se encontró un token válido.');
        const response = await fetch(`${BASE_URL}containers/${token}`);
        if (!response.ok) throw new Error('Error al obtener la lista de contenedores.');
        const data = await response.json();
        setContenedores(data || []);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error al obtener los contenedores:', error);
        setError('No se pudieron cargar los contenedores.');
      }
    };

    fetchContenedores();
  }, []);

  const handleSubmit = async () => {
    if (!contenedorSeleccionado) {
      setError('Por favor selecciona un contenedor.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró un token válido.');
      const response = await fetch(`${BASE_URL}ia/recommendations?id_recipiente=${contenedorSeleccionado}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor.');
      }

      const data = await response.json();

      Alert.alert('Éxito', 'Recomendación obtenida con éxito.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MostrarRecomendacion', { recomendacion: data }),
        },
      ]);
    } catch (error) {
      console.error('Error al obtener la recomendación:', error);
      setError(error.message || 'Hubo un error al obtener la recomendación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Crear Recomendación</Text>

        <View style={styles.transparentContainer}>
          <Text style={styles.label}>Selecciona un contenedor:</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={contenedorSeleccionado}
              onValueChange={(itemValue) => setContenedorSeleccionado(itemValue)}
              dropdownIconColor="#025959"
            >
              <Picker.Item label="Selecciona un contenedor" value="" />
              {contenedores.map((contenedor) => (
                <Picker.Item
                  key={contenedor.id_recipiente}
                  label={`${contenedor.tipo || 'Tipo desconocido'} - ${contenedor.id_recipiente || 'ID desconocido'}`}
                  value={contenedor.id_recipiente}
                />
              ))}
            </Picker>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Ionicons name="water-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Obtener Recomendación</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00a8cc',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#00a8cc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RecomendacionesScreen;
