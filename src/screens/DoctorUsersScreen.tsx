import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Realm from "realm";

interface User {
  id: string;
  name: string;
  surname: string;
}

export default function DoctorUsersScreen({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Arama sorgusu durumu
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Filtrelenmiş kullanıcılar

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
            age: "int",
            email: "string",
            password: "string",
            role: "string", 
          },
        },
      ],
    });

    try {
      const realmUsers = realm.objects<User>("Users");
      const userList = Array.from(realmUsers).map((user) => ({
        id: user.id.toString(),
        name: user.name,
        surname: user.surname,
      }));
      setUsers(userList);
      setFilteredUsers(userList); // Başlangıçta tüm kullanıcılar filtrelenmiş listeye eklenir
    } catch (error: any) {
      console.error("Kullanıcıları yüklerken hata oluştu:", error.message || error);
    } finally {
      realm.close();
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.surname.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>{item.name} {item.surname}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PatientTests", { patientId: item.id })}
        >
          <Text style={styles.buttonText}>Tahlilleri Görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddTestForUser", { patientId: item.id })}
        >
          <Text style={styles.buttonText}>Yeni Tahlil Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HASTALAR</Text>
      <TextInput
        style={styles.searchInput}
        placeholder=" Arama"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredUsers}
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
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
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
    fontSize: 18,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
