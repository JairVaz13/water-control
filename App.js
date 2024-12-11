import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Asegúrate de que las rutas coincidan con la ubicación de tus archivos
import LoginScreen from "./login/LoginScreen"; // Ruta correcta
import RegisterScreen from "./login/RegisterScreen"; // Ruta correcta
import HomeScreen from "./home/HomeScreen"; // Ruta correcta
import AlbercasScreen from "./albercas/contenedores"; // Ajusta la ruta si es necesario
import SensoresScreen from './sensores/sensor'; // Importa correctamente el archivo SensoresScreen
import ReportsScreen from './reports/ReportsScreen'; // Pantalla de Reportes
import DispenserScreen from './dispenser/DispenserScreen'; // Pantalla de Dispensador
import RecomendacionesScreenFoto from './recomendacionesFoto/RecomendacionesScreenFoto'; // Pantalla de la cámara
import RecomendacionesScreen from './recomendaciones/RecomendacionesScreen'; // Pantalla de Recomendaciones
import MostrarRecomendacion from './recomendaciones/mostrarRecomendacion'; // Pantalla de Mostrar Recomendación
import MostrarRecomendacionFoto from "./recomendacionesFoto/mostrarRecomendacionFoto";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Albercas" component={AlbercasScreen} />
        <Stack.Screen name="Sensors" component={SensoresScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Dispenser" component={DispenserScreen} />
        <Stack.Screen name="Recomendaciones" component={RecomendacionesScreen} />
        <Stack.Screen name="MostrarRecomendacion" component={MostrarRecomendacion} />
        <Stack.Screen name="RecomendacionesFoto" component={RecomendacionesScreenFoto} />
        <Stack.Screen name="MostrarRecomendacionFoto" component={MostrarRecomendacionFoto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
