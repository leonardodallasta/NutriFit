import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, View, Text, LayoutAnimation, UIManager, Platform, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

type Meta = {
  id: number;
  goal: string;
  progress: number;
  target: number;
  unit: string;
};

const metasDisponiveis = ["Beber água", "Andar", "Correr", "Esteira", "Yoga", "Meditar", "Alongamento"];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MetasScreen() {
  const [metas, setMetas] = useState<Meta[]>([
    { id: 1, goal: 'Perder peso', progress: 1, target: 7, unit: 'kg' }
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const addMeta = (goal: string) => {
    const alreadyExists = metas.some(meta => meta.goal === goal);
    if (alreadyExists) return;

    const id = new Date().getTime();
    let target = 1;
    let unit = '';

    switch (goal) {
      case 'Beber água':
        target = 5;
        unit = 'L';
        break;
      case 'Andar':
        target = 10;
        unit = 'km';
        break;
      case 'Correr':
        target = 5;
        unit = 'km';
        break;
      case 'Esteira':
        target = 3;
        unit = 'km';
        break;
      case 'Yoga':
      case 'Meditar':
      case 'Alongamento':
        target = 30;
        unit = 'min';
        break;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMetas([...metas, { id, goal, progress: Math.random() * target, target, unit }]);
  };

  const removeMeta = (metaId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMetas(metas.filter(meta => meta.id !== metaId));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Metas</Text>

      <ScrollView style={styles.metasScroll} contentContainerStyle={{ paddingBottom: 20 }}>
        {metas.map(meta => (
          <View key={meta.id} style={styles.metaCard}>
            <View style={styles.metaHeader}>
              <Text style={styles.metaTitle}>{meta.goal}</Text>
              <TouchableOpacity onPress={() => removeMeta(meta.id)}>
                <Icon name="trash-2" size={20} color="red" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>Progresso</Text>

            <ProgressBar
              progress={meta.progress / meta.target}
              color="#00A99D"
              style={styles.progressBar}
            />

            <Text style={styles.progressText}>
              {meta.progress.toFixed(1)} de {meta.target} {meta.unit}
            </Text>
          </View>
        ))}
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
    color: '#000',
    textAlign: 'center',
  },
  metasScroll: {
    flex: 1,
  },
  metaCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    color: '#000',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#00A99D',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    maxHeight: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  metaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metaOptionSelected: {
    opacity: 0.5,
  },
  metaOptionText: {
    fontSize: 16,
    color: '#000',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
