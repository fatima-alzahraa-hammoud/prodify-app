import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

export const productFormStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Header Card
    headerCard: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 24,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },

    // Section
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        letterSpacing: -0.3,
    },
    requiredBadge: {
        backgroundColor: `${COLORS.error}15`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    requiredText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.error,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: COLORS.textLight,
        marginBottom: 16,
        lineHeight: 18,
    },

    // Images
    imagesScroll: {
        marginHorizontal: -4,
    },
    imagesScrollContent: {
        paddingHorizontal: 4,
        gap: 12,
    },
    addImageButton: {
        width: 140,
        height: 160,
        backgroundColor: `${COLORS.primary}08`,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addImageIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${COLORS.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    addImageText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: 8,
    },
    addImageSubtext: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 4,
        fontWeight: '600',
    },
    imageContainer: {
        width: 140,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    coverBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    coverBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },

    // Input Groups
    inputGroup: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        letterSpacing: -0.2,
    },
    requiredDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.error,
        marginLeft: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        paddingVertical: 14,
        fontWeight: '500',
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
        paddingBottom: 14,
        textAlignVertical: 'top',
    },

    // Row Layout
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },

    // Categories
    categoriesScroll: {
        marginHorizontal: -4,
    },
    categoriesScrollContent: {
        paddingHorizontal: 4,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowOpacity: 0.2,
    },
    categoryIcon: {
        marginRight: 6,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        letterSpacing: -0.2,
    },
    categoryChipTextSelected: {
        color: COLORS.white,
        fontWeight: '700',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: -0.3,
    },
    category: {
        marginBottom: 15
    }
});