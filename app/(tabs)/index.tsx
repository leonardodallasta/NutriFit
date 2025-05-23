import { StyleSheet, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email" 
          placeholderTextColor="#555" 
        />

        <Text>Senha</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite sua senha" 
          secureTextEntry 
          placeholderTextColor="#555" 
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.linkText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
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
