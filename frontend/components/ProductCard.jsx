import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { productCardStyles } from "../assets/styles/homeStyles";
import { COLORS } from "../constants/colors";

export default function ProductCard({ product }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={productCardStyles.container}
            onPress={() => router.push(`/product/${product.id}`)}
            activeOpacity={0.7}
        >
            <View style={productCardStyles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={productCardStyles.image}
                    contentFit="cover"
                    transition={300}
                />
                {product.quantity === 0 && (
                    <View style={productCardStyles.outOfStockBadge}>
                        <Text style={productCardStyles.outOfStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>

            <View style={productCardStyles.content}>
                <Text style={productCardStyles.title} numberOfLines={2}>
                    {product.title}
                </Text>

                {product.description && (
                    <Text style={productCardStyles.description} numberOfLines={2}>
                        {product.description}
                    </Text>
                )}

                <View style={productCardStyles.footer}>
                    {product.price && (
                        <View style={productCardStyles.priceContainer}>
                            <Ionicons
                                name="pricetag"
                                size={14}
                                color={COLORS.primary}
                            />
                            <Text style={productCardStyles.priceText}>
                                ${product.price}
                            </Text>
                        </View>
                    )}

                    {product.quantity !== undefined && (
                        <View style={productCardStyles.quantityContainer}>
                            <Ionicons
                                name="cube-outline"
                                size={14}
                                color={product.quantity > 0 ? COLORS.textLight : COLORS.error}
                            />
                            <Text
                                style={[
                                    productCardStyles.quantityText,
                                    product.quantity === 0 && productCardStyles.outOfStockQuantity
                                ]}
                            >
                                {product.quantity}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}