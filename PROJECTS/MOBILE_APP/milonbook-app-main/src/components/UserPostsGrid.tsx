// import React, { useState, useRef } from 'react';
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
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import IconFA from 'react-native-vector-icons/FontAwesome5';
// import Video from 'react-native-video';
// import { useUserPosts, useDeletePost } from '../hooks/usePosts';
// import { useLike } from '../hooks/useLike';
// import { API_BASE_URL } from '../api/apiClient';

// const { width, height } = Dimensions.get('window');
// const ITEM_SIZE = (width - 4) / 3; // 3 columns with 2px gaps

// interface Post {
//   _id: string;
//   mediaUrl: string;
//   mediaType: 'image' | 'video';
//   caption: string;
//   likesCount: number;
//   commentsCount: number;
//   viewsCount: number;
//   createdAt: string;
//   isLiked?: boolean;
//   likes?: Array<{
//     _id: string;
//     username: string;
//     profilePicture: string;
//   }>;
//   comments?: Array<{
//     _id: string;
//     userId: {
//       username: string;
//     };
//     text: string;
//     likesCount: number;
//   }>;
//   userId?: {
//     _id: string;
//     username: string;
//     name: string;
//     profilePicture: string;
//   };
// }

// interface UserPostsGridProps {
//   userId: string;
// }

// const getFullImageUrl = (url: string): string => {
//   if (!url) return "https://via.placeholder.com/400";
//   if (url.startsWith("http://") || url.startsWith("https://")) return url;
//   return `${API_BASE_URL}${url}`;
// };

// const formatNumber = (num: number): string => {
//   if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//   if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//   return num.toString();
// };

// const formatTime = (seconds: number): string => {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// };

// // Separate component for the modal content to use the like hook
// const PostDetailModal = ({ 
//   post, 
//   onClose, 
//   onDelete,
//   isDeletingPost 
// }: { 
//   post: Post; 
//   onClose: () => void;
//   onDelete: () => void;
//   isDeletingPost: boolean;
// }) => {
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [videoProgress, setVideoProgress] = useState({ currentTime: 0, duration: 0 });
//   const [isMuted, setIsMuted] = useState(false);
//   const videoRef = useRef<Video>(null);

//   // ✅ Use the like hook for this specific post
//   const { isLiked, likesCount, isLoading: isLikeLoading, toggleLike } = useLike({
//     id: post._id,
//     type: 'post',
//     initialLiked: post.isLiked || false,
//     initialLikesCount: post.likesCount || post.likes?.length || 0,
//   });

//   const handleProgress = (data: any) => {
//     setVideoProgress({
//       currentTime: data.currentTime,
//       duration: data.seekableDuration || data.playableDuration || 0,
//     });
//   };

//   const getUsername = (post: Post) => {
//     const user = post?.userId || {};
//     return user?.username || user?.name || 'User';
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const options: Intl.DateTimeFormatOptions = { 
//         day: 'numeric', 
//         month: 'long', 
//         year: 'numeric' 
//       };
//       return date.toLocaleDateString('en-GB', options);
//     } catch {
//       return '';
//     }
//   };

//   const handleDeletePost = () => {
//     setShowOptionsMenu(false);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = () => {
//     onDelete();
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };

//   const progressPercentage = videoProgress.duration > 0 
//     ? (videoProgress.currentTime / videoProgress.duration) * 100 
//     : 0;

//   return (
//     <View style={styles.modalContainer}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
      
//       {/* Header */}
//       <View style={styles.instagramHeader}>
//         <TouchableOpacity onPress={onClose} style={styles.backButton}>
//           <Icon name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.instagramHeaderTitle}>Posts</Text>
//         <TouchableOpacity 
//           onPress={() => setIsMuted(!isMuted)} 
//           style={styles.soundButton}
//         >
//           <Icon 
//             name={isMuted ? "volume-x" : "volume-2"} 
//             size={24} 
//             color="#fff" 
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.instagramContent}>
//         {/* User Info Header */}
//         <View style={styles.postHeader}>
//           <View style={styles.postUserInfo}>
//             <Image
//               source={{
//                 uri: getFullImageUrl(post.userId?.profilePicture || ''),
//               }}
//               style={styles.postAvatar}
//             />
//             <View>
//               <Text style={styles.postUsername}>{getUsername(post)}</Text>
//               {post.createdAt && (
//                 <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
//               )}
//             </View>
//           </View>
//           <TouchableOpacity onPress={() => setShowOptionsMenu(!showOptionsMenu)}>
//             <Icon name="more-vertical" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Options Menu Dropdown */}
//         {showOptionsMenu && (
//           <View style={styles.optionsMenu}>
//             <TouchableOpacity 
//               style={styles.optionItem}
//               onPress={handleDeletePost}
//               disabled={isDeletingPost}
//             >
//               <Icon name="trash-2" size={14} color="#ed4956" />
//               <Text style={styles.optionTextDelete}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Media */}
//         <View style={styles.mediaContainer}>
//           {post.mediaType === 'video' ? (
//             <Video
//               ref={videoRef}
//               source={{ uri: getFullImageUrl(post.mediaUrl) }}
//               style={styles.instagramMedia}
//               resizeMode="contain"
//               paused={false}
//               repeat={true}
//               controls={false}
//               muted={isMuted}
//               playInBackground={false}
//               playWhenInactive={false}
//               onProgress={handleProgress}
//               onError={(error) => console.log('Video Error:', error)}
//             />
//           ) : (
//             <Image
//               source={{ uri: getFullImageUrl(post.mediaUrl) }}
//               style={styles.instagramMedia}
//               resizeMode="contain"
//             />
//           )}
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionsContainer}>
//           <View style={styles.leftActions}>
//             <TouchableOpacity 
//               onPress={toggleLike} 
//               style={styles.actionButton}
//               disabled={isLikeLoading}
//             >
//                <IconFA 
//                           name="heart"
//                           size={24} 
//                           color={isLiked ? "#EC4899" : "#fff"}
//                           solid={isLiked}
//                         />
//               <Text style={styles.actionCount}>{formatNumber(likesCount)}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="message-circle" size={26} color="#fff" />
//               <Text style={styles.actionCount}>{formatNumber(post.commentsCount)}</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.actionButton}>
//               <Icon name="send" size={24} color="#fff" />
//               <Text style={styles.actionCount}>{formatNumber(post.viewsCount)}</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.actionButton}>
//             <Icon name="bookmark" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Liked by section */}
//         {post.likes && post.likes.length > 0 && (
//           <View style={styles.likedBySection}>
//             <View style={styles.likedByAvatars}>
//               {post.likes.slice(0, 3).map((like, index) => (
//                 <Image
//                   key={like._id}
//                   source={{ uri: getFullImageUrl(like.profilePicture) }}
//                   style={[
//                     styles.likedByAvatar,
//                     { 
//                       zIndex: 3 - index,
//                       marginLeft: index > 0 ? -8 : 0 
//                     }
//                   ]}
//                 />
//               ))}
//             </View>
//             <Text style={styles.likedByText}>
//               Liked by <Text style={styles.likedByUsername}>{post.likes[0].username}</Text>
//               {post.likes.length > 1 && ' and others'}
//             </Text>
//           </View>
//         )}

//         {/* Caption */}
//         {post.caption && (
//           <View style={styles.instagramCaption}>
//             <Text style={styles.captionUsername}>{getUsername(post)}</Text>
//             <Text style={styles.instagramCaptionText}> {post.caption}</Text>
//           </View>
//         )}

//         {/* Comment Preview */}
//         {post.comments && post.comments.length > 0 && (
//           <TouchableOpacity style={styles.commentPreview}>
//             <Text style={styles.commentUsername}>
//               {post.comments[0].userId.username}{' '}
//             </Text>
//             <Text style={styles.commentText}>
//               {post.comments[0].text}
//             </Text>
//             {post.comments[0].likesCount > 0 && (
//               <Icon name="heart" size={12} color="#ed4956" style={styles.commentLike} />
//             )}
//           </TouchableOpacity>
//         )}

//         {/* Duration Progress Bar - Only for Videos */}
//         {post.mediaType === 'video' && videoProgress.duration > 0 && (
//           <View style={styles.durationContainer}>
//             <View style={styles.progressBarBackground}>
//               <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
//             </View>
//             <Text style={styles.durationText}>
//               {formatTime(videoProgress.currentTime)} / {formatTime(videoProgress.duration)}
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Custom Delete Confirmation Dialog */}
//       {showDeleteConfirm && (
//         <View style={styles.deleteOverlay}>
//           <View style={styles.deleteDialog}>
//             <View style={styles.deleteIconContainer}>
//               <Icon name="trash-2" size={36} color="#ed4956" />
//             </View>
            
//             <Text style={styles.deleteTitle}>Delete Post?</Text>
//             <Text style={styles.deleteMessage}>
//               Are you sure you want to delete this post? This action cannot be undone.
//             </Text>
            
//             <View style={styles.deleteActions}>
//               <TouchableOpacity 
//                 style={styles.deleteCancelButton}
//                 onPress={cancelDelete}
//                 disabled={isDeletingPost}
//               >
//                 <Text style={styles.deleteCancelText}>Cancel</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.deleteConfirmButton}
//                 onPress={confirmDelete}
//                 disabled={isDeletingPost}
//               >
//                 {isDeletingPost ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={styles.deleteConfirmText}>Delete</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default function UserPostsGrid({ userId }: UserPostsGridProps) {
//   const {
//     data,
//     isLoading,
//     error,
//     refetch,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useUserPosts(userId);
  
//   const deletePostMutation = useDeletePost();
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   // Flatten all pages into single array
//   const posts = data?.pages?.flatMap((page) => page?.posts || []) || [];

//   const handleLoadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };

//   const openPost = (item: Post) => {
//     setSelectedPost(item);
//   };

//   const closePost = () => {
//     setSelectedPost(null);
//   };

//   const handleDeletePost = () => {
//     if (!selectedPost) return;
    
//     deletePostMutation.mutate(selectedPost._id, {
//       onSuccess: () => {
//         closePost();
//       },
//     });
//   };

//   const renderPost = ({ item }: { item: Post }) => (
//     <TouchableOpacity
//       style={styles.postItem}
//       onPress={() => openPost(item)}
//       activeOpacity={0.9}
//     >
//       {item.mediaType === 'video' ? (
//         <View style={styles.videoContainer}>
//           <Image
//             source={{ uri: getFullImageUrl(item.mediaUrl) }}
//             style={styles.postImage}
//             resizeMode="cover"
//           />
//           <View style={styles.videoIndicator}>
//             <Icon name="play" size={18} color="#000" />
//           </View>
//         </View>
//       ) : (
//         <Image
//           source={{ uri: getFullImageUrl(item.mediaUrl) }}
//           style={styles.postImage}
//           resizeMode="cover"
//         />
//       )}

//       {/* Stats overlay - only views */}
//       <View style={styles.statsOverlay}>
//         <Icon name="eye" size={16} color="#000" />
//         <Text style={styles.statText}>{formatNumber(item.viewsCount)}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="camera" size={64} color="#d1d5db" />
//       <Text style={styles.emptyTitle}>No Moments Yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Share your first moment to get started
//       </Text>
//     </View>
//   );

//   const renderFooter = () => {
//     if (!isFetchingNextPage) return null;

//     return (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color="#7C3AED" />
//       </View>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#7C3AED" />
//         <Text style={styles.loadingText}>Loading posts...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Icon name="alert-circle" size={48} color="#ef4444" />
//         <Text style={styles.errorText}>Failed to load posts</Text>
//         <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
//           <Text style={styles.retryBtnText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header with post count */}
//       <View style={styles.header}>
//         <Icon name="grid" size={20} color="#111" />
//         <Text style={styles.headerText}>
//           {posts.length} {posts.length === 1 ? 'Moment' : 'Moments'}
//         </Text>
//       </View>

//       {/* Grid */}
//       <FlatList
//         data={posts}
//         renderItem={renderPost}
//         keyExtractor={(item) => item._id}
//         numColumns={3}
//         contentContainerStyle={styles.gridContent}
//         columnWrapperStyle={styles.columnWrapper}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={renderEmptyState}
//         ListFooterComponent={renderFooter}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         scrollEnabled={false}
//       />

//       {/* Instagram-like Post Detail Modal */}
//       <Modal
//         visible={!!selectedPost}
//         animationType="fade"
//         transparent={false}
//         onRequestClose={closePost}
//         statusBarTranslucent
//       >
//         {selectedPost && (
//           <PostDetailModal
//             post={selectedPost}
//             onClose={closePost}
//             onDelete={handleDeletePost}
//             isDeletingPost={deletePostMutation.isPending}
//           />
//         )}
//       </Modal>
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

//   postItem: {
//     width: ITEM_SIZE,
//     height: ITEM_SIZE,
//     marginBottom: 2,
//     position: 'relative',
//     backgroundColor: '#f9fafb',
//   },

//   postImage: {
//     width: '100%',
//     height: '100%',
//   },

//   videoContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },

//   videoIndicator: {
//     position: 'absolute',
//     top: 6,
//     right: 6,
//   },

//   statsOverlay: {
//     position: 'absolute',
//     bottom: 6,
//     left: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//   },

//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },

//   statText: {
//     color: '#000',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   footerLoader: {
//     paddingVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
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

//   // Instagram-like Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingTop: 50,
//   },

//   instagramHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#000',
//   },

//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   soundButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   instagramHeaderTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },

//   instagramContent: {
//     flex: 1,
//     backgroundColor: '#000',
//   },

//   postHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     position: 'relative',
//   },

//   postUserInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },

//   postAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//   },

//   postUsername: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//   },

//   postTime: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 2,
//   },

//   optionsMenu: {
//     position: 'absolute',
//     top: 50,
//     right: 16,
//     backgroundColor: '#1a1a1a',
//     borderRadius: 12,
//     paddingVertical: 8,
//     minWidth: 150,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//     zIndex: 1000,
//   },

//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 12,
//   },

//   optionTextDelete: {
//     color: '#ed4956',
//     fontSize: 15,
//     fontWeight: '500',
//   },

//   mediaContainer: {
//     width: width,
//     height: width * 1.25,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   instagramMedia: {
//     width: '100%',
//     height: '100%',
//   },

//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 8,
//   },

//   leftActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 18,
//   },

//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },

//   actionCount: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   likedBySection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     gap: 10,
//   },

//   likedByAvatars: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   likedByAvatar: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#000',
//   },

//   likedByText: {
//     color: '#fff',
//     fontSize: 13,
//   },

//   likedByUsername: {
//     fontWeight: '600',
//     color: '#fff',
//   },

//   instagramCaption: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 4,
//   },

//   captionUsername: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   instagramCaptionText: {
//     color: '#fff',
//     fontSize: 13,
//     flex: 1,
//   },

//   commentPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },

//   commentUsername: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   commentText: {
//     color: '#fff',
//     fontSize: 13,
//     flex: 1,
//   },

//   commentLike: {
//     marginLeft: 'auto',
//   },

//   // Duration Progress Bar Styles
//   durationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     gap: 12,
//   },

//   progressBarBackground: {
//     flex: 1,
//     height: 3,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 1.5,
//     overflow: 'hidden',
//   },

//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#7C3AED',
//     borderRadius: 1.5,
//   },

//   durationText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '600',
//     minWidth: 70,
//     textAlign: 'right',
//   },

//   // Custom Delete Confirmation Dialog Styles
//   deleteOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 2000,
//   },

//   deleteDialog: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     padding: 24,
//     width: width * 0.85,
//     maxWidth: 400,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },

//   deleteIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 40,
//     backgroundColor: 'rgba(237, 73, 86, 0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },

//   deleteTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 12,
//     textAlign: 'center',
//   },

//   deleteMessage: {
//     fontSize: 14,
//     color: '#a0a0a0',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 28,
//     paddingHorizontal: 8,
//   },

//   deleteActions: {
//     flexDirection: 'row',
//     gap: 12,
//     width: '100%',
//   },

//   deleteCancelButton: {
//     flex: 1,
//     backgroundColor: '#2a2a2a',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#3a3a3a',
//   },

//   deleteCancelText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   deleteConfirmButton: {
//     flex: 1,
//     backgroundColor: '#ed4956',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     minHeight: 48,
//     justifyContent: 'center',
//   },

//   deleteConfirmText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });
// src/components/UserPostsGrid.tsx
import React, { useState, useRef } from 'react';
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
import { useUserPosts, useDeletePost } from '../hooks/usePosts';
import { useLike } from '../hooks/useLike';
import { API_BASE_URL } from '../api/apiClient';
import CommentBottomSheet from './CommentBottomSheet'; // ← Added

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = (width - 4) / 3;

interface Post {
  _id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  isLiked?: boolean;
  comments?: Array<{
    _id: string;
    text: string;
    likesCount: number;
    user: {
      _id: string;
      name?: string;
      username?: string;
      profilePicture?: string;
    };
  }>;
  userId?: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
  };
}

interface UserPostsGridProps {
  userId: string;
}

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

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Comment Preview Component
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

const PostDetailModal = ({
  post,
  onClose,
  onDelete,
  isDeletingPost,
  openComments,
}: {
  post: Post;
  onClose: () => void;
  onDelete: () => void;
  isDeletingPost: boolean;
  openComments: (post: Post) => void;
}) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoProgress, setVideoProgress] = useState({ currentTime: 0, duration: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<Video>(null);

  const { isLiked, likesCount, isLoading: isLikeLoading, toggleLike } = useLike({
    id: post._id,
    type: 'post',
    initialLiked: post.isLiked || false,
    initialLikesCount: post.likesCount || 0,
  });

  const handleProgress = (data: any) => {
    setVideoProgress({
      currentTime: data.currentTime,
      duration: data.seekableDuration || data.playableDuration || 0,
    });
  };

  const getUsername = () => post.userId?.name || post.userId?.username || 'User';

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options);
    } catch {
      return '';
    }
  };

  const progressPercentage = videoProgress.duration > 0
    ? (videoProgress.currentTime / videoProgress.duration) * 100
    : 0;

  const previewComments = (post.comments || []).slice(0, 2);

  return (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.instagramHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.instagramHeaderTitle}>Post</Text>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.soundButton}>
          <Icon name={isMuted ? "volume-x" : "volume-2"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.instagramContent}>
        {/* User Info */}
        <View style={styles.postHeader}>
          <View style={styles.postUserInfo}>
            <Image source={{ uri: getFullUrl(post.userId?.profilePicture) }} style={styles.postAvatar} />
            <View>
              <Text style={styles.postUsername}>{getUsername()}</Text>
              {post.createdAt && <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>}
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowOptionsMenu(true)}>
            <Icon name="more-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Options Menu */}
        {showOptionsMenu && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity style={styles.optionItem} onPress={() => { setShowOptionsMenu(false); setShowDeleteConfirm(true); }}>
              <Icon name="trash-2" size={14} color="#ed4956" />
              <Text style={styles.optionTextDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Media */}
        <View style={styles.mediaContainer}>
          {post.mediaType === 'video' ? (
            <Video
              ref={videoRef}
              source={{ uri: getFullUrl(post.mediaUrl) }}
              style={styles.instagramMedia}
              resizeMode="contain"
              paused={false}
              repeat
              muted={isMuted}
              onProgress={handleProgress}
            />
          ) : (
            <Image source={{ uri: getFullUrl(post.mediaUrl) }} style={styles.instagramMedia} resizeMode="contain" />
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={toggleLike} disabled={isLikeLoading} style={styles.actionButton}>
              <IconFA name="heart" size={24} color={isLiked ? "#EC4899" : "#fff"} solid={isLiked} />
              <Text style={styles.actionCount}>{formatNumber(likesCount)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => openComments(post)}>
              <Icon name="message-circle" size={26} color="#fff" />
              <Text style={styles.actionCount}>{formatNumber(post.commentsCount)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="send" size={24} color="#fff" />
              <Text style={styles.actionCount}>{formatNumber(post.viewsCount)}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="bookmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        {post.caption && (
          <View style={styles.instagramCaption}>
            <Text style={styles.captionUsername}>{getUsername()}</Text>
            <Text style={styles.instagramCaptionText}> {post.caption}</Text>
          </View>
        )}

        {/* Comment Previews */}
        {previewComments.map((comment) => (
          <CommentPreview key={comment._id} comment={comment} />
        ))}

        {post.commentsCount > 2 && (
          <TouchableOpacity onPress={() => openComments(post)} style={styles.viewAllCommentsContainer}>
            <Text style={styles.viewAllCommentsText}>
              View all {post.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}

        {/* Video Progress */}
        {post.mediaType === 'video' && videoProgress.duration > 0 && (
          <View style={styles.durationContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.durationText}>
              {formatTime(videoProgress.currentTime)} / {formatTime(videoProgress.duration)}
            </Text>
          </View>
        )}
      </View>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteDialog}>
            <View style={styles.deleteIconContainer}>
              <Icon name="trash-2" size={36} color="#ed4956" />
            </View>
            <Text style={styles.deleteTitle}>Delete Post?</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this post? This action cannot be undone.
            </Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity style={styles.deleteCancelButton} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmButton} onPress={onDelete} disabled={isDeletingPost}>
                {isDeletingPost ? <ActivityIndicator color="#fff" /> : <Text style={styles.deleteConfirmText}>Delete</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default function UserPostsGrid({ userId }: UserPostsGridProps) {
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserPosts(userId);
  const deletePostMutation = useDeletePost();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCommentSheetVisible, setIsCommentSheetVisible] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);

  const posts = data?.pages?.flatMap(page => page?.posts || []) || [];

  const openPost = (post: Post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  const openComments = (post: Post) => {
    setSelectedPostForComments(post);
    setIsCommentSheetVisible(true);
  };

  const handleDeletePost = () => {
    if (!selectedPost) return;
    deletePostMutation.mutate(selectedPost._id, { onSuccess: closePost });
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postItem} onPress={() => openPost(item)} activeOpacity={0.9}>
      {item.mediaType === 'video' ? (
        <View style={styles.videoContainer}>
          <Image source={{ uri: getFullUrl(item.mediaUrl) }} style={styles.postImage} resizeMode="cover" />
          <View style={styles.videoIndicator}>
            <Icon name="play" size={12} color="#fff" />
          </View>
        </View>
      ) : (
        <Image source={{ uri: getFullUrl(item.mediaUrl) }} style={styles.postImage} resizeMode="cover" />
      )}
      <View style={styles.statsOverlay}>
        <Icon name="eye" size={12} color="#fff" />
        <Text style={styles.statText}>{formatNumber(item.viewsCount)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#7C3AED" /><Text style={styles.loadingText}>Loading posts...</Text></View>;
  if (error) return <View style={styles.center}><Icon name="alert-circle" size={48} color="#ef4444" /><Text style={styles.errorText}>Failed to load posts</Text><TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}><Text style={styles.retryBtnText}>Retry</Text></TouchableOpacity></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="grid" size={20} color="#111" />
        <Text style={styles.headerText}>{posts.length} {posts.length === 1 ? 'Moment' : 'Moments'}</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Icon name="camera" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Moments Yet</Text>
          </View>
        }
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
      />

      {/* Post Detail Modal */}
      <Modal visible={!!selectedPost} animationType="fade" transparent={false} onRequestClose={closePost}>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={closePost}
            onDelete={handleDeletePost}
            isDeletingPost={deletePostMutation.isPending}
            openComments={openComments}
          />
        )}
      </Modal>

      {/* Comment Bottom Sheet */}
      <CommentBottomSheet
        visible={isCommentSheetVisible}
        onClose={() => setIsCommentSheetVisible(false)}
        item={selectedPostForComments}
        type="post"
        currentUserAvatar={getFullUrl('YOUR_CURRENT_USER_AVATAR_PATH')} // ← Replace with real one
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  headerText: { fontSize: 15, fontWeight: '600', color: '#111' },
  gridContent: { paddingBottom: 20 },
  columnWrapper: { gap: 2 },
  postItem: { width: ITEM_SIZE, height: ITEM_SIZE, marginBottom: 2, backgroundColor: '#f9fafb', overflow: 'hidden' },
  postImage: { width: '100%', height: '100%' },
  videoContainer: { width: '100%', height: '100%', position: 'relative' },
  videoIndicator: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 6 },
  statsOverlay: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  loadingText: { marginTop: 12, color: '#6b7280' },
  errorText: { marginTop: 12, color: '#6b7280', fontSize: 16 },
  retryBtn: { marginTop: 16, backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  emptyTitle: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#111' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#000' },
  instagramHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  soundButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  instagramHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  instagramContent: { flex: 1 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  postUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  postUsername: { color: '#fff', fontSize: 14, fontWeight: '600' },
  postTime: { color: '#999', fontSize: 12 },
  optionsMenu: { position: 'absolute', top: 70, right: 16, backgroundColor: '#1a1a1a', borderRadius: 12, paddingVertical: 8, minWidth: 150, elevation: 10 },
  optionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  optionTextDelete: { color: '#ed4956', fontSize: 15, fontWeight: '500' },
  mediaContainer: { width, height: width * 1.25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  instagramMedia: { width: '100%', height: '100%' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  leftActions: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { color: '#fff', fontSize: 14, fontWeight: '600' },
  instagramCaption: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 4 },
  captionUsername: { color: '#fff', fontSize: 13, fontWeight: '600' },
  instagramCaptionText: { color: '#fff', fontSize: 13, flex: 1 },

  // Comment Preview
  commentPreviewItem: { flexDirection: 'row', marginTop: 10, paddingHorizontal: 16, gap: 10 },
  commentPreviewAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentPreviewContent: { flex: 1 },
  commentPreviewText: { color: '#fff', fontSize: 13.5, lineHeight: 19 },
  commentPreviewUsername: { fontWeight: '600', color: '#fff' },
  viewAllCommentsContainer: { paddingHorizontal: 16, marginTop: 10 },
  viewAllCommentsText: { color: '#ccc', fontSize: 13.5, fontWeight: '500' },

  // Video Progress
  durationContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, gap: 12 },
  progressBarBackground: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 2 },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '600', minWidth: 70, textAlign: 'right' },

  // Delete Dialog
  deleteOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  deleteDialog: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, width: width * 0.85, alignItems: 'center' },
  deleteIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(237,73,86,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  deleteTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  deleteMessage: { fontSize: 14, color: '#a0a0a0', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  deleteActions: { flexDirection: 'row', gap: 12, width: '100%' },
  deleteCancelButton: { flex: 1, backgroundColor: '#2a2a2a', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  deleteCancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteConfirmButton: { flex: 1, backgroundColor: '#ed4956', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  deleteConfirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});