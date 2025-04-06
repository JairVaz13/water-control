import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const HomeScreen = ({ navigation }) => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [0.2, 0.45, 0.28, 0.8, 0.9, 0.43],
  };

  return (
    <LinearGradient
      colors={["#0f8c8c", "#025959", "#012840"]}
      style={styles.container}
    >
      {/* Header */}
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Text style={styles.title}>GestiónDB</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/30" }}
          style={styles.logo}
        />
      </Animatable.View>

      {/* Chart */}
      <Animatable.View animation="fadeInUp" duration={1000} style={styles.chartContainer}>
        <ProgressChart
          data={data}
          width={350}
          height={250}
          strokeWidth={12}
          radius={32}
          chartConfig={{
            backgroundColor: "#0f8c8c",
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
      </Animatable.View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {[
          { title: "Albercas", screen: "Albercas", delay: 0 },
          { title: "Sensores", screen: "Sensors", delay: 100 },
          { title: "Recomendaciones", screen: "Recomendaciones", delay: 200 },
          { title: "Reportes", screen: "Reports", delay: 300 },
          { title: "Dispensador", screen: "Dispenser", delay: 400 },
        ].map(({ title, screen, delay }, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={1000}
            delay={delay}
            style={styles.buttonWrapper}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(screen)}
            >
              <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Floating Button */}
      <Animatable.View
        animation="zoomIn"
        delay={500}
        duration={1000}
        style={styles.floatingButton}
      >
        <TouchableOpacity onPress={() => navigation.navigate("RecomendacionesFoto")}>
          <MaterialIcons name="camera-alt" size={24} color="#fff" />
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chartContainer: {
    marginBottom: 40,
    alignItems: "center",
    marginTop: 20,
  },
  chart: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00a8cc",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#7B61FF",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
  },
});

export default HomeScreen;
