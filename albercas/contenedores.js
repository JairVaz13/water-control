import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CrearContenedor from './crearContenedor';
import EditarContenedor from './editarContenedor'; 
import VerContenedor from './verContenedor';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Componente para un elemento de alberca
const AlbercaItem = ({ id, ubicacion, tipo, capacidad, navigation, onDelete }) => {

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este contenedor?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => onDelete(id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Nombre: {tipo + id || "No disponible"}</Text>
      <Text style={styles.itemText}>Ubicación: {ubicacion || "No disponible"}</Text>
      <Text style={styles.itemText}>Tipo: {tipo || "No especificado"}</Text>
      <Text style={styles.itemText}>Capacidad: {capacidad || "No especificada"}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Ver", { id })}>
          <Icon name="visibility" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Editar", { id })}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleDelete(id)}>
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ContenedoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://water-efficient-control.onrender.com/containers/9f17ab0b-d0be-40d5-b9ca-0844645e38d6")
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
    fetch(`https://water-efficient-control.onrender.com/containers/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        console.log('Container deleted');
        setData((prevData) => prevData.filter(item => item.id_recipiente !== id));
      })
      .catch((error) => {
        console.error('Error deleting container:', error);
      });
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.screenContainer}>
        <Text style={styles.header}>Contenedores</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <ScrollView>
            {data.length > 0 ? (
              data.map((item) => (
                <AlbercaItem
                  key={item.id_recipiente}
                  id={item.id_recipiente}
                  ubicacion={item.ubicacion}
                  tipo={item.tipo}
                  capacidad={item.capacidad}
                  navigation={navigation}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay contenedores registrados.</Text>
            )}
          </ScrollView>
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

const AlbercasScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Contenedores">
      <Stack.Screen name="Contenedores" component={ContenedoresScreen} />
      <Stack.Screen name="Crear" component={CrearContenedor} />
      <Stack.Screen name="Editar" component={EditarContenedor} />
      <Stack.Screen name="Ver" component={VerContenedor} />
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
  button: {
    backgroundColor: '#4CAF50', // Default green for buttons
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
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

export default AlbercasScreen;
