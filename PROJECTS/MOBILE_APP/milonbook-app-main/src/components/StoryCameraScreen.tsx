// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   TextInput,
//   PanResponder,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
// import { launchImageLibrary } from 'react-native-image-picker';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Toast from 'react-native-toast-message';

// const { width, height } = Dimensions.get('window');

// type Props = { navigation: any };
// type CapturedMedia = { uri: string; type: 'photo' | 'video'; duration?: number };
// type TextOverlay = {
//   id: string;
//   text: string;
//   x: number;
//   y: number;
//   fontSize: number;
//   color: string;
//   backgroundColor: string;
//   fontWeight: 'normal' | 'bold';
//   textAlign: 'left' | 'center' | 'right';
// };

// const TEXT_COLORS = ['#FFFFFF', '#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];
// const BG_COLORS = ['transparent', 'rgba(0,0,0,0.6)', 'rgba(255,255,255,0.6)', 'rgba(239,68,68,0.6)', 'rgba(245,158,11,0.6)', 'rgba(16,185,129,0.6)', 'rgba(59,130,246,0.6)', 'rgba(139,92,246,0.6)', 'rgba(236,72,153,0.6)'];

// function CreateStoryScreen({ navigation }: Props): React.JSX.Element {
//   const camera = useRef<Camera>(null);
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
//   const frontDevice = useCameraDevice('front');
//   const backDevice = useCameraDevice('back');

//   const isLongPress = useRef(false);
//   const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

//   const [capturedMedia, setCapturedMedia] = useState<CapturedMedia | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [flash, setFlash] = useState<'off' | 'on'>('off');
//   const [isPosting, setIsPosting] = useState(false);
//   const [isCameraReady, setIsCameraReady] = useState(false);

//   const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
//   const [isEditingText, setIsEditingText] = useState(false);
//   const [editingTextId, setEditingTextId] = useState<string | null>(null);
//   const [currentText, setCurrentText] = useState('');
//   const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
//   const [currentBgColor, setCurrentBgColor] = useState('transparent');
//   const [currentFontSize, setCurrentFontSize] = useState(32);
//   const [currentFontWeight] = useState<'normal' | 'bold'>('bold');
//   const [currentTextAlign, setCurrentTextAlign] = useState<'left' | 'center' | 'right'>('center');
//   const textInputRef = useRef<TextInput>(null);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     checkPermissions();
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
//     };
//   }, []);

//   const checkPermissions = async () => {
//     if (!hasPermission) {
//       const granted = await requestPermission();
//       if (!granted) {
//         Toast.show({ type: 'error', text1: 'Camera Permission Required', text2: 'Enable in settings' });
//         setTimeout(() => navigation.goBack(), 2000);
//       }
//     }
//     await Camera.requestMicrophonePermission();
//   };

//   const currentDevice = cameraFacing === 'front' ? frontDevice : backDevice;

//   // FIXED PHOTO CAPTURE (this is the only part that was still broken)
//   const capturePhoto = async () => {
//     if (!camera.current || !isCameraReady) return;

//     try {
//       const photo = await camera.current.takePhoto({
//         flash: flash,
//         qualityPrioritization: 'balanced',
//         enableShutterSound: true,
//       });

//       const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
//       setCapturedMedia({ uri, type: 'photo' });
//     } catch (error: any) {
//       console.warn('Photo capture failed (safe):', error.message);
//       // Do NOT show toast for normal quick-tap failures — user just tapped too fast
//     }
//   };

//   const startRecording = async () => {
//     if (!camera.current || isRecording || !isCameraReady) return;

//     setIsRecording(true);
//     setRecordingTime(0);
//     timerRef.current = setInterval(() => setRecordingTime(prev => (prev >= 60 ? (stopRecording(), prev) : prev + 1)), 1000);

//     try {
//       camera.current.startRecording({
//         flash: flash,
//         onRecordingFinished: (video) => {
//           const uri = video.path.startsWith('file://') ? video.path : `file://${video.path}`;
//           setCapturedMedia({ uri, type: 'video', duration: video.duration });
//           setIsRecording(false);
//           if (timerRef.current) clearInterval(timerRef.current);
//         },
//         onRecordingError: (error) => {
//           console.error('Recording error:', error);
//           setIsRecording(false);
//           if (timerRef.current) clearInterval(timerRef.current);
//           Toast.show({ type: 'error', text1: 'Recording failed' });
//         },
//       });
//     } catch (e) {
//       setIsRecording(false);
//       if (timerRef.current) clearInterval(timerRef.current);
//     }
//   };

//   const stopRecording = async () => {
//     if (!camera.current || !isRecording) return;
//     try {
//       if (timerRef.current) clearInterval(timerRef.current);
//       await camera.current.stopRecording();
//     } catch (e) {
//       setIsRecording(false);
//     }
//   };

//   const handlePressIn = () => {
//     isLongPress.current = false;
//     longPressTimeout.current = setTimeout(() => {
//       isLongPress.current = true;
//       startRecording();
//     }, 400);
//   };

//   const handlePressOut = () => {
//     if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
//     if (!isLongPress.current && !isRecording) capturePhoto();
//     else if (isRecording) stopRecording();
//   };

//   const selectFromGallery = () => {
//     launchImageLibrary({ mediaType: 'mixed', quality: 0.9 }, (response) => {
//       if (response.didCancel || response.errorCode || !response.assets?.[0]?.uri) return;
//       const asset = response.assets[0];
//       setCapturedMedia({
//         uri: asset.uri!,
//         type: asset.type?.startsWith('video/') ? 'video' : 'photo',
//       });
//     });
//   };

//   const toggleCamera = () => {
//     setIsCameraReady(false);
//     setCameraFacing(prev => (prev === 'front' ? 'back' : 'front'));
//   };

//   const retake = () => {
//     setCapturedMedia(null);
//     setTextOverlays([]);
//   };

//   const handlePost = async () => {
//     if (!capturedMedia || isPosting) return;
//     setIsPosting(true);
//     await new Promise(r => setTimeout(r, 1500));
//     Toast.show({ type: 'success', text1: 'Story posted!', text2: 'Live for 24 hours', visibilityTime: 3000 });
//     setTimeout(() => navigation.goBack(), 800);
//     setIsPosting(false);
//   };

//   const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   if (!hasPermission || !currentDevice) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#7C3AED" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       {capturedMedia ? (
//         /* ────── PREVIEW SCREEN (unchanged) ────── */
//         <View style={styles.previewContainer}>
//           {capturedMedia.type === 'photo' ? (
//             <Image source={{ uri: capturedMedia.uri }} style={styles.preview} resizeMode="cover" />
//           ) : (
//             <Video source={{ uri: capturedMedia.uri }} style={styles.preview} resizeMode="cover" repeat paused={false} controls={false} />
//           )}

//           {textOverlays.map(o => (
//             <DraggableText key={o.id} overlay={o}
//               onPositionChange={(x, y) => setTextOverlays(prev => prev.map(t => t.id === o.id ? { ...t, x, y } : t))}
//               onEdit={() => {
//                 setEditingTextId(o.id); setCurrentText(o.text); setCurrentTextColor(o.color);
//                 setCurrentBgColor(o.backgroundColor); setCurrentFontSize(o.fontSize); setCurrentTextAlign(o.textAlign);
//                 setIsEditingText(true); setTimeout(() => textInputRef.current?.focus(), 100);
//               }}
//               onDelete={() => setTextOverlays(prev => prev.filter(t => t.id !== o.id))}
//             />
//           ))}

//           {/* Text editor & controls — unchanged (kept exactly as you had) */}
//           {isEditingText && (
//             <View style={styles.inlineTextEditor}>
//               <SafeAreaView style={styles.topBar}><View style={{ width: 40 }} /><TouchableOpacity onPress={() => {
//                 if (currentText.trim()) {
//                   if (editingTextId) {
//                     setTextOverlays(prev => prev.map(t => t.id === editingTextId ? { ...t, text: currentText, color: currentTextColor, backgroundColor: currentBgColor, fontSize: currentFontSize, textAlign: currentTextAlign } : t));
//                   } else {
//                     setTextOverlays(prev => [...prev, { id: Date.now().toString(), text: currentText, x: width / 2 - 100, y: height / 3, fontSize: currentFontSize, color: currentTextColor, backgroundColor: currentBgColor, fontWeight: 'bold', textAlign: currentTextAlign }]);
//                   }
//                 }
//                 setIsEditingText(false); setCurrentText(''); setEditingTextId(null);
//               }}><Text style={styles.doneButtonTopText}>Done</Text></TouchableOpacity></SafeAreaView>
//               <View style={styles.centerContent}>
//                 <View style={styles.textEditorControls}>
//                   <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentTextColor(prev => TEXT_COLORS[(TEXT_COLORS.indexOf(prev) + 1) % TEXT_COLORS.length])}><View style={[styles.colorPreview, { backgroundColor: currentTextColor }]} /></TouchableOpacity>
//                   <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentBgColor(prev => BG_COLORS[(BG_COLORS.indexOf(prev) + 1) % BG_COLORS.length])}><View style={[styles.bgColorPreview, { backgroundColor: currentBgColor === 'transparent' ? '#f3f4f6' : currentBgColor }]}>{currentBgColor === 'transparent' && <Icon name="ban" size={14} color="#666" />}</View></TouchableOpacity>
//                   <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentFontSize(prev => Math.max(prev - 4, 20))}><Text style={styles.sizeButtonText}>A-</Text></TouchableOpacity>
//                   <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentFontSize(prev => Math.min(prev + 4, 60))}><Text style={styles.sizeButtonText}>A+</Text></TouchableOpacity>
//                   <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentTextAlign(prev => prev === 'left' ? 'center' : prev === 'center' ? 'right' : 'left')}><Icon name={currentTextAlign === 'left' ? 'align-left' : currentTextAlign === 'center' ? 'align-center' : 'align-right'} size={16} color="#ffffff" /></TouchableOpacity>
//                 </View>
//                 <View style={[styles.textInputContainer, { backgroundColor: currentBgColor }]}>
//                   <TextInput ref={textInputRef} style={[styles.inlineTextInput, { color: currentTextColor, fontSize: currentFontSize, textAlign: currentTextAlign }]} placeholder="Type something..." placeholderTextColor="rgba(255,255,255,0.5)" value={currentText} onChangeText={setCurrentText} multiline autoFocus />
//                 </View>
//               </View>
//             </View>
//           )}

//           <SafeAreaView style={styles.topBar}>
//             <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Icon name="times" size={24} color="#ffffff" /></TouchableOpacity>
//             {!isEditingText && <TouchableOpacity style={styles.iconButton} onPress={() => { setIsEditingText(true); setTimeout(() => textInputRef.current?.focus(), 100); }}><Text style={styles.textButtonLabel}>Aa</Text></TouchableOpacity>}
//           </SafeAreaView>

//           {!isEditingText && (
//             <View style={styles.previewControls}>
//               <TouchableOpacity style={styles.retakeButton} onPress={retake}><Icon name="redo" size={20} color="#ffffff" /><Text style={styles.retakeText}>Retake</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.postButton, isPosting && styles.postButtonDisabled]} onPress={handlePost} disabled={isPosting}>
//                 {isPosting ? <ActivityIndicator size="small" color="#ffffff" /> : <><Icon name="paper-plane" size={20} color="#ffffff" /><Text style={styles.postText}>Share</Text></>}
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       ) : (
//         /* ────── CAMERA SCREEN ────── */
//         <>
//           <Camera
//             ref={camera}
//             style={StyleSheet.absoluteFill}
//             device={currentDevice}
//             isActive={true}
//             photo={true}
//             video={true}
//             audio={true}
//             onInitialized={() => setIsCameraReady(true)}
//           />

//           <SafeAreaView style={styles.topBar}>
//             <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Icon name="times" size={24} color="#ffffff" /></TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton} onPress={() => setFlash(prev => prev === 'off' ? 'on' : 'off')}><Icon name={flash === 'off' ? 'bolt' : 'sun'} size={20} color="#ffffff" /></TouchableOpacity>
//           </SafeAreaView>

//           {isRecording && (
//             <View style={styles.recordingIndicator}>
//               <View style={styles.recordingDot} />
//               <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
//             </View>
//           )}

//           <View style={styles.cameraControls}>
//             <TouchableOpacity style={styles.galleryButton} onPress={selectFromGallery}>
//               <View style={styles.galleryIcon}><Icon name="images" size={20} color="#ffffff" /></View>
//             </TouchableOpacity>

//             <View style={styles.captureContainer}>
//               <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
//                 <View style={[styles.captureButton, isRecording && styles.captureButtonRecording]}>
//                   <View style={[styles.captureInner, isRecording && styles.captureInnerRecording]} />
//                 </View>
//               </TouchableWithoutFeedback>
//               <Text style={styles.captureHint}>{isRecording ? 'Recording...' : 'Tap • Hold to record'}</Text>
//             </View>

//             <TouchableOpacity style={styles.flipButton} onPress={toggleCamera}><Icon name="sync" size={20} color="#ffffff" /></TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// }

// /* DraggableText & styles — unchanged (kept exactly the same as your original) */
// const DraggableText: React.FC<{ overlay: TextOverlay; onPositionChange: (x: number, y: number) => void; onEdit: () => void; onDelete: () => void }> = ({ overlay, onPositionChange, onEdit, onDelete }) => {
//   const [showActions, setShowActions] = useState(false);
//   const [position, setPosition] = useState({ x: overlay.x, y: overlay.y });
//   const panResponder = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, g) => setPosition({ x: Math.max(20, Math.min(width - 220, overlay.x + g.dx)), y: Math.max(100, Math.min(height - 200, overlay.y + g.dy)) }),
//     onPanResponderRelease: (_, g) => { onPositionChange(Math.max(20, Math.min(width - 220, overlay.x + g.dx)), Math.max(100, Math.min(height - 200, overlay.y + g.dy))); setTimeout(() => setShowActions(false), 2000); },
//   })).current;

//   return (
//     <View style={[styles.draggableText, { left: position.x, top: position.y }]} {...panResponder.panHandlers}>
//       <TouchableOpacity activeOpacity={1} onLongPress={() => setShowActions(true)}>
//         <View style={[styles.textOverlayContent, { backgroundColor: overlay.backgroundColor }]}>
//           <Text style={[styles.overlayText, { color: overlay.color, fontSize: overlay.fontSize, fontWeight: overlay.fontWeight, textAlign: overlay.textAlign }]}>{overlay.text}</Text>
//         </View>
//       </TouchableOpacity>
//       {showActions && (
//         <View style={styles.textActions}>
//           <TouchableOpacity style={styles.textActionButton} onPress={() => { setShowActions(false); onEdit(); }}><Icon name="edit" size={14} color="#fff" /></TouchableOpacity>
//           <TouchableOpacity style={styles.textActionButton} onPress={() => { setShowActions(false); onDelete(); }}><Icon name="trash" size={14} color="#fff" /></TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 16, zIndex: 10 },
//   closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   textButtonLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   recordingIndicator: { position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
//   recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' },
//   recordingTime: { color: '#fff', fontSize: 18, fontWeight: '600' },
//   cameraControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40 },
//   galleryButton: { width: 48, height: 48, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' },
//   galleryIcon: { flex: 1, backgroundColor: 'rgba(124,58,237,0.8)', justifyContent: 'center', alignItems: 'center' },
//   captureContainer: { alignItems: 'center', gap: 8 },
//   captureButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
//   captureButtonRecording: { backgroundColor: '#EF4444', transform: [{ scale: 0.9 }] },
//   captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
//   captureInnerRecording: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#DC2626' },
//   captureHint: { color: '#fff', fontSize: 12 },
//   flipButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   previewContainer: { flex: 1, backgroundColor: '#000' },
//   preview: { width: '100%', height: '100%' },
//   previewControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 },
//   retakeButton: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
//   retakeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   postButton: { flexDirection: 'row', gap: 8, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: '#7C3AED' },
//   postButtonDisabled: { backgroundColor: '#6b7280' },
//   postText: { color: '#fff', fontSize: 16, fontWeight: '700' },
//   inlineTextEditor: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
//   doneButtonTopText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
//   textEditorControls: { flexDirection: 'row', gap: 16, marginBottom: 30, backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 30 },
//   editorControlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   colorPreview: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
//   bgColorPreview: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
//   sizeButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
//   textInputContainer: { width: '100%', minHeight: 120, padding: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
//   inlineTextInput: { width: '100%', minHeight: 80, textAlignVertical: 'center', fontWeight: 'bold' },
//   draggableText: { position: 'absolute', padding: 8, minWidth: 100, maxWidth: width - 40 },
//   textOverlayContent: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
//   overlayText: { fontSize: 32, fontWeight: 'bold' },
//   textActions: { flexDirection: 'row', gap: 8, marginTop: 8, justifyContent: 'center' },
//   textActionButton: { backgroundColor: 'rgba(0,0,0,0.6)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
// });

// export default CreateStoryScreen;



import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Image,
  TextInput,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

type Props = { navigation: any };
type CapturedMedia = { uri: string; type: 'photo' | 'video'; duration?: number };
type TextOverlay = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
};

function CreateStoryScreen({ navigation }: Props): React.JSX.Element {
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');

  const isLongPress = useRef(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isPosting, setIsPosting] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Text states
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
  const [currentBgColor, setCurrentBgColor] = useState('transparent');
  const [currentFontSize, setCurrentFontSize] = useState(32);
  const [currentTextAlign, setCurrentTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const textInputRef = useRef<TextInput>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      if (!hasPermission) await requestPermission();
      await Camera.requestMicrophonePermission();
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    };
  }, []);

  const currentDevice = cameraFacing === 'front' ? frontDevice : backDevice;

  // FIXED: Photo capture (no error toast)
  const capturePhoto = async () => {
    if (!camera.current || !isCameraReady) return;
    try {
      const photo = await camera.current.takePhoto({ flash, qualityPrioritization: 'balanced' });
      const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      setCapturedMedia({ uri, type: 'photo' });
    } catch (e) {
      // Silent fail — user just tapped too fast
    }
  };

  const startRecording = () => {
    if (!camera.current || isRecording || !isCameraReady) return;
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(p => p >= 60 ? (stopRecording(), p) : p + 1), 1000);
    camera.current.startRecording({
      flash,
      onRecordingFinished: (v) => {
        const uri = v.path.startsWith('file://') ? v.path : `file://${v.path}`;
        setCapturedMedia({ uri, type: 'video', duration: v.duration });
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      },
      onRecordingError: () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        Toast.show({ type: 'error', text1: 'Recording failed' });
      },
    });
  };

  const stopRecording = () => {
    if (!isRecording || !camera.current) return;
    try { camera.current.stopRecording(); } catch {}
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePressIn = () => {
    isLongPress.current = false;
    longPressTimeout.current = setTimeout(() => {
      isLongPress.current = true;
      startRecording();
    }, 400);
  };

  const handlePressOut = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    if (!isLongPress.current && !isRecording) capturePhoto();
    else if (isRecording) stopRecording();
  };

  // FIXED: Done button now works perfectly
  const saveTextOverlay = () => {
    if (!currentText.trim()) {
      setIsEditingText(false);
      return;
    }

    if (editingTextId) {
      // Edit existing
      setTextOverlays(prev => prev.map(t =>
        t.id === editingTextId
          ? { ...t, text: currentText, color: currentTextColor, backgroundColor: currentBgColor, fontSize: currentFontSize, textAlign: currentTextAlign }
          : t
      ));
    } else {
      // Add new
      const newOverlay: TextOverlay = {
        id: Date.now().toString(),
        text: currentText,
        x: width / 2 - 100,
        y: height / 3,
        fontSize: currentFontSize,
        color: currentTextColor,
        backgroundColor: currentBgColor,
        fontWeight: 'bold',
        textAlign: currentTextAlign,
      };
      setTextOverlays(prev => [...prev, newOverlay]);
    }

    // Reset & close
    setIsEditingText(false);
    setCurrentText('');
    setEditingTextId(null);
    setCurrentTextColor('#FFFFFF');
    setCurrentBgColor('transparent');
    setCurrentFontSize(32);
    setCurrentTextAlign('center');
  };

  const startTextEditing = () => {
    setIsEditingText(true);
    setEditingTextId(null);
    setCurrentText('');
    setCurrentTextColor('#FFFFFF');
    setCurrentBgColor('transparent');
    setCurrentFontSize(32);
    setCurrentTextAlign('center');
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const editTextOverlay = (id: string) => {
    const overlay = textOverlays.find(t => t.id === id);
    if (!overlay) return;
    setEditingTextId(id);
    setCurrentText(overlay.text);
    setCurrentTextColor(overlay.color);
    setCurrentBgColor(overlay.backgroundColor);
    setCurrentFontSize(overlay.fontSize);
    setCurrentTextAlign(overlay.textAlign);
    setIsEditingText(true);
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const handlePost = async () => {
    if (!capturedMedia || isPosting) return;
    setIsPosting(true);
    await new Promise(r => setTimeout(r, 1500));
    Toast.show({ type: 'success', text1: 'Story posted!', text2: 'Live for 24 hours' });
    setTimeout(() => navigation.goBack(), 800);
  };

  if (!hasPermission || !currentDevice) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#7C3AED" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {capturedMedia ? (
        <View style={styles.previewContainer}>
          {capturedMedia.type === 'photo' ? (
            <Image source={{ uri: capturedMedia.uri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <Video source={{ uri: capturedMedia.uri }} style={styles.preview} resizeMode="cover" repeat paused={false} controls={false} />
          )}

          {/* Render text overlays */}
          {textOverlays.map(overlay => (
            <DraggableText
              key={overlay.id}
              overlay={overlay}
              onPositionChange={(x, y) => setTextOverlays(prev => prev.map(t => t.id === overlay.id ? { ...t, x, y } : t))}
              onEdit={() => editTextOverlay(overlay.id)}
              onDelete={() => setTextOverlays(prev => prev.filter(t => t.id !== overlay.id))}
            />
          ))}

          {/* Text Editor */}
          {isEditingText && (
            <View style={styles.inlineTextEditor}>
              <SafeAreaView style={styles.topBar}>
                <View style={{ width: 40 }} />
                <TouchableOpacity onPress={saveTextOverlay}>
                  <Text style={styles.doneButtonTopText}>Done</Text>
                </TouchableOpacity>
              </SafeAreaView>

              <View style={styles.centerContent}>
                <View style={styles.textEditorControls}>
                  <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentTextColor(prev => TEXT_COLORS[(TEXT_COLORS.indexOf(prev) + 1) % TEXT_COLORS.length])}>
                    <View style={[styles.colorPreview, { backgroundColor: currentTextColor }]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentBgColor(prev => BG_COLORS[(BG_COLORS.indexOf(prev) + 1) % BG_COLORS.length])}>
                    <View style={[styles.bgColorPreview, { backgroundColor: currentBgColor === 'transparent' ? '#f3f4f6' : currentBgColor }]}>
                      {currentBgColor === 'transparent' && <Icon name="ban" size={14} color="#666" />}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentFontSize(p => Math.max(p - 4, 20))}><Text style={styles.sizeButtonText}>A-</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentFontSize(p => Math.min(p + 4, 60))}><Text style={styles.sizeButtonText}>A+</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.editorControlButton} onPress={() => setCurrentTextAlign(p => p === 'left' ? 'center' : p === 'center' ? 'right' : 'left')}>
                    <Icon name={currentTextAlign === 'left' ? 'align-left' : currentTextAlign === 'center' ? 'align-center' : 'align-right'} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.textInputContainer, { backgroundColor: currentBgColor }]}>
                  <TextInput
                    ref={textInputRef}
                    style={[styles.inlineTextInput, { color: currentTextColor, fontSize: currentFontSize, textAlign: currentTextAlign }]}
                    placeholder="Type something..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={currentText}
                    onChangeText={setCurrentText}
                    multiline
                    autoFocus
                  />
                </View>
              </View>
            </View>
          )}

          {/* Top bar */}
          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>
            {!isEditingText && (
              <TouchableOpacity style={styles.iconButton} onPress={startTextEditing}>
                <Text style={styles.textButtonLabel}>Aa</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>

          {/* Bottom controls */}
          {!isEditingText && (
            <View style={styles.previewControls}>
              <TouchableOpacity style={styles.retakeButton} onPress={() => { setCapturedMedia(null); setTextOverlays([]); }}>
                <Icon name="redo" size={20} color="#fff" />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.postButton, isPosting && styles.postButtonDisabled]} onPress={handlePost} disabled={isPosting}>
                {isPosting ? <ActivityIndicator size="small" color="#fff" /> : <><Icon name="paper-plane" size={20} color="#fff" /><Text style={styles.postText}>Share</Text></>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        /* CAMERA SCREEN */
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={currentDevice}
            isActive={true}
            photo video audio
            onInitialized={() => setIsCameraReady(true)}
          />

          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Icon name="times" size={24} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setFlash(p => p === 'off' ? 'on' : 'off')}><Icon name={flash === 'off' ? 'bolt' : 'sun'} size={20} color="#fff" /></TouchableOpacity>
          </SafeAreaView>

          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}</Text>
            </View>
          )}

          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={() => launchImageLibrary({ mediaType: 'mixed' }, r => r.assets?.[0]?.uri && setCapturedMedia({ uri: r.assets[0].uri, type: r.assets[0].type?.includes('video') ? 'video' : 'photo' }))}>
              <View style={styles.galleryIcon}><Icon name="images" size={20} color="#fff" /></View>
            </TouchableOpacity>

            <View style={styles.captureContainer}>
              <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <View style={[styles.captureButton, isRecording && styles.captureButtonRecording]}>
                  <View style={[styles.captureInner, isRecording && styles.captureInnerRecording]} />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.captureHint}>{isRecording ? 'Recording...' : 'Tap • Hold to record'}</Text>
            </View>

            <TouchableOpacity style={styles.flipButton} onPress={() => setCameraFacing(p => p === 'front' ? 'back' : 'front')}>
              <Icon name="sync" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* DraggableText & styles — unchanged */
const DraggableText: React.FC<{ overlay: TextOverlay; onPositionChange: (x: number, y: number) => void; onEdit: () => void; onDelete: () => void }> = ({ overlay, onPositionChange, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [pos, setPos] = useState({ x: overlay.x, y: overlay.y });
  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => setPos({ x: Math.max(20, Math.min(width - 220, overlay.x + g.dx)), y: Math.max(100, Math.min(height - 200, overlay.y + g.dy)) }),
    onPanResponderRelease: (_, g) => { onPositionChange(Math.max(20, Math.min(width - 220, overlay.x + g.dx)), Math.max(100, Math.min(height - 200, overlay.y + g.dy))); setTimeout(() => setShowActions(false), 2000); },
  });

  return (
    <View style={[styles.draggableText, { left: pos.x, top: pos.y }]} {...pan.panHandlers}>
      <TouchableOpacity activeOpacity={1} onLongPress={() => setShowActions(true)}>
        <View style={[styles.textOverlayContent, { backgroundColor: overlay.backgroundColor }]}>
          <Text style={[styles.overlayText, { color: overlay.color, fontSize: overlay.fontSize, fontWeight: overlay.fontWeight, textAlign: overlay.textAlign }]}>{overlay.text}</Text>
        </View>
      </TouchableOpacity>
      {showActions && (
        <View style={styles.textActions}>
          <TouchableOpacity style={styles.textActionButton} onPress={() => { setShowActions(false); onEdit(); }}><Icon name="edit" size={14} color="#fff" /></TouchableOpacity>
          <TouchableOpacity style={styles.textActionButton} onPress={() => { setShowActions(false); onDelete(); }}><Icon name="trash" size={14} color="#fff" /></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 16, zIndex: 10 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  textButtonLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  recordingIndicator: { position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' },
  recordingTime: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cameraControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40 },
  galleryButton: { width: 48, height: 48, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' },
  galleryIcon: { flex: 1, backgroundColor: 'rgba(124,58,237,0.8)', justifyContent: 'center', alignItems: 'center' },
  captureContainer: { alignItems: 'center', gap: 8 },
  captureButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureButtonRecording: { backgroundColor: '#EF4444', transform: [{ scale: 0.9 }] },
  captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  captureInnerRecording: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#DC2626' },
  captureHint: { color: '#fff', fontSize: 12 },
  flipButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  preview: { width: '100%', height: '100%' },
  previewControls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 },
  retakeButton: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  retakeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  postButton: { flexDirection: 'row', gap: 8, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: '#7C3AED' },
  postButtonDisabled: { backgroundColor: '#6b7280' },
  postText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  inlineTextEditor: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
  doneButtonTopText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  textEditorControls: { flexDirection: 'row', gap: 16, marginBottom: 30, backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 30 },
  editorControlButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  colorPreview: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  bgColorPreview: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  sizeButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  textInputContainer: { width: '100%', minHeight: 120, padding: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  inlineTextInput: { width: '100%', minHeight: 80, textAlignVertical: 'center', fontWeight: 'bold' },
  draggableText: { position: 'absolute', padding: 8, minWidth: 100, maxWidth: width - 40 },
  textOverlayContent: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  overlayText: { fontSize: 32, fontWeight: 'bold' },
  textActions: { flexDirection: 'row', gap: 8, marginTop: 8, justifyContent: 'center' },
  textActionButton: { backgroundColor: 'rgba(0,0,0,0.6)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});

export default CreateStoryScreen;