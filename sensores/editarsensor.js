import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditarSensor = ({ route, navigation }) => {
  const { id } = route.params; // ID del sensor a editar
  const [sensor, setSensor] = useState(null); // Información del sensor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState('');
  const [rango, setRango] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [recipiente, setRecipiente] = useState(''); // Recipiente solo para visualización

  useEffect(() => {
    // Obtener los detalles del sensor y su recipiente
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Obtener detalles del sensor actual
        const sensorResponse = await fetch(
          `https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`
        );
        const sensorData = await sensorResponse.json();
        setSensor(sensorData);

        // Establecer los valores actuales del sensor en los estados
        setTipo(sensorData.tipo);
        setRango(sensorData.rango);
        setUbicacion(sensorData.ubicacion);

        // Obtener detalles del recipiente del sensor
        if (sensorData.id_recipiente) {
          const recipienteResponse = await fetch(
            `https://water-efficient-control.onrender.com/containers/${sensorData.id_recipiente}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`
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
  }, [id]);

  const handleSubmit = () => {
    setLoading(true);
    setError('');

    const updatedSensor = {
      tipo,
    };

    // Enviar los datos actualizados del sensor al servidor
    fetch(
      `https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`,
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
        navigation.navigate('Sensores' ); // Redirigir a la página de detalles con el ID del sensor
      })
      .catch((error) => {
        console.error('Error updating sensor:', error);
        setError('Error al actualizar el sensor. Intenta nuevamente.');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Regresar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Sensor</Text>
      
      {/* Mostrar los detalles del sensor */}
      {sensor && (
        <>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.pickerSensor}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
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

      <Button
        title={loading ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSubmit}
        disabled={loading}
      />
      <Button title="Regresar" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Estilos para la vista
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
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loading: {
    fontSize: 18,
    color: '#777',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default EditarSensor;
