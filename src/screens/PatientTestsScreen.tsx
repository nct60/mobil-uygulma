import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Realm from "realm";

interface Test {
  id: string;
  test_name: string;
  value: number;
  date: string;
  comparison?: string; // ↑, ↓, ↔
  status?: "low" | "normal" | "high"; // Referans durumu
}

const referenceRanges: { 
  [key: string]: { 
    [ageRange: string]: { low: number; high: number } 
  } 
} = {
  IgA: {
    "0-5": { low: 0.07, high: 0.37 },
    "5-9": { low: 0.16, high: 0.5 },
    "9-15": { low: 0.27, high: 0.66 },
    "15-24": { low: 0.36, high: 0.79 },
    "24-48": { low: 0.27, high: 0.46 },
    "48+": { low: 0.27, high: 0.46 },
  },
  IgM: {
    "0-5": { low: 0.26, high: 1.12 },
    "5-9": { low: 0.34, high: 1.26 },
    "9-15": { low: 0.42, high: 1.38 },
    "15-24": { low: 0.49, high: 1.51 },
    "24-48": { low: 0.37, high: 1.84 },
    "48+": { low: 0.37, high: 1.84 },
  },
  IgG: {
    "0-5": { low: 1.0, high: 1.34 },
    "5-9": { low: 1.64, high: 5.88 },
    "9-15": { low: 2.46, high: 9.04 },
    "15-24": { low: 3.13, high: 11.7 },
    "24-48": { low: 2.95, high: 11.56 },
    "48+": { low: 2.95, high: 11.56 },
  },
  IgG1: {
    "0-5": { low: 0.56, high: 2.15 },
    "5-9": { low: 1.02, high: 3.69 },
    "9-15": { low: 1.60, high: 5.62 },
    "15-24": { low: 2.09, high: 7.24 },
    "24-48": { low: 1.58, high: 7.21 },
    "48+": { low: 1.58, high: 7.21 },
  },
  IgG2: {
    "0-5": { low: 0, high: 0.82 },
    "5-9": { low: 0, high: 0.89 },
    "9-15": { low: 0.24, high: 0.98 },
    "15-24": { low: 0.35, high: 1.05 },
    "24-48": { low: 0.39, high: 1.76 },
    "48+": { low: 0.39, high: 1.76 },
  },
  IgG3: {
    "0-5": { low: 0.07, high: 8.23 },
    "5-9": { low: 0.11, high: 7.40 },
    "9-15": { low: 0.17, high: 6.37 },
    "15-24": { low: 0.21, high: 5.50 },
    "24-48": { low: 0.17, high: 8.47 },
    "48+": { low: 0.17, high: 8.47 },
  },
  IgG4: {
    "0-5": { low: 0, high: 0.198 },
    "5-9": { low: 0, high: 0.208 },
    "9-15": { low: 0, high: 0.220 },
    "15-24": { low: 0, high: 0.230 },
    "24-48": { low: 0.004, high: 0.491 },
    "48+": { low: 0.004 ,high: 0.491 },
  },
};

function getAgeGroup(age: number): string {
  if (age <= 5) return "0-5";
  if (age <= 10) return "5-9";
  if (age <= 15) return "9-15";
  if (age <= 24) return "15-24";
  if (age <= 48) return "24-48";
  return "48+";
}

function getTestStatusByAge(testName: string, value: number, age: number): "low" | "high" | "normal" {
  const ageGroup = getAgeGroup(age);
  const range = referenceRanges[testName]?.[ageGroup];
  if (!range) return "normal"; // Belirtilen yaş grubu veya test yoksa varsayılan
  if (value < range.low) return "low";
  if (value > range.high) return "high";
  return "normal";
}

export default function PatientTestsScreen({ route }: any) {
  const [tests, setTests] = useState<Test[]>([]);
  const { patientId } = route.params;

  useEffect(() => {
    let realm: Realm | null = null;

    try {
      realm = new Realm({
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
          {
            name: "Users",
            primaryKey: "id",
            properties: {
              id: "objectId",
              name: "string", // Kullanıcı adı
              surname: "string", // Kullanıcı soyadı
              email: "string", // Kullanıcı email
              password: "string", // Şifre
              role: "string", // Kullanıcı rolü (ör: doktor, hasta)
              age: "int", // Kullanıcı yaşı
            },
          },
        ],
      });

      const user = realm
        .objects("Users")
        .filtered("id == $0", new Realm.BSON.ObjectId(patientId))[0];

        const userAge: number = user.age as number;

      const realmTests = realm
        .objects("Tests")
        .filtered("user_id == $0", new Realm.BSON.ObjectId(patientId));
      const testList = Array.from(realmTests).map((test: any) => ({
        id: test.id.toString(),
        test_name: test.test_name,
        value: test.value,
        date: new Date(test.date).toISOString().split("T")[0],
        status: getTestStatusByAge(test.test_name, test.value, userAge), // Referans durumunu hesapla, yaş kullanıcıdan alındı.
      }));

      // Gruplama ve karşılaştırma
      const groupedTests = Object.values(
        testList.reduce((groups: { [key: string]: Test[] }, test: Test) => {
          if (!groups[test.test_name]) groups[test.test_name] = [];
          groups[test.test_name].push(test);
          return groups;
        }, {})
      );

      const processedTests = groupedTests.flatMap((group) => {
        group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Tarihe göre doğru sırala
        return group.map((test, index) => ({
          ...test,
          comparison:
            index === 0
              ? "↔" // İlk değer için varsayılan
              : group[index].value > group[index - 1].value
              ? "↑"
              : group[index].value < group[index - 1].value
              ? "↓"
              : "↔",
        }));
      });

      setTests(processedTests);
    } catch (error) {
      console.error("Tahlil sonuçlarını yüklerken hata oluştu:", error);
    } finally {
      if (realm) {
        realm.close();
      }
    }
  }, [patientId]);

  const renderTest = ({ item }: { item: Test }) => {
    const comparisonStyle =
      item.comparison === "↓"
        ? styles.low
        : item.comparison === "↑"
        ? styles.high
        : styles.normal;

    const statusStyle =
      item.status === "low"
        ? styles.low
        : item.status === "high"
        ? styles.high
        : styles.normal;

    return (
      <View style={styles.testItem}>
        <Text style={styles.testText}>Tahlil Adı: {item.test_name}</Text>
        <Text style={styles.testText}>Değer: {item.value}</Text>
        <Text style={[styles.testText, statusStyle]}>
          Referans Durumu: {item.status === "low" ? "Düşük" : item.status === "high" ? "Yüksek" : "Normal"}
        </Text>
        <Text style={[styles.testText, comparisonStyle]}>
          Değişim: {item.comparison}
        </Text>
        <Text style={styles.testText}>Tarih: {item.date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahlil Sonuçları</Text>
      <FlatList
        data={tests}
        renderItem={renderTest}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  testItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  testText: {
    fontSize: 18,
    color: "#333",
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
});
