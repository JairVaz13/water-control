import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MostrarRecomendacion = ({ route, navigation }) => {
  const { recomendacion } = route.params || {}; // Manejo de valores undefined

  // Validar si no hay recomendación
  if (!recomendacion) {
    return (
      <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>No se encontró una recomendación.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Recomendación Obtenida</Text>
        <View style={styles.transparentContainer}>
          <Text style={styles.label}>Tipo de Recipiente:</Text>
          <Text style={styles.content}>{recomendacion.tipo_recipiente}</Text>

          <Text style={styles.label}>Capacidad del Recipiente:</Text>
          <Text style={styles.content}>{recomendacion.capacidad_recipiente} litros</Text>

          <Text style={styles.label}>Recomendación:</Text>
          <Text style={styles.content}>{recomendacion.response}</Text>

          
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  sensorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  sensorLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#025959',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MostrarRecomendacion;
