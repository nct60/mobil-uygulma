import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import DoctorHomeScreen from "./src/screens/DoctorHomeScreen";
import DoctorUsersScreen from "./src/screens/DoctorUsersScreen";
import AddPatientAndTestScreen from "./src/screens/AddPatientAndTestScreen";
import PatientTestsScreen from "./src/screens/PatientTestsScreen";
import AddTestForUserScreen from "./src/screens/AddTestForUserScreen";
import UpdateUserDetailsScreen from "./src/screens/UpdateUserDetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import UserHomeScreen from "./src/screens/UserHomeScreen"; 

const Stack = createStackNavigator();

function AppNavigator() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided.");
  }

  const { user } = authContext;

  return (
    <Stack.Navigator initialRouteName="Login">
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Giriş Yap" }}
        />
      ) : user.role === "doctor" ? (
        <>
          <Stack.Screen
            name="DoctorHome"
            component={DoctorHomeScreen}
            options={{ title: "Doktor Anasayfa" }}
          />
          <Stack.Screen
            name="DoctorUsers"
            component={DoctorUsersScreen}
            options={{ title: " Hastalar" }}
          />
          <Stack.Screen
            name="AddPatientAndTestScreen"
            component={AddPatientAndTestScreen}
            options={{ title: "Hasta ve Tahlil Ekle" }}
          />
          <Stack.Screen
            name="PatientTests"
            component={PatientTestsScreen}
            options={{ title: "Hasta Tahlil Sonuçları" }}
          />
          <Stack.Screen
            name="AddTestForUser"
            component={AddTestForUserScreen}
            options={{ title: "Yeni Tahlil Ekle" }}
          />
          <Stack.Screen
            name="UpdateUserDetailsScreen"
            component={UpdateUserDetailsScreen}
            options={{ title: "Kullanıcı Güncelle" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={{ title: "Hasta Anasayfa" }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
