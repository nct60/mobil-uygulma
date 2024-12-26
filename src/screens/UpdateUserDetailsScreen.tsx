import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Realm from "realm";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  age: string;
}

export default function UpdateUserDetailsScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedDetails, setUpdatedDetails] = useState<User | null>(null);

  useEffect(() => {
    const realm = new Realm({
      schema: [
        {
          name: "Users",
          primaryKey: "id",
          properties: {
            id: "objectId",
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
      const realmUsers = realm.objects("Users");
      const userList = Array.from(realmUsers).map((user: any) => ({
        id: user.id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
        role: user.role,
        age: user.age.toString(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Kullanıcıları yüklerken hata oluştu:", error);
    } finally {
      realm.close();
    }
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUpdatedDetails({ ...user });
  };

  const handleUpdate = () => {
    if (!updatedDetails) return;

    const realm = new Realm({
      schema: [
        {
          name: "Users",
          primaryKey: "id",
          properties: {
            id: "objectId",
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
      realm.write(() => {
        const user = realm.objectForPrimaryKey("Users", new Realm.BSON.ObjectId(updatedDetails.id));
        if (user) {
          user.name = updatedDetails.name;
          user.surname = updatedDetails.surname;
          user.email = updatedDetails.email;
          user.password = updatedDetails.password;
          user.role = updatedDetails.role;
          user.age = parseInt(updatedDetails.age, 10);
          Alert.alert("Başarılı!", "Kullanıcı bilgileri güncellendi.");
        } else {
          Alert.alert("Hata!", "Kullanıcı bulunamadı.");
        }
      });
    } catch (error) {
      console.error("Bilgiler güncellenirken hata oluştu:", error);
      Alert.alert("Hata!", "Bilgiler güncellenirken bir sorun oluştu.");
    } finally {
      realm.close();
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    if (!updatedDetails) return;
    setUpdatedDetails({ ...updatedDetails, [field]: value });
  };

  return (
    <View style={styles.container}>
      {!selectedUser ? (
        <>
          <Text style={styles.title}>Kullanıcı Seç</Text>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => handleUserSelect(item)}
              >
                <Text style={styles.userText}>{item.name} {item.surname}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Kullanıcı Güncelle</Text>
          {Object.keys(updatedDetails || {}).map((field) =>
            field !== "id" ? (
              <View style={styles.inputWrapper} key={field}>
                <Text style={styles.label}>{field.toUpperCase()}</Text>
                <TextInput
                  style={styles.input}
                  value={updatedDetails?.[field as keyof User] || ""}
                  onChangeText={(value) => handleChange(field as keyof User, value)}
                  keyboardType={field === "age" ? "numeric" : "default"}
                  secureTextEntry={field === "password"}
                />
              </View>
            ) : null
          )}
          <Button title="Güncelle" onPress={handleUpdate} />
        </>
      )}
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
  userItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    fontSize: 18,
    color: "#333",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
