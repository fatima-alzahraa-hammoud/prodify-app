import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { profileStyles } from '../../assets/styles/profileStyle.js';
import { COLORS } from '../../constants/colors';

const ProfileScreen = () => {
    const { signOut } = useAuth();
    const { user } = useUser();

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const menuItems = [
        {
            id: 'account',
            title: 'Account Settings',
            icon: 'person-outline',
            onPress: () => console.log('Account Settings')
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: 'notifications-outline',
            onPress: () => console.log('Notifications')
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            icon: 'shield-checkmark-outline',
            onPress: () => console.log('Privacy')
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: 'help-circle-outline',
            onPress: () => console.log('Help')
        },
        {
            id: 'about',
            title: 'About',
            icon: 'information-circle-outline',
            onPress: () => console.log('About')
        },
    ];

    return (
        <View style={profileStyles.container}>
            <ScrollView
                contentContainerStyle={profileStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={profileStyles.header}>
                    <View style={profileStyles.avatarContainer}>
                        {user?.imageUrl ? (
                            <Image
                                source={{ uri: user.imageUrl }}
                                style={profileStyles.avatar}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={profileStyles.avatarPlaceholder}>
                                <Ionicons
                                    name="person"
                                    size={48}
                                    color={COLORS.primary}
                                />
                            </View>
                        )}
                    </View>

                    <Text style={profileStyles.name}>
                        {user?.fullName || user?.firstName || 'User'}
                    </Text>
                    
                    {user?.emailAddresses?.[0]?.emailAddress && (
                        <Text style={profileStyles.email}>
                            {user.emailAddresses[0].emailAddress}
                        </Text>
                    )}
                </View>

                {/* Menu Items */}
                <View style={profileStyles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                profileStyles.menuItem,
                                index === menuItems.length - 1 && profileStyles.lastMenuItem
                            ]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={profileStyles.menuItemLeft}>
                                <View style={profileStyles.menuIconContainer}>
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={COLORS.primary}
                                    />
                                </View>
                                <Text style={profileStyles.menuItemText}>
                                    {item.title}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={profileStyles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color={COLORS.white}
                        style={profileStyles.signOutIcon}
                    />
                    <Text style={profileStyles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={profileStyles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;