// import React, { useState, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Modal,
//   TextInput,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { useIsFocused } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Video from 'react-native-video';
// import { useReels } from '../hooks/useReels';
// import { useLike } from '../hooks/useLike';
// import { API_BASE_URL } from '../api/apiClient';

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// const CATEGORIES = [
//   { id: 'All', label: 'All Reels', icon: '∞' },
//   { id: 'Sad', label: 'Sad', icon: '😢' },
//   { id: 'Funny', label: 'Funny', icon: '😂' },
//   { id: 'Inspirational', label: 'Inspirational', icon: '✨' },
//   { id: 'Educational', label: 'Educational', icon: '📚' },
//   { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
//   { id: 'Sports', label: 'Sports', icon: '⚽' },
//   { id: 'Travel', label: 'Travel', icon: '✈️' },
//   { id: 'Lifestyle', label: 'Lifestyle', icon: '🌟' },
//   { id: 'Food', label: 'Food', icon: '🍔' },
//   { id: 'Fashion', label: 'Fashion', icon: '👗' },
//   { id: 'Technology', label: 'Technology', icon: '💻' },
//   { id: 'Other', label: 'Other', icon: '📌' },
// ];

// const ReelItem = ({ 
//   item, 
//   isCurrent, 
//   isNearby, 
//   isMuted, 
//   setIsMuted,
//   isFocusedScreen, 
//   insets, 
//   currentCategoryIcon, 
//   currentCategoryLabel, 
//   videoProgress, 
//   handleProgress, 
//   getFullUrl, 
//   formatNumber 
// }: any) => {
//   const { isLiked, likesCount, isLoading, toggleLike } = useLike({
//     id: item._id,
//     type: 'reel',
//     initialLiked: item.isLiked || false,
//     initialLikesCount: item.likesCount || 0,
//   });

//   const videoUrl = getFullUrl(item.mediaUrl);
//   const thumbnailUrl = item.thumbnail ? getFullUrl(item.thumbnail) : null;
//   const commentsCount = item.commentsCount || 0;
//   const sharesCount = item.sharesCount || 0;

//   const progress = videoProgress[item._id];
//   const currentTime = progress?.currentTime || 0;
//   const duration = progress?.duration || 0;
//   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.reelContainer}>
//       {thumbnailUrl && (
//         <Image source={{ uri: thumbnailUrl }} style={styles.posterImage} resizeMode="cover" />
//       )}

//       {isNearby && (
//         <Video
//           source={{ uri: videoUrl }}
//           style={styles.video}
//           resizeMode="cover"
//           repeat={true}
//           muted={isMuted}
//           paused={!isFocusedScreen || !isCurrent}
//           poster={thumbnailUrl}
//           posterResizeMode="cover"
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           bufferConfig={{
//             minBufferMs: 2000,
//             maxBufferMs: 5000,
//             bufferForPlaybackMs: 1000,
//             bufferForPlaybackAfterRebufferMs: 2000,
//           }}
//           onProgress={(data) => handleProgress(item._id, data)}
//           onError={(e) => console.log('Video error:', e)}
//         />
//       )}

//       {isCurrent && !isNearby && (
//         <View style={styles.videoLoadingContainer}>
//           <ActivityIndicator size="large" color="#7C3AED" />
//         </View>
//       )}

//       <LinearGradient
//         colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
//         style={styles.gradient}
//       />

//       {/* Top Bar */}
//       <View style={[styles.topBar, { top: insets.top + 10 }]}>
//         <Text style={styles.reelsTitle}>Reels</Text>
//         <View style={styles.topButtons}>
//           <View style={styles.filterButton}>
//             <Text style={styles.filterButtonText}>
//               {currentCategoryIcon} {currentCategoryLabel}
//             </Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.soundButton}
//             onPress={() => setIsMuted(!isMuted)}
//           >
//             <Icon 
//               name={isMuted ? 'volume-mute' : 'volume-up'} 
//               size={18} 
//               color="#fff" 
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: 200 + insets.bottom }]}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={toggleLike}
//           disabled={isLoading}
//         >
//           <Icon 
//             name="heart"
//             size={24} 
//             color={isLiked ? "#EC4899" : "#fff"}
//             solid={isLiked}
//           />
//           <Text style={styles.actionText}>{formatNumber(likesCount)}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="comment-dots" size={24} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(commentsCount)}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="paper-plane" size={24} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(sharesCount)}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="bookmark" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Info */}
//       <View style={[styles.bottomInfo, { bottom: 70 + insets.bottom }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{ 
//               uri: item.userId?.profilePicture 
//                 ? getFullUrl(item.userId.profilePicture) 
//                 : 'https://i.pravatar.cc/150' 
//             }}
//             style={styles.avatar}
//           />
//           <View style={styles.userDetails}>
//             <View style={styles.userRow}>
//               <Text style={styles.username}>
//                 {item.userId?.name || item.userId?.username || 'User'}
//               </Text>
//               <TouchableOpacity style={styles.connectButton}>
//                 <Text style={styles.connectText}>Connect</Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.description} numberOfLines={2}>
//               {item.caption || 'No caption'}
//             </Text>
//             <View style={styles.audioRow}>
//               <Icon name="music" size={12} color="#fff" />
//               <Text style={styles.audioText}>Original Audio • {item.userId?.username}</Text>
//             </View>
//           </View>
//         </View>

//         {isCurrent && duration > 0 && (
//           <View style={styles.durationControl}>
//             <View style={styles.progressBarBackground}>
//               <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
//             </View>
//             <Text style={styles.durationText}>
//               {formatTime(currentTime)} / {formatTime(duration)}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const ReelsScreen = () => {
//   const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
//   const [isMuted, setIsMuted] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [videoProgress, setVideoProgress] = useState<{ [key: string]: { currentTime: number; duration: number } }>({});

//   const insets = useSafeAreaInsets();
//   const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;

//   const {
//     data,
//     isPending,
//     isError,
//     isFetching,
//     isFetchingNextPage,
//     hasNextPage,
//     fetchNextPage,
//     refetch,
//   } = useReels(categoryParam);

//   const reels = data?.pages.flatMap(page => page.reels) ?? [];
//   const isFocusedScreen = useIsFocused();

//   const currentCategoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || 'All Reels';
//   const currentCategoryIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon || '∞';

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   const handleCategoryChange = useCallback((categoryId: string) => {
//     setSelectedCategory(categoryId);
//     setCurrentIndex(0);
//     setModalVisible(false);
//     setSearchQuery('');
//   }, []);

//   const handleSwitchToAllReels = useCallback(() => {
//     setSelectedCategory('All');
//     setCurrentIndex(0);
//   }, []);

//   const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       setCurrentIndex(newIndex);
//     }
//   }).current;

//   const handleLoadMore = useCallback(() => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const handleRefresh = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   const getFullUrl = useCallback((path: string) => {
//     if (!path) return '';
//     if (path.startsWith('http')) return path;
//     const cleanPath = path.startsWith('/') ? path.substring(1) : path;
//     return `${API_BASE_URL}/${cleanPath}`;
//   }, []);

//   const handleProgress = useCallback((videoId: string, data: any) => {
//     setVideoProgress(prev => ({
//       ...prev,
//       [videoId]: {
//         currentTime: data.currentTime,
//         duration: data.seekableDuration || data.playableDuration || 0,
//       },
//     }));
//   }, []);

//   const renderReel = useCallback(({ item, index }: { item: any; index: number }) => {
//     const isCurrent = currentIndex === index;
//     const isNearby = Math.abs(currentIndex - index) <= 2;

//     return (
//       <ReelItem
//         key={`${item._id}-${item.isLiked}-${item.likesCount}`}
//         item={item}
//         isCurrent={isCurrent}
//         isNearby={isNearby}
//         isMuted={isMuted}
//         setIsMuted={setIsMuted}
//         isFocusedScreen={isFocusedScreen}
//         insets={insets}
//         currentCategoryIcon={currentCategoryIcon}
//         currentCategoryLabel={currentCategoryLabel}
//         videoProgress={videoProgress}
//         handleProgress={handleProgress}
//         getFullUrl={getFullUrl}
//         formatNumber={formatNumber}
//       />
//     );
//   }, [currentIndex, isMuted, isFocusedScreen, insets, currentCategoryIcon, currentCategoryLabel, videoProgress, handleProgress, getFullUrl, formatNumber]);

//   const renderEmptyState = () => (
//     <View style={styles.emptyStateContainer}>
//       <View style={[styles.topBar, { top: insets.top + 10 }]}>
//         <Text style={styles.reelsTitle}>Reels</Text>
//         <View style={styles.topButtons}>
//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
//             <Text style={styles.filterButtonText}>
//               {currentCategoryIcon} {currentCategoryLabel}
//             </Text>
//             <Icon name="chevron-down" size={16} color="#fff" style={{ marginLeft: 6 }} />
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={styles.soundButton}
//             onPress={() => setIsMuted(!isMuted)}
//           >
//             <Icon 
//               name={isMuted ? 'volume-mute' : 'volume-up'} 
//               size={18} 
//               color="#fff" 
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.emptyStateContent}>
//         <View style={styles.emptyIconContainer}>
//           <Icon name="film" size={80} color="#4B5563" />
//         </View>
//         <Text style={styles.emptyStateTitle}>No Reels in {currentCategoryLabel}</Text>
//         <Text style={styles.emptyStateSubtitle}>
//           There are no reels available in this category at the moment.
//         </Text>
        
//         {selectedCategory !== 'All' && (
//           <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToAllReels}>
//             <LinearGradient
//               colors={['#00B5D8', '#7C3AED', '#EC4899']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.switchButtonGradient}
//             >
//               <Icon name="infinity" size={18} color="#fff" style={{ marginRight: 8 }} />
//               <Text style={styles.switchButtonText}>View All Reels</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
//           <Icon name="sync-alt" size={18} color="#7C3AED" style={{ marginRight: 8 }} />
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (isPending) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#7C3AED" />
//         <Text style={styles.loadingText}>Loading Reels...</Text>
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={styles.errorContainer}>
//         <Icon name="exclamation-triangle" size={64} color="#EC4899" />
//         <Text style={styles.errorTitle}>Something went wrong</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={refetch}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!isPending && !isError && reels.length === 0) {
//     return (
//       <View style={styles.container}>
//         {renderEmptyState()}
//         <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//           <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//             <View style={styles.modalOverlay}>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContent}>
//                   <View style={styles.modalHeader}>
//                     <Text style={styles.modalTitle}>Choose Category</Text>
//                     <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//                       <Icon name="times" size={24} color="#fff" />
//                     </TouchableOpacity>
//                   </View>
//                   <View style={styles.searchContainer}>
//                     <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
//                     <TextInput
//                       style={styles.searchInput}
//                       placeholder="Search categories..."
//                       placeholderTextColor="#888"
//                       value={searchQuery}
//                       onChangeText={setSearchQuery}
//                     />
//                   </View>
//                   <View style={styles.categoriesGrid}>
//                     {CATEGORIES.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase())).map(cat => (
//                       <TouchableOpacity
//                         key={cat.id}
//                         style={[styles.categoryItem, selectedCategory === cat.id && styles.categoryItemSelected]}
//                         onPress={() => handleCategoryChange(cat.id)}
//                       >
//                         <Text style={styles.categoryEmoji}>{cat.icon}</Text>
//                         <Text style={styles.categoryLabel}>{cat.label}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={reels}
//         renderItem={renderReel}
//         keyExtractor={(item, index) => `${item._id}-${item.isLiked}-${index}`}
//         extraData={reels}
//         pagingEnabled
//         snapToInterval={SCREEN_HEIGHT}
//         snapToAlignment="start"
//         decelerationRate="fast"
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={{
//           itemVisiblePercentThreshold: 80,
//           minimumViewTime: 100,
//         }}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.7}
//         refreshControl={
//           <RefreshControl
//             refreshing={isFetching && !isFetchingNextPage}
//             onRefresh={handleRefresh}
//             tintColor="#7C3AED"
//           />
//         }
//         ListFooterComponent={
//           isFetchingNextPage ? (
//             <View style={styles.footerLoader}>
//               <ActivityIndicator size="small" color="#7C3AED" />
//             </View>
//           ) : null
//         }
//         removeClippedSubviews={false}
//         maxToRenderPerBatch={3}
//         windowSize={7}
//         initialNumToRender={3}
//         getItemLayout={(_, index) => ({
//           length: SCREEN_HEIGHT,
//           offset: SCREEN_HEIGHT * index,
//           index,
//         })}
//       />

//       <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
//         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalTitle}>Choose Category</Text>
//                   <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//                     <Icon name="times" size={24} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.searchContainer}>
//                   <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
//                   <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search categories..."
//                     placeholderTextColor="#888"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                   />
//                 </View>
//                 <View style={styles.categoriesGrid}>
//                   {CATEGORIES.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase())).map(cat => (
//                     <TouchableOpacity
//                       key={cat.id}
//                       style={[styles.categoryItem, selectedCategory === cat.id && styles.categoryItemSelected]}
//                       onPress={() => handleCategoryChange(cat.id)}
//                     >
//                       <Text style={styles.categoryEmoji}>{cat.icon}</Text>
//                       <Text style={styles.categoryLabel}>{cat.label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   reelContainer: { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: '#000', overflow: 'hidden' },
//   video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
//   posterImage: { ...StyleSheet.absoluteFillObject },
//   gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' },
//   videoLoadingContainer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topBar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
//   reelsTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
//   topButtons: { flexDirection: 'row', gap: 12, alignItems: 'center' },
//   filterButton: { 
//     backgroundColor: 'rgba(0, 0, 0, 0.6)', 
//     paddingHorizontal: 14, 
//     paddingVertical: 8, 
//     borderRadius: 20, 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   filterButtonText: { 
//     color: '#fff', 
//     fontSize: 14, 
//     fontWeight: '600',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },
//   soundButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rightActions: { position: 'absolute', right: 16, gap: 24, zIndex: 10 },
//   actionButton: { alignItems: 'center', gap: 4 },
//   actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
//   bottomInfo: { position: 'absolute', left: 16, right: 80, zIndex: 10 },
//   userInfo: { flexDirection: 'row', gap: 12 },
//   avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff' },
//   userDetails: { flex: 1 },
//   userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   username: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   connectButton: { backgroundColor: '#00B5D8', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
//   connectText: { color: '#fff', fontSize: 14, fontWeight: '600' },
//   description: { color: '#fff', fontSize: 14, marginTop: 4 },
//   audioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
//   audioText: { color: '#fff', fontSize: 12, opacity: 0.9 },
//   durationControl: {
//     width: '100%',
//     marginTop: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 20,
//   },
//   progressBarBackground: {
//     flex: 1,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 1.5,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#7C3AED',
//     borderRadius: 2.5,
//   },
//   durationText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '600',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//     minWidth: 70,
//   },
//   loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
//   loadingText: { color: '#fff', fontSize: 16, marginTop: 16 },
//   errorContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
//   errorTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
//   retryButton: { backgroundColor: '#7C3AED', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 20 },
//   retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   footerLoader: { padding: 20 },
//   emptyStateContainer: { flex: 1, backgroundColor: '#000' },
//   emptyStateContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
//   emptyIconContainer: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: '#1F2937',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyStateTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 12, textAlign: 'center' },
//   emptyStateSubtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
//   switchButton: {
//     marginBottom: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#7C3AED',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   switchButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 16 },
//   switchButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     backgroundColor: '#1F2937',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#7C3AED',
//   },
//   refreshButtonText: { color: '#7C3AED', fontSize: 16, fontWeight: '600' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
//   modalContent: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: SCREEN_HEIGHT * 0.9 },
//   modalHeader: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
//   closeButton: { padding: 10 },
//   searchContainer: { flexDirection: 'row', marginHorizontal: 24, marginBottom: 20, backgroundColor: '#2a2a2a', borderRadius: 12, paddingHorizontal: 16, alignItems: 'center' },
//   searchIcon: { marginRight: 12 },
//   searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14 },
//   categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, gap: 16 },
//   categoryItem: { width: (SCREEN_WIDTH - 80) / 3, aspectRatio: 1, backgroundColor: '#2a2a2a', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   categoryItemSelected: { backgroundColor: '#7C3AED' },
//   categoryEmoji: { fontSize: 36, marginBottom: 8 },
//   categoryLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
// });

// export default ReelsScreen;

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { useReels } from '../hooks/useReels';
import { useLike } from '../hooks/useLike';
import { useComment } from '../hooks/useComments';
import { API_BASE_URL } from '../api/apiClient';
import CommentBottomSheet from '../components/CommentBottomSheet';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'All', label: 'All Reels', icon: '∞' },
  { id: 'Sad', label: 'Sad', icon: '😢' },
  { id: 'Funny', label: 'Funny', icon: '😂' },
  { id: 'Inspirational', label: 'Inspirational', icon: '✨' },
  { id: 'Educational', label: 'Educational', icon: '📚' },
  { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
  { id: 'Travel', label: 'Travel', icon: '✈️' },
  { id: 'Lifestyle', label: 'Lifestyle', icon: '🌟' },
  { id: 'Food', label: 'Food', icon: '🍔' },
  { id: 'Fashion', label: 'Fashion', icon: '👗' },
  { id: 'Technology', label: 'Technology', icon: '💻' },
  { id: 'Other', label: 'Other', icon: '📌' },
];

const ReelItem = ({ 
  item, 
  isCurrent, 
  isNearby, 
  isMuted, 
  setIsMuted,
  isFocusedScreen, 
  insets, 
  currentCategoryIcon, 
  currentCategoryLabel, 
  videoProgress, 
  handleProgress, 
  getFullUrl, 
  formatNumber,
  onCommentPress,
}: any) => {
  const { isLiked, likesCount, isLoading, toggleLike } = useLike({
    id: item._id,
    type: 'reel',
    initialLiked: item.isLiked || false,
    initialLikesCount: item.likesCount || 0,
  });

  const { commentsCount } = useComment({
    id: item._id,
    type: 'reel',
    initialCommentsCount: item.commentsCount || 0,
  });

  const videoUrl = getFullUrl(item.mediaUrl);
  const thumbnailUrl = item.thumbnail ? getFullUrl(item.thumbnail) : null;
  const sharesCount = item.sharesCount || 0;

  const progress = videoProgress[item._id];
  const currentTime = progress?.currentTime || 0;
  const duration = progress?.duration || 0;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.reelContainer}>
      {thumbnailUrl && (
        <Image source={{ uri: thumbnailUrl }} style={styles.posterImage} resizeMode="cover" />
      )}

      {isNearby && (
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          muted={isMuted}
          paused={!isFocusedScreen || !isCurrent}
          poster={thumbnailUrl}
          posterResizeMode="cover"
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          bufferConfig={{
            minBufferMs: 2000,
            maxBufferMs: 5000,
            bufferForPlaybackMs: 1000,
            bufferForPlaybackAfterRebufferMs: 2000,
          }}
          onProgress={(data) => handleProgress(item._id, data)}
          onError={(e) => console.log('Video error:', e)}
        />
      )}

      {isCurrent && !isNearby && (
        <View style={styles.videoLoadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      {/* Top Bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <Text style={styles.reelsTitle}>Reels</Text>
        <View style={styles.topButtons}>
          <View style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              {currentCategoryIcon} {currentCategoryLabel}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.soundButton}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Icon 
              name={isMuted ? 'volume-mute' : 'volume-up'} 
              size={18} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Actions */}
      <View style={[styles.rightActions, { bottom: 200 + insets.bottom }]}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={toggleLike}
          disabled={isLoading}
        >
          <Icon 
            name="heart"
            size={24} 
            color={isLiked ? "#EC4899" : "#fff"}
            solid={isLiked}
          />
          <Text style={styles.actionText}>{formatNumber(likesCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onCommentPress(item)}
        >
          <Icon name="comment-dots" size={24} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(commentsCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="paper-plane" size={24} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(sharesCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={[styles.bottomInfo, { bottom: 70 + insets.bottom }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ 
              uri: item.userId?.profilePicture 
                ? getFullUrl(item.userId.profilePicture) 
                : 'https://i.pravatar.cc/150' 
            }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.userRow}>
              <Text style={styles.username}>
                {item.userId?.name || item.userId?.username || 'User'}
              </Text>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.caption || 'No caption'}
            </Text>
            <View style={styles.audioRow}>
              <Icon name="music" size={12} color="#fff" />
              <Text style={styles.audioText}>Original Audio • {item.userId?.username}</Text>
            </View>
          </View>
        </View>

        {isCurrent && duration > 0 && (
          <View style={styles.durationControl}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.durationText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};



const ReelsScreen = () => {
   const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  const [isMuted, setIsMuted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);  // ✅ CORRECT LOCATION
  const [selectedReel, setSelectedReel] = useState<any>(null);              // ✅ CORRECT LOCATION
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: { currentTime: number; duration: number } }>({});

  const insets = useSafeAreaInsets();
  const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;

  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useReels(categoryParam);

  const reels = data?.pages.flatMap(page => page.reels) ?? [];
  const isFocusedScreen = useIsFocused();

  const currentCategoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || 'All Reels';
  const currentCategoryIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon || '∞';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentIndex(0);
    setModalVisible(false);
    setSearchQuery('');
  }, []);

  const handleSwitchToAllReels = useCallback(() => {
    setSelectedCategory('All');
    setCurrentIndex(0);
  }, []);

  const handleCommentPress = useCallback((reel: any) => {
    setSelectedReel(reel);
    setCommentModalVisible(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setCommentModalVisible(false);
    setSelectedReel(null);
  }, []);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
    }
  }).current;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const getFullUrl = useCallback((path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  }, []);

  const handleProgress = useCallback((videoId: string, data: any) => {
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        currentTime: data.currentTime,
        duration: data.seekableDuration || data.playableDuration || 0,
      },
    }));
  }, []);

  const renderReel = useCallback(({ item, index }: { item: any; index: number }) => {
    const isCurrent = currentIndex === index;
    const isNearby = Math.abs(currentIndex - index) <= 2;

    return (
      <ReelItem
        key={`${item._id}-${item.isLiked}-${item.likesCount}-${item.commentsCount}`}
        item={item}
        isCurrent={isCurrent}
        isNearby={isNearby}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isFocusedScreen={isFocusedScreen}
        insets={insets}
        currentCategoryIcon={currentCategoryIcon}
        currentCategoryLabel={currentCategoryLabel}
        videoProgress={videoProgress}
        handleProgress={handleProgress}
        getFullUrl={getFullUrl}
        formatNumber={formatNumber}
        onCommentPress={handleCommentPress}
      />
    );
  }, [currentIndex, isMuted, isFocusedScreen, insets, currentCategoryIcon, currentCategoryLabel, videoProgress, handleProgress, getFullUrl, formatNumber, handleCommentPress]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <Text style={styles.reelsTitle}>Reels</Text>
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              {currentCategoryIcon} {currentCategoryLabel}
            </Text>
            <Icon name="chevron-down" size={16} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.soundButton}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Icon 
              name={isMuted ? 'volume-mute' : 'volume-up'} 
              size={18} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.emptyStateContent}>
        <View style={styles.emptyIconContainer}>
          <Icon name="film" size={80} color="#4B5563" />
        </View>
        <Text style={styles.emptyStateTitle}>No Reels in {currentCategoryLabel}</Text>
        <Text style={styles.emptyStateSubtitle}>
          There are no reels available in this category at the moment.
        </Text>
        
        {selectedCategory !== 'All' && (
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToAllReels}>
            <LinearGradient
              colors={['#00B5D8', '#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.switchButtonGradient}
            >
              <Icon name="infinity" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.switchButtonText}>View All Reels</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Icon name="sync-alt" size={18} color="#7C3AED" style={{ marginRight: 8 }} />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading Reels...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="exclamation-triangle" size={64} color="#EC4899" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isPending && !isError && reels.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyState()}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Choose Category</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                      <Icon name="times" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchContainer}>
                    <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search categories..."
                      placeholderTextColor="#888"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                  <View style={styles.categoriesGrid}>
                    {CATEGORIES.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase())).map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryItem, selectedCategory === cat.id && styles.categoryItemSelected]}
                        onPress={() => handleCategoryChange(cat.id)}
                      >
                        <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item, index) => `${item._id}-${item.isLiked}-${item.commentsCount}-${index}`}
        extraData={reels}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
          minimumViewTime: 100,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={handleRefresh}
            tintColor="#7C3AED"
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          ) : null
        }
        removeClippedSubviews={false}
        maxToRenderPerBatch={3}
        windowSize={7}
        initialNumToRender={3}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      {/* Category Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Category</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Icon name="times" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                  <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search categories..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase())).map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryItem, selectedCategory === cat.id && styles.categoryItemSelected]}
                      onPress={() => handleCategoryChange(cat.id)}
                    >
                      <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Comment Bottom Sheet */}
       <CommentBottomSheet
        visible={commentModalVisible}
        onClose={handleCloseComments}
        item={selectedReel}
        type="reel"
        currentUserAvatar={selectedReel?.userId?.profilePicture 
          ? getFullUrl(selectedReel.userId.profilePicture) 
          : 'https://i.pravatar.cc/150'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  reelContainer: { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: '#000', overflow: 'hidden' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  posterImage: { ...StyleSheet.absoluteFillObject },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, zIndex: 10 },
  reelsTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  topButtons: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  filterButton: { 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  soundButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: { position: 'absolute', right: 16, gap: 24, zIndex: 10 },
  actionButton: { alignItems: 'center', gap: 4 },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  bottomInfo: { position: 'absolute', left: 16, right: 80, zIndex: 10 },
  userInfo: { flexDirection: 'row', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff' },
  userDetails: { flex: 1 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  username: { color: '#fff', fontSize: 16, fontWeight: '600' },
  connectButton: { backgroundColor: '#00B5D8', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  connectText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  description: { color: '#fff', fontSize: 14, marginTop: 4 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  audioText: { color: '#fff', fontSize: 12, opacity: 0.9 },
  durationControl: {
    width: '100%',
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2.5,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    minWidth: 70,
  },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 16 },
  errorContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  retryButton: { backgroundColor: '#7C3AED', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footerLoader: { padding: 20 },
  emptyStateContainer: { flex: 1, backgroundColor: '#000' },
  emptyStateContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 12, textAlign: 'center' },
  emptyStateSubtitle: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  switchButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  switchButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 16 },
  switchButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  refreshButtonText: { color: '#7C3AED', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: SCREEN_HEIGHT * 0.9 },
  modalHeader: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  closeButton: { padding: 10 },
  searchContainer: { flexDirection: 'row', marginHorizontal: 24, marginBottom: 20, backgroundColor: '#2a2a2a', borderRadius: 12, paddingHorizontal: 16, alignItems: 'center' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, gap: 16 },
  categoryItem: { width: (SCREEN_WIDTH - 80) / 3, aspectRatio: 1, backgroundColor: '#2a2a2a', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  categoryItemSelected: { backgroundColor: '#7C3AED' },
  categoryEmoji: { fontSize: 36, marginBottom: 8 },
  categoryLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  // Comment Modal Styles
  commentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  commentModalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  commentModalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  commentModalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#4B5563',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  commentModalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  commentModalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  commentCloseButton: {
    padding: 8,
  },
  commentReelInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    gap: 12,
  },
  commentReelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  commentReelDetails: {
    flex: 1,
  },
  commentReelUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  commentReelCaption: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentsEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  commentsEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  commentsEmptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    gap: 12,
    backgroundColor: '#121212',
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
  },
  commentSendButton: {
    backgroundColor: '#7C3AED',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentSendButtonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
});

// Add this at the very end of your ReelsScreen.tsx file, after the styles

export default ReelsScreen;