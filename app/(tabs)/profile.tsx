import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type UserProfile = {
  nome?: string;
  dataNascimento?: string;
  profilePictureUrl?: string;
  peso?: number;
  altura?: number;
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<'peso' | 'altura' | null>(null);
  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    setLoading(true);
    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        setProfile(documentSnapshot.data() || {});
        if (loading) setLoading(false);
      });
      
    return () => subscriber();
  }, [user]);

  const calculateIMC = () => {
    const peso = profile?.peso;
    const altura = profile?.altura;
    if (peso && altura && altura > 0) {
      const alturaEmMetros = altura < 3 ? altura : altura / 100;
      if (alturaEmMetros === 0) return '--';
      const imc = peso / (alturaEmMetros * alturaEmMetros);
      return imc.toFixed(1);
    }
    return '--';
  };
  
  const openUpdateModal = (field: 'peso' | 'altura') => {
    setEditingField(field);
    setFieldValue(String(profile?.[field] || ''));
    setModalVisible(true);
  };

  const handleUpdateField = async () => {
    if (!user || !editingField) return;
    const numericValue = parseFloat(fieldValue.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert("Valor inválido", "Por favor, insira um número positivo.");
      return;
    }

    try {
      await firestore().collection('users').doc(user.uid).update({
        [editingField]: numericValue,
      });
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o valor.");
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
      Alert.alert("Erro", "Não foi possível sair da sua conta.");
    }
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#00A99D" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <View style={{width: 50}} />
          <Image source={require('@/assets/images/nutrifit.png')} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <FontAwesome name="sign-out" size={28} color="#333" />
          </TouchableOpacity>
      </View>
      
      <Image
        source={profile?.profilePictureUrl ? { uri: profile.profilePictureUrl } : require('@/assets/images/profile/perfil.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>{profile?.nome || 'Usuário NutriFit'}</Text>
      <Text style={styles.dob}>{profile?.dataNascimento || ' '}</Text>

      <View style={styles.dataBox}>
        <TouchableOpacity style={styles.dataItem} onPress={() => openUpdateModal('peso')}>
          <Text style={styles.dataValue}>{profile?.peso || '--'} kg</Text>
          <Text style={styles.dataLabel}>Peso</Text>
        </TouchableOpacity>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>{calculateIMC()}</Text>
          <Text style={styles.dataLabel}>IMC</Text>
        </View>
        <TouchableOpacity style={styles.dataItem} onPress={() => openUpdateModal('altura')}>
          <Text style={styles.dataValue}>{profile?.altura || '--'} cm</Text>
          <Text style={styles.dataLabel}>Altura</Text>
        </TouchableOpacity>
      </View>
      
      <Link href="/edit-profile" asChild>
          <TouchableOpacity style={styles.action}>
            <Text style={styles.actionText}>Editar perfil completo</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
      </Link>
      
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Atualizar {editingField}</Text>
                <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={fieldValue}
                    onChangeText={setFieldValue}
                    placeholder={editingField === 'peso' ? 'Peso em kg (ex: 75.5)' : 'Altura em cm (ex: 172)'}
                />
                <View style={styles.modalButtons}>
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#6b7280" />
                    <Button title="Salvar" onPress={handleUpdateField} color="#00A99D" />
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 60,
  },
  logoutButton: {
    width: 50,
    alignItems: 'flex-end',
    padding: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dob: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  dataBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  dataItem: {
    alignItems: 'center',
    flex: 1,
  },
  dataValue: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  dataLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
