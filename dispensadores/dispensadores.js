import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CrearDispensador from "./crearDispensador";
import EditarDispensador from "./editarDispensador";
import VerDispensador from "./verDispensador";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

// Componente para mostrar un dispensador individual
const DispensadorItem = ({ id, estado, idRecipiente, navigation, onDelete }) => {
  const handleDelete = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este Dispensador?",
      [
        { text: "Cancelar", style: "cancel" },
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
      <Text style={styles.itemText}>ID Recipiente: {idRecipiente}</Text>
      <Text style={styles.itemText}>Estado: {estado === "0" ? "Inactivo" : "Activo"}</Text>
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

// Pantalla principal de dispensadores
const DispensadoresScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://water-efficient-control.onrender.com/dispensadores/9f17ab0b-d0be-40d5-b9ca-0844645e38d6")
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
    fetch(`https://water-efficient-control.onrender.com/dispensadores/${id}/9f17ab0b-d0be-40d5-b9ca-0844645e38d6`, {
      method: "DELETE",
    })
      .then(() => {
        console.log("Dispensador eliminado");
        setData((prevData) => prevData.filter((item) => item.id_dispensador !== id));
      })
      .catch((error) => {
        console.error("Error eliminando dispensador:", error);
      });
  };

  return (
    <LinearGradient colors={["#0f8c8c", "#025959", "#012840"]} style={styles.gradient}>
      <View style={styles.screenContainer}>
        <Text style={styles.header}>Dispensadores</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <ScrollView>
            {data.length > 0 ? (
              data.map((item) => (
                <DispensadorItem
                  key={item.id_dispensador}
                  id={item.id_dispensador}
                  estado={item.estado}
                  idRecipiente={item.id_recipiente}
                  navigation={navigation}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay Dispensadores registrados.</Text>
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

// Configuración de la navegación con React Navigation
const Stack = createStackNavigator();

const Dispensadores = () => {
  return (
    <Stack.Navigator initialRouteName="Dispensadores">
      <Stack.Screen name="Dispensadores" component={DispensadoresScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Crear" component={CrearDispensador} />
      <Stack.Screen name="Editar" component={EditarDispensador} />
      <Stack.Screen name="Ver" component={VerDispensador} />
    </Stack.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screenContainer: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  itemContainer: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  createButton: {
    backgroundColor: "#00a8cc",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: "#ccc",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
});

export default Dispensadores;
