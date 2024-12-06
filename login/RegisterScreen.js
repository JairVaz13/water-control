import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    if (contrasena !== confirmContrasena) {
      setError('Las contraseñas no coinciden');
      console.log('Error: Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!nombre || !email || !contrasena) {
      setError('Todos los campos son obligatorios');
      console.log('Error: Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    const requestData = {
      nombre: nombre,
      email: email,
      contrasena: contrasena,
    };

    try {
      const response = await fetch('https://water-efficient-control.onrender.com/user/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || `Error en el registro: ${JSON.stringify(data)}`);
        console.log(`Error en el registro: ${data.message || JSON.stringify(data)}`);
        setLoading(false);
        return;
      }

      // Si el registro es exitoso y devuelve un token
      if (data.token) {
        console.log('Registro exitoso:', data);
        console.log('Token recibido:', data.token);

        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        console.log('Token almacenado en AsyncStorage.');

        Alert.alert('Registro exitoso', `Bienvenido, ${nombre}`);
        navigation.navigate('Login');
      } else {
        console.log('Registro exitoso, pero no se recibió token:', data);
        Alert.alert('Registro exitoso', `Bienvenido, ${nombre}`);
      }
    } catch (err) {
      setError('Hubo un problema al registrar, intenta de nuevo más tarde');
      console.log('Error en la solicitud:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrarse</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={contrasena}
              onChangeText={setContrasena}
            />
            <TouchableOpacity onPress={toggleShowPassword}>
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#ccc"
              secureTextEntry={!showConfirmPassword}
              value={confirmContrasena}
              onChangeText={setConfirmContrasena}
            />
            <TouchableOpacity onPress={toggleShowConfirmPassword}>
              <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Registrarse</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>¿Ya tienes una cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: 30 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  errorText: { color: '#ff6b6b', textAlign: 'center', marginBottom: 15 },
  loginButton: { backgroundColor: '#00a8cc', padding: 15, borderRadius: 8, marginTop: 10 },
  loginButtonDisabled: { backgroundColor: '#00a8cc80' },
  loginButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  registerButton: { marginTop: 20 },
  registerText: { color: '#00e5ff', textAlign: 'center', fontSize: 14 },
});

export default RegisterScreen;
