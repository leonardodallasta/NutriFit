import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function TrainingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Treinos</Text>

      <TrainingButton
        label="Corrida"
        icon={require('@/assets/images/training/corrida.png')}
      />
      <TrainingButton
        label="Natação"
        icon={require('@/assets/images/training/natacao.png')}
      />
      <TrainingButton
        label="Yoga"
        icon={require('@/assets/images/training/yoga.png')}
      />
      <TrainingButton
        label="Ciclismo"
        icon={require('@/assets/images/training/ciclismo.png')}
      />
      <TrainingButton
        label="Musculação"
        icon={require('@/assets/images/training/musculacao.png')}
      />
    </View>
  );
}

function TrainingButton({ label, icon }: { label: string; icon: any }) {
  return (
    <TouchableOpacity style={styles.button}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
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
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
