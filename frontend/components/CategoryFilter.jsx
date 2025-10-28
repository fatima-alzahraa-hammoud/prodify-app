import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { homeStyles } from '../assets/styles/homeStyles';
import { COLORS } from '../constants/colors';
import { API_BASE_URL } from "../services/api.js";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, onAddPress, showAddButton = false }) => {
    return (
        <View style={homeStyles.categoryFilterContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={homeStyles.categoryFilterScrollContent}
            >
                {categories.map((cat) => {
                    const isSelected = selectedCategory?.id === cat.id;
                    return(
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                homeStyles.categoryButton, isSelected && homeStyles.selectedCategory,
                            ]}
                            onPress={() => onSelectCategory(cat)}
                            activeOpacity={0.7}
                        >
                            <Image 
                                source={{uri: `${API_BASE_URL}${cat.image}`}}
                                style={[
                                    homeStyles.categoryImage, isSelected && homeStyles.selectedCategoryImage,
                                ]}
                                contentFit='cover'
                                transition={300}
                            />
                            <Text
                                style={[
                                    homeStyles.categoryText, isSelected && homeStyles.selectedCategoryText
                                ]}
                            >
                                {cat.category}
                            </Text>
                        </TouchableOpacity>
                    )
                })}

                {showAddButton && onAddPress && (
                    <TouchableOpacity
                        style={homeStyles.categoryAddButton}
                        onPress={onAddPress}
                        activeOpacity={0.7}
                    >
                        <View style={homeStyles.categoryAddIconContainer}>
                            <Ionicons
                                name='add-circle-outline'
                                size={40}
                                color={COLORS.primary}
                            />
                        </View>
                        <Text style={homeStyles.categoryAddText}>Add Category</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

export default CategoryFilter;