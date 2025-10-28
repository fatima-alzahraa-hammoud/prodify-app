import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { productDetailStyles } from "../../assets/styles/productDetailStyles.js";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constants/colors";
import { productsAPI } from "../../services/productsAPI";

const ProductDetailScreen = () => {
  const { id: productId } = useLocalSearchParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  const loadProductDetail = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const productData = await productsAPI.getById(token, productId);
      setProduct(productData);
    } catch (error) {
      console.error("Error loading product detail:", error);
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) return <LoadingSpinner message="Loading product details..." />;

  if (!product) {
    return (
      <View style={productDetailStyles.errorContainer}>
        <Text style={productDetailStyles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={productDetailStyles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || product.image;
  const isOutOfStock = product.quantity === 0;

  return (
    <View style={productDetailStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER WITH IMAGE */}
        <View style={productDetailStyles.headerContainer}>
          <View style={productDetailStyles.imageContainer}>
            <Image
              source={{ uri: currentImage }}
              style={productDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={productDetailStyles.gradientOverlay}
          />

          {/* Floating Buttons */}
          <View style={productDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={productDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity style={productDetailStyles.floatingButton}>
              <Ionicons name="share-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <View style={productDetailStyles.outOfStockBadge}>
              <Text style={productDetailStyles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}

          {/* Title Section */}
          <View style={productDetailStyles.titleSection}>
            {product.category && (
              <View style={productDetailStyles.categoryBadge}>
                <Text style={productDetailStyles.categoryText}>
                  {product.category.category}
                </Text>
              </View>
            )}
            <Text style={productDetailStyles.productTitle}>{product.title}</Text>
            <View style={productDetailStyles.priceRow}>
              <Text style={productDetailStyles.priceText}>${product.price}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={productDetailStyles.contentSection}>
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={productDetailStyles.thumbnailContainer}
              contentContainerStyle={productDetailStyles.thumbnailContent}
            >
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImageChange(index)}
                  style={[
                    productDetailStyles.thumbnail,
                    currentImageIndex === index && productDetailStyles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={productDetailStyles.thumbnailImage}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Quick Stats */}
          <View style={productDetailStyles.statsContainer}>
            <View style={productDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={productDetailStyles.statIconContainer}
              >
                <Ionicons name="layers" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={productDetailStyles.statValue}>{product.quantity}</Text>
              <Text style={productDetailStyles.statLabel}>In Stock</Text>
            </View>

            <View style={productDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={productDetailStyles.statIconContainer}
              >
                <Ionicons name="cash" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={productDetailStyles.statValue}>${product.price}</Text>
              <Text style={productDetailStyles.statLabel}>Price</Text>
            </View>
          </View>

          {/* Description Section */}
          {product.description && (
            <View style={productDetailStyles.sectionContainer}>
              <View style={productDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary + "80"]}
                  style={productDetailStyles.sectionIcon}
                >
                  <Ionicons name="document-text" size={16} color={COLORS.white} />
                </LinearGradient>
                <Text style={productDetailStyles.sectionTitle}>Description</Text>
              </View>

              <View style={productDetailStyles.descriptionCard}>
                <Text style={productDetailStyles.descriptionText}>
                  {product.description}
                </Text>
              </View>
            </View>
          )}

          {/* Product Info */}
          <View style={productDetailStyles.sectionContainer}>
            <View style={productDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={productDetailStyles.sectionIcon}
              >
                <Ionicons name="information-circle" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={productDetailStyles.sectionTitle}>Product Information</Text>
            </View>

            <View style={productDetailStyles.infoCard}>
              <View style={productDetailStyles.infoRow}>
                <View style={productDetailStyles.infoLabel}>
                  <Ionicons name="pricetag" size={18} color={COLORS.primary} />
                  <Text style={productDetailStyles.infoLabelText}>Category</Text>
                </View>
                <Text style={productDetailStyles.infoValue}>
                  {product.category?.category || "Uncategorized"}
                </Text>
              </View>

              <View style={productDetailStyles.infoDivider} />

              <View style={productDetailStyles.infoRow}>
                <View style={productDetailStyles.infoLabel}>
                  <Ionicons name="cube" size={18} color={COLORS.primary} />
                  <Text style={productDetailStyles.infoLabelText}>Availability</Text>
                </View>
                <Text
                  style={[
                    productDetailStyles.infoValue,
                    isOutOfStock && { color: COLORS.error },
                  ]}
                >
                  {isOutOfStock ? "Out of Stock" : `${product.quantity} available`}
                </Text>
              </View>

              <View style={productDetailStyles.infoDivider} />

              <View style={productDetailStyles.infoRow}>
                <View style={productDetailStyles.infoLabel}>
                  <Ionicons name="calendar" size={18} color={COLORS.primary} />
                  <Text style={productDetailStyles.infoLabelText}>Added</Text>
                </View>
                <Text style={productDetailStyles.infoValue}>
                  {new Date(product.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={productDetailStyles.actionsContainer}>
            <TouchableOpacity
              style={productDetailStyles.secondaryButton}
              onPress={() => router.push(`/products/edit/${productId}`)}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={productDetailStyles.secondaryButtonText}>Edit Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                productDetailStyles.primaryButton,
                isOutOfStock && productDetailStyles.primaryButtonDisabled,
              ]}
              disabled={isOutOfStock}
            >
              <LinearGradient
                colors={
                  isOutOfStock
                    ? [COLORS.textLight, COLORS.textLight]
                    : [COLORS.primary, COLORS.primary]
                }
                style={productDetailStyles.buttonGradient}
              >
                <Ionicons name="cart" size={20} color={COLORS.white} />
                <Text style={productDetailStyles.buttonText}>
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;