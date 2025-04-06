import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearSensor from "./crearsensor";
import EditarSensor from "./editarsensor";
import VerSensor from "./versensor";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const SensorItem = ({ id, ubicacion, tipo, navigation, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>ID Sensor: {id || "No disponible"}</Text>
      <Text style={styles.itemText}>Ubicación: {ubicacion || "No disponible"}</Text>
      <Text style={styles.itemText}>Tipo: {tipo || "No especificado"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonGreen} onPress={() => navigation.navigate("Ver", { id })}>
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBlue} onPress={() => navigation.navigate("Editar", { id })}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRed} onPress={() => onDelete(id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SensoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorsWithDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          setError("No se encontró un token válido.");
          setLoading(false);
          return;
        }
  
        const response = await fetch(`https://water-efficient-control.onrender.com/sensors/${token}`);
  
        if (!response.ok) {
          throw new Error("Error al obtener los sensores");
        }
  
        const sensors = await response.json();
  
        const sensorsWithDetails = await Promise.all(
          sensors.map(async (sensor) => {
            if (sensor.id_recipiente) {
              try {
                const containerResponse = await fetch(
                  `https://water-efficient-control.onrender.com/containers/${sensor.id_recipiente}/${token}`
                );
  
                if (!containerResponse.ok) {
                  throw new Error("Error al obtener el contenedor");
                }
  
                const containerData = await containerResponse.json();
  
                return {
                  ...sensor,
                  ubicacion: `${containerData.tipo || "No disponible"}-${sensor.id_recipiente} ${containerData.ubicacion || "No disponible"}`,
                };
              } catch (error) {
                return {
                  ...sensor,
                  ubicacion: `${sensor.id_recipiente} - No disponible (${sensor.tipo})`,
                };
              }
            } else {
              return {
                ...sensor,
                ubicacion: `No asignado (${sensor.tipo})`,
              };
            }
          })
        );
  
        setData(sensorsWithDetails);
      } catch (err) {
        setError("Error cargando datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSensorsWithDetails();
  }, []);

  const handleDelete = async (id) => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "No se encontró un token válido.");
      return;
    }
  
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este sensor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(
                `https://water-efficient-control.onrender.com/sensors/${id}/${token}`,
                { method: "DELETE" }
              );
  
              if (!response.ok) {
                throw new Error("Error eliminando el sensor.");
              }
  
              setData((prevData) => prevData.filter((item) => item.id_sensor !== id));
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el sensor.");
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#0f8c8c", "#025959", "#012840"]} style={styles.gradient}>
      <View style={styles.screenContainer}>
        <Text style={styles.header}>Sensores</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : data.length > 0 ? (
          data.map((item) => (
            <SensorItem
              key={item.id_sensor}
              id={item.id_sensor}
              ubicacion={item.ubicacion}
              tipo={item.tipo}
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

const Stack = createStackNavigator();

const Sensores = () => {
  return (
    <Stack.Navigator initialRouteName="Sensores">
      <Stack.Screen name="Sensores" component={SensoresScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Crear" component={CrearSensor} options={{ headerShown: false }}  />
      <Stack.Screen name="Editar" component={EditarSensor} options={{ headerShown: false }} />
      <Stack.Screen name="Ver" component={VerSensor} options={{ headerShown: false }} />
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
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  buttonGreen: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  buttonBlue: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#00a8cc',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonRed: {
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
});

export default Sensores;
