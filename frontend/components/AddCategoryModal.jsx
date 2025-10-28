import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Modal,
    Platform, ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { modalStyles } from '../assets/styles/modalStyles';
import { COLORS } from '../constants/colors';

const AddCategoryModal = ({ visible, onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission needed',
                    'Please grant camera roll permissions to select an image.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Image picker error:', error);
        }
    };

    const handleSave = async () => {
        if (!categoryName.trim()) {
            Alert.alert('Validation Error', 'Please enter a category name');
            return;
        }

        if (!imageUri) {
            Alert.alert('Validation Error', 'Please select an image');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('category', categoryName.trim());

            // Extract filename from URI
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // Backend expects 'image' field
            formData.append('image', {
                uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
                name: filename,
                type: type,
            });

            await onSave(formData);
            handleClose();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCategoryName('');
        setImageUri(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={modalStyles.modalOverlay}
            >
                <TouchableOpacity
                    style={modalStyles.modalOverlay}
                    activeOpacity={1}
                    onPress={handleClose}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={modalStyles.modalContent}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header */}
                            <View style={modalStyles.modalHeader}>
                                <Text style={modalStyles.modalTitle}>Add Category</Text>
                                <TouchableOpacity
                                    onPress={handleClose}
                                    style={modalStyles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>

                            {/* Image Picker */}
                            <View style={modalStyles.imageSection}>
                                <Text style={modalStyles.label}>Category Image</Text>
                                <TouchableOpacity
                                    style={modalStyles.imagePicker}
                                    onPress={pickImage}
                                    activeOpacity={0.7}
                                >
                                    {imageUri ? (
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={modalStyles.selectedImage}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={modalStyles.imagePickerPlaceholder}>
                                            <Ionicons
                                                name="image-outline"
                                                size={48}
                                                color={COLORS.textLight}
                                            />
                                            <Text style={modalStyles.imagePickerText}>
                                                Tap to select image
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Category Name Input */}
                            <View style={modalStyles.inputSection}>
                                <Text style={modalStyles.label}>Category Name</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    placeholder="Enter category name"
                                    placeholderTextColor={COLORS.textLight}
                                    value={categoryName}
                                    onChangeText={setCategoryName}
                                    maxLength={50}
                                />
                            </View>

                            {/* Action Buttons */}
                            <View style={modalStyles.buttonContainer}>
                                <TouchableOpacity
                                    style={[modalStyles.button, modalStyles.cancelButton]}
                                    onPress={handleClose}
                                    disabled={loading}
                                >
                                    <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        modalStyles.button,
                                        modalStyles.saveButton,
                                        loading && modalStyles.disabledButton,
                                    ]}
                                    onPress={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={modalStyles.saveButtonText}>Save</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddCategoryModal;