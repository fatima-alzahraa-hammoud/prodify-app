import { View, Text, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from 'react';

const signInScreen = () => {

    const router = useRouter();
    const {signIn, setActive, isLoaded} = useSignIn();

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () =>{
        if (!isLoaded) return;

        if (!loginForm.email || !loginForm.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const signInAttemp = await signIn.create({
                identifier: loginForm.email,
                password: loginForm.password,
            });

            if (signInAttemp.status === 'complete') {
                await setActive({ session: signInAttemp.createdSessionId });
            } else{
                Alert.alert("Error", "Sign in failed. Please try again.");
            console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (error) {
            Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed");
            console.error(JSON.stringify(error, null, 2));
        } finally{
            setLoading(false);
        }
    }
    return (
        <View>
            <Text>sign-in</Text>
        </View>
    );
}

export default signInScreen;