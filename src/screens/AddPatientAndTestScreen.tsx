import React, { useState } from "react";
import { Alert } from "react-native";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Realm from "realm";
import "react-native-get-random-values";
import { ObjectId } from "bson";
import { addPatientWithTests } from "../../services/deneme";

export default function AddPatientAndTestScreen() {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    surname: "",
    age: "",
    email: "",
    password: "",
  });

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

  const handleInputChange = (field: keyof typeof patientInfo, value: string) => {
    console.log(`Güncelleniyor -> Field: ${field}, Value: ${value}`); // Log eklendi
    setPatientInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleTestValueChange = (field: keyof typeof testValues, value: string) => {
    setTestValues({ ...testValues, [field]: value });
  };

  const handleSave = async () => {
    try {
      console.log("Hasta Bilgileri (raw):", patientInfo);
      const numericAge = parseInt(patientInfo.age.trim(), 10);
      console.log("Parsed Age:", numericAge);

      if (
        !patientInfo.name.trim() ||
        !patientInfo.surname.trim() ||
        !patientInfo.email.trim() ||
        !patientInfo.password.trim() ||
        isNaN(numericAge) ||
        numericAge <= 0
      ) {
        console.error("Hata: Alanlar boş veya geçersiz yaş değeri.");
        throw new Error("Lütfen tüm alanları doldurun ve geçerli bir yaş girin.");
      }

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

      console.log("Gönderilecek Hasta Bilgileri:", { ...patientInfo, age: numericAge });
      console.log("Gönderilecek Test Bilgileri:", tests);

      await addPatientWithTests({ ...patientInfo, age: numericAge }, tests);
      Alert.alert("Hasta ve test bilgileri başarıyla kaydedildi!");
    } catch (error: any) {
      console.error("Kaydetme sırasında hata:", error.message);
      Alert.alert("Kaydetme sırasında bir hata oluştu:", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yeni Hasta Ekle</Text>

      {["name", "surname", "age", "email", "password"].map((field) => (
        <View style={styles.inputWrapper} key={field}>
          <Text style={styles.label}>{field.toUpperCase()}</Text>
          <TextInput
            style={styles.input}
            placeholder={`${field} giriniz`}
            value={patientInfo[field as keyof typeof patientInfo]} // Doğru bağlama
            keyboardType={field === "age" ? "numeric" : "default"}
            secureTextEntry={field === "password"}
            onChangeText={(text) => handleInputChange(field as keyof typeof patientInfo, text)}
          />
        </View>
      ))}

      <Text style={styles.title}>Test Değerleri</Text>

      {testFields.map((field) => (
        <View style={styles.inputWrapper} key={field}>
          <Text style={styles.label}>{field}</Text>
          <TextInput
            style={styles.input}
            placeholder={`${field} değeri giriniz`}
            value={testValues[field as keyof typeof testValues]}
            keyboardType="numeric"
            onChangeText={(text) => handleTestValueChange(field as keyof typeof testValues, text)}
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
