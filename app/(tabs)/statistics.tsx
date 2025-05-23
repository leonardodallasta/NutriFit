import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/nutrifit.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Estatísticas</Text>

      <View style={styles.card}>
        <StatItem
          label="Água"
          value="1,9 / 2,5L"
          progress={0.76}
          color="#3b82f6"
        />
        <StatItem
          label="Calorias"
          value="1820 / 2200"
          progress={0.83}
          color="#f97316"
        />
        <StatItem
          label="Proteínas"
          value="120 / 150g"
          progress={0.8}
          color="#ec4899"
        />
        <StatItem
          label="Carboidratos"
          value="200 / 250g"
          progress={0.8}
          color="#22c55e"
        />
      </View>
    </View>
  );
}

function StatItem({ label, value, progress, color }: { label: string; value: string; progress: number; color: string; }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Image
              source={require('@/assets/images/statistical/botao_remover.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('@/assets/images/statistical/botao_verde.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
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
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statItem: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  icons: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 14,
    color: '#555',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});
