import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CrearSensor from './crearsensor';
import EditarSensor from './editarsensor'; 
import VerSensor from './versensor';
import { LinearGradient } from 'expo-linear-gradient';

const SensorItem = ({ id, ubicacion, tipo, capacidad, navigation, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>ID Sensor: {id || "No disponible"}</Text>
      <Text style={styles.itemText}>Ubicación: {ubicacion || "No disponible"}</Text>
      <Text style={styles.itemText}>Tipo: {tipo || "No especificado"}</Text>
      <Text style={styles.itemText}>Capacidad: {capacidad || "No especificada"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonGreen} onPress={() => navigation.navigate("Ver", { id })}>
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBlue} onPress={() => navigation.navigate("Editar", { id })}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SensoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://water-efficient-control.onrender.com/sensors/9f17ab0b-d0be-40d5-b9ca-0844645e38d6")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`https://water-efficient-control.onrender.com/sensors/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        console.log('Sensor eliminado');
        setData((prevData) => prevData.filter(item => item.id_sensor !== id));
      })
      .catch((error) => {
        console.error('Error eliminando el sensor:', error);
      });
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.screenContainer}>
        <Text style={styles.header}>Sensores</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : data.length > 0 ? (
          data.map((item) => (
            <SensorItem
              key={item.id_sensor}
              id={item.id_sensor}
              ubicacion={item.ubicacion}
              tipo={item.tipo}
              capacidad={item.capacidad}
              navigation={navigation}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No hay sensores registrados.</Text>
        )}
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("Crear")}>
          <Text style={styles.createButtonText}>+ Crear</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Configuración de la navegación
const Stack = createStackNavigator();

const Sensores = () => {
  return (
    <Stack.Navigator initialRouteName="Sensores">
      <Stack.Screen name="Sensores" component={SensoresScreen}/>
      <Stack.Screen name="Crear" component={CrearSensor} />
      <Stack.Screen name="Editar" component={EditarSensor} />
      <Stack.Screen name="Ver" component={VerSensor} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screenContainer: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  buttonGreen: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  buttonBlue: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#00a8cc',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
});

export default Sensores  ;
