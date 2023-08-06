import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ExposureCalculator from "./components/ExposureCalculator";
import { PaperProvider } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 16,
    paddingBottom: 10,
  },
});

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>Exposure Buddy</Text>
        <ExposureCalculator />
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}
