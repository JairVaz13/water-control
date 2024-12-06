import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient"; // Importa LinearGradient
import * as Animatable from 'react-native-animatable'; // Importar la librería de animaciones

const HomeScreen = ({ navigation }) => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [0.2, 0.45, 0.28, 0.8, 0.90, 0.43],
  };

  return (
    <LinearGradient
      colors={["#0f8c8c", "#025959", "#012840"]} // Degradado con los colores que has solicitado
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        
        <Text style={styles.title}>GestiónB</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/30" }}
          style={styles.logo}
        />
      </View>

      {/* ProgressChart */}
      <View style={styles.chartContainer}>
        <ProgressChart
          data={data}
          width={350}  // Ajustamos el ancho para adaptarse mejor al diseño
          height={250}  // Ajustamos la altura para un mejor ajuste
          strokeWidth={10}
          radius={32}
          chartConfig={{
            backgroundColor: "#0f8c8c", // Fondo del gráfico ajustado al degradado
            backgroundGradientFrom: "#025959",
            backgroundGradientTo: "#012840",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#0f8c8c",
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* Buttons con animación */}
      <View style={styles.buttonsContainer}>
        {/* Botón Albercas */}
        <Animatable.View
          animation="slideInUp"
          duration={1200}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Albercas")}
          >
            <Text style={styles.buttonText}>Albercas</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Botón Sensors */}
        <Animatable.View
          animation="slideInUp"
          duration={1200}
          delay={200}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Sensors")}
          >
            <Text style={styles.buttonText}>Sensores</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Botón Reports */}
        <Animatable.View
          animation="slideInUp"
          duration={1200}
          delay={400}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Reports")}
          >
            <Text style={styles.buttonText}>Reportes</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Botón History */}
        <Animatable.View
          animation="slideInUp"
          duration={1200}
          delay={600}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.buttonText}>Historial</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Botón Dispenser */}
        <Animatable.View
          animation="slideInUp"
          duration={1200}
          delay={800}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Dispenser")}
          >
            <Text style={styles.buttonText}>Dispensador</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("Camera")}
      >
        <MaterialIcons name="camera-alt" size={24} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  chartContainer: {
    marginBottom: 30,  
    alignItems: "center",
    marginTop: 20, 
  },
  chart: {
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00a8cc",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7B61FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default HomeScreen;
