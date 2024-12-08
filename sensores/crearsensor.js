import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            <Picker.Item label="Sensor de TDS" value="Sensor de TDS" />
          </Picker>
        </View>
      </View>

      <View style={styles.container}>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
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
