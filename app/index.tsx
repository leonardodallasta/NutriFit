import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Image, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha os campos de e-mail e senha.');
      return;
    }
    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('Usuário logado com sucesso:', userCredential.user.email);
        router.replace('/(tabs)');

      })
      .catch(error => {
        let errorMessage = 'Ocorreu um erro desconhecido.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = 'E-mail ou senha inválidos.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'O formato do e-mail é inválido.';
        }
        Alert.alert('Erro no Login', errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email" 
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite sua senha" 
          secureTextEntry 
          placeholderTextColor="#555" 
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Cadastrar</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00A99D',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  linkText: {
    color: '#000',
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
  },
});
