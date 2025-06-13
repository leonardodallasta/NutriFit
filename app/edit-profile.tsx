import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        const userData = documentSnapshot.data();
        if (userData) {
          setNome(userData.nome || '');
          setDataNascimento(userData.dataNascimento || '');
          setProfilePictureUrl(userData.profilePictureUrl || null);
        }
        setLoading(false);
      });
    return () => subscriber();
  }, [user]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePictureUrl(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await firestore().collection('users').doc(user.uid).update({
        nome: nome,
        dataNascimento: dataNascimento,
        profilePictureUrl: profilePictureUrl,
      });
      Alert.alert('Sucesso', 'Seu perfil foi atualizado!');
      router.back();
    } catch (error) {
      console.error("Erro ao salvar perfil: ", error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={profilePictureUrl ? { uri: profilePictureUrl } : require('@/assets/images/profile/perfil.png')}
          style={styles.avatar}
        />
        <Text style={styles.avatarLabel}>Trocar foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
      />

      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        placeholder="DD/MM/AAAA"
      />
      
      <View style={styles.buttonContainer}>
        <Button title={saving ? "Salvando..." : "Salvar Alterações"} onPress={handleSaveChanges} disabled={saving} color="#00A99D" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff', alignItems: 'center', paddingTop: 40 },
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, backgroundColor: '#f0f0f0' },
    avatarLabel: { color: '#00A99D', fontSize: 16, marginBottom: 30 },
    label: { alignSelf: 'flex-start', marginLeft: '10%', fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 5 },
    input: { width: '80%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16 },
    buttonContainer: { width: '80%', marginTop: 20 },
});
