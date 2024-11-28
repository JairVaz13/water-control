import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CrearContenedor from './crearContnedor';
import EditarContenedor from './editarContenedor'; 
import VerContenedor from './verContenedor';

// Componente para un elemento de alberca
const AlbercaItem = ({ id, ubicacion, tipo, capacidad, navigation, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Nombre: {tipo + id || "No disponible"}</Text>
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
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Contenedores</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : data.length > 0 ? (
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
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("Crear")}>
        <Text style={styles.createButtonText}>+ Crear</Text>
      </TouchableOpacity>
    </View>
  );
};

// Configuración de la navegación
const Stack = createStackNavigator();

const AlbercasScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Contenedores">
      <Stack.Screen name="Contenedores" component={ContenedoresScreen}  />
      <Stack.Screen name="Crear" component={CrearContenedor} />
      <Stack.Screen name="Editar" component={EditarContenedor} />
      <Stack.Screen name="Ver" component={VerContenedor} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    padding: 20,
    backgroundColor: '#f3f3f3',  // Fondo claro para el contenedor principal
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7a4eeb',  // Color vino (deep red) para el encabezado
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#ffffff',  // Fondo blanco para cada item
    borderRadius: 10,
    shadowColor: '#000',  // Sombra ligera para destacar el contenedor
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',  // Color oscuro para el título
  },
  itemText: {
    fontSize: 14,
    color: '#666',  // Gris para los textos
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
    backgroundColor: '#7a4eeb',
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
    color: '#888',  // Color gris para texto de carga
  },
  noDataText: {
    fontSize: 16,
    color: '#999',  // Gris claro para mensaje sin datos
  },
});

export default AlbercasScreen;
