import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { saveTestResult } from "../../services/testService"; // `../../` yolunu düzelttik
import 'react-native-get-random-values';

export default function PatientTestInputScreen() {
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    surname: "",
    age: "",
  });

  const [testValues, setTestValues] = useState({
    IgA: "",
    IgG: "",
    IgM: "",
  });

  const handleInputChange = (field: "name" | "surname" | "age", value: string) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handleTestValueChange = (field: "IgA" | "IgG" | "IgM", value: string) => {
    setTestValues({ ...testValues, [field]: value });
  };

  const handleSave = () => {
    console.log("Hasta Bilgileri:", patientInfo);
    console.log("Test Değerleri:", testValues);

    // Test değerlerini Realm'e kaydetme
    Object.entries(testValues).forEach(([testName, value]) => {
      const numericValue = typeof value === "string" ? parseFloat(value) : 0; // Varsayılan değer ekledik
      saveTestResult(
        "64a7f53c10c7b9a6d7c0e0e1", // Örnek User ID
        testName,
        numericValue, // Sayıya çevrilen değer
        "Normal", // Örnek kategori
        "↔" // Örnek trend
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hasta Bilgileri</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={patientInfo.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={patientInfo.surname}
        onChangeText={(text) => handleInputChange("surname", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş"
        value={patientInfo.age}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange("age", text)}
      />

      <Text style={styles.title}>Test Değerleri</Text>

      {["IgA", "IgG", "IgM"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`${field} Değeri`}
          value={testValues[field as "IgA" | "IgG" | "IgM"]}
          keyboardType="numeric"
          onChangeText={(text) => handleTestValueChange(field as "IgA" | "IgG" | "IgM", text)}
        />
      ))}

      <Button title="Kaydet" onPress={handleSave} />
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
