import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { COLORS } from "../../constants/colors";

const TabsLayout = () => {

    const {isSignedIn, isLoaded} = useAuth();
    if (!isLoaded) return null;

    if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle:{
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle:{
                    fontSize: 12,
                    fontWeight: '600',
                }
            }}
        >

            <Tabs.Screen
                name='index'
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size}) => <Ionicons name='home' color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name='add-product'
                options={{
                    title: "Add Product",
                    tabBarIcon: ({color, size}) => <Ionicons name='add-circle' color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    tabBarIcon: ({color, size}) => <Ionicons name='person' color={color} size={size} />
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;