import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, View, Text, LayoutAnimation, UIManager, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';

type Meta = {
  id: string; 
  goal: string;
  progress: number;
  target: number;
  unit: string;
};

const getFormattedDate = (date: Date) => date.toISOString().slice(0, 10);
const metasDisponiveis = ["Beber água", "Caminhada", "Correr", "Esteira", "Yoga", "Meditar", "Alongamento"];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MetasScreen() {
  const { user } = useAuth();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [consumoAguaHoje, setConsumoAguaHoje] = useState(0);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const metasSubscriber = firestore().collection('users').doc(user.uid).collection('metas')
      .onSnapshot(querySnapshot => {
        const userMetas: Meta[] = [];
        querySnapshot.forEach(documentSnapshot => {
          userMetas.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Meta);
        });
        setMetas(userMetas);
        if(loading) setLoading(false);
      }, error => {
        console.error("Erro ao buscar metas: ", error);
        setLoading(false);
      });

    const hoje = getFormattedDate(new Date());
    const aguaSubscriber = firestore().collection('users').doc(user.uid).collection('diario').doc(hoje)
      .onSnapshot(doc => {
        if (doc.exists()) {
          setConsumoAguaHoje(doc.data()?.consumoAgua || 0);
        } else {
          setConsumoAguaHoje(0);
        }
      });

    return () => {
      metasSubscriber();
      aguaSubscriber();
    };
  }, [user]);

  const addMeta = async (goal: string) => {
    if (!user) return;
    const alreadyExists = metas.some(meta => meta.goal === goal);
    if (alreadyExists) return;

    let target = 1;
    let unit = '';

    switch (goal) {
        case 'Beber água': target = 2.5; unit = 'L'; break;
        case 'Caminhada': target = 5; unit = 'km'; break;
        case 'Correr': target = 3; unit = 'km'; break;
        case 'Esteira': target = 3; unit = 'km'; break;
        case 'Yoga': case 'Meditar': case 'Alongamento': target = 30; unit = 'min'; break;
    }
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    try {
      await firestore().collection('users').doc(user.uid).collection('metas').add({
        goal,
        progress: 0,
        target,
        unit,
      });
    } catch (error) {
      console.error("Erro ao adicionar meta: ", error);
      Alert.alert("Erro", "Não foi possível adicionar a meta.");
    }
  };

  const removeMeta = async (metaId: string) => {
    if (!user) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    try {
      await firestore().collection('users').doc(user.uid).collection('metas').doc(metaId).delete();
    } catch (error) {
      console.error("Erro ao remover meta: ", error);
      Alert.alert("Erro", "Não foi possível remover a meta.");
    }
  };

  if (loading) {
      return <View style={styles.container}><ActivityIndicator size="large" color="#00A99D"/></View>
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Minhas Metas</Text>

      <ScrollView style={styles.metasScroll} contentContainerStyle={{ paddingBottom: 20 }}>
        {metas.map(meta => {
          const isMetaAgua = meta.goal === 'Beber água';
          const progressoAtual = isMetaAgua ? (consumoAguaHoje / 1000) : meta.progress;

          return (
            <View key={meta.id} style={styles.metaCard}>
              <View style={styles.metaHeader}>
                <Text style={styles.metaTitle}>{meta.goal}</Text>
                <TouchableOpacity onPress={() => removeMeta(meta.id)}>
                  <Icon name="trash-2" size={20} color="red" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subTitle}>Progresso</Text>
              <ProgressBar
                progress={meta.target > 0 ? progressoAtual / meta.target : 0}
                color="#00A99D"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {progressoAtual.toFixed(1)} de {meta.target} {meta.unit}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Adicionar meta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={{ maxHeight: 300 }}>
              {metasDisponiveis.map(goal => {
                const isSelected = metas.some(meta => meta.goal === goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => addMeta(goal)}
                    style={[styles.metaOption, isSelected && styles.metaOptionSelected]}
                    disabled={isSelected}
                  >
                    <Icon
                      name={isSelected ? 'check-square' : 'square'}
                      size={20}
                      color={isSelected ? '#00A99D' : '#ccc'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.metaOptionText}>{goal}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff', justifyContent: 'center' },
  logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000', textAlign: 'center' },
  metasScroll: { flex: 1, width: '100%' },
  metaCard: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, marginBottom: 20, backgroundColor: '#f9f9f9' },
  metaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  subTitle: { fontSize: 16, marginTop: 12, marginBottom: 8, color: '#000' },
  progressBar: { height: 10, borderRadius: 5, marginBottom: 8 },
  progressText: { fontSize: 14, color: '#000' },
  addButton: { backgroundColor: '#00A99D', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10, width: '100%' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 300, maxHeight: 400, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  metaOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  metaOptionSelected: { opacity: 0.5 },
  metaOptionText: { fontSize: 16, color: '#000' },
  cancelButton: { marginTop: 10, padding: 10, backgroundColor: '#ccc', borderRadius: 6, alignItems: 'center' },
  cancelButtonText: { fontWeight: 'bold', color: '#333' },
});
