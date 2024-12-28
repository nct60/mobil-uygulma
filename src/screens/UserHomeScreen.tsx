import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Realm from "realm";

const screenWidth = Dimensions.get("window").width;

interface Test {
  id: string;
  test_name: string;
  value: number;
  date: string;
}

const referenceRanges: { [key: string]: { low: number; high: number } } = {
  IgA: { low: 0.5, high: 2.0 },
  IgM: { low: 0.4, high: 1.5 },
  IgG: { low: 0.6, high: 2.5 },
  IgG1: { low: 0.8, high: 2.3 },
  IgG2: { low: 0.7, high: 1.9 },
  IgG3: { low: 0.5, high: 1.7 },
  IgG4: { low: 0.4, high: 1.6 },
};

function getTestStatus(testName: string, value: number): "low" | "high" | "normal" {
  const range = referenceRanges[testName];
  if (!range) return "normal";
  if (value < range.low) return "low";
  if (value > range.high) return "high";
  return "normal";
}

export default function UserHomeScreen() {
  const { user, logout } = useContext(AuthContext);
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    if (!user || !user.id) {
      console.error("Kullanıcı bilgisi eksik!");
      return;
    }

    const realm = new Realm({
      schema: [
        {
          name: "Tests",
          primaryKey: "id",
          properties: {
            id: "objectId",
            user_id: "objectId",
            test_name: "string",
            value: "float",
            date: "date",
          },
        },
      ],
    });

    try {
      const realmTests = realm
        .objects("Tests")
        .filtered("user_id == $0", new Realm.BSON.ObjectId(user.id));

      const testList = Array.from(realmTests).map((test: any) => ({
        id: test.id.toString(),
        test_name: test.test_name,
        value: test.value,
        date: new Date(test.date).toISOString().split("T")[0],
      }));

      setTests(testList);
    } catch (error) {
      console.error("Tahlil sonuçlarını yüklerken hata oluştu:", error);
    } finally {
      realm.close();
    }
  }, [user]);

  const renderTest = ({ item }: { item: Test }) => {
    const status = getTestStatus(item.test_name, item.value);
    const statusStyle =
      status === "low"
        ? styles.low
        : status === "high"
        ? styles.high
        : styles.normal;

    return (
      <View style={styles.testCard}>
        <View style={styles.testHeader}>
          <Text style={styles.testName}>{item.test_name}</Text>
          <Text style={[styles.testStatus, statusStyle]}>{status.toUpperCase()}</Text>
        </View>
        <Text style={styles.testDetails}>Değer: {item.value}</Text>
        <Text style={styles.testDetails}>Tarih: {item.date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text style={styles.title}>HOŞGELDİNİZ
             
             
             </Text>
             <Text style={styles.title}>
             
             
             {user.name} {user.surname}</Text>



          <Text style={styles.subtitle}>Tahlil Sonuçlarınız:</Text>
        </>
      )}
      <FlatList
        data={tests}
        renderItem={renderTest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#374151",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#6b7280",
  },
  listContainer: {
    paddingBottom: 16,
  },
  testCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  testName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  testStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  testDetails: {
    fontSize: 16,
    color: "#4b5563",
    marginTop: 4,
  },
  low: {
    color: "red",
  },
  high: {
    color: "green",
  },
  normal: {
    color: "blue",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
