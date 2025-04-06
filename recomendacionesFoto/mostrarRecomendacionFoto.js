import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MostrarRecomendacionFoto = ({ route, navigation }) => {
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

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de Recipiente:</Text>
          <Text style={styles.value}>{recomendacion.tipo_recipiente}</Text>

          <Text style={styles.label}>Capacidad del Recipiente:</Text>
          <Text style={styles.value}>{recomendacion.capacidad_recipiente} litros</Text>
        </View>

        {recomendacion.analisis_sensores && recomendacion.analisis_sensores.map((sensor, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>Tipo de Sensor:</Text>
            <Text style={styles.value}>{sensor.tipo_sensor}</Text>

            <Text style={styles.label}>Datos del Sensor:</Text>
            {sensor.datos_sensor.map((dato, idx) => (
              <Text key={idx} style={styles.subValue}>
                📅 {dato.fecha} | 📈 {dato.valor}
              </Text>
            ))}

            <Text style={styles.label}>Predicciones:</Text>
            {sensor.predicciones.map((prediccion, idx) => (
              <Text key={idx} style={styles.subValue}>
                🔮 {prediccion.fecha} | 📊 {prediccion.valor_predicho.toFixed(2)}
              </Text>
            ))}
          </View>
        ))}

        {recomendacion.analisis_imagen && (
          <View style={styles.card}>
            <Text style={styles.label}>Análisis de la Imagen:</Text>
            <Text style={styles.value}>{recomendacion.analisis_imagen.estado_agua}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#e0f7f7',
    marginBottom: 15,
  },
  subValue: {
    fontSize: 14,
    color: '#d0eeee',
    marginLeft: 10,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#013333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default MostrarRecomendacionFoto;
