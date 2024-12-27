import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext, User } from "../context/AuthContext";
import Realm from "realm";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  if (!authContext) {
    Alert.alert("Hata", "AuthContext bulunamadı.");
    return null;
  }

  const { login } = authContext;

  const handleLogin = () => {
    const { ObjectId } = Realm.BSON; // Access ObjectId from Realm.BSON

    const realm = new Realm({
      schema: [
        {
          name: "Users",
          primaryKey: "id",
          properties: {
            id: "objectId", // Ensures it's an ObjectId
            name: "string",
            surname: "string",
            email: "string",
            password: "string",
            role: "string",
            age: "int",
          },
        },
      ],
    });

    try {
      const realmUser = realm.objects("Users").filtered(`email == "${email}"`)[0];

      if (!realmUser) {
        Alert.alert("Hata", "Kullanıcı bulunamadı.");
        return;
      }

      if (realmUser.password === password) {
        const userCopy: User = {
          id: (realmUser.id as Realm.BSON.ObjectId).toHexString(),
          name: realmUser.name as string,
          surname: realmUser.surname as string,
          email: realmUser.email as string,
          role: realmUser.role as string,
          age: realmUser.age as number,
        };

        login(userCopy);

        Alert.alert("Başarılı", "Giriş başarılı!", [
          {
            text: "Tamam",
            onPress: () =>
              userCopy.role === "doctor"
                ? navigation.navigate("DoctorHome")
                : navigation.navigate("UserHome"),
          },
        ]);
      } else {
        Alert.alert("Hata", "Şifre yanlış.");
      }
    } catch (error) {
      console.error("Giriş sırasında hata oluştu:", error);
      Alert.alert("Hata", "Bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      realm.close();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  button: {
    width: "80%",
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
