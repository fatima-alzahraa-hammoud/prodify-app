import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { homeStyles } from '../../assets/styles/homeStyles';
import { searchStyles } from '../../assets/styles/searchStyles';
import AddCategoryModal from '../../components/AddCategoryModal';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import { COLORS } from '../../constants/colors';
import { categoriesAPI } from '../../services/categoriesAPI';
import { handleAPIError } from '../../services/handleAPIError';
import { productsAPI } from '../../services/productsAPI';

const HomeScreen = () => {
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, selectedCategory, products]);

    const loadCategories = async () => {
        try {
            const token = await getToken();
            const categories = await categoriesAPI.getAll(token);
            setCategories(categories || []);
        } catch (error) {
            const err = handleAPIError(error);
            console.error('Error loading categories:', err.message);
        }
    }

    const loadProducts = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const products = await productsAPI.getAll(token);
            setProducts(products || []);
        } catch (error) {
            const err = handleAPIError(error);
            console.error('Error loading products:', err.message);
        } finally {
            setLoading(false);
        }
    }

    const filterProducts = () => {
        let filtered = [...products];

        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryId === selectedCategory.id);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
                || product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }

    const handleCategorySelect = async (category) => {
        if (category === selectedCategory) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
        setSearchQuery("");
        // load category data
    };

    const handleAddCategory = () => {
        setModalVisible(true);
    };

    const handleSaveCategory = async (formData) => {
        try {
            const token = await getToken();
            await categoriesAPI.create(token, formData);

            Alert.alert('Success', 'Category created successfully');

            // Reload categories
            await loadCategories();
        } catch (error) {
            const err = handleAPIError(error);
            throw new Error(err.message);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCategories();
        await loadProducts();
        setRefreshing(false);
    }

    if (loading && !refreshing) return <Text>Loading...</Text>;

    return (
        <View style={homeStyles.container}>
            <View style={searchStyles.searchSection}>
                <View style={searchStyles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={COLORS.textLight}
                        style={searchStyles.searchIcon}
                    />
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder="Search products"
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType='search'
                    />

                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            style={searchStyles.clearButton}
                        >
                            <Ionicons
                                name='close-circle'
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={homeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Image */}
                <View style={homeStyles.bannerImageContainer}>
                    <Image
                        source={require("../../assets/images/home_banner.png")}
                        style={homeStyles.bannerImage}
                        contentFit='contain'
                        transition={500}
                    />
                </View>

                {/* Categories with add button */}
                {categories && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                        onAddPress={handleAddCategory}
                        showAddButton={true}
                    />
                )}

                {/* render products */}
                <View style={homeStyles.productsSection}>
                    <View style={homeStyles.sectionHeader}>
                        <Text style={homeStyles.sectionTitle}>
                            {
                                searchQuery
                                    ? `Results for ${searchQuery}`
                                    : selectedCategory
                                        ? selectedCategory
                                        : "All Products"
                            }
                        </Text>
                        <Text style={searchStyles.productCount}>
                            {filteredProducts.length} products
                        </Text>
                    </View>

                    {filteredProducts.length > 0 ? (
                        <FlatList
                            data={filteredProducts}
                            renderItem={({ item }) => <ProductCard product={item} />}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={homeStyles.row}
                            contentContainerStyle={homeStyles.productsGrid}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={homeStyles.emptyState}>
                            <Ionicons
                                name='cube-outline'
                                size={64}
                                color={COLORS.textLight}
                            />
                            <Text style={homeStyles.emptyTitle}>No products found</Text>
                            <Text style={homeStyles.emptyDescription}>
                                {searchQuery
                                    ? "Try adjusting your search"
                                    : selectedCategory
                                        ? "No products in this category"
                                        : "Start by adding your first product"
                                }
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <AddCategoryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveCategory}
            />
        </View>
    )
}

export default HomeScreen;