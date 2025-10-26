import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity, Alert } from 'react-native'
import { authStyles } from '../../assets/styles/authStyles';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import VerifyEmail from './verify-email';

const SignUp = () => {

    const router = useRouter();
    const {signUp, isLoaded} = useSignUp();

    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: ''    
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);

    const handleSignUp = async () => {
        if (!isLoaded) return;
        if (!registerForm.email || !registerForm.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (registerForm.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        
        try {
            await signUp.create({
                emailAddress: registerForm.email,
                password: registerForm.password,
            });

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
            setPendingVerification(true);
        } catch (error) {
            Alert.alert("Error", error.errors?.[0]?.message || "Sign up failed");
            console.error(JSON.stringify(error, null, 2));
        } finally{
            setLoading(false);
        }
    }

    if (pendingVerification){
        return <VerifyEmail email={registerForm.email} onBack={() => setPendingVerification(false)} />;
    }

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                style={authStyles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.imageContainer}>
                        <Image 
                            style={authStyles.image}
                            source={require('../../assets/images/store_owner_signUp.png')}
                            contentFit="contain"
                        />
                    </View>
                    <Text style={authStyles.title}>Create Account</Text>

                    <View
                        style={authStyles.formContainer}
                    >
                        <View style={authStyles.inputContainer}>
                            <TextInput 
                                style={authStyles.textInput}
                                placeholder="Email"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="email-address"
                                value={registerForm.email}
                                onChangeText={(text) => {
                                    setRegisterForm({...registerForm, email: text})
                                }}
                                autoCapitalize='none'
                            />    
                        </View>

                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter Password'
                                placeholderTextColor={COLORS.textLight}
                                value={registerForm.password}
                                onChangeText={(text) =>{
                                    setRegisterForm({...registerForm, password:text})
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize='none'
                            />   
                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity> 
                        </View>
                        
                        <TouchableOpacity
                            style={authStyles.authButton}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.back()}
                        >
                            <Text style={authStyles.linkText}>
                                Already have an account? <Text style={authStyles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignUp;