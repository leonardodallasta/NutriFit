import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNutri } from 'C:/Users/User/Downloads/NutriFit/app/context/NutriContext';

export default function StatisticsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [consumoAgua, setConsumoAgua] = useState(0);
  const [metaAgua, setMetaAgua] = useState(2500);

  const { nutrientes } = useNutri();
  const calorias = (nutrientes.proteina + nutrientes.carboidrato) * 4;

  const adicionarAgua = (quantidade: number) => {
    setConsumoAgua((prev) => Math.max(0, prev + quantidade));
  };

  const definirAgua = (text: string) => {
    const valor = parseInt(text) || 0;
    setConsumoAgua(Math.max(0, valor));
  };

  const alterarMeta = (quantidade: number) => {
    setMetaAgua((prev) => Math.min(5000, Math.max(2500, prev + quantidade)));
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Estatísticas</Text>

      <View style={styles.card}>
        <StatItem label="Água" value={`${consumoAgua / 1000} / ${metaAgua / 1000}L`} progress={consumoAgua / metaAgua} color="#3b82f6" openModal={() => setModalVisible(true)} />
        <StatItem label="Calorias" value={`${calorias} / 2200 kcal`} progress={calorias / 2200} color="#f97316" />
        <StatItem label="Proteínas" value={`${nutrientes.proteina} / 150g`} progress={nutrientes.proteina / 150} color="#ec4899" />
        <StatItem label="Carboidratos" value={`${nutrientes.carboidrato} / 250g`} progress={nutrientes.carboidrato / 250} color="#22c55e" />
      </View>

      {/* Modal de controle de água */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Água</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={consumoAgua.toString()} onChangeText={definirAgua} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => adicionarAgua(-100)}>
                <Text style={styles.modalButtonText}>-100mL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => adicionarAgua(100)}>
                <Text style={styles.modalButtonText}>+100mL</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Definir Meta</Text>
            <Text style={styles.metaValue}>{metaAgua / 1000} L</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => alterarMeta(-250)}>
                <Text style={styles.modalButtonText}>-0.25L</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => alterarMeta(250)}>
                <Text style={styles.modalButtonText}>+0.25L</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function StatItem({
  label,
  value,
  progress,
  color,
  openModal,
}: {
  label: string;
  value: string;
  progress: number;
  color: string;
  openModal?: () => void;
}) {
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
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, backgroundColor: '#fff' },
  logo: { width: 200, height: 100, marginBottom: 20, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'flex-start' },
  card: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  statItem: { marginBottom: 16 },
  statHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontWeight: '600', fontSize: 16 },
  icons: { flexDirection: 'row', marginHorizontal: 10 },
  icon: { width: 24, height: 24, marginLeft: 8 },
  statValue: { fontSize: 14, color: '#555' },
  progressBarBackground: { height: 10, backgroundColor: '#e5e5e5', borderRadius: 5, overflow: 'hidden', marginTop: 8 },
  progressBar: { height: '100%', borderRadius: 5 },
  metaValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },

  /* Modal */
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: '80%', textAlign: 'center', fontSize: 18, marginBottom: 12, backgroundColor: '#f9f9f9' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 15 },
  modalButton: { backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeButton: { marginTop: 20, backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
