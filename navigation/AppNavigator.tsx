import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HastaDashboard from '../screens/HastaDashboard';
import DoktorDashboard from '../screens/DoktorDashboard';

// Stack Navigator için parametre türlerini tanımlıyoruz
type RootStackParamList = {
    Login: undefined;
    HastaDashboard: undefined;
    DoktorDashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
            <Stack.Screen name="HastaDashboard" component={HastaDashboard} options={{ title: 'Hasta Paneli' }} />
            <Stack.Screen name="DoktorDashboard" component={DoktorDashboard} options={{ title: 'Doktor Paneli' }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
