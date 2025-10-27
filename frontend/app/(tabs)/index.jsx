import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { homeStyles } from '../../assets/styles/homeStyles';
import { searchStyles } from '../../assets/styles/searchStyles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useEffect, useState } from 'react';
import {Image} from "expo-image";
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';

const HomeScreen = () => {

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, selectedCategory, products]);

    const loadCategories = async () =>{

        try {
            
            setCategories([
                { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/100' },
                { id: 2, name: 'Clothing', image: 'https://via.placeholder.com/100' },
                { id: 3, name: 'Home', image: 'https://via.placeholder.com/100' },
            ]);

        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    const loadProducts = async () =>{
        try {
            setLoading(true);


            setProducts([
                { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics', image: 'https://via.placeholder.com/200', quantity: 6, description: "hello" },
                { id: 2, name: 'Product 2', price: 49.99, category: 'Clothing', image: 'https://via.placeholder.com/200', quantity: 4,  description: "hiii"  },
            ]);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }

    const filterProducts = () => {
        let filtered = [...products];

        if (selectedCategory){
            filtered = filtered.filter( product => product.category === selectedCategory);
        }

        if (searchQuery.trim()){
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredProducts(filtered);
    }

    const handleCategorySelect = async (category) => {
        if (category === selectedCategory){
            setSelectedCategory(null);
        } else{
            setSelectedCategory(category);
        }
        setSearchQuery("");
        // load category data
    };

    const handleAddCategory = () => {

    };

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
                {categories.length > 0 && (
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
                            renderItem={({item}) => <ProductCard product={item}/>}
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
                                { searchQuery
                                    ? "Try adjusting your search"
                                    : ""
                                }
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default HomeScreen;