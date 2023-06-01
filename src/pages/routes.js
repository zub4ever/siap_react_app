import React from "react";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';

import AreaRestrita from "./AreaRestrita";
import Home from "./Home";

const Tab = createBottomTabNavigator();

export default function Routes() {
    return (
        <Tab.Navigator>

            <Tab.Screen
                name="Inicio"
                component={Home}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Àrea Restria"
                component={AreaRestrita}
                options={{
                    tabBarLabel: 'Área Restrita',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}