import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Realm from "realm";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  age: number;
}

export default function ListUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const realm = new Realm({
      schema: [
        {
          name: "Users",
          primaryKey: "id",
          properties: {
            id: "objectId",
            name: "string", // Kullanıcı adı
            surname: "string", // Kullanıcı soyadı
            email: "string", // Kullanıcı email
            password: "string", // Şifre
            role: "string", // Kullanıcı rolü
            age: "int", // Kullanıcı yaşı
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
        age: user.age,
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Kullanıcıları yüklerken hata oluştu:", error);
    } finally {
      realm.close();
    }
  }, []);

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>ID: {item.id}</Text>
      <Text style={styles.userText}>Ad: {item.name}</Text>
      <Text style={styles.userText}>Soyad: {item.surname}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Şifre: {item.password}</Text>
      <Text style={styles.userText}>Rol: {item.role}</Text>
      <Text style={styles.userText}>Yaş: {item.age}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıtlı Kullanıcılar</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
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
  userItem: {
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
  userText: {
    fontSize: 16,
    color: "#333",
  },
});
