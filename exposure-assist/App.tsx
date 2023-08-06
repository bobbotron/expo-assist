import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ExposureCalculator from "./components/ExposureCalculator";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import Theme from "./theme/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    width: "99%",
  },
});

const theme = {
  ...DefaultTheme,
  colors: Theme.lightMode.colors
};
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ExposureCalculator />
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}
