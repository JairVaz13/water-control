import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrearDispensador = () => {
  const [tipo, setTipo] = useState('');
  const [contenedores, setContenedores] = useState([]);
  const [contenedorSeleccionado, setContenedorSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = '9f17ab0b-d0be-40d5-b9ca-0844645e38d6'; 

  
  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        const response = await fetch(
          'https://water-efficient-control.onrender.com/containers/9f17ab0b-d0be-40d5-b9ca-0844645e38d6',
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

  const handleSubmit = () => {
    if (!tipo || !contenedorSeleccionado) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const newDispensador = {
      tipo,
      token,
      id_recipienre: parseInt(contenedorSeleccionado, 10), // Cambiar al nombre esperado por el backend
    };
  
    fetch('https://water-efficient-control.onrender.com/dispensadores/crear/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDispensador),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error('Respuesta del servidor:', text); // Debug detallado
            throw new Error('Error en la solicitud al servidor.');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Nuevo Dispensador agregado:', data);
        setTipo('');
        setContenedorSeleccionado('');
        setLoading(false);
        Alert.alert('Éxito', 'Dispensador creado con éxito');
      })
      .catch((error) => {
        console.error('Error al agregar el Dispensador:', error);
        setError(error.message || 'Hubo un error al enviar el formulario.');
        setLoading(false);
      });
  };
  

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Crear Dispensador</Text>

      <View style={styles.container}>
        <Text style={styles.label}>Tipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="Dispensador de pH" value="Dispensador de pH" />
            <Picker.Item label="Dispensador de TDS" value="Dispensador de TDS" />
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
              key={contenedor.id_recipiente} // Clave única usando id_recipiente
              label={`${contenedor.tipo} - ${contenedor.ubicacion}`} // Etiqueta combinada
              value={contenedor.id_recipiente} // Valor seleccionado
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

export default CrearDispensador;
