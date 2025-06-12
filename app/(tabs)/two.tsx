import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Text, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNutri } from '../context/NutriContext';

type Receita = {
  id: string;
  nome: string;
  imagem: any;
  proteina: number;
  carboidrato: number;
};

export default function TabTwoScreen() {
  const [receitas, setReceitas] = useState<Receita[]>([
    {
      id: '1',
      nome: 'Salada de Frango',
      imagem: require('@/assets/images/salada.png'),
      proteina: 25,
      carboidrato: 10,
    },
    {id: '2',
      nome: 'Aveia com Morangos',
      imagem: require('@/assets/images/aveia.png'),
      proteina: 30,
      carboidrato: 12,
    },
    {id: '3',
      nome: 'Omelete de Vegetais',
      imagem: require('@/assets/images/omelete.png'),
      proteina: 30,
      carboidrato: 7,
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [novaReceita, setNovaReceita] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [proteina, setProteina] = useState<string>('');
  const [carboidrato, setCarboidrato] = useState<string>('');

  const { adicionarNutrientes, removerNutrientes } = useNutri();

  const adicionarReceita = () => {
    if (novaReceita.trim() === '') return;

    const novaProteina = parseInt(proteina) || 0;
    const novoCarboidrato = parseInt(carboidrato) || 0;

    const nova: Receita = {
      id: String(receitas.length + 1),
      nome: novaReceita,
      imagem: imagemSelecionada ? { uri: imagemSelecionada } : require('@/assets/images/placeholder.png'),
      proteina: novaProteina,
      carboidrato: novoCarboidrato,
    };

    setReceitas([...receitas, nova]);
    adicionarNutrientes(novaProteina, novoCarboidrato);

    setNovaReceita('');
    setProteina('');
    setCarboidrato('');
    setImagemSelecionada(null);
    setModalVisible(false);
  };

  const selecionarImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });

    if (!result.canceled) {
      setImagemSelecionada(result.assets[0].uri);
    }
  };

  const excluirReceita = (id: string) => {
    const receitaRemovida = receitas.find((r) => r.id === id);
  
    if (receitaRemovida) {
      removerNutrientes(receitaRemovida.proteina, receitaRemovida.carboidrato);
    }
  
    setReceitas(receitas.filter((receita) => receita.id !== id));
  };  

  const receitasFiltradas = receitas.filter((receita) =>
    receita.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Receitas</Text>
      <TextInput
        style={styles.search}
        placeholder="Buscar receitas"
        value={searchText}
        onChangeText={setSearchText}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Adicionar Receita</Text>
      </TouchableOpacity>

      <FlatList
        data={receitasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imagem} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>{item.nome}</Text>
              <Text style={styles.cardTextSmall}>Proteína: {item.proteina}g</Text>
              <Text style={styles.cardTextSmall}>Carboidrato: {item.carboidrato}g</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => excluirReceita(item.id)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput placeholder="Nome da Receita" style={styles.input} value={novaReceita} onChangeText={setNovaReceita} />

          <TextInput
            placeholder="Proteína (g)"
            keyboardType="numeric"
            style={styles.input}
            value={proteina}
            onChangeText={setProteina}
          />

          <TextInput
            placeholder="Carboidrato (g)"
            keyboardType="numeric"
            style={styles.input}
            value={carboidrato}
            onChangeText={setCarboidrato}
          />

          <TouchableOpacity style={styles.imageButton} onPress={selecionarImagem}>
            <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          {imagemSelecionada && <Image source={{ uri: imagemSelecionada }} style={styles.previewImage} />}

          <Button title="Adicionar" onPress={adicionarReceita} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff' },
  logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'flex-start' },
  search: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  addButton: { backgroundColor: '#009688', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  cardText: { fontWeight: 'bold' },
  cardTextSmall: { fontSize: 12, color: '#555' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: '80%', marginBottom: 12 },
  imageButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  imageButtonText: { color: '#fff', fontWeight: 'bold' },
  previewImage: { width: 100, height: 100, marginTop: 10 },
  deleteButton: { backgroundColor: 'red', padding: 5, borderRadius: 5, marginLeft: 10 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});
