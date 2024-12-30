import React, { useState } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Realm from "realm";
import "react-native-get-random-values";
import { ObjectId } from "bson";

export default function AddTestForUserScreen({ route, navigation }: any) {
  const { patientId } = route.params; // Kullanıcı ID'sini al

  const [testValues, setTestValues] = useState({
    IgA: "",
    IgG: "",
    IgM: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
  });

  const testFields = ["IgA", "IgG", "IgM", "IgG1", "IgG2", "IgG3", "IgG4"];

  // Test değerlerini güncelleyen fonksiyon
  const handleTestValueChange = (
    field: keyof typeof testValues,
    value: string
  ) => {
    setTestValues({ ...testValues, [field]: value });
  };

  const handleSave = async () => {
    let realm: Realm | null = null; // Başlangıçta null olarak tanımlandı
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
        ],
      });

      const tests = Object.entries(testValues).map(([testName, value]) => {
        const parsedValue = parseFloat(value.trim());
        if (isNaN(parsedValue)) {
          throw new Error(`Test değeri geçerli bir sayı değil: ${testName}`);
        }
        return {
          test_name: testName,
          value: parsedValue,
        };
      });

      realm.write(() => {
        tests.forEach((test) => {
          realm?.create("Tests", {
            id: new ObjectId(),
            user_id: new ObjectId(patientId),
            test_name: test.test_name,
            value: test.value,
            date: new Date(),
          });
        });
      });

      Alert.alert("Başarılı", "Tahlil bilgileri başarıyla kaydedildi!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Kaydetme sırasında hata:", error.message);
      Alert.alert("Hata", "Kaydetme sırasında bir hata oluştu: " + error.message);
    } finally {
      if (realm) {
        realm.close(); // Eğer realm null değilse kapatma işlemini yap
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yeni Tahlil Ekle</Text>

      {testFields.map((field) => (
        <View style={styles.inputWrapper} key={field}>
          <Text style={styles.label}>{field}</Text>
          <TextInput
            style={styles.input}
            placeholder={`${field} değeri giriniz`}
            value={testValues[field as keyof typeof testValues]}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleTestValueChange(field as keyof typeof testValues, text)
            }
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
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
    color: "#333",
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
