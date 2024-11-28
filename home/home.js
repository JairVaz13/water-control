import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import AlbercasScreen from "../albercas/contenedores"
import Sensores from "../sensores/sensor"
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [30, 20, 50, 70, 40, 80],
        color: (opacity = 1) => `rgba(66, 194, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [50, 30, 60, 90, 70, 100],
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Water Quality Dashboard</Text>
      <LineChart
        data={data}
        width={350}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#f2f2f2",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Albercas")}
        >
          <MaterialIcons name="water" size={24} color="white" />
          <Text style={styles.buttonText}>Contenedores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Sensores")}
        >
          <MaterialIcons name="water" size={24} color="white" />
          <Text style={styles.buttonText}>Sensores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Reports")}
        >
          <MaterialIcons name="bar-chart" size={24} color="white" />
          <Text style={styles.buttonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};




const ReportsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Reports Screen</Text>
  </View>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Albercas" component={AlbercasScreen} />
      <Stack.Screen name="Sensores" component={Sensores}/>
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B61FF",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  screenText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AppNavigator;
