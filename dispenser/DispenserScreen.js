import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearDispensador from "./crearDispensador";
import EditarDispensador from "./editarDispensador";
import VerDispensador from "./verDispensador";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obtener el token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const DispensadorItem = ({ id, estado, ubicacion, navigation, handleDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Dispensador: {id || "No disponible"}</Text>
      <Text style={styles.itemText}>
        Estado: {estado === 1 ? "Activo" : estado === 0 ? "Inactivo" : "No disponible"}
      </Text>
      <Text style={styles.itemText}>Ubicación: {ubicacion || "No disponible"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonGreen} onPress={() => navigation.navigate("Ver", { id })}>
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRed} onPress={() => handleDelete(id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DispensadoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDispensadorsWithDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          setError("No se encontró un token válido.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://water-efficient-control.onrender.com/dispensadores?token=${token}`);
        
        if (!response.ok) {
          throw new Error("Error al obtener los dispensadores.");
        }

        const dispensadors = await response.json();
        if (!Array.isArray(dispensadors)) {
          throw new Error("La respuesta no contiene un arreglo de dispensadores.");
        }

        const dispensadorsWithDetails = await Promise.all(
          dispensadors.map(async (dispensador) => {
            if (dispensador.id_recipiente) {
              try {
                const containerResponse = await fetch(
                  `https://water-efficient-control.onrender.com/containers/${dispensador.id_recipiente}/${token}`
                );

                if (!containerResponse.ok) {
                  throw new Error("Error al obtener el contenedor.");
                }

                const containerData = await containerResponse.json();
                return {
                  ...dispensador,
                  ubicacion: `${containerData.tipo || "No disponible"}-${dispensador.id_recipiente} ${containerData.ubicacion || "No disponible"}`,
                };
              } catch (error) {
                return {
                  ...dispensador,
                  ubicacion: `${dispensador.id_recipiente} - No disponible (${dispensador.tipo})`,
                };
              }
            } else {
              return {
                ...dispensador,
                ubicacion: `No asignado (${dispensador.tipo})`,
              };
            }
          })
        );

        setData(dispensadorsWithDetails);
      } catch (err) {
        setError(err.message || "Error cargando datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDispensadorsWithDetails();
  }, []);

  const handleDelete = async (id) => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "No se encontró un token válido.");
      return;
    }

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este dispensador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(
                `https://water-efficient-control.onrender.com/dispensadores/${id}?token=${token}`,
                { method: "DELETE" }
              );

              if (!response.ok) {
                throw new Error("Error eliminando el dispensador.");
              }

              setData((prevData) => prevData.filter((item) => item.id_dispensador !== id));
            } catch (error) {
              Alert.alert("Error", "Hubo un problema al eliminar el dispensador.");
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={["#0f8c8c", "#025959", "#012840"]} style={styles.gradient}>
      <View style={styles.screenContainer}>
        <Text style={styles.header}>Dispensadores</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando dispensadores...</Text>
          </View>
        ) : data.length > 0 ? (
          data.map((item) => (
            <DispensadorItem
              key={item.id_dispensador}
              id={item.id_dispensador}
              estado={parseInt(item.estado, 10)}
              ubicacion={item.ubicacion}
              navigation={navigation}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>No hay dispensadores registrados.</Text>
        )}

        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("Crear")}>
          <Text style={styles.createButtonText}>+ Crear</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const Stack = createStackNavigator();

const Dispensadores = () => {
  return (
    <Stack.Navigator initialRouteName="Dispensadores">
      <Stack.Screen name="Dispensadores" component={DispensadoresScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Crear" component={CrearDispensador} options={{ headerShown: false }} />
      <Stack.Screen name="Editar" component={EditarDispensador} options={{ headerShown: false }} />
      <Stack.Screen name="Ver" component={VerDispensador} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screenContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  itemTitle: {
    fontSize: 20,
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
    marginTop: 15,
    justifyContent: 'space-between',
  },
  buttonGreen: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  buttonRed: {
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 12,
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
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default Dispensadores;
