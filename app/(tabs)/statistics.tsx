import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../context/DateContext';

type StatsDiarias = {
  consumoAgua: number;
  metaAgua: number;
};
type Receita = {
  proteina: number;
  carboidrato: number;
};

const getFormattedDate = (date: Date) => date.toISOString().slice(0, 10);

function StatItem({ label, value, progress, color, openModal }: { label: string; value: string; progress: number; color: string; openModal?: () => void; }) { 
    return ( 
        <View style={styles.statItem}> 
            <View style={styles.statHeader}> 
                <Text style={styles.statLabel}>{label}</Text> 
                <View style={styles.icons}> 
                    {label === 'Água' && ( 
                        <TouchableOpacity onPress={openModal}> 
                            <Image source={require('@/assets/images/statistical/botao_verde.png')} style={styles.icon} /> 
                        </TouchableOpacity> 
                    )} 
                </View> 
                <Text style={styles.statValue}>{value}</Text> 
            </View> 
            <View style={styles.progressBarBackground}> 
                <View style={[styles.progressBar, { width: `${Math.min(1, progress || 0) * 100}%`, backgroundColor: color }]} /> 
            </View> 
        </View> 
    ); 
}

export default function StatisticsScreen() {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();

  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState<StatsDiarias>({ consumoAgua: 0, metaAgua: 2500 });
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nutrientesDoDia, setNutrientesDoDia] = useState({ proteina: 0, carboidrato: 0 });

  const formattedDate = getFormattedDate(selectedDate);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const statsDocRef = firestore().collection('users').doc(user.uid).collection('diario').doc(formattedDate);
    const statsSubscriber = statsDocRef.onSnapshot(doc => {
      const defaultData = { consumoAgua: 0, metaAgua: 2500 };
      const firestoreData = doc.exists() ? doc.data() : {};
      setStats({ ...defaultData, ...firestoreData as StatsDiarias });
    });

    const receitasSubscriber = firestore()
      .collection('users').doc(user.uid).collection('receitas')
      .where('data', '==', formattedDate)
      .onSnapshot(querySnapshot => {
        let totalProteina = 0;
        let totalCarboidrato = 0;
        querySnapshot.forEach(doc => {
          const receita = doc.data() as Receita;
          totalProteina += receita.proteina;
          totalCarboidrato += receita.carboidrato;
        });
        setNutrientesDoDia({ proteina: totalProteina, carboidrato: totalCarboidrato });
        setLoading(false);
      });

    return () => {
      statsSubscriber();
      receitasSubscriber();
    };
  }, [user, formattedDate]);


  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') { setShowDatePicker(false); }
    if (date) { setSelectedDate(date); }
  };

  const atualizarStats = async (novosDados: Partial<StatsDiarias>) => {
    if (!user) return;
    const statsDocRef = firestore().collection('users').doc(user.uid).collection('diario').doc(formattedDate);
    try {
      await statsDocRef.set(novosDados, { merge: true });
    } catch (error) {
      console.error(error); Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };
  
  const adicionarAgua = (quantidade: number) => {
    const novoConsumo = Math.max(0, (stats.consumoAgua || 0) + quantidade);
    atualizarStats({ consumoAgua: novoConsumo });
  };
  
  const definirAgua = (text: string) => {
    const valor = parseInt(text) || 0;
    atualizarStats({ consumoAgua: Math.max(0, valor) });
  };
  
  const alterarMeta = (quantidade: number) => {
    const novaMeta = Math.min(5000, Math.max(2500, (stats.metaAgua || 2500) + quantidade));
    atualizarStats({ metaAgua: novaMeta });
  };
  
  const calorias = (nutrientesDoDia.proteina * 4) + (nutrientesDoDia.carboidrato * 4);

  const getTitle = () => {
    if (formattedDate === getFormattedDate(new Date())) { return "Estatísticas de Hoje"; }
    return `Estatísticas de ${selectedDate.toLocaleDateString('pt-BR')}`;
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}><FontAwesome name="calendar" size={24} color="#00A99D" /></TouchableOpacity>
      </View>
      {showDatePicker && (<DateTimePicker value={selectedDate} mode="date" display="default" onChange={onDateChange} maximumDate={new Date()} />)}
      {loading ? (<ActivityIndicator size="large" color="#00A99D"/>) : (
        <View style={styles.card}>
          <StatItem label="Água" value={`${(stats.consumoAgua || 0) / 1000} / ${(stats.metaAgua || 2500) / 1000}L`} progress={(stats.metaAgua || 2500) > 0 ? (stats.consumoAgua || 0) / (stats.metaAgua || 2500) : 0} color="#3b82f6" openModal={() => setModalVisible(true)} />
          <StatItem label="Calorias" value={`${calorias.toFixed(0)} / 2200 kcal`} progress={calorias / 2200} color="#f97316" />
          <StatItem label="Proteínas" value={`${nutrientesDoDia.proteina.toFixed(0)} / 150g`} progress={nutrientesDoDia.proteina / 150} color="#ec4899" />
          <StatItem label="Carboidratos" value={`${nutrientesDoDia.carboidrato.toFixed(0)} / 250g`} progress={nutrientesDoDia.carboidrato / 250} color="#22c55e" />
        </View>
      )}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Água</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={String(stats.consumoAgua || 0)} onChangeText={definirAgua} />
            <View style={styles.modalButtons}><TouchableOpacity style={styles.modalButton} onPress={() => adicionarAgua(-100)}><Text style={styles.modalButtonText}>-100mL</Text></TouchableOpacity><TouchableOpacity style={styles.modalButton} onPress={() => adicionarAgua(100)}><Text style={styles.modalButtonText}>+100mL</Text></TouchableOpacity></View>
            <Text style={styles.modalTitle}>Definir Meta</Text>
            <Text style={styles.metaValue}>{(stats.metaAgua || 2500) / 1000} L</Text>
            <View style={styles.modalButtons}><TouchableOpacity style={styles.modalButton} onPress={() => alterarMeta(-250)}><Text style={styles.modalButtonText}>-0.25L</Text></TouchableOpacity><TouchableOpacity style={styles.modalButton} onPress={() => alterarMeta(250)}><Text style={styles.modalButtonText}>+0.25L</Text></TouchableOpacity></View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}><Text style={styles.closeButtonText}>Fechar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff'}, titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20}, logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' }, title: { fontSize: 24, fontWeight: 'bold' }, card: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }, statItem: { marginBottom: 16 }, statHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, statLabel: { fontWeight: '600', fontSize: 16 }, icons: { flexDirection: 'row', marginHorizontal: 10 }, icon: { width: 24, height: 24, marginLeft: 8 }, statValue: { fontSize: 14, color: '#555' }, progressBarBackground: { height: 10, backgroundColor: '#e5e5e5', borderRadius: 5, overflow: 'hidden', marginTop: 8 }, progressBar: { height: '100%', borderRadius: 5 }, metaValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' }, modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' }, modalContent: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', elevation: 5 }, modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 }, input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: '80%', textAlign: 'center', fontSize: 18, marginBottom: 12, backgroundColor: '#f9f9f9' }, modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 15 }, modalButton: { backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 }, modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }, closeButton: { marginTop: 20, backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 }, closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }, });
