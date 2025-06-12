import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Text, Modal, Button, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useNutri } from '../context/NutriContext';
import { useDate } from '../context/DateContext';

type Receita = {
  id: string;
  nome: string;
  imagem: string;
  proteina: number;
  carboidrato: number;
  data: string;
};

const getFormattedDate = (date: Date) => date.toISOString().slice(0, 10);

export default function TabTwoScreen() {
  const { user } = useAuth();
  const { setNutrientes } = useNutri();
  const { selectedDate, setSelectedDate } = useDate();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const formattedDate = getFormattedDate(selectedDate);

  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [novaReceita, setNovaReceita] = useState('');
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
  const [proteina, setProteina] = useState('');
  const [carboidrato, setCarboidrato] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('receitas')
      .where('data', '==', formattedDate)
      .onSnapshot(querySnapshot => {
        const userReceitas: Receita[] = [];
        querySnapshot.forEach(doc => {
          userReceitas.push({ id: doc.id, ...doc.data() } as Receita);
        });
        setReceitas(userReceitas);
        setLoading(false);
      });

    return () => subscriber();
  }, [user, formattedDate]);

  useEffect(() => {
    const totalProteina = receitas.reduce((sum, r) => sum + r.proteina, 0);
    const totalCarboidrato = receitas.reduce((sum, r) => sum + r.carboidrato, 0);
    setNutrientes({ proteina: totalProteina, carboidrato: totalCarboidrato });
  }, [receitas]);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const adicionarReceita = async () => {
    if (!user || novaReceita.trim() === '') return;
    const novaProteina = parseInt(proteina) || 0;
    const novoCarboidrato = parseInt(carboidrato) || 0;
    const novaImagemUrl = imagemSelecionada || 'https://placehold.co/100x100/A0E6DA/000000?text=Comida';
    
    try {
      await firestore().collection('users').doc(user.uid).collection('receitas').add({
        nome: novaReceita,
        imagem: novaImagemUrl,
        proteina: novaProteina,
        carboidrato: novoCarboidrato,
        data: formattedDate,
      });

      setNovaReceita('');
      setProteina('');
      setCarboidrato('');
      setImagemSelecionada(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível adicionar a receita.');
    }
  };
  
  const excluirReceita = async (id: string) => {
      if (!user) return;
      try {
        await firestore().collection('users').doc(user.uid).collection('receitas').doc(id).delete();
      } catch (error) {
         console.error(error);
         Alert.alert('Erro', 'Não foi possível excluir a receita.');
      }
  };

  const selecionarImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!result.canceled) {
      setImagemSelecionada(result.assets[0].uri);
    }
  };

  const getTitle = () => {
    if (formattedDate === getFormattedDate(new Date())) {
      return "Receitas de Hoje";
    }
    return `Receitas de ${selectedDate.toLocaleDateString('pt-BR')}`;
  };
  
  const receitasFiltradas = receitas.filter(receita =>
    receita.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <FontAwesome name="calendar" size={24} color="#00A99D" />
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {loading ? <ActivityIndicator size="large" color="#00A99D"/> : (
        <>
            <TextInput style={styles.search} placeholder="Buscar receitas" value={searchText} onChangeText={setSearchText} />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Adicionar Receita</Text>
            </TouchableOpacity>
            <FlatList
                data={receitasFiltradas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: item.imagem }} style={styles.image} onError={() => console.log('Erro ao carregar imagem')} />
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
        </>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nova Receita</Text>
                <TextInput placeholder="Nome da Receita" style={styles.input} value={novaReceita} onChangeText={setNovaReceita} />
                <TextInput placeholder="Proteína (g)" keyboardType="numeric" style={styles.input} value={proteina} onChangeText={setProteina} />
                <TextInput placeholder="Carboidrato (g)" keyboardType="numeric" style={styles.input} value={carboidrato} onChangeText={setCarboidrato} />
                <TouchableOpacity style={styles.imageButton} onPress={selecionarImagem}>
                    <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
                </TouchableOpacity>
                {imagemSelecionada && <Image source={{ uri: imagemSelecionada }} style={styles.previewImage} />}
                <View style={styles.modalActionButtons}>
                    <Button title="Adicionar" onPress={adicionarReceita} color="#00A99D" />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
                </View>
            </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff'},
  logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20,},
  title: { fontSize: 24, fontWeight: 'bold' },
  search: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  addButton: { backgroundColor: '#00A99D', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  cardText: { fontWeight: 'bold' },
  cardTextSmall: { fontSize: 12, color: '#555' },
  modalScrollContainer: { flexGrow: 1, justifyContent: 'center' },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: '80%', marginBottom: 12, textAlign: 'center' },
  imageButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, marginBottom: 10 },
  imageButtonText: { color: '#fff', fontWeight: 'bold' },
  previewImage: { width: 100, height: 100, marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  deleteButton: { backgroundColor: 'red', padding: 5, borderRadius: 20, marginLeft: 10, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalActionButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginTop: 20 },
});
