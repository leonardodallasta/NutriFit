import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TrainingButton({ label, icon, onPress }: { label: string; icon: any; onPress: () => void; }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function TrainingScreen() {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const openTimerModal = (training: string) => {
    setSelectedTraining(training);
    handleReset();
    setModalVisible(true);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // salva o progresso no Firebase
  const handleSaveWorkout = async () => {
    if (!user || !selectedTraining || time === 0) {
      Alert.alert("Atenção", "Inicie o treino para poder salvar.");
      return;
    }

    const timeInMinutes = time / 60;
    const trainingMap: { [key: string]: { goals: string[]; calculation: (minutes: number) => number } } = {
      'Corrida':    { goals: ['Correr', 'Esteira'], calculation: (minutes) => minutes * (8 / 60) }, // 8 km/h
      'Caminhada':  { goals: ['Caminhada', 'Esteira'], calculation: (minutes) => minutes * (5 / 60) }, // 5 km/h
      'Ciclismo':   { goals: ['Ciclismo'], calculation: (minutes) => minutes * (15 / 60) }, // 15 km/h
      'Yoga':       { goals: ['Yoga', 'Alongamento', 'Meditar'], calculation: (minutes) => minutes },
      'Musculação': { goals: ['Musculação'], calculation: (minutes) => minutes },
      'Natação':    { goals: ['Natação'], calculation: (minutes) => minutes },
    };

    const workout = trainingMap[selectedTraining];
    if (!workout) {
      Alert.alert("Erro", "Tipo de treino não reconhecido.");
      return;
    }

    const progressToAdd = workout.calculation(timeInMinutes);

    try {
      const metasRef = firestore().collection('users').doc(user.uid).collection('metas');
      const querySnapshot = await metasRef.where('goal', 'in', workout.goals).get();

      if (querySnapshot.empty) {
        Alert.alert("Meta não encontrada", `Você precisa ter uma das seguintes metas para registrar este progresso: ${workout.goals.join(', ')}`);
      } else {
        const batch = firestore().batch();
        querySnapshot.forEach(doc => {
          batch.update(doc.ref, {
            progress: firestore.FieldValue.increment(progressToAdd)
          });
        });
        await batch.commit();
        Alert.alert("Sucesso!", `Progresso adicionado às suas metas!`);
      }

      setModalVisible(false);
      handleReset();

    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      Alert.alert("Erro", "Não foi possível salvar seu progresso.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Registrar Treino</Text>

      <TrainingButton label="Corrida" icon={require('@/assets/images/training/corrida.png')} onPress={() => openTimerModal('Corrida')} />
      <TrainingButton label="Caminhada" icon={require('@/assets/images/training/caminhada.png')} onPress={() => openTimerModal('Caminhada')} />
      <TrainingButton label="Musculação" icon={require('@/assets/images/training/musculacao.png')} onPress={() => openTimerModal('Musculação')} />
      <TrainingButton label="Yoga" icon={require('@/assets/images/training/yoga.png')} onPress={() => openTimerModal('Yoga')} />
      <TrainingButton label="Ciclismo" icon={require('@/assets/images/training/ciclismo.png')} onPress={() => openTimerModal('Ciclismo')} />
      <TrainingButton label="Natação" icon={require('@/assets/images/training/natacao.png')} onPress={() => openTimerModal('Natação')} />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTraining}</Text>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleStartPause}><FontAwesome name={isActive ? 'pause' : 'play'} size={32} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleReset}><FontAwesome name="stop" size={32} color="#fff" /></TouchableOpacity>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.saveButton, {backgroundColor: '#6b7280'}]} onPress={() => { setModalVisible(false); handleReset(); }}><Text style={styles.saveButtonText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}><Text style={styles.saveButtonText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff' },
  logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3 },
  icon: { width: 32, height: 32, marginRight: 12 },
  buttonText: { fontSize: 18, fontWeight: '500' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 30, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  timerText: { fontSize: 64, fontWeight: '300', fontFamily: 'SpaceMono', marginVertical: 20 },
  timerControls: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginBottom: 30 },
  controlButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#00A99D', justifyContent: 'center', alignItems: 'center' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  saveButton: { flex: 1, backgroundColor: '#00A99D', padding: 15, borderRadius: 8, marginHorizontal: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
