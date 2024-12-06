import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import CrearContenedor from './crearContnedor';
import EditarContenedor from './editarContenedor';
import VerContenedor from './verContenedor';

const AlbercaItem = ({ id, ubicacion, tipo, capacidad, navigation }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Nombre: {tipo + id || "No disponible"}</Text>
      <Text style={styles.itemText}>Ubicación: {ubicacion || "No disponible"}</Text>
      <Text style={styles.itemText}>Tipo: {tipo || "No especificado"}</Text>
      <Text style={styles.itemText}>Capacidad: {capacidad || "No especificada"}</Text>
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
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ContenedoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://water-efficient-control.onrender.com/containers/58a6bfc2-67f0-4a8c-bd09-d5e0d2300af1")
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

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>Contenedores</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
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
        <Text style={styles.buttonText}>+ Crear</Text>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', // Texto blanco para el título
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ccc', // Texto más claro para indicar que está cargando
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999', // Texto de color gris claro si no hay datos
  },
  itemContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo translúcido para los ítems
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff', // Texto en blanco para el nombre
  },
  itemText: {
    fontSize: 14,
    color: '#ccc', // Texto en gris claro para los detalles
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#00a8cc', // Fondo morado para el botón de crear
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
});

export default App;
