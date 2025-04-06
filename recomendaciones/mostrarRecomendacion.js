import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MostrarRecomendacion = ({ route, navigation }) => {
  const { recomendacion } = route.params || {};

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
          <View style={styles.section}>
            <Text style={styles.label}>Tipo de Recipiente</Text>
            <Text style={styles.content}>{recomendacion.tipo_recipiente}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Capacidad del Recipiente</Text>
            <Text style={styles.content}>{recomendacion.capacidad_recipiente} litros</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Recomendación</Text>
            <Text style={styles.content}>{recomendacion.response}</Text>
          </View>

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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  transparentContainer: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 10,
  },
  label: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 15,
    color: '#e0f7fa',
    lineHeight: 22,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#00a8cc',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default MostrarRecomendacion;
