import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { productFormStyles } from '../../assets/styles/productFormStyles';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS } from '../../constants/colors';
import { categoriesAPI } from '../../services/categoriesAPI';
import { handleAPIError } from '../../services/handleAPIError';
import { productsAPI } from '../../services/productsAPI';

const AddProduct = () => {
    const { getToken } = useAuth();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
    });

    useEffect(() => {
        loadCategories();
        requestPermissions();
    }, []);

    // Reload categories when screen comes into focus
    useEffect(() => {
        if (isFocused) {
            loadCategories();
        }
    }, [isFocused]);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photos');
        }
    };

    const loadCategories = async () => {
        try {
            const token = await getToken();
            const fetchedCategories = await categoriesAPI.getAll(token);
            setCategories(fetchedCategories || []);
        } catch (error) {
            const err = handleAPIError(error);
            console.error('Error loading categories:', err.message);
        }
    };

    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 10 - images.length,
            });

            if (!result.canceled && result.assets) {
                setImages([...images, ...result.assets]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title.trim()) {
            Alert.alert('Error', 'Please enter a product title');
            return;
        }
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }
        if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
            Alert.alert('Error', 'Please enter a valid quantity');
            return;
        }
        if (images.length === 0) {
            Alert.alert('Error', 'Please add at least one image');
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            
            // Create FormData
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity);
            if (formData.categoryId) {
                data.append('categoryId', formData.categoryId);
            }

            // Append images
            images.forEach((image, index) => {
                const uriParts = image.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                data.append('images', {
                    uri: image.uri,
                    name: `photo_${index}.${fileType}`,
                    type: `image/${fileType}`,
                });
            });

            await productsAPI.create(token, data);
            
            Alert.alert('Success', 'Product created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            const err = handleAPIError(error);
            Alert.alert('Error', err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Creating product..." />;

    return (
        <KeyboardAvoidingView
            style={productFormStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                style={productFormStyles.scrollView}
                contentContainerStyle={productFormStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Card */}
                <View style={productFormStyles.headerCard}>
                    <View style={productFormStyles.headerIconContainer}>
                        <Ionicons name="cube" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={productFormStyles.headerTitle}>Create New Product</Text>
                    <Text style={productFormStyles.headerSubtitle}>
                        Add photos and details to list your product
                    </Text>
                </View>

                {/* Images Section */}
                <View style={productFormStyles.section}>
                    <View style={productFormStyles.sectionHeader}>
                        <View style={productFormStyles.sectionTitleContainer}>
                            <Ionicons name="images" size={20} color={COLORS.text} />
                            <Text style={productFormStyles.sectionTitle}>Product Photos</Text>
                        </View>
                        <View style={productFormStyles.requiredBadge}>
                            <Text style={productFormStyles.requiredText}>Required</Text>
                        </View>
                    </View>
                    <Text style={productFormStyles.sectionSubtitle}>
                        Add up to 10 high-quality images • First image will be the cover
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={productFormStyles.imagesScroll}
                        contentContainerStyle={productFormStyles.imagesScrollContent}
                    >
                        {images.length < 10 && (
                            <TouchableOpacity
                                style={productFormStyles.addImageButton}
                                onPress={pickImages}
                            >
                                <View style={productFormStyles.addImageIconContainer}>
                                    <Ionicons name="camera" size={32} color={COLORS.primary} />
                                </View>
                                <Text style={productFormStyles.addImageText}>Add Photos</Text>
                                <Text style={productFormStyles.addImageSubtext}>
                                    {images.length}/10
                                </Text>
                            </TouchableOpacity>
                        )}

                        {images.map((image, index) => (
                            <View key={index} style={productFormStyles.imageContainer}>
                                <Image
                                    source={{ uri: image.uri }}
                                    style={productFormStyles.image}
                                    contentFit="cover"
                                />
                                {index === 0 && (
                                    <View style={productFormStyles.coverBadge}>
                                        <Text style={productFormStyles.coverBadgeText}>Cover</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={productFormStyles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close" size={18} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Product Details */}
                <View style={productFormStyles.section}>
                    <View style={productFormStyles.sectionHeader}>
                        <View style={productFormStyles.sectionTitleContainer}>
                            <Ionicons name="information-circle" size={20} color={COLORS.text} />
                            <Text style={productFormStyles.sectionTitle}>Product Details</Text>
                        </View>
                    </View>

                    <View style={productFormStyles.inputGroup}>
                        <View style={productFormStyles.labelContainer}>
                            <Text style={productFormStyles.label}>Title</Text>
                            <View style={productFormStyles.requiredDot} />
                        </View>
                        <View style={productFormStyles.inputWrapper}>
                            <Ionicons 
                                name="pricetag-outline" 
                                size={18} 
                                color={COLORS.textLight}
                                style={productFormStyles.inputIcon}
                            />
                            <TextInput
                                style={productFormStyles.input}
                                placeholder="e.g., Vintage Leather Jacket"
                                placeholderTextColor={COLORS.textLight}
                                value={formData.title}
                                onChangeText={(text) => setFormData({ ...formData, title: text })}
                            />
                        </View>
                    </View>

                    <View style={productFormStyles.inputGroup}>
                        <Text style={productFormStyles.label}>Description</Text>
                        <View style={productFormStyles.inputWrapper}>
                            <Ionicons 
                                name="document-text-outline" 
                                size={18} 
                                color={COLORS.textLight}
                                style={[productFormStyles.inputIcon, { alignSelf: 'flex-start', marginTop: 14 }]}
                            />
                            <TextInput
                                style={[productFormStyles.input, productFormStyles.textArea]}
                                placeholder="Describe your product in detail..."
                                placeholderTextColor={COLORS.textLight}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    <View style={productFormStyles.row}>
                        <View style={[productFormStyles.inputGroup, productFormStyles.halfWidth]}>
                            <View style={productFormStyles.labelContainer}>
                                <Text style={productFormStyles.label}>Price</Text>
                                <View style={productFormStyles.requiredDot} />
                            </View>
                            <View style={productFormStyles.inputWrapper}>
                                <Ionicons 
                                    name="cash-outline" 
                                    size={18} 
                                    color={COLORS.textLight}
                                    style={productFormStyles.inputIcon}
                                />
                                <TextInput
                                    style={productFormStyles.input}
                                    placeholder="0.00"
                                    placeholderTextColor={COLORS.textLight}
                                    value={formData.price}
                                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        <View style={[productFormStyles.inputGroup, productFormStyles.halfWidth]}>
                            <View style={productFormStyles.labelContainer}>
                                <Text style={productFormStyles.label}>Quantity</Text>
                                <View style={productFormStyles.requiredDot} />
                            </View>
                            <View style={productFormStyles.inputWrapper}>
                                <Ionicons 
                                    name="layers-outline" 
                                    size={18} 
                                    color={COLORS.textLight}
                                    style={productFormStyles.inputIcon}
                                />
                                <TextInput
                                    style={productFormStyles.input}
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textLight}
                                    value={formData.quantity}
                                    onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={productFormStyles.inputGroup}>
                        <View style={[productFormStyles.sectionTitleContainer, productFormStyles.category]}>
                            <Ionicons name="apps" size={18} color={COLORS.text} />
                            <Text style={productFormStyles.label}>Category</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={productFormStyles.categoriesScroll}
                            contentContainerStyle={productFormStyles.categoriesScrollContent}
                        >
                            <TouchableOpacity
                                style={[
                                    productFormStyles.categoryChip,
                                    !formData.categoryId && productFormStyles.categoryChipSelected,
                                ]}
                                onPress={() => setFormData({ ...formData, categoryId: '' })}
                            >
                                <Ionicons 
                                    name="remove-circle-outline" 
                                    size={16} 
                                    color={!formData.categoryId ? COLORS.white : COLORS.textLight}
                                    style={productFormStyles.categoryIcon}
                                />
                                <Text
                                    style={[
                                        productFormStyles.categoryChipText,
                                        !formData.categoryId && productFormStyles.categoryChipTextSelected,
                                    ]}
                                >
                                    None
                                </Text>
                            </TouchableOpacity>

                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        productFormStyles.categoryChip,
                                        formData.categoryId === category.id.toString() &&
                                            productFormStyles.categoryChipSelected,
                                    ]}
                                    onPress={() =>
                                        setFormData({ ...formData, categoryId: category.id.toString() })
                                    }
                                >
                                    <Ionicons 
                                        name="pricetag" 
                                        size={16} 
                                        color={formData.categoryId === category.id.toString() ? COLORS.white : COLORS.textLight}
                                        style={productFormStyles.categoryIcon}
                                    />
                                    <Text
                                        style={[
                                            productFormStyles.categoryChipText,
                                            formData.categoryId === category.id.toString() &&
                                                productFormStyles.categoryChipTextSelected,
                                        ]}
                                    >
                                        {category.category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={productFormStyles.footer}>
                <TouchableOpacity
                    style={[
                        productFormStyles.submitButton,
                        loading && productFormStyles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
                    <Text style={productFormStyles.submitButtonText}>Create Product</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AddProduct;