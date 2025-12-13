// // File: src/components/UserReelsGrid.tsx
// import React, { useState, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import IconFA from 'react-native-vector-icons/FontAwesome5';
// import Video from 'react-native-video';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useReels, useDeleteReel } from '../hooks/useReels';
// import { useLike } from '../hooks/useLike';
// import { API_BASE_URL } from '../api/apiClient';

// const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const ITEM_SIZE = (width - 4) / 3;

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

// const getFullImageUrl = (url: string): string => {
//   if (!url) return "https://via.placeholder.com/400";
//   if (url.startsWith("http://") || url.startsWith("https://")) return url;
//   const clean = url.startsWith('/') ? url.substring(1) : url;
//   return `${API_BASE_URL}/${clean}`;
// };

// interface Reel {
//   _id: string;
//   mediaUrl: string;
//   thumbnail?: string;
//   caption: string;
//   likesCount: number;
//   commentsCount: number;
//   viewsCount: number;
//   category?: string;
//   isLiked?: boolean;
//   userId?: {
//     _id: string;
//     username: string;
//     name: string;
//     profilePicture: string;
//   };
// }

// interface UserReelsGridProps {
//   userId: string;
// }

// const formatNumber = (num: number): string => {
//   if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//   if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//   return num.toString();
// };

// // ✅ Separate component for full-screen reel with like functionality
// const FullScreenReelItem = ({ 
//   item, 
//   index, 
//   currentPlayingIndex, 
//   showOptionsMenu,
//   isMuted,
//   insets,
//   setIsMuted,
//   setShowOptionsMenu,
//   handleDeleteReel,
//   deleteReelMutationPending,
//   formatNumber,
// }: any) => {
//   // ✅ useLike hook for each reel
//   const { isLiked, likesCount, isLoading, toggleLike } = useLike({
//     id: item._id,
//     type: 'reel',
//     initialLiked: item.isLiked || false,
//     initialLikesCount: item.likesCount || 0,
//   });

//   const isCurrent = currentPlayingIndex === index;
//   const isAdjacent = Math.abs(currentPlayingIndex - index) <= 2;
//   const videoUrl = getFullImageUrl(item.mediaUrl);
//   const thumbnailUrl = item.thumbnail ? getFullImageUrl(item.thumbnail) : null;
//   const categoryInfo = CATEGORIES.find(c => c.id === item.category) || { id: 'Other', label: 'Other', icon: '📌' };

//   const getUsername = () => {
//     const user = item?.userId || {};
//     return user?.username || user?.name || 'User';
//   };

//   return (
//     <View style={styles.fullScreenReelContainer}>
//       {showOptionsMenu && (
//         <TouchableOpacity
//           style={styles.menuBackdrop}
//           activeOpacity={1}
//           onPress={() => setShowOptionsMenu(false)}
//         />
//       )}

//       {thumbnailUrl && (
//         <Image source={{ uri: thumbnailUrl }} style={styles.posterImage} resizeMode="cover" />
//       )}

//       {isAdjacent && (
//         <Video
//           pointerEvents="none"  
//           source={{ uri: videoUrl }}
//           style={styles.fullScreenVideo}
//           resizeMode="cover"
//           repeat={true}
//           paused={!isCurrent}
//           muted={isMuted}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch="ignore"
//           poster={thumbnailUrl}
//           posterResizeMode="cover"
//           bufferConfig={{
//             minBufferMs: 2000,
//             maxBufferMs: 5000,
//             bufferForPlaybackMs: 1000,
//             bufferForPlaybackAfterRebufferMs: 2000,
//           }}
//           onError={(error) => console.log('Video error:', error)}
//         />
//       )}

//       {isCurrent && !isAdjacent && (
//         <View style={styles.videoPlaceholder}>
//           <ActivityIndicator size="large" color="#7C3AED" />
//         </View>
//       )}

//       <LinearGradient
//         colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
//         style={styles.gradient}
//       />

//       {/* Top Bar */}
//       <View style={[styles.topBar, { top: insets.top + 2 }]}>
//         <View style={styles.categoryBadge}>
//           <Text style={styles.categoryText}>
//             {categoryInfo.icon} {categoryInfo.label}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.muteButton}>
//           <IconFA name={isMuted ? 'volume-mute' : 'volume-up'} size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Right Actions */}
//       <View style={[styles.rightActions, { bottom: 150 + insets.bottom }]}>
//         {/* ✅ Like Button with useLike hook */}
//         <TouchableOpacity 
//           style={styles.actionButton} 
//           onPress={toggleLike}
//           disabled={isLoading}
//         >
//           <IconFA 
//             name="heart"
//             size={24} 
//             color={isLiked ? "#EC4899" : "#fff"}
//             solid={isLiked}
//           />
//           <Text style={styles.actionText}>{formatNumber(likesCount)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="message-circle" size={24} color="#fff" />
//           <Text style={styles.actionText}>{formatNumber(item.commentsCount || 0)}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="send" size={24} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="bookmark" size={24} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => setShowOptionsMenu(!showOptionsMenu)}
//         >
//           <Icon name="more-vertical" size={24} color="#fff" />
//         </TouchableOpacity>

//         {showOptionsMenu && (
//           <View style={styles.optionsMenu} pointerEvents="box-none">
//             <TouchableOpacity 
//               style={styles.optionItem}
//               onPress={handleDeleteReel}
//               activeOpacity={0.7}
//             >
//               {deleteReelMutationPending ? (
//                 <ActivityIndicator size="small" color="#ed4956" />
//               ) : (
//                 <>
//                   <Icon name="trash-2" size={20} color="#ed4956" />
//                   <Text style={styles.optionTextDelete}>Delete</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Bottom Info */}
//       <View style={[styles.bottomInfo, { bottom: 70 + insets.bottom }]}>
//         <View style={styles.userInfo}>
//           <Image
//             source={{
//               uri: getFullImageUrl(item.userId?.profilePicture || ''),
//             }}
//             style={styles.avatar}
//           />
//           <View style={styles.userDetails}>
//             <Text style={styles.username}>{getUsername()}</Text>
//             {item.caption && (
//               <Text style={styles.description} numberOfLines={2}>
//                 {item.caption}
//               </Text>
//             )}
//             <View style={styles.audioRow}>
//               <IconFA name="music" size={12} color="#fff" />
//               <Text style={styles.audioText}>Original Audio • {getUsername()}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default function UserReelsGrid({ userId }: UserReelsGridProps) {
//   const { 
//     data, 
//     isPending: isLoading, 
//     isError: error, 
//     refetch,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useReels(undefined, userId);

//   const deleteReelMutation = useDeleteReel();

//   const [selectedReelIndex, setSelectedReelIndex] = useState<number>(-1);
//   const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(0);
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
  
//   const insets = useSafeAreaInsets();
//   const fullScreenListRef = useRef<FlatList>(null);

//   const reels = data?.pages.flatMap(page => page.reels) ?? [];

//   const handleCloseFullScreen = () => {
//     setSelectedReelIndex(-1);
//     setCurrentPlayingIndex(0);
//     setShowOptionsMenu(false);
//   };

//   const handleDeleteReel = () => {
//     const currentReel = reels[currentPlayingIndex];

//     if (!currentReel) {
//       setShowOptionsMenu(false);
//       return;
//     }

//     deleteReelMutation.mutate(currentReel._id, {
//       onSuccess: () => {
//         setShowOptionsMenu(false);
//         handleCloseFullScreen();
//       },
//       onError: (err) => {
//         console.log("❌ Delete error:", err);
//         setShowOptionsMenu(false);
//       }
//     });
//   };

//   const renderReel = useCallback(({ item, index }: { item: Reel; index: number }) => {
//     return (
//       <TouchableOpacity
//         style={styles.reelItem}
//         onPress={() => {
//           setSelectedReelIndex(index);
//           setCurrentPlayingIndex(index);
//           setShowOptionsMenu(false);
//         }}
//         activeOpacity={0.8}
//       >
//         <Image
//           source={{ uri: getFullImageUrl(item.mediaUrl) }}
//           style={styles.reelImage}
//           resizeMode="cover"
//         />

//         <View style={styles.reelIndicator}>
//           <Icon name="play" size={14} color="#fff" />
//         </View>

//         <View style={styles.statsOverlay}>
//           <Icon name="eye" size={14} color="#fff" />
//           <Text style={styles.statText}>{formatNumber(item.viewsCount || 0)}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }, []);

//   const renderFullScreenReel = useCallback(({ item, index }: { item: Reel; index: number }) => {
//     return (
//       <FullScreenReelItem
//         key={`${item._id}-${item.isLiked}-${item.likesCount}`}
//         item={item}
//         index={index}
//         currentPlayingIndex={currentPlayingIndex}
//         showOptionsMenu={showOptionsMenu}
//         isMuted={isMuted}
//         insets={insets}
//         setIsMuted={setIsMuted}
//         setShowOptionsMenu={setShowOptionsMenu}
//         handleDeleteReel={handleDeleteReel}
//         deleteReelMutationPending={deleteReelMutation.isPending}
//         formatNumber={formatNumber}
//       />
//     );
//   }, [currentPlayingIndex, showOptionsMenu, isMuted, insets, deleteReelMutation.isPending]);

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="film" size={64} color="#d1d5db" />
//       <Text style={styles.emptyTitle}>No Reels Yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Create your first reel to get started
//       </Text>
//     </View>
//   );

//   const handleLoadMore = useCallback(() => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
//     if (viewableItems && viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       if (newIndex !== undefined && newIndex !== currentPlayingIndex) {
//         setCurrentPlayingIndex(newIndex);
//       }
//     }
//   }, [currentPlayingIndex]);

//   const viewabilityConfigRef = useRef({
//     itemVisiblePercentThreshold: 80,
//     minimumViewTime: 100,
//   });

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#7C3AED" />
//         <Text style={styles.loadingText}>Loading reels...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Icon name="alert-circle" size={48} color="#ef4444" />
//         <Text style={styles.errorText}>Failed to load reels</Text>
//         <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
//           <Text style={styles.retryBtnText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {reels.length > 0 && (
//         <View style={styles.header}>
//           <Icon name="film" size={20} color="#111" />
//           <Text style={styles.headerText}>
//             {reels.length} {reels.length === 1 ? 'Reel' : 'Reels'}
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={reels}
//         renderItem={renderReel}
//         keyExtractor={(item, index) => `grid-${item._id}-${index}`}
//         numColumns={3}
//         contentContainerStyle={styles.gridContent}
//         columnWrapperStyle={reels.length > 0 ? styles.columnWrapper : undefined}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={renderEmptyState}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           isFetchingNextPage ? (
//             <View style={styles.footerLoader}>
//               <ActivityIndicator size="small" color="#7C3AED" />
//             </View>
//           ) : null
//         }
//         scrollEnabled={false}
//         removeClippedSubviews={false}
//       />

//       {selectedReelIndex >= 0 && reels.length > 0 && (
//         <Modal
//           visible={true}
//           animationType="slide"
//           transparent={false}
//           onRequestClose={handleCloseFullScreen}
//         >
//           <View style={styles.modalContainer}>
//             <StatusBar barStyle="light-content" backgroundColor="#000" />
            
//             <View style={[styles.modalHeader, { top: insets.top + 2 }]}>
//               <TouchableOpacity 
//                 onPress={handleCloseFullScreen}
//                 style={styles.closeButton}
//               >
//                 <Icon name="arrow-left" size={24} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               ref={fullScreenListRef}
//               data={reels}
//               renderItem={renderFullScreenReel}
//               keyExtractor={(item, index) => `fullscreen-${item._id}-${item.isLiked}-${index}`}
//               extraData={reels}
//               pagingEnabled
//               showsVerticalScrollIndicator={false}
//               snapToInterval={SCREEN_HEIGHT}
//               snapToAlignment="start"
//               decelerationRate="fast"
//               onViewableItemsChanged={onViewableItemsChanged}
//               viewabilityConfig={viewabilityConfigRef.current}
//               removeClippedSubviews={false}
//               windowSize={5}
//               maxToRenderPerBatch={2}
//               initialNumToRender={2}
//               contentOffset={{ x: 0, y: selectedReelIndex * SCREEN_HEIGHT }}
//               updateCellsBatchingPeriod={100}
//               getItemLayout={(_, index) => ({
//                 length: SCREEN_HEIGHT,
//                 offset: SCREEN_HEIGHT * index,
//                 index,
//               })}
//             />
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },

//   headerText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111',
//   },

//   gridContent: {
//     paddingBottom: 20,
//   },

//   columnWrapper: {
//     gap: 2,
//   },

//   reelItem: {
//     width: ITEM_SIZE,
//     height: ITEM_SIZE * 1.5,
//     marginBottom: 2,
//     position: 'relative',
//     backgroundColor: '#f9fafb',
//     overflow: 'hidden',
//   },

//   reelImage: {
//     width: '100%',
//     height: '100%',
//   },

//   reelIndicator: {
//     position: 'absolute',
//     top: 6,
//     right: 6,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     borderRadius: 12,
//     padding: 4,
//   },

//   statsOverlay: {
//     position: 'absolute',
//     bottom: 6,
//     left: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },

//   statText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   loadingContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6b7280',
//   },

//   errorContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   errorText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#6b7280',
//   },

//   retryBtn: {
//     marginTop: 16,
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     backgroundColor: '#7C3AED',
//     borderRadius: 12,
//   },

//   retryBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   footerLoader: {
//     paddingVertical: 20,
//     alignItems: 'center',
//   },

//   emptyContainer: {
//     paddingVertical: 80,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   emptyTitle: {
//     marginTop: 16,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111',
//   },

//   emptySubtitle: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'center',
//   },

//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },

//   modalHeader: {
//     position: 'absolute',
//     left: 5,
//     top: 0,
//     zIndex: 10,
//   },

//   closeButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   fullScreenReelContainer: {
//     width: width,
//     height: SCREEN_HEIGHT,
//     backgroundColor: '#000',
//     position: 'relative',
//   },

//   fullScreenVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },

//   posterImage: {
//     ...StyleSheet.absoluteFillObject,
//   },

//   gradient: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: '60%',
//   },

//   videoPlaceholder: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   menuBackdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 9998,
//   },

//   topBar: {
//     position: 'absolute',
//     left: 70,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     zIndex: 9,
//   },

//   categoryBadge: {
//     backgroundColor: 'transparent',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },

//   categoryText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },

//   muteButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   rightActions: {
//     position: 'absolute',
//     right: 12,
//     gap: 24,
//     zIndex: 10,
//   },

//   actionButton: {
//     alignItems: 'center',
//     gap: 4,
//     position: 'relative',
//   },

//   actionText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   optionsMenu: {
//     position: 'absolute',
//     right: 50,
//     top: 200,
//     backgroundColor: 'rgba(26, 26, 26, 0.98)',
//     borderRadius: 12,
//     paddingVertical: 4,
//     minWidth: 120,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//     zIndex: 9999,
//   },

//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     gap: 8,
//   },

//   optionTextDelete: {
//     color: '#ed4956',
//     fontSize: 15,
//     fontWeight: '600',
//   },

//   bottomInfo: {
//     position: 'absolute',
//     left: 16,
//     right: 80,
//     zIndex: 10,
//   },

//   userInfo: {
//     flexDirection: 'row',
//     gap: 12,
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },

//   userDetails: {
//     flex: 1,
//   },

//   username: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   description: {
//     color: '#fff',
//     fontSize: 14,
//     marginTop: 4,
//   },

//   audioRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginTop: 6,
//   },

//   audioText: {
//     color: '#fff',
//     fontSize: 12,
//     opacity: 0.9,
//   },
// });
// src/components/UserReelsGrid.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReels, useDeleteReel } from '../hooks/useReels';
import { useLike } from '../hooks/useLike';
import { API_BASE_URL } from '../api/apiClient';
import CommentBottomSheet from './CommentBottomSheet'; // ← Your sheet

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

const CATEGORIES = [
  { id: 'All', label: 'All Reels', icon: '∞' },
  { id: 'Sad', label: 'Sad', icon: 'Sad' },
  { id: 'Funny', label: 'Funny', icon: 'Funny' },
  { id: 'Inspirational', label: 'Inspirational', icon: 'Inspirational' },
  { id: 'Educational', label: 'Educational', icon: 'Educational' },
  { id: 'Entertainment', label: 'Entertainment', icon: 'Entertainment' },
  { id: 'Sports', label: 'Sports', icon: 'Sports' },
  { id: 'Travel', label: 'Travel', icon: 'Travel' },
  { id: 'Lifestyle', label: 'Lifestyle', icon: 'Lifestyle' },
  { id: 'Food', label: 'Food', icon: 'Food' },
  { id: 'Fashion', label: 'Fashion', icon: 'Fashion' },
  { id: 'Technology', label: 'Technology', icon: 'Technology' },
  { id: 'Other', label: 'Other', icon: 'Other' },
];

// Helper for full URLs
const getFullUrl = (path?: string): string => {
  if (!path) return 'https://i.pravatar.cc/150?u=fallback';
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${clean}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};

// Comment Preview (shown under reel)
const CommentPreview = ({ comment }: { comment: any }) => {
  const username = comment.user?.name || comment.user?.username || 'User';
  const avatar = getFullUrl(comment.user?.profilePicture);

  return (
    <View style={styles.commentPreviewItem}>
      <Image source={{ uri: avatar }} style={styles.commentPreviewAvatar} />
      <View style={styles.commentPreviewContent}>
        <Text style={styles.commentPreviewText}>
          <Text style={styles.commentPreviewUsername}>{username}</Text>{' '}
          {comment.text}
        </Text>
      </View>
    </View>
  );
};

// Full-screen reel with comments
const FullScreenReelItem = ({
  item,
  index,
  currentPlayingIndex,
  showOptionsMenu,
  isMuted,
  insets,
  setIsMuted,
  setShowOptionsMenu,
  handleDeleteReel,
  deleteReelMutationPending,
  openComments,
}: any) => {
  const { isLiked, likesCount, toggleLike, isLoading: likeLoading } = useLike({
    id: item._id,
    type: 'reel',
    initialLiked: item.isLiked || false,
    initialLikesCount: item.likesCount || 0,
  });

  const isCurrent = currentPlayingIndex === index;
  const isAdjacent = Math.abs(currentPlayingIndex - index) <= 2;
  const videoUrl = getFullUrl(item.mediaUrl);
  const thumbnailUrl = item.thumbnail ? getFullUrl(item.thumbnail) : null;
  const category = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[12];

  const username = item.userId?.name || item.userId?.username || 'User';
  const previewComments = (item.comments || []).slice(0, 2);

  return (
    <View style={styles.fullScreenReelContainer}>
      {/* Backdrop for menu */}
      {showOptionsMenu && (
        <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={() => setShowOptionsMenu(false)} />
      )}

      {/* Thumbnail fallback */}
      {thumbnailUrl && <Image source={{ uri: thumbnailUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />}

      {/* Video */}
      {isAdjacent && (
        <Video
          source={{ uri: videoUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          repeat
          paused={!isCurrent}
          muted={isMuted}
          poster={thumbnailUrl || undefined}
          posterResizeMode="cover"
        />
      )}

      {/* Gradient */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']} style={styles.gradient} />

      {/* Top bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category.icon} {category.label}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
          <IconFA name={isMuted ? 'volume-mute' : 'volume-up'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Right actions */}
      <View style={[styles.rightActions, { bottom: insets.bottom + 100 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleLike} disabled={likeLoading}>
          <IconFA name="heart" size={28} color={isLiked ? '#EC4899' : '#fff'} solid={isLiked} />
          <Text style={styles.actionText}>{formatNumber(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item)}>
          <Icon name="message-circle" size={28} color="#fff" />
          <Text style={styles.actionText}>{formatNumber(item.commentsCount || 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="send" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowOptionsMenu(true)}>
          <Icon name="more-vertical" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Delete menu */}
        {showOptionsMenu && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity style={styles.optionItem} onPress={handleDeleteReel}>
              {deleteReelMutationPending ? (
                <ActivityIndicator size="small" color="#ed4956" />
              ) : (
                <>
                  <Icon name="trash-2" size={20} color="#ed4956" />
                  <Text style={styles.optionTextDelete}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom info + comment previews */}
      <View style={[styles.bottomInfo, { bottom: insets.bottom + 70 }]}>
        <View style={styles.userInfo}>
          <Image source={{ uri: getFullUrl(item.userId?.profilePicture) }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{username}</Text>
            {item.caption ? (
              <Text style={styles.description} numberOfLines={2}>{item.caption}</Text>
            ) : null}
            <View style={styles.audioRow}>
              <IconFA name="music" size={12} color="#fff" />
              <Text style={styles.audioText}>Original Audio • {username}</Text>
            </View>
          </View>
        </View>

        {/* Comment Previews */}
        {previewComments.map((c: any) => (
          <CommentPreview key={c._id} comment={c} />
        ))}

        {item.commentsCount > 2 && (
          <TouchableOpacity onPress={() => openComments(item)} style={{ marginTop: 8 }}>
            <Text style={styles.viewAllComments}>
              View all {item.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function UserReelsGrid({ userId }: { userId: string }) {
  const { data, isPending: isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useReels(undefined, userId);
  const deleteReelMutation = useDeleteReel();

  const [selectedReelIndex, setSelectedReelIndex] = useState<number>(-1);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReelForComments, setSelectedReelForComments] = useState<any>(null);
  const [isCommentSheetVisible, setIsCommentSheetVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const fullScreenListRef = useRef<FlatList>(null);

  const reels = data?.pages.flatMap(p => p.reels) ?? [];

  const openComments = (reel: any) => {
    setSelectedReelForComments(reel);
    setIsCommentSheetVisible(true);
  };

  const handleCloseFullScreen = () => {
    setSelectedReelIndex(-1);
    setCurrentPlayingIndex(0);
    setShowOptionsMenu(false);
  };

  const handleDeleteReel = () => {
    const reel = reels[currentPlayingIndex];
    if (!reel) return;

    deleteReelMutation.mutate(reel._id, {
      onSuccess: () => {
        setShowOptionsMenu(false);
        handleCloseFullScreen();
      },
    });
  };

  const renderGridItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.reelItem}
      onPress={() => {
        setSelectedReelIndex(index);
        setCurrentPlayingIndex(index);
      }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: getFullUrl(item.mediaUrl) }} style={styles.reelImage} resizeMode="cover" />
      <View style={styles.reelIndicator}>
        <Icon name="play" size={14} color="#fff" />
      </View>
      <View style={styles.statsOverlay}>
        <Icon name="eye" size={14} color="#fff" />
        <Text style={styles.statText}>{formatNumber(item.viewsCount || 0)}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderFullScreen = useCallback(({ item, index }: { item: any; index: number }) => (
    <FullScreenReelItem
      item={item}
      index={index}
      currentPlayingIndex={currentPlayingIndex}
      showOptionsMenu={showOptionsMenu}
      isMuted={isMuted}
      insets={insets}
      setIsMuted={setIsMuted}
      setShowOptionsMenu={setShowOptionsMenu}
      handleDeleteReel={handleDeleteReel}
      deleteReelMutationPending={deleteReelMutation.isPending}
      openComments={openComments}
    />
  ), [currentPlayingIndex, showOptionsMenu, isMuted, insets, deleteReelMutation.isPending]);

  const onViewableChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPlayingIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading reels...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Icon name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load reels</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reels.length > 0 && (
        <View style={styles.header}>
          <Icon name="film" size={20} color="#111" />
          <Text style={styles.headerText}>{reels.length} Reel{reels.length !== 1 && 's'}</Text>
        </View>
      )}

      <FlatList
        data={reels}
        renderItem={renderGridItem}
        keyExtractor={(_, i) => `grid-${i}`}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Icon name="film" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Reels Yet</Text>
          </View>
        }
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
      />

      {/* Fullscreen Modal */}
      {selectedReelIndex >= 0 && (
        <Modal visible transparent={false} animationType="slide" onRequestClose={handleCloseFullScreen}>
          <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <TouchableOpacity style={[styles.closeButton, { top: insets.top + 10 }]} onPress={handleCloseFullScreen}>
              <Icon name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>

            <FlatList
              ref={fullScreenListRef}
              data={reels}
              renderItem={renderFullScreen}
              keyExtractor={(_, i) => `fs-${i}`}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              snapToInterval={SCREEN_HEIGHT}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableChanged}
              viewabilityConfig={viewabilityConfig}
              initialScrollIndex={selectedReelIndex}
              getItemLayout={(_, i) => ({ length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * i, index: i })}
            />
          </View>
        </Modal>
      )}

      {/* Comment Bottom Sheet */}
      <CommentBottomSheet
        visible={isCommentSheetVisible}
        onClose={() => setIsCommentSheetVisible(false)}
        item={selectedReelForComments}
        type="reel"
        currentUserAvatar={getFullUrl('YOUR_CURRENT_USER_PROFILE_PICTURE_PATH')} // ← Replace with real one
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8, borderTopWidth: 1, borderColor: '#f3f4f6' },
  headerText: { fontSize: 15, fontWeight: '600', color: '#111' },
  gridContent: { paddingBottom: 20 },
  columnWrapper: { gap: 2 },
  reelItem: { width: ITEM_SIZE, height: ITEM_SIZE * 1.5, backgroundColor: '#f9fafb', overflow: 'hidden' },
  reelImage: { width: '100%', height: '100%' },
  reelIndicator: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
  statsOverlay: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  statText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  loadingText: { marginTop: 12, color: '#6b7280' },
  errorText: { marginTop: 12, color: '#6b7280', fontSize: 16 },
  retryBtn: { marginTop: 16, backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#111' },

  // Fullscreen
  modalContainer: { flex: 1, backgroundColor: '#000' },
  closeButton: { position: 'absolute', left: 16, zIndex: 10, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  fullScreenReelContainer: { width, height: SCREEN_HEIGHT, backgroundColor: '#000' },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' },
  topBar: { position: 'absolute', left: 70, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 9 },
  categoryBadge: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  categoryText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  rightActions: { position: 'absolute', right: 12, gap: 28, zIndex: 10 },
  actionButton: { alignItems: 'center', gap: 4 },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  menuBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  optionsMenu: { position: 'absolute', right: 50, top: 180, backgroundColor: 'rgba(26,26,26,0.98)', borderRadius: 12, paddingVertical: 8, minWidth: 140, elevation: 10 },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 },
  optionTextDelete: { color: '#ed4956', fontSize: 15, fontWeight: '600' },

  bottomInfo: { position: 'absolute', left: 16, right: 80, zIndex: 10 },
  userInfo: { flexDirection: 'row', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff' },
  userDetails: { flex: 1 },
  username: { color: '#fff', fontSize: 16, fontWeight: '600' },
  description: { color: '#fff', fontSize: 14, marginTop: 4 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  audioText: { color: '#fff', fontSize: 12, opacity: 0.9 },

  // Comment preview
  commentPreviewItem: { flexDirection: 'row', marginTop: 10, gap: 10 },
  commentPreviewAvatar: { width: 28, height: 28, borderRadius: 14 },
  commentPreviewContent: { flex: 1 },
  commentPreviewText: { color: '#fff', fontSize: 13.5, lineHeight: 18 },
  commentPreviewUsername: { fontWeight: '600', color: '#fff' },
  viewAllComments: { color: '#ccc', fontSize: 13, marginTop: 6, fontWeight: '500' },
});