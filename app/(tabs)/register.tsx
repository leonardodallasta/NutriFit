import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter(); 

  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    console.log('Botão "Cadastrar" pressionado. Iniciando o processo...');
    
    if (!nome.trim() || !login.trim() || !email.trim() || !dataNascimento.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('1. Tentando criar usuário no Firebase Auth com o email:', email);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('--- SUCESSO! Usuário criado no Auth com UID:', user.uid);

      console.log('2. Tentando salvar dados no Firestore para o UID:', user.uid);
      await firestore().collection('users').doc(user.uid).set({
        nome: nome,
        login: login,
        email: email,
        dataNascimento: dataNascimento,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('--- SUCESSO! Dados salvos no Firestore.');
      
      setIsLoading(false);
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada. Você será redirecionado para a tela de login.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );

    } catch (error: any) {
      setIsLoading(false);
      console.log('!!! ERRO CAPTURADO DURANTE O CADASTRO !!!');
      console.error(error); 

      let errorMessage = 'Não foi possível criar a conta. Verifique o console para mais detalhes.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este endereço de e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.code === 'firestore/permission-denied') {
          errorMessage = 'Erro de permissão ao salvar dados. Verifique as regras de segurança do Firestore.';
      }
      
      Alert.alert('Erro no Cadastro', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text style={styles.title}>Crie sua conta</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} placeholder="Seu nome completo" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Login (Apelido)</Text>
        <TextInput style={styles.input} placeholder="Um nome de usuário único" value={login} onChangeText={setLogin} />
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Seu melhor e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        
        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={dataNascimento} onChangeText={setDataNascimento} />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="Crie uma senha forte" value={password} onChangeText={setPassword} secureTextEntry />
        
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

         <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Text style={styles.backLink}>Já tenho uma conta. Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  backLink: {
      color: '#000',
      textDecorationLine: 'underline',
      textAlign: 'center',
      marginTop: 20,
  }
});
