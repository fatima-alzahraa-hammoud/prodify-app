import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { homeStyles } from '../assets/styles/homeStyles'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, onAddPress, showAddButton = false }) => {
    return (
        <View style={homeStyles.categoryFilterContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={homeStyles.categoryFilterScrollContent}
            >
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return(
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                homeStyles.categoryButton, isSelected && homeStyles.selectedCategory,
                            ]}
                            onPress={() => onSelectCategory(category.name)}
                            activeOpacity={0.7}
                        >
                            <Image 
                                source={{uri: category.image}}
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
                                {category.name}
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