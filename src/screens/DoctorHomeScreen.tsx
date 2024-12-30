import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function DoctorHomeScreen({ navigation }: any) {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DoctorUsers")}
        >
          <Text style={styles.cardText}>Hastalar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AddPatientAndTestScreen")}
        >
          <Text style={styles.cardText}>Hasta Tahlil Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("UpdateUserDetailsScreen")}
        >
          <Text style={styles.cardText}>Hasta Güncelle</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  card: {
    flex: 1,
    margin: 10,
    height: 150,
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
