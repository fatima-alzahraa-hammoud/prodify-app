import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { homeStyles } from '../../assets/styles/homeStyles';
import { searchStyles } from '../../assets/styles/searchStyles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useState } from 'react';
import {Image} from "expo-image";
import CategoryFilter from '../../components/CategoryFilter';

const HomeScreen = () => {

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategorySelect = async (category) => {
        setSelectedCategory(category);
        setSearchQuery("");
        // load category data
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
                    />
                )}

                {/* render products */}
            </ScrollView>
        </View>
    )
}

export default HomeScreen;