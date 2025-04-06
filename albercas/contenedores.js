import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import CrearContenedor from './crearContnedor';
import EditarContenedor from './editarContenedor';
import VerContenedor from './verContenedor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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

const AlbercaItem = ({ id, ubicacion, tipo, capacidad, navigation }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{tipo} {id}</Text>
      <Text style={styles.itemText}>📍 Ubicación: {ubicacion || "No disponible"}</Text>
      <Text style={styles.itemText}>⚙️ Tipo: {tipo || "No especificado"}</Text>
      <Text style={styles.itemText}>🧪 Capacidad: {capacidad || "No especificada"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate("Ver", { id })}
        >
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={() => navigation.navigate("Editar", { id })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ContenedoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContainers = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          console.error("Token no disponible.");
          setLoading(false);
          return;
        }
        const response = await fetch(`https://water-efficient-control.onrender.com/containers/${token}`);
        if (!response.ok) throw new Error("Error al obtener los contenedores.");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, []);

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>📦 Contenedores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00ced1" />
      ) : data.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {data.map((item) => (
            <AlbercaItem
              key={item.id_recipiente}
              id={item.id_recipiente}
              ubicacion={item.ubicacion}
              tipo={item.tipo}
              capacidad={item.capacidad}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>No hay contenedores registrados.</Text>
      )}

      <TouchableOpacity
        style={[styles.actionButton, styles.createButton]}
        onPress={() => navigation.navigate("Crear")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={[styles.buttonText, { marginLeft: 8 }]}>Crear nuevo</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Contenedores" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Contenedores" component={ContenedoresScreen} />
      <Stack.Screen name="Crear" component={CrearContenedor} />
      <Stack.Screen name="Editar" component={EditarContenedor} />
      <Stack.Screen name="Ver" component={VerContenedor} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ccc',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ddd',
  },
  itemContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 15,
    color: '#dcdcdc',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    width: '48%',
    backgroundColor: '#007bff',
  },
  createButton: {
    marginTop: 25,
    alignSelf: 'center',
    backgroundColor: '#00a8cc',
    width: '60%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default App;
