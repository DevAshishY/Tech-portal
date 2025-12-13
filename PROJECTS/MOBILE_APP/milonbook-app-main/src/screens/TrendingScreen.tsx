import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Dimensions,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');
const imageSize = width / 3; // Full width divided by 3 columns

type Props = {
    navigation: any;
};

// Mixed image + video items
const trendingItems = [
    { id: '1', type: 'image', src: require('../assets/trending1.jpeg'), views: '1.2M' },
     { id: '10', type: 'video', src: require('../assets/trending10.mp4'), views: '5.1M' },
    { id: '2', type: 'image', src: require('../assets/trending2.jpeg'), views: '890K' },
    { id: '3', type: 'image', src: require('../assets/trending3.jpeg'), views: '2.1M' },
     { id: '10', type: 'video', src: require('../assets/trending10.mp4'), views: '5.1M' },
    { id: '4', type: 'image', src: require('../assets/trending4.jpeg'), views: '654K' },
    { id: '5', type: 'image', src: require('../assets/trending5.jpeg'), views: '1.5M' },
    { id: '6', type: 'image', src: require('../assets/trending6.jpeg'), views: '3.2M' },
    { id: '7', type: 'image', src: require('../assets/trending7.jpeg'), views: '987K' },
    // { id: '8', type: 'video', src: require('../assets/trending8.mp4'), views: '4.5M' },
      { id: '9', type: 'video', src: require('../assets/trending9.mp4'), views: '4.5M' },
     { id: '4', type: 'image', src: require('../assets/trending4.jpeg'), views: '654K' },
    { id: '5', type: 'image', src: require('../assets/trending5.jpeg'), views: '1.5M' },
    { id: '10', type: 'video', src: require('../assets/trending10.mp4'), views: '5.1M' },
     { id: '2', type: 'image', src: require('../assets/trending2.jpeg'), views: '890K' },
    { id: '3', type: 'image', src: require('../assets/trending3.jpeg'), views: '2.1M' },
    { id: '4', type: 'image', src: require('../assets/trending4.jpeg'), views: '654K' },
     { id: '10', type: 'video', src: require('../assets/trending10.mp4'), views: '5.1M' },
    //   { id: '8', type: 'video', src: require('../assets/trending8.mp4'), views: '4.5M' },
  
];

export default function TrendingScreen({ navigation }: Props) {
    const [searchText, setSearchText] = useState('');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={22} color="#111827" />
                </TouchableOpacity>
                
                <View style={styles.titleContainer}>
                    <Icon name="fire" size={22} color="#EF4444" style={styles.fireIcon} />
                    <Text style={styles.headerTitle}>Trending</Text>
                </View>
                
                <View style={styles.headerPlaceholder} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarWrapper}>
                <Icon name="search" size={16} color="#6b7280" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Explore trending content..."
                    placeholderTextColor="#9ca3af"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity 
                        onPress={() => setSearchText('')}
                        activeOpacity={0.7}
                    >
                        <Icon name="times-circle" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Grid */}
            <FlatList
                data={trendingItems}
                keyExtractor={(item) => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.gridItem}
                        activeOpacity={0.95}
                    >
                        {item.type === 'image' ? (
                            <Image source={item.src} style={styles.media} />
                        ) : (
                            <>
                                <Video
                                    source={item.src}
                                    style={styles.media}
                                    muted
                                    repeat
                                    resizeMode="cover"
                                    paused={false}
                                />
                                {/* Video Play Icon */}
                                <View style={styles.videoIconContainer}>
                                    <Icon name="play" color="#ffffff" size={12} />
                                </View>
                            </>
                        )}
                        
                        {/* Gradient Overlay with Views */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.gradientOverlay}
                        >
                            <View style={styles.viewsContainer}>
                                <Icon name="eye" size={10} color="#ffffff" />
                                <Text style={styles.viewsText}>{item.views}</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.gridContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    /* HEADER */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        backgroundColor: '#ffffff',
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#f9fafb',
    },

    headerPlaceholder: {
        width: 40,
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    fireIcon: {
        marginBottom: 2,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.5,
    },

    /* Search Bar */
    searchBarWrapper: {
        marginTop: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 14,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        fontWeight: '400',
    },

    /* Grid */
    gridContainer: {
        paddingBottom: 20,
    },

    row: {
        gap: 0,
    },

    gridItem: {
        width: imageSize,
        height: imageSize,
        backgroundColor: '#f3f4f6',
        marginBottom: 0,
        position: 'relative',
        overflow: 'hidden',
    },

    media: {
        width: '100%',
        height: '100%',
    },

    videoIconContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        justifyContent: 'flex-end',
        paddingBottom: 6,
        paddingHorizontal: 8,
    },

    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    viewsText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});