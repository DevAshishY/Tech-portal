// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   StatusBar,
// //   ScrollView,
// //   Image,
// //   TouchableOpacity,
// //   TextInput,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Icon from 'react-native-vector-icons/FontAwesome5';
// // import { launchImageLibrary } from 'react-native-image-picker';
// // import Video from 'react-native-video'; // ✅ Install: npm install react-native-video
// // import { useCreatePost, useUploadMedia } from '../hooks/usePosts';
// // import Toast from 'react-native-toast-message';

// // type Props = {
// //   navigation: any;
// // };

// // function CreatePostScreen({ navigation }: Props): React.JSX.Element {
// //   const [caption, setCaption] = useState('');
// //   const [selectedCategory, setSelectedCategory] = useState('Other');
// //   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
// //   const [selectedMedia, setSelectedMedia] = useState<{
// //     uri: string;
// //     type: string;
// //     name: string;
// //   } | null>(null);
// //   const [location, setLocation] = useState('');

// //   const uploadMutation = useUploadMedia();
// //   const createPostMutation = useCreatePost();

// //   const categories = [
// //     'Sad',
// //     'Funny',
// //     'Inspirational',
// //     'Educational',
// //     'Entertainment',
// //     'Sports',
// //     'Travel',
// //     'Lifestyle',
// //     'Food',
// //     'Fashion',
// //     'Technology',
// //     'Other',
// //   ];

// //   // ✅ Pick Media (Images & Videos)
// //   const handlePickMedia = () => {
// //     launchImageLibrary(
// //       {
// //         mediaType: 'mixed', // ✅ Both photos and videos
// //         quality: 0.9,
// //         includeBase64: false,
// //         videoQuality: 'medium',
// //       },
// //       (response) => {
// //         if (response.didCancel) return;

// //         if (response.errorCode) {
// //           Toast.show({
// //             type: 'error',
// //             text1: 'Failed to open gallery',
// //           });
// //           return;
// //         }

// //         const asset = response.assets?.[0];
// //         if (!asset?.uri) return;

// //         // ✅ Validate file type
// //         const isImage = asset.type?.startsWith('image/');
// //         const isVideo = asset.type?.startsWith('video/');

// //         if (!isImage && !isVideo) {
// //           Toast.show({
// //             type: 'error',
// //             text1: 'Invalid file type',
// //             text2: 'Please select an image or video',
// //           });
// //           return;
// //         }

// //         setSelectedMedia({
// //           uri: asset.uri,
// //           type: asset.type || 'image/jpeg',
// //           name: asset.fileName || 'media.jpg',
// //         });
// //       }
// //     );
// //   };

// //   const extractHashtags = (text: string): string[] => {
// //     const matches = text.match(/#\w+/g);
// //     return matches ? matches.map((tag) => tag.substring(1)) : [];
// //   };

// //   // ✅ Create Post
// //   const handleCreatePost = async () => {
// //     if (!selectedMedia) {
// //       Toast.show({
// //         type: 'error',
// //         text1: 'No media selected',
// //         text2: 'Please select a photo or video',
// //       });
// //       return;
// //     }

// //     try {
// //       // Step 1: Upload media
// //       const uploadResult = await uploadMutation.mutateAsync({
// //         uri: selectedMedia.uri,
// //         name: selectedMedia.name,
// //         type: selectedMedia.type,
// //       });

// //       if (!uploadResult.success) {
// //         throw new Error('Failed to upload media');
// //       }

// //       // Step 2: Extract hashtags
// //       const extractedHashtags = extractHashtags(caption);

// //       // Step 3: Create post
// //       await createPostMutation.mutateAsync({
// //         caption,
// //         mediaUrl: uploadResult.url,
// //         mediaType: selectedMedia.type.startsWith('video') ? 'video' : 'image',
// //         category: selectedCategory,
// //         hashtags: extractedHashtags,
// //         taggedUsers: [],
// //         ...(location && { location: { name: location } }),
// //       });

// //       // Success - Navigate back
// //       setTimeout(() => {
// //         navigation.goBack();
// //       }, 1000);
// //     } catch (error: any) {
// //       console.error('Create post error:', error);
// //     }
// //   };

// //   const isLoading = uploadMutation.isPending || createPostMutation.isPending;
// //   const isVideo = selectedMedia?.type.startsWith('video/');

// //   return (
// //     <SafeAreaProvider>
// //       <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
// //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// //         {/* Header */}
// //         <View style={styles.header}>
// //           <TouchableOpacity
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Icon name="arrow-left" size={20} color="#111827" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>Create Post</Text>
// //           <TouchableOpacity
// //             style={styles.shareButton}
// //             onPress={handleCreatePost}
// //             disabled={isLoading}
// //           >
// //             <LinearGradient
// //               colors={['#00B5D8', '#7C3AED', '#EC4899']}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.shareGradient}
// //             >
// //               {isLoading ? (
// //                 <ActivityIndicator size="small" color="#fff" />
// //               ) : (
// //                 <Text style={styles.shareText}>Share</Text>
// //               )}
// //             </LinearGradient>
// //           </TouchableOpacity>
// //         </View>

// //         <ScrollView
// //           style={styles.content}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.contentContainer}
// //         >
// //           {/* Media Upload/Preview Section */}
// //           <View style={styles.uploadSection}>
// //             <LinearGradient
// //               colors={['#00B5D8', '#7C3AED', '#EC4899']}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.uploadBorder}
// //             >
// //               <View style={styles.uploadContainer}>
// //                 {selectedMedia ? (
// //                   <>
// //                     {/* ✅ Video Preview */}
// //                     {isVideo ? (
// //                       <View style={styles.videoContainer}>
// //                         <Video
// //                           source={{ uri: selectedMedia.uri }}
// //                           style={styles.previewVideo}
// //                           resizeMode="cover"
// //                           paused={false}
// //                           repeat={true}
// //                           muted={true}
// //                         />
// //                         <View style={styles.videoOverlay}>
// //                           <Icon name="play-circle" size={50} color="#ffffff" />
// //                         </View>
// //                       </View>
// //                     ) : (
// //                       /* ✅ Image Preview */
// //                       <Image
// //                         source={{ uri: selectedMedia.uri }}
// //                         style={styles.previewImage}
// //                         resizeMode="cover"
// //                       />
// //                     )}
// //                     <TouchableOpacity
// //                       style={styles.changeMediaBtn}
// //                       onPress={handlePickMedia}
// //                     >
// //                       <Text style={styles.changeMediaText}>Change Media</Text>
// //                     </TouchableOpacity>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <View style={styles.uploadIconContainer}>
// //                       <Icon name="photo-video" size={40} color="#00B5D8" />
// //                       <Icon
// //                         name="sparkles"
// //                         size={20}
// //                         color="#EC4899"
// //                         style={styles.sparkleIcon}
// //                       />
// //                     </View>
// //                     <Text style={styles.uploadTitle}>
// //                       Select photo or video
// //                     </Text>
// //                     <Text style={styles.uploadSubtitle}>
// //                       Tap to browse your gallery
// //                     </Text>

// //                     <TouchableOpacity
// //                       style={styles.browseButton}
// //                       onPress={handlePickMedia}
// //                     >
// //                       <LinearGradient
// //                         colors={['#00B5D8', '#7C3AED', '#EC4899']}
// //                         start={{ x: 0, y: 0 }}
// //                         end={{ x: 1, y: 1 }}
// //                         style={styles.browseGradient}
// //                       >
// //                         <Text style={styles.browseText}>Browse Files</Text>
// //                       </LinearGradient>
// //                     </TouchableOpacity>
// //                   </>
// //                 )}
// //               </View>
// //             </LinearGradient>
// //           </View>

// //           {/* Caption Section */}
// //           <View style={styles.captionSection}>
// //             <LinearGradient
// //               colors={['#00B5D8', '#7C3AED', '#EC4899']}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.captionBorder}
// //             >
// //               <View style={styles.captionContainer}>
// //                 <TextInput
// //                   style={styles.captionInput}
// //                   placeholder="Write a caption... ✨ Use #hashtags"
// //                   placeholderTextColor="#9ca3af"
// //                   multiline
// //                   numberOfLines={4}
// //                   value={caption}
// //                   onChangeText={setCaption}
// //                   textAlignVertical="top"
// //                   maxLength={2200}
// //                 />
// //                 <Text style={styles.charCount}>{caption.length}/2200</Text>
// //               </View>
// //             </LinearGradient>
// //           </View>

// //           {/* Options Section */}
// //           <View style={styles.optionsSection}>
// //             {/* Category Dropdown */}
// //             <View
// //               style={[
// //                 styles.categoryWrapper,
// //                 showCategoryDropdown && styles.categoryWrapperExpanded,
// //               ]}
// //             >
// //               <TouchableOpacity
// //                 style={styles.categoryButton}
// //                 onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
// //               >
// //                 <LinearGradient
// //                   colors={['#00B5D8', '#7C3AED', '#EC4899']}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.categoryGradient}
// //                 >
// //                   <Text style={styles.categoryButtonText}>
// //                     {selectedCategory}
// //                   </Text>
// //                   <Icon
// //                     name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
// //                     size={14}
// //                     color="#ffffff"
// //                   />
// //                 </LinearGradient>
// //               </TouchableOpacity>

// //               {showCategoryDropdown && (
// //                 <View style={styles.categoryDropdown}>
// //                   {categories.map((category) => (
// //                     <TouchableOpacity
// //                       key={category}
// //                       style={[
// //                         styles.categoryItem,
// //                         selectedCategory === category &&
// //                           styles.categoryItemSelected,
// //                       ]}
// //                       onPress={() => {
// //                         setSelectedCategory(category);
// //                         setShowCategoryDropdown(false);
// //                       }}
// //                     >
// //                       <Text
// //                         style={[
// //                           styles.categoryItemText,
// //                           selectedCategory === category &&
// //                             styles.categoryItemTextSelected,
// //                         ]}
// //                       >
// //                         {category}
// //                       </Text>
// //                       {selectedCategory === category && (
// //                         <Icon name="check" size={14} color="#7C3AED" />
// //                       )}
// //                     </TouchableOpacity>
// //                   ))}
// //                 </View>
// //               )}
// //             </View>

// //             {/* Add Location */}
// //             <TouchableOpacity style={styles.optionItem}>
// //               <View style={styles.optionLeft}>
// //                 <Icon name="map-marker-alt" size={18} color="#7C3AED" />
// //                 <TextInput
// //                   style={styles.locationInput}
// //                   placeholder="Add Location"
// //                   placeholderTextColor="#111827"
// //                   value={location}
// //                   onChangeText={setLocation}
// //                 />
// //               </View>
// //             </TouchableOpacity>
// //           </View>
// //         </ScrollView>
// //       </SafeAreaView>
// //     </SafeAreaProvider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e5e7eb',
// //   },
// //   backButton: {
// //     padding: 8,
// //     width: 80,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#111827',
// //     flex: 1,
// //     textAlign: 'center',
// //   },
// //   shareButton: {
// //     width: 80,
// //     alignItems: 'flex-end',
// //   },
// //   shareGradient: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 20,
// //     minWidth: 70,
// //     alignItems: 'center',
// //   },
// //   shareText: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   content: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   contentContainer: {
// //     paddingBottom: 80,
// //   },
// //   uploadSection: {
// //     marginBottom: 16,
// //   },
// //   uploadBorder: {
// //     borderRadius: 20,
// //     padding: 2,
// //   },
// //   uploadContainer: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 18,
// //     padding: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     minHeight: 300,
// //   },
// //   previewImage: {
// //     width: '100%',
// //     height: 300,
// //     borderRadius: 12,
// //   },
// //   // ✅ Video Preview Styles
// //   videoContainer: {
// //     width: '100%',
// //     height: 300,
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     position: 'relative',
// //   },
// //   previewVideo: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   videoOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.3)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   changeMediaBtn: {
// //     marginTop: 12,
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     backgroundColor: '#f3f4f6',
// //     borderRadius: 8,
// //   },
// //   changeMediaText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#111827',
// //   },
// //   uploadIconContainer: {
// //     position: 'relative',
// //     marginBottom: 20,
// //   },
// //   sparkleIcon: {
// //     position: 'absolute',
// //     top: -5,
// //     right: -10,
// //   },
// //   uploadTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#111827',
// //     marginBottom: 8,
// //   },
// //   uploadSubtitle: {
// //     fontSize: 14,
// //     color: '#9ca3af',
// //     marginBottom: 24,
// //   },
// //   browseButton: {
// //     borderRadius: 24,
// //   },
// //   browseGradient: {
// //     paddingHorizontal: 32,
// //     paddingVertical: 12,
// //     borderRadius: 24,
// //   },
// //   browseText: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   captionSection: {
// //     marginBottom: 16,
// //   },
// //   captionBorder: {
// //     borderRadius: 16,
// //     padding: 2,
// //   },
// //   captionContainer: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 14,
// //     padding: 16,
// //     minHeight: 120,
// //   },
// //   captionInput: {
// //     fontSize: 15,
// //     color: '#111827',
// //     minHeight: 100,
// //   },
// //   charCount: {
// //     fontSize: 12,
// //     color: '#9ca3af',
// //     textAlign: 'right',
// //     marginTop: 4,
// //   },
// //   optionsSection: {
// //     backgroundColor: '#f9fafb',
// //     borderRadius: 16,
// //     padding: 16,
// //     gap: 12,
// //   },
// //   optionItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingVertical: 12,
// //   },
// //   optionLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //     flex: 1,
// //   },
// //   locationInput: {
// //     flex: 1,
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: '#111827',
// //   },
// //   categoryWrapper: {
// //     position: 'relative',
// //     zIndex: 1000,
// //   },
// //   categoryWrapperExpanded: {
// //     marginBottom: 20,
// //   },
// //   categoryButton: {
// //     alignSelf: 'flex-end',
// //     borderRadius: 20,
// //   },
// //   categoryGradient: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 20,
// //     gap: 8,
// //   },
// //   categoryButtonText: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   categoryDropdown: {
// //     marginTop: 8,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 5,
// //     borderWidth: 1,
// //     borderColor: '#e5e7eb',
// //   },
// //   categoryItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //   },
// //   categoryItemSelected: {
// //     backgroundColor: '#f3f4f6',
// //   },
// //   categoryItemText: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: '#111827',
// //   },
// //   categoryItemTextSelected: {
// //     color: '#7C3AED',
// //   },
// // });

// // export default CreatePostScreen;
// // File: src/screens/CreatePostScreen.tsx
// // Instagram-style multi-step flow - FIXED VERSION

// // File: src/screens/CreatePostScreen.tsx
// // Instagram-style multi-step flow with working API integration


// // File: src/screens/CreatePostScreen.tsx
// // Updated to show compression progress



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import Video from 'react-native-video';
// import { useCreatePost, useUploadMedia } from '../hooks/usePosts';
// import { useCreateReel, useUploadReelMedia } from '../hooks/useReels';
// import Toast from 'react-native-toast-message';

// const { width } = Dimensions.get('window');

// type Props = {
//   navigation: any;
// };

// type Step = 1 | 2 | 3;
// type ContentType = 'post' | 'reel' | 'story';

// function CreatePostScreen({ navigation }: Props): React.JSX.Element {
//   const uploadMutation = useUploadMedia();
//   const createPostMutation = useCreatePost();

//   const uploadReelMutation = useUploadReelMedia();
//   const createReelMutation = useCreateReel();

//   const [contentType, setContentType] = useState<ContentType>('post');
//   const [currentStep, setCurrentStep] = useState<Step>(1);
//   const [selectedMedia, setSelectedMedia] = useState<{
//     uri: string;
//     type: string;
//     name: string;
//   } | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState('Lifestyle');
//   const [caption, setCaption] = useState('');
//   const [location, setLocation] = useState('');

//   const isLoading =
//     contentType === 'post'
//       ? uploadMutation.isPending || createPostMutation.isPending
//       : contentType === 'reel'
//         ? uploadReelMutation.isPending || createReelMutation.isPending
//         : false;

//   const isVideo = selectedMedia?.type.startsWith('video/');

//   const categories = [
//     { id: 'Sad', label: 'Sad', icon: '😢' },
//     { id: 'Funny', label: 'Funny', icon: '😂' },
//     { id: 'Inspirational', label: 'Inspirational', icon: '✨' },
//     { id: 'Educational', label: 'Educational', icon: '📚' },
//     { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
//     { id: 'Sports', label: 'Sports', icon: '⚽' },
//     { id: 'Travel', label: 'Travel', icon: '✈️' },
//     { id: 'Lifestyle', label: 'Lifestyle', icon: '🌟' },
//     { id: 'Food', label: 'Food', icon: '🍔' },
//     { id: 'Fashion', label: 'Fashion', icon: '👗' },
//     { id: 'Technology', label: 'Technology', icon: '💻' },
//     { id: 'Other', label: 'Other', icon: '📌' },
//   ];

//   const handlePickFromGallery = () => {
//     const mediaType = contentType === 'reel' ? 'video' : 'mixed';
//     launchImageLibrary(
//       {
//         mediaType,
//         quality: 0.9,
//         includeBase64: false,
//         videoQuality: 'medium',
//       },
//       (response) => {
//         if (response.didCancel) return;

//         if (response.errorCode) {
//           Toast.show({
//             type: 'error',
//             text1: 'Failed to open gallery',
//           });
//           return;
//         }

//         const asset = response.assets?.[0];
//         if (!asset?.uri) return;

//         const isImage = asset.type?.startsWith('image/');
//         const isVideoAsset = asset.type?.startsWith('video/');

//         if (contentType === 'reel' && !isVideoAsset) {
//           Toast.show({
//             type: 'error',
//             text1: 'Reels require video',
//             text2: 'Please select a video file',
//           });
//           return;
//         }

//         if (!isImage && !isVideoAsset) {
//           Toast.show({
//             type: 'error',
//             text1: 'Invalid file type',
//             text2: 'Please select an image or video',
//           });
//           return;
//         }

//         setSelectedMedia({
//           uri: asset.uri,
//           type: asset.type || 'image/jpeg',
//           name: asset.fileName || 'media.jpg',
//         });
//       }
//     );
//   };

//   const handleCaptureFromCamera = () => {
//     const mediaType = contentType === 'reel' ? 'video' : 'mixed';
//     launchCamera(
//       {
//         mediaType,
//         quality: 0.9,
//         includeBase64: false,
//         videoQuality: 'medium',
//         saveToPhotos: true,
//       },
//       (response) => {
//         if (response.didCancel) return;

//         if (response.errorCode) {
//           Toast.show({
//             type: 'error',
//             text1: 'Failed to open camera',
//           });
//           return;
//         }

//         const asset = response.assets?.[0];
//         if (!asset?.uri) return;

//         setSelectedMedia({
//           uri: asset.uri,
//           type: asset.type || 'image/jpeg',
//           name: asset.fileName || 'media.jpg',
//         });
//       }
//     );
//   };

//   const handleNext = () => {
//     if (currentStep === 1 && !selectedMedia) {
//       Toast.show({
//         type: 'error',
//         text1: 'No media selected',
//         text2: 'Please select a photo or video',
//       });
//       return;
//     }

//     if (currentStep < 3) {
//       setCurrentStep((prev) => (prev + 1) as Step);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => (prev - 1) as Step);
//     } else {
//       resetForm();
//       navigation.goBack();
//     }
//   };

//   const resetForm = () => {
//     setCurrentStep(1);
//     setSelectedMedia(null);
//     setSelectedCategory('Lifestyle');
//     setCaption('');
//     setLocation('');
//     setContentType('post');
//   };

//   const switchContentType = (newType: ContentType) => {
//     setContentType(newType);
//     setCurrentStep(1);
//     setSelectedMedia(null);
//     setSelectedCategory('Lifestyle');
//     setCaption('');
//     setLocation('');
//   };

//   const extractHashtags = (text: string): string[] => {
//     const matches = text.match(/#\w+/g);
//     return matches ? matches.map((tag) => tag.substring(1)) : [];
//   };

//   const handlePublish = async () => {
//     if (!selectedMedia) {
//       Toast.show({
//         type: 'error',
//         text1: 'No media selected',
//         text2: 'Please select a photo or video',
//       });
//       return;
//     }

//     if (contentType === 'story') {
//       Toast.show({
//         type: 'info',
//         text1: 'Coming Soon',
//         text2: 'Stories feature will be available soon',
//       });
//       return;
//     }

//     try {
//       const extractedHashtags = extractHashtags(caption);

//       if (contentType === 'post') {
//         // 🎥 Video will be compressed automatically by the hook
//         const uploadResult = await uploadMutation.mutateAsync({
//           uri: selectedMedia.uri,
//           name: selectedMedia.name,
//           type: selectedMedia.type,
//         });

//         if (!uploadResult.success) {
//           throw new Error('Failed to upload media');
//         }

//         await createPostMutation.mutateAsync({
//           caption,
//           mediaUrl: uploadResult.url,
//           mediaType: selectedMedia.type.startsWith('video/') ? 'video' : 'image',
//           category: selectedCategory,
//           hashtags: extractedHashtags,
//           taggedUsers: [],
//           ...(location && { location: { name: location } }),
//         });
//       } else if (contentType === 'reel') {
//         // 🎥 Video will be compressed automatically by the hook
//         const uploadResult = await uploadReelMutation.mutateAsync({
//           uri: selectedMedia.uri,
//           name: selectedMedia.name,
//           type: selectedMedia.type,
//         });

//         if (!uploadResult.success) {
//           throw new Error('Failed to upload reel');
//         }

//         await createReelMutation.mutateAsync({
//           caption,
//           mediaUrl: uploadResult.url,
//           mediaType: 'video',
//           category: selectedCategory,
//           hashtags: extractedHashtags,
//           taggedUsers: [],
//           ...(location && { location: { name: location } }),
//         });
//       }

//       resetForm();
//       setTimeout(() => {
//         navigation.goBack();
//       }, 1000);
//     } catch (error: any) {
//       console.error('Create content error:', error);
//       Toast.show({
//         type: 'error',
//         text1: `Failed to create ${contentType}`,
//         text2: error.message || 'Please try again',
//       });
//     }
//   };

//   const renderStep1 = () => (
//     <ScrollView
//       style={styles.stepContainer}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingBottom: 20 }}
//     >
//       <Text style={styles.stepTitle}>
//         {contentType === 'reel' ? 'Select Video' : 'Select Photo or Video'}
//       </Text>
//       <Text style={styles.stepSubtitle}>
//         Choose from gallery or take a new one
//       </Text>

//       {selectedMedia ? (
//         <View style={styles.previewContainer}>
//           {isVideo ? (
//             <View style={styles.videoPreviewContainer}>
//               <Video
//                 source={{ uri: selectedMedia.uri }}
//                 style={styles.mediaPreview}
//                 resizeMode="cover"
//                 paused={false}
//                 repeat={true}
//                 muted={true}
//               />
//             </View>
//           ) : (
//             <Image
//               source={{ uri: selectedMedia.uri }}
//               style={styles.mediaPreview}
//               resizeMode="cover"
//             />
//           )}

//           <View style={styles.changeMediaButtons}>
//             <TouchableOpacity
//               style={styles.changeMediaBtn}
//               onPress={handlePickFromGallery}
//             >
//               <Icon name="images" size={16} color="#7C3AED" />
//               <Text style={styles.changeMediaText}>Gallery</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.changeMediaBtn}
//               onPress={handleCaptureFromCamera}
//             >
//               <Icon name="camera" size={16} color="#7C3AED" />
//               <Text style={styles.changeMediaText}>Camera</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         <View style={styles.selectionContainer}>
//           <TouchableOpacity
//             style={styles.selectionCard}
//             onPress={handlePickFromGallery}
//           >
//             <View style={styles.selectionContent}>
//               <Icon name="images" size={40} color="#7C3AED" />
//               <Text style={styles.selectionText}>Gallery</Text>
//               <Text style={styles.selectionSubtext}>
//                 {contentType === 'reel' ? 'Choose a video' : 'Choose from your photos'}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.selectionCard}
//             onPress={handleCaptureFromCamera}
//           >
//             <View style={styles.selectionContent}>
//               <Icon name="camera" size={40} color="#EC4899" />
//               <Text style={styles.selectionText}>Camera</Text>
//               <Text style={styles.selectionSubtext}>
//                 {contentType === 'reel' ? 'Record a video' : 'Take a new photo or video'}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );

//   const renderStep2 = () => (
//     <View style={styles.stepContainer}>
//       <Text style={styles.stepTitle}>Choose Category</Text>
//       <Text style={styles.stepSubtitle}>Help people discover your {contentType}</Text>

//       <ScrollView
//         style={styles.categoriesScroll}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.categoriesGrid}>
//           {categories.map((category) => (
//             <TouchableOpacity
//               key={category.id}
//               style={[
//                 styles.categoryCard,
//                 selectedCategory === category.id && styles.categoryCardSelected,
//               ]}
//               onPress={() => setSelectedCategory(category.id)}
//             >
//               <Text style={styles.categoryIcon}>{category.icon}</Text>
//               <Text
//                 style={[
//                   styles.categoryLabel,
//                   selectedCategory === category.id && styles.categoryLabelSelected,
//                 ]}
//               >
//                 {category.label}
//               </Text>
//               {selectedCategory === category.id && (
//                 <View style={styles.categoryCheck}>
//                   <Icon name="check" size={12} color="#ffffff" />
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   const renderStep3 = () => (
//     <ScrollView
//       style={styles.stepContainer}
//       showsVerticalScrollIndicator={false}
//     >
//       <Text style={styles.stepTitle}>Add Details</Text>
//       <Text style={styles.stepSubtitle}>Tell your story</Text>

//       <View style={styles.detailSection}>
//         <View style={styles.detailHeader}>
//           <Icon name="align-left" size={18} color="#7C3AED" />
//           <Text style={styles.detailLabel}>Caption</Text>
//         </View>
//         <TextInput
//           style={styles.captionTextArea}
//           placeholder="Write a caption... ✨ Use #hashtags"
//           placeholderTextColor="#9ca3af"
//           multiline
//           numberOfLines={6}
//           value={caption}
//           onChangeText={setCaption}
//           textAlignVertical="top"
//           maxLength={2200}
//         />
//         <Text style={styles.charCount}>{caption.length}/2200</Text>
//       </View>

//       <View style={styles.detailSection}>
//         <View style={styles.detailHeader}>
//           <Icon name="map-marker-alt" size={18} color="#00B5D8" />
//           <Text style={styles.detailLabel}>Location</Text>
//         </View>
//         <TextInput
//           style={styles.detailInput}
//           placeholder="Add Location"
//           placeholderTextColor="#9ca3af"
//           value={location}
//           onChangeText={setLocation}
//           maxLength={200}
//         />
//       </View>

//       <View style={styles.detailSection}>
//         <View style={styles.detailHeader}>
//           <Icon name="tag" size={18} color="#7C3AED" />
//           <Text style={styles.detailLabel}>Details</Text>
//         </View>
//         <View style={styles.categoryPreview}>
//           <Text style={styles.categoryPreviewText}>
//             {categories.find(c => c.id === selectedCategory)?.icon}{' '}
//             {categories.find(c => c.id === selectedCategory)?.label}
//           </Text>
//           <Text style={styles.contentTypeText}>
//             Type: {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
//           </Text>

//         </View>
//       </View>

//       <View style={{ height: 100 }} />
//     </ScrollView>
//   );

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={handleBack}
//             disabled={isLoading}
//           >
//             <Icon name="arrow-left" size={20} color="#111827" />
//           </TouchableOpacity>

//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>
//               New {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
//             </Text>
//             <Text style={styles.headerStep}>Step {currentStep} of 3</Text>
//           </View>

//           {currentStep === 3 ? (
//             <TouchableOpacity
//               style={styles.publishButton}
//               onPress={handlePublish}
//               disabled={isLoading || !selectedMedia}
//             >
//               <LinearGradient
//                 colors={
//                   isLoading || !selectedMedia
//                     ? ['#9ca3af', '#9ca3af']
//                     : ['#00B5D8', '#7C3AED', '#EC4899']
//                 }
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.publishGradient}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={styles.publishText}>Share</Text>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.nextButton}
//               onPress={handleNext}
//               disabled={currentStep === 1 && !selectedMedia}
//             >
//               <Text
//                 style={[
//                   styles.nextText,
//                   (currentStep === 1 && !selectedMedia) && styles.nextTextDisabled,
//                 ]}
//               >
//                 Next
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={styles.progressContainer}>
//           {[1, 2, 3].map((step) => (
//             <View
//               key={step}
//               style={[
//                 styles.progressDot,
//                 currentStep >= step && styles.progressDotActive,
//               ]}
//             />
//           ))}
//         </View>

//         <View style={styles.content}>
//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//         </View>

//         <View style={styles.bottomTabs}>
//           <TouchableOpacity
//             style={styles.tabItem}
//             onPress={() => switchContentType('post')}
//           >
//             <Icon
//               name="image"
//               size={24}
//               color={contentType === 'post' ? '#7C3AED' : '#6b7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: contentType === 'post' ? '#7C3AED' : '#6b7280' },
//               ]}
//             >
//               Moments
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.tabItem}
//             onPress={() => switchContentType('reel')}
//           >
//             <Icon
//               name="film"
//               size={24}
//               color={contentType === 'reel' ? '#7C3AED' : '#6b7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: contentType === 'reel' ? '#7C3AED' : '#6b7280' },
//               ]}
//             >
//               Reels
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.tabItem}
//             onPress={() => switchContentType('story')}
//           >
//             <Icon
//               name="clock"
//               size={24}
//               color={contentType === 'story' ? '#7C3AED' : '#6b7280'}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: contentType === 'story' ? '#7C3AED' : '#6b7280' },
//               ]}
//             >
//               Spotlight
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   backButton: { padding: 8, width: 60 },
//   headerCenter: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
//   headerStep: { fontSize: 12, color: '#6b7280', marginTop: 2 },
//   nextButton: { padding: 8, width: 60, alignItems: 'flex-end' },
//   nextText: { fontSize: 16, fontWeight: '600', color: '#7C3AED' },
//   nextTextDisabled: { color: '#9ca3af' },
//   publishButton: { width: 80, alignItems: 'flex-end' },
//   publishGradient: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//     minWidth: 70,
//     alignItems: 'center',
//   },
//   publishText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
//   progressContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 12,
//     gap: 8,
//     backgroundColor: '#ffffff',
//   },
//   progressDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#e5e7eb',
//   },
//   progressDotActive: { backgroundColor: '#7C3AED', width: 24 },
//   content: { flex: 1, backgroundColor: '#f9fafb' },
//   stepContainer: { flex: 1, padding: 20 },
//   stepTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
//   stepSubtitle: { fontSize: 12, color: '#6b7280', marginBottom: 24 },
//   selectionContainer: { flex: 1, gap: 16 },
//   selectionCard: {
//     flex: 1,
//     borderRadius: 20,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//   },
//   selectionContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 32,
//     minHeight: 180,
//   },
//   selectionText: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 16 },
//   selectionSubtext: { fontSize: 13, color: '#6b7280', marginTop: 8, textAlign: 'center' },
//   previewContainer: {
//     width: '100%',
//   },
//   mediaPreview: {
//     width: '100%',
//     height: width * 0.85,
//     borderRadius: 20,
//     backgroundColor: '#f3f4f6',
//   },
//   videoPreviewContainer: {
//     width: '100%',
//     height: width * 0.85,
//     borderRadius: 20,
//     overflow: 'hidden',
//     position: 'relative',
//     backgroundColor: '#000',
//   },
//   changeMediaButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 12,
//     marginTop: 20,
//   },
//   changeMediaBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#7C3AED',
//   },
//   changeMediaText: { fontSize: 15, fontWeight: '600', color: '#7C3AED' },
//   categoriesScroll: { flex: 1 },
//   categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
//   categoryCard: {
//     width: (width - 64) / 2,
//     aspectRatio: 1,
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   categoryCardSelected: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
//   categoryIcon: { fontSize: 40, marginBottom: 12 },
//   categoryLabel: { fontSize: 15, fontWeight: '600', color: '#111827', textAlign: 'center' },
//   categoryLabelSelected: { color: '#7C3AED' },
//   categoryCheck: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#7C3AED',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   detailSection: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
//   detailLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
//   captionTextArea: {
//     fontSize: 15,
//     color: '#111827',
//     minHeight: 120,
//     textAlignVertical: 'top',
//     padding: 12,
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//   },
//   charCount: { fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 8 },
//   detailInput: {
//     fontSize: 15,
//     color: '#111827',
//     padding: 12,
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//   },
//   categoryPreview: {
//     padding: 12,
//     backgroundColor: '#F3E8FF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#DDD6FE',
//   },
//   categoryPreviewText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#7C3AED',
//     marginBottom: 4,
//   },
//   contentTypeText: { fontSize: 8, color: '#7C3AED', fontWeight: '500' },

//   bottomTabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 4,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//     backgroundColor: '#ffffff',
//   },
//   tabItem: { alignItems: 'center', padding: 2 },
//   tabText: { fontSize: 10, marginTop: 2, fontWeight: '800' },
// });

// export default CreatePostScreen;





import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useCreatePost, useUploadMedia } from '../hooks/usePosts';
import { useCreateReel, useUploadReelMedia } from '../hooks/useReels';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
};

type Step = 1 | 2 | 3;
type ContentType = 'post' | 'reel' | 'story';

type SaavnTrack = {
  id: string;
  name: string;
  primary_artists: string;
  image: string;
  download_url: string[];
};

function CreatePostScreen({ navigation }: Props): React.JSX.Element {
  const uploadMutation = useUploadMedia();
  const createPostMutation = useCreatePost();
  const uploadReelMutation = useUploadReelMedia();
  const createReelMutation = useCreateReel();

  const [contentType, setContentType] = useState<ContentType>('post');
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Lifestyle');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  // JioSaavn Music State
  const [musicModalVisible, setMusicModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SaavnTrack | null>(null);
  const [tracks, setTracks] = useState<SaavnTrack[]>([]);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading =
    contentType === 'post'
      ? uploadMutation.isPending || createPostMutation.isPending
      : contentType === 'reel'
        ? uploadReelMutation.isPending || createReelMutation.isPending
        : false;

  const isVideo = selectedMedia?.type.startsWith('video/');

  const categories = [
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

  const handlePickFromGallery = () => {
    const mediaType = contentType === 'reel' ? 'video' : 'mixed';
    launchImageLibrary(
      {
        mediaType,
        quality: 0.9,
        includeBase64: false,
        videoQuality: 'medium',
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Toast.show({ type: 'error', text1: 'Failed to open gallery' });
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        const isVideoAsset = asset.type?.startsWith('video/');
        if (contentType === 'reel' && !isVideoAsset) {
          Toast.show({
            type: 'error',
            text1: 'Reels require video',
            text2: 'Please select a video file',
          });
          return;
        }

        setSelectedMedia({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'media.jpg',
        });
      }
    );
  };

  const handleCaptureFromCamera = () => {
    const mediaType = contentType === 'reel' ? 'video' : 'mixed';
    launchCamera(
      {
        mediaType,
        quality: 0.9,
        includeBase64: false,
        videoQuality: 'medium',
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Toast.show({ type: 'error', text1: 'Failed to open camera' });
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        setSelectedMedia({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'media.jpg',
        });
      }
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedMedia) {
      Toast.show({
        type: 'error',
        text1: 'No media selected',
        text2: 'Please select a photo or video',
      });
      return;
    }
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    } else {
      resetForm();
      navigation.goBack();
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedMedia(null);
    setSelectedCategory('Lifestyle');
    setCaption('');
    setLocation('');
    setContentType('post');
    setSelectedTrack(null);
  };

  const switchContentType = (newType: ContentType) => {
    setContentType(newType);
    setCurrentStep(1);
    setSelectedMedia(null);
    setSelectedCategory('Lifestyle');
    setCaption('');
    setLocation('');
    setSelectedTrack(null);
  };

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.substring(1)) : [];
  };

  // JioSaavn Search
  const searchSaavnMusic = async (query: string = 'party') => {
    if (!query.trim()) return;
    setLoadingMusic(true);
    try {
      const response = await fetch(`https://saavn.me/search?s=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      setTracks(data.data || []);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to load music' });
    } finally {
      setLoadingMusic(false);
    }
  };

  const openMusicPicker = () => {
    setMusicModalVisible(true);
    setSearchQuery('');
    setTracks([]); // Clear previous results
  };

  const handlePublish = async () => {
    if (!selectedMedia) {
      Toast.show({
        type: 'error',
        text1: 'No media selected',
        text2: 'Please select a photo or video',
      });
      return;
    }

    if (contentType === 'story') {
      Toast.show({
        type: 'info',
        text1: 'Coming Soon',
        text2: 'Stories feature will be available soon',
      });
      return;
    }

    try {
      const extractedHashtags = extractHashtags(caption);

      if (contentType === 'post') {
        const uploadResult = await uploadMutation.mutateAsync({
          uri: selectedMedia.uri,
          name: selectedMedia.name,
          type: selectedMedia.type,
        });
        if (!uploadResult.success) throw new Error('Upload failed');

        await createPostMutation.mutateAsync({
          caption,
          mediaUrl: uploadResult.url,
          mediaType: selectedMedia.type.startsWith('video/') ? 'video' : 'image',
          category: selectedCategory,
          hashtags: extractedHashtags,
          taggedUsers: [],
          ...(location && { location: { name: location } }),
        });
      } else if (contentType === 'reel') {
        const uploadResult = await uploadReelMutation.mutateAsync({
          uri: selectedMedia.uri,
          name: selectedMedia.name,
          type: selectedMedia.type,
        });
        if (!uploadResult.success) throw new Error('Upload failed');

        await createReelMutation.mutateAsync({
          caption,
          mediaUrl: uploadResult.url,
          mediaType: 'video',
          category: selectedCategory,
          hashtags: extractedHashtags,
          taggedUsers: [],
          ...(location && { location: { name: location } }),
          ...(selectedTrack && {
            music: {
              id: selectedTrack.id,
              title: selectedTrack.name,
              artist: selectedTrack.primary_artists,
              audioUrl: selectedTrack.download_url[0],
              cover: selectedTrack.image,
              source: 'jiosaavn',
            },
          }),
        });
      }

      resetForm();
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error: any) {
      console.error('Create content error:', error);
      Toast.show({
        type: 'error',
        text1: `Failed to create ${contentType}`,
        text2: error.message || 'Please try again',
      });
    }
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.stepTitle}>
        {contentType === 'reel' ? 'Select Video' : 'Select Photo or Video'}
      </Text>
      <Text style={styles.stepSubtitle}>Choose from gallery or take a new one</Text>

      {selectedMedia ? (
        <View style={styles.previewContainer}>
          {isVideo ? (
            <View style={styles.videoPreviewContainer}>
              <Video source={{ uri: selectedMedia.uri }} style={styles.mediaPreview} resizeMode="cover" paused={false} repeat={true} muted={true} />
            </View>
          ) : (
            <Image source={{ uri: selectedMedia.uri }} style={styles.mediaPreview} resizeMode="cover" />
          )}

          <View style={styles.changeMediaButtons}>
            <TouchableOpacity style={styles.changeMediaBtn} onPress={handlePickFromGallery}>
              <Icon name="images" size={16} color="#7C3AED" />
              <Text style={styles.changeMediaText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeMediaBtn} onPress={handleCaptureFromCamera}>
              <Icon name="camera" size={16} color="#7C3AED" />
              <Text style={styles.changeMediaText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.selectionContainer}>
          <TouchableOpacity style={styles.selectionCard} onPress={handlePickFromGallery}>
            <View style={styles.selectionContent}>
              <Icon name="images" size={40} color="#7C3AED" />
              <Text style={styles.selectionText}>Gallery</Text>
              <Text style={styles.selectionSubtext}>
                {contentType === 'reel' ? 'Choose a video' : 'Choose from your photos'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectionCard} onPress={handleCaptureFromCamera}>
            <View style={styles.selectionContent}>
              <Icon name="camera" size={40} color="#EC4899" />
              <Text style={styles.selectionText}>Camera</Text>
              <Text style={styles.selectionSubtext}>
                {contentType === 'reel' ? 'Record a video' : 'Take a new photo or video'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Category</Text>
      <Text style={styles.stepSubtitle}>Help people discover your {contentType}</Text>

      <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, selectedCategory === category.id && styles.categoryCardSelected]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryLabel, selectedCategory === category.id && styles.categoryLabelSelected]}>
                {category.label}
              </Text>
              {selectedCategory === category.id && (
                <View style={styles.categoryCheck}>
                  <Icon name="check" size={12} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Add Details</Text>
      <Text style={styles.stepSubtitle}>Tell your story</Text>

      <View style={styles.detailSection}>
        <View style={styles.detailHeader}>
          <Icon name="align-left" size={18} color="#7C3AED" />
          <Text style={styles.detailLabel}>Caption</Text>
        </View>
        <TextInput
          style={styles.captionTextArea}
          placeholder="Write a caption... ✨ Use #hashtags"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          value={caption}
          onChangeText={setCaption}
          textAlignVertical="top"
          maxLength={2200}
        />
        <Text style={styles.charCount}>{caption.length}/2200</Text>
      </View>

      <View style={styles.detailSection}>
        <View style={styles.detailHeader}>
          <Icon name="map-marker-alt" size={18} color="#00B5D8" />
          <Text style={styles.detailLabel}>Location</Text>
        </View>
        <TextInput
          style={styles.detailInput}
          placeholder="Add Location"
          placeholderTextColor="#9ca3af"
          value={location}
          onChangeText={setLocation}
          maxLength={200}
        />
      </View>

      {/* Music Section - Only for Reels */}
      {contentType === 'reel' && (
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Icon name="music" size={18} color="#EC4899" />
            <Text style={styles.detailLabel}>Music</Text>
          </View>
          <TouchableOpacity style={styles.musicPickerButton} onPress={openMusicPicker}>
            {selectedTrack ? (
              <View style={styles.selectedMusicRow}>
                <Icon name="music" size={20} color="#7C3AED" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.musicTitle} numberOfLines={1}>{selectedTrack.name}</Text>
                  <Text style={styles.musicArtist}>{selectedTrack.primary_artists}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedTrack(null)}>
                  <Icon name="times" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.musicPlaceholder}>Add music from JioSaavn</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.detailSection}>
        <View style={styles.detailHeader}>
          <Icon name="tag" size={18} color="#7C3AED" />
          <Text style={styles.detailLabel}>Details</Text>
        </View>
        <View style={styles.categoryPreview}>
          <Text style={styles.categoryPreviewText}>
            {categories.find((c) => c.id === selectedCategory)?.icon} {categories.find((c) => c.id === selectedCategory)?.label}
          </Text>
          <Text style={styles.contentTypeText}>
            Type: {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </Text>
          {selectedTrack && contentType === 'reel' && (
            <Text style={styles.musicPreviewText}>
              Music: {selectedTrack.name} by {selectedTrack.primary_artists}
            </Text>
          )}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={isLoading}>
            <Icon name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              New {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </Text>
            <Text style={styles.headerStep}>Step {currentStep} of 3</Text>
          </View>

          {currentStep === 3 ? (
            <TouchableOpacity style={styles.publishButton} onPress={handlePublish} disabled={isLoading || !selectedMedia}>
              <LinearGradient
                colors={isLoading || !selectedMedia ? ['#9ca3af', '#9ca3af'] : ['#00B5D8', '#7C3AED', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.publishGradient}
              >
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.publishText}>Share</Text>}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={currentStep === 1 && !selectedMedia}>
              <Text style={[styles.nextText, (currentStep === 1 && !selectedMedia) && styles.nextTextDisabled]}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={[styles.progressDot, currentStep >= step && styles.progressDotActive]} />
          ))}
        </View>

        <View style={styles.content}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>

        <View style={styles.bottomTabs}>
          <TouchableOpacity style={styles.tabItem} onPress={() => switchContentType('post')}>
            <Icon name="image" size={24} color={contentType === 'post' ? '#7C3AED' : '#6b7280'} />
            <Text style={[styles.tabText, { color: contentType === 'post' ? '#7C3AED' : '#6b7280' }]}>Moments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => switchContentType('reel')}>
            <Icon name="film" size={24} color={contentType === 'reel' ? '#7C3AED' : '#6b7280'} />
            <Text style={[styles.tabText, { color: contentType === 'reel' ? '#7C3AED' : '#6b7280' }]}>Reels</Text>
          </TouchableOpacity>
         <TouchableOpacity 
  style={styles.tabItem} 
  onPress={() => {
    // Navigate to Story Camera instead of switching content type
    navigation.navigate('CreateStory');
  }}
>
  <Icon name="clock" size={24} color={contentType === 'story' ? '#7C3AED' : '#6b7280'} />
  <Text style={[styles.tabText, { color: contentType === 'story' ? '#7C3AED' : '#6b7280' }]}>
    Spotlight
  </Text>
</TouchableOpacity>
        </View>

        {/* JioSaavn Music Picker Modal */}
        <Modal visible={musicModalVisible} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.musicModalHeader}>
              <TouchableOpacity onPress={() => setMusicModalVisible(false)}>
                <Icon name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.musicModalTitle}>Choose Music</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Search music (e.g., party)..."
                style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => searchSaavnMusic(searchQuery)}
              />
            </View>

            {loadingMusic ? (
              <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#7C3AED" />
            ) : tracks.length === 0 ? (
              <TouchableOpacity style={styles.defaultSearchBtn} onPress={() => searchSaavnMusic('party')}>
                <Text style={styles.defaultSearchText}>Search Popular Party Tracks</Text>
              </TouchableOpacity>
            ) : (
              <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.trackItem, selectedTrack?.id === item.id && styles.trackItemSelected]}
                    onPress={() => {
                      setSelectedTrack(item);
                      setMusicModalVisible(false);
                      Toast.show({ type: 'success', text1: 'Music added!' });
                    }}
                  >
                    <Image source={{ uri: item.image || 'https://via.placeholder.com/60' }} style={styles.trackImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.trackName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.trackArtist}>{item.primary_artists}</Text>
                    </View>
                    {selectedTrack?.id === item.id && <Icon name="check-circle" size={24} color="#7C3AED" />}
                  </TouchableOpacity>
                )}
              />
            )}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backButton: { padding: 8, width: 60 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerStep: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  nextButton: { padding: 8, width: 60, alignItems: 'flex-end' },
  nextText: { fontSize: 16, fontWeight: '600', color: '#7C3AED' },
  nextTextDisabled: { color: '#9ca3af' },
  publishButton: { width: 80, alignItems: 'flex-end' },
  publishGradient: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, minWidth: 70, alignItems: 'center' },
  publishText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, gap: 8, backgroundColor: '#ffffff' },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: '#7C3AED', width: 24 },
  content: { flex: 1, backgroundColor: '#f9fafb' },
  stepContainer: { flex: 1, padding: 20 },
  stepTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  stepSubtitle: { fontSize: 12, color: '#6b7280', marginBottom: 24 },
  selectionContainer: { flex: 1, gap: 16 },
  selectionCard: { flex: 1, borderRadius: 20, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, borderWidth: 2, borderColor: '#e5e7eb' },
  selectionContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, minHeight: 180 },
  selectionText: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 16 },
  selectionSubtext: { fontSize: 13, color: '#6b7280', marginTop: 8, textAlign: 'center' },
  previewContainer: { width: '100%' },
  mediaPreview: { width: '100%', height: width * 0.85, borderRadius: 20, backgroundColor: '#f3f4f6' },
  videoPreviewContainer: { width: '100%', height: width * 0.85, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000' },
  changeMediaButtons: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20 },
  changeMediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 2, borderColor: '#7C3AED' },
  changeMediaText: { fontSize: 15, fontWeight: '600', color: '#7C3AED' },
  categoriesScroll: { flex: 1 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: (width - 64) / 2, aspectRatio: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  categoryCardSelected: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
  categoryIcon: { fontSize: 40, marginBottom: 12 },
  categoryLabel: { fontSize: 15, fontWeight: '600', color: '#111827', textAlign: 'center' },
  categoryLabelSelected: { color: '#7C3AED' },
  categoryCheck: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
  detailSection: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  detailLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
  captionTextArea: { fontSize: 15, color: '#111827', minHeight: 120, textAlignVertical: 'top', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12 },
  charCount: { fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 8 },
  detailInput: { fontSize: 15, color: '#111827', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12 },
  categoryPreview: { padding: 12, backgroundColor: '#F3E8FF', borderRadius: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  categoryPreviewText: { fontSize: 15, fontWeight: '600', color: '#7C3AED', marginBottom: 4 },
  contentTypeText: { fontSize: 8, color: '#7C3AED', fontWeight: '500' },
  bottomTabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 4, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#ffffff' },
  tabItem: { alignItems: 'center', padding: 2 },
  tabText: { fontSize: 10, marginTop: 2, fontWeight: '800' },

  // New Music Styles
  musicPickerButton: { padding: 16, backgroundColor: '#f9fafb', borderRadius: 12 },
  musicPlaceholder: { color: '#6b7280', fontSize: 15 },
  selectedMusicRow: { flexDirection: 'row', alignItems: 'center' },
  musicTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  musicArtist: { fontSize: 13, color: '#6b7280' },
  musicPreviewText: { fontSize: 12, color: '#7C3AED', marginTop: 4 },
  musicModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  musicModalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 12 },
  defaultSearchBtn: { padding: 20, alignItems: 'center' },
  defaultSearchText: { color: '#7C3AED', fontSize: 16, fontWeight: '600' },
  trackItem: { flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 16, marginVertical: 4, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  trackItemSelected: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
  trackImage: { width: 50, height: 50, borderRadius: 8 },
  trackName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  trackArtist: { fontSize: 13, color: '#6b7280' },
});

export default CreatePostScreen;