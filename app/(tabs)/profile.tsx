import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Logo NutriFit */}
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Avatar */}
      <Image
        source={require('@/assets/images/profile/perfil.png')}
        style={styles.avatar}
      />

      {/* Nome do usuário */}
      <Text style={styles.name}>João da Silva</Text>

      {/* Bloco de dados: peso, IMC, metas */}
      <View style={styles.dataBox}>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>82Kg</Text>
          <Text style={styles.dataLabel}>Peso</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>26,3</Text>
          <Text style={styles.dataLabel}>IMC</Text>
        </View>
        <View style={styles.dataItem}>
          <Text style={styles.dataValue}>Metas</Text>
        </View>
      </View>

      {/* Ações */}
      <TouchableOpacity style={styles.action}>
        <Text style={styles.actionText}>Editar perfil</Text>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <Text style={styles.actionText}>Histórico de atividades</Text>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
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
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  dataBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  dataItem: {
    alignItems: 'center',
    flex: 1,
  },
  dataValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  dataLabel: {
    fontSize: 14,
    color: '#555',
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  actionText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#888',
  },
});