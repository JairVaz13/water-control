import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      console.log('Token recuperado:', token);
      return token;
    } else {
      console.log('No se encontró ningún token');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const VerContenedor = ({ route, navigation }) => {
  const { id } = route.params;
  const [container, setContainer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0)); // Para la animación de desvanecimiento
  const [slideAnim] = useState(new Animated.Value(50)); // Para la animación de deslizamiento

  useEffect(() => {
    const fetchContainerData = async () => {
      setLoading(true);
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
        setContainer(data);
      } catch (error) {
        console.error('Error fetching container data:', error);
        setError('Hubo un error al obtener los datos del contenedor.');
      } finally {
        setLoading(false);
      }
    };

    fetchContainerData();
  }, [id]);

  // Animación para desvanecer
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Animación para deslizar
  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!loading) {
      fadeIn();
      slideIn();
    }
  }, [loading]);

  if (error) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!container) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <Text style={styles.errorText}>Contenedor no encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>Detalles del Contenedor</Text>
      <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{container.tipo}</Text>
        <Text style={styles.label}>Capacidad:</Text>
        <Text style={styles.value}>{container.capacidad} litros</Text>
        <Text style={styles.label}>Ubicación:</Text>
        <Text style={styles.value}>{container.ubicacion}</Text>
      </Animated.View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#00a8cc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#025959',
    marginBottom: 6,
  },
  value: {
    fontSize: 17,
    color: '#333',
    marginBottom: 18,
    paddingLeft: 8,
  },
  backButton: {
    backgroundColor: '#00a8cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 17,
    marginTop: 10,
  },
});

export default VerContenedor;
