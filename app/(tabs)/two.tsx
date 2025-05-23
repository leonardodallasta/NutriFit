import React from 'react';
import { View, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Text } from 'react-native';

const receitas = [
  {
    id: '1',
    nome: 'Salada de Frango',
    imagem: require('@/assets/images/salada.png'),
  },
  {
    id: '2',
    nome: 'Aveia com Morangos',
    imagem: require('@/assets/images/aveia.png'),
  },
  {
    id: '3',
    nome: 'Omelete de Vegetais',
    imagem: require('@/assets/images/omelete.png'),
  },
];

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Receitas</Text>

      <TextInput style={styles.search} placeholder="Buscar receitas" />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar Receita</Text>
      </TouchableOpacity>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imagem} style={styles.image} />
            <Text style={styles.cardText}>{item.nome}</Text>
            <View style={styles.progressBar}></View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#009688',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  cardText: {
    fontWeight: 'bold',
    flex: 1,
  },
  progressBar: {
    width: 60,
    height: 8,
    backgroundColor: '#a0e7e5',
    borderRadius: 4,
  },
});
