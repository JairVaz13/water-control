import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de tener instalado expo-linear-gradient
import * as Animatable from 'react-native-animatable'; // Importa react-native-animatable

// Obtener dimensiones de la pantalla
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

const CrearSensor = ({ navigation }) => {
  const [tipo, setTipo] = useState('');
  const [contenedores, setContenedores] = useState([]);
  const [contenedorSeleccionado, setContenedorSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('No se encontró un token válido.');
        }

        const response = await fetch(
          `https://water-efficient-control.onrender.com/containers/${token}`
        );
        if (!response.ok) {
          throw new Error('Error al obtener la lista de contenedores.');
        }
        const data = await response.json();
        setContenedores(data || []); // Asume que la API devuelve un array de contenedores
      } catch (error) {
        console.error('Error al obtener los contenedores:', error);
        setError('No se pudieron cargar los contenedores.');
      }
    };

    fetchContenedores();
  }, []);

  const handleSubmit = async () => {
    if (!tipo || !contenedorSeleccionado) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se encontró un token válido.');
      }

      const newSensor = {
        tipo,
        token,
        id_recipiente: parseInt(contenedorSeleccionado, 10), // Cambiar al nombre esperado por el backend
      };

      const response = await fetch(
        'https://water-efficient-control.onrender.com/sensors/crear/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSensor),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error del servidor:', errorMessage);
        throw new Error('Error en la solicitud al servidor.');
      }

      const data = await response.json();
      console.log('Nuevo sensor agregado:', data);
      setTipo('');
      setContenedorSeleccionado('');
      Alert.alert('Éxito', 'Sensor creado con éxito', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Sensores'), // Navegar a la pantalla de sensores
        },
      ]);
    } catch (error) {
      console.error('Error al agregar el sensor:', error);
      setError(error.message || 'Hubo un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f8c8c', '#025959', '#012840']}
      style={styles.mainContainer}
    >
      <Animatable.Text
        style={styles.title}
        animation="fadeInDown"
        duration={1500}
      >
        Crear Sensor
      </Animatable.Text>

      <Animatable.View
        animation="fadeInUp"
        duration={1500}
        delay={500}
        style={styles.container}
      >
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="Sensor de pH" value="Sensor de pH" />
            <Picker.Item label="Sensor de TDS" value="Sensor de TDS" />
          </Picker>
        </View>
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        duration={1500}
        delay={800}
        style={styles.container}
      >
        <Text style={styles.label}>Contenedor:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={contenedorSeleccionado}
            onValueChange={(itemValue) => setContenedorSeleccionado(itemValue)}
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
      </Animatable.View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Animatable.View
        animation="bounceIn"
        duration={1500}
        style={styles.buttonContainer}
      >
        <Button
          title={loading ? 'Guardando...' : 'Guardar Cambios'}
          onPress={handleSubmit}
          disabled={loading}
          color="#00a8cc"
        />
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: width * 0.05,  // 5% del ancho de la pantalla
  },
  title: {
    fontSize: width * 0.08,  // 8% del ancho de la pantalla
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.05, // 5% del alto de la pantalla
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: height * 0.02,  // 2% del alto de la pantalla
    paddingHorizontal: width * 0.04, // 4% del ancho de la pantalla
    marginBottom: height * 0.02, // 2% del alto de la pantalla
    width: '100%',
  },
  label: {
    marginBottom: height * 0.01,  // 1% del alto de la pantalla
    fontSize: width * 0.05,  // 5% del ancho de la pantalla
    color: '#fff',
  },
  container: {
    marginBottom: height * 0.03,  // 3% del alto de la pantalla
  },
  error: {
    color: '#E53E3E',
    fontSize: width * 0.04,  // 4% del ancho de la pantalla
    marginBottom: height * 0.02,  // 2% del alto de la pantalla
  },
  buttonContainer: {
    marginTop: height * 0.05, // Añadido para separar el botón del resto de los componentes
  },
});

export default CrearSensor;
