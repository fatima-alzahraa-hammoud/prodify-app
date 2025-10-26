import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity } from 'react-native'
import { authStyles } from '../../assets/styles/authStyles';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';

const VerifyEmail = ({email, onBack}) => {

    const {isLoaded, signUp, setActive} = useSignUp();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');

    const handleVerification = async () => {
        if (!isLoaded) return;

        if (!code){
            Alert.alert("Enter the code!");
            return;
        }

        setLoading(true);

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({code});

            if (signUpAttempt.status === "complete"){
                await setActive({session: signUpAttempt.createdSessionId });
            } else{
                Alert.alert("Error", "Email verification failed. Please try again.");
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (error) {
            Alert.alert("Error", error.errors?.[0]?.message || "Verification failed");
            console.error(JSON.stringify(error, null, 2));
        } finally{
            setLoading(false);
        }
    };

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
                    <View
                        style={authStyles.imageContainer}
                    >
                        <Image 
                            source={require("../../assets/images/verify_email1.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    <Text style={authStyles.title}>Verify Your Email</Text>
                    <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter Verification Code'
                                placeholderTextColor={COLORS.textLight}
                                value={code}
                                onChangeText={setCode}
                                keyboardType='number-pad'
                                autoCapitalize='none'
                            />
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={handleVerification}
                            buttonDisabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={authStyles.linkContainer}
                            onPress={onBack}
                        >
                            <Text style={authStyles.linkText}>
                                <Text style={authStyles.link}>Back to Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default VerifyEmail;