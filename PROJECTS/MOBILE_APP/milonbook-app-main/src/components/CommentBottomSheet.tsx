// CommentBottomSheet.tsx (Fixed Version)

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComment } from '../hooks/useComments';
import { useLike } from '../hooks/useLike';
import { API_BASE_URL } from '../api/apiClient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface User {
  _id: string;
  name?: string;
  username?: string;
  profilePicture?: string;
}

interface ContentItem {
  _id: string;
  userId?: User;
  caption?: string;
  commentsCount?: number;
}

interface CommentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  item: ContentItem | null;
  type: 'post' | 'reel';
  currentUserAvatar?: string;
}

const CommentBottomSheet: React.FC<CommentBottomSheetProps> = ({
  visible,
  onClose,
  item,
  type,
  currentUserAvatar = 'https://i.pravatar.cc/150',
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const {
    commentsCount,
    isLoading,
    addComment,
    comments,
    isFetchingComments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useComment({
    id: item?._id || '',
    type: type,
    initialCommentsCount: item?.commentsCount || 0,
    limit: 20,
    enableFetch: visible && !!item?._id,
  });

  // KEEP AUTO-FOCUS ON iOS
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible, replyingTo]);

  // PAN RESPONDER FOR SWIPE DOWN TO CLOSE
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isAtTop,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes when at top
        return isAtTop && gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Close if swiped down more than 150px or velocity is high
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          // Spring back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getFullUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !item) return;

    if (replyingTo) {
      addComment(commentText);
      setReplyingTo(null);
    } else {
      addComment(commentText);
    }
    setCommentText('');
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
    setCommentText(`@${username} `);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  const CommentItem = React.memo(({ comment }: { comment: any }) => {
    const {
      isLiked,
      likesCount,
      toggleLike,
      isLoading: isLikeLoading,
    } = useLike({
      id: comment._id,
      type: 'comment',
      initialLiked: comment.isLiked || false,
      initialLikesCount: comment.likesCount || 0,
    });

    return (
      <View style={styles.commentItem}>
        <Image
          source={{
            uri: comment.user?.profilePicture
              ? getFullUrl(comment.user.profilePicture)
              : 'https://i.pravatar.cc/150',
          }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUsername}>
              {comment.user?.name || comment.user?.username || 'User'}
            </Text>
            <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>

          <View style={styles.commentActions}>
            <TouchableOpacity
              style={[styles.commentActionButton, isLikeLoading && styles.disabledAction]}
              onPress={toggleLike}
              disabled={isLikeLoading}
            >
              <Icon
                name="heart"
                size={14}
                color={isLiked ? '#EF4444' : '#9CA3AF'}
                solid={isLiked}
              />
              <Text
                style={[
                  styles.commentActionText,
                  isLiked && styles.commentActionTextLiked,
                ]}
              >
                {likesCount > 0 ? likesCount : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.commentActionButton}
              onPress={() => handleReply(comment._id, comment.user?.name || 'user')}
            >
              <Icon name="reply" size={14} color="#9CA3AF" />
              <Text style={styles.commentActionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  });

  const renderComment = ({ item }: { item: any }) => <CommentItem comment={item} />;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsAtTop(offsetY <= 0);
  };

  const renderEmptyState = () => (
    <View style={styles.commentsEmptyState}>
      <Icon name="comments" size={48} color="#4B5563" />
      <Text style={styles.commentsEmptyText}>No comments yet</Text>
      <Text style={styles.commentsEmptySubtext}>Be the first to comment!</Text>
    </View>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#7C3AED" />
        </View>
      );
    }
    if (hasNextPage) {
      return (
        <View style={styles.footerLoader}>
          <TouchableOpacity style={styles.loadMoreButton} onPress={fetchNextPage}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <Icon name="chevron-down" size={14} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  if (!visible || !item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* FIXED: Separate dismiss area for overlay */}
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.dismissArea} />
        </TouchableWithoutFeedback>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            {/* DRAG HANDLE WITH PAN RESPONDER */}
            <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
            </View>

            {/* Header is now touchable */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
                </Text>
                <TouchableOpacity 
                  onPress={onClose} 
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="times" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contentInfo}>
              <Image
                source={{
                  uri: item.userId?.profilePicture
                    ? getFullUrl(item.userId.profilePicture)
                    : 'https://i.pravatar.cc/150',
                }}
                style={styles.contentAvatar}
              />
              <View style={styles.contentDetails}>
                <Text style={styles.contentUsername}>
                  {item.userId?.name || item.userId?.username || 'User'}
                </Text>
                <Text style={styles.contentCaption} numberOfLines={2}>
                  {item.caption || 'No caption'}
                </Text>
              </View>
            </View>

            {replyingTo && (
              <View style={styles.replyBanner}>
                <Icon name="reply" size={14} color="#7C3AED" />
                <Text style={styles.replyBannerText}>
                  Replying to @{replyingTo.username}
                </Text>
                <TouchableOpacity onPress={cancelReply}>
                  <Icon name="times" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            )}

            {/* FIXED: Added proper flex container for FlatList */}
            <View style={styles.commentsListContainer}>
              {isFetchingComments && comments.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#7C3AED" />
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={comments}
                  renderItem={renderComment}
                  keyExtractor={(item) => item._id}
                  ListEmptyComponent={renderEmptyState}
                  ListFooterComponent={renderFooter}
                  contentContainerStyle={comments.length === 0 ? styles.commentsListEmpty : styles.commentsList}
                  showsVerticalScrollIndicator={false}
                  onEndReached={fetchNextPage}
                  onEndReachedThreshold={0.5}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={true}
                  bounces={true}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              )}
            </View>

            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
              <Image source={{ uri: currentUserAvatar }} style={styles.inputAvatar} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : 'Add a comment...'}
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="paper-plane" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    justifyContent: 'flex-end' 
  },
  dismissArea: {
    flex: 1,
  },
  keyboardView: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.9,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    zIndex: 10,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#fff' 
  },
  contentInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    gap: 12,
  },
  contentAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#7C3AED' 
  },
  contentDetails: { flex: 1 },
  contentUsername: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#fff', 
    marginBottom: 4 
  },
  contentCaption: { 
    fontSize: 13, 
    color: '#9CA3AF', 
    lineHeight: 18 
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  replyBannerText: { 
    flex: 1, 
    fontSize: 14, 
    color: '#7C3AED', 
    fontWeight: '600' 
  },
  commentsListContainer: { 
    flex: 1,
  },
  commentsList: { 
    paddingHorizontal: 20, 
    paddingTop: 12, 
    paddingBottom: 20,
  },
  commentsListEmpty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  commentsListEmpty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 200 
  },
  commentsEmptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  commentsEmptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#fff', 
    marginTop: 16 
  },
  commentsEmptySubtext: { 
    fontSize: 14, 
    color: '#9CA3AF', 
    marginTop: 8 
  },
  commentItem: { 
    flexDirection: 'row', 
    paddingVertical: 12, 
    gap: 12 
  },
  commentAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18 
  },
  commentContent: { flex: 1 },
  commentHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  commentUsername: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#fff' 
  },
  commentTime: { 
    fontSize: 12, 
    color: '#9CA3AF' 
  },
  commentText: { 
    fontSize: 14, 
    color: '#E5E7EB', 
    lineHeight: 20, 
    marginBottom: 8 
  },
  commentActions: { 
    flexDirection: 'row', 
    gap: 20 
  },
  commentActionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  commentActionText: { 
    fontSize: 13, 
    color: '#9CA3AF', 
    fontWeight: '600' 
  },
  commentActionTextLiked: { 
    color: '#EF4444' 
  },
  disabledAction: { 
    opacity: 0.6 
  },
  footerLoader: { 
    paddingVertical: 16, 
    alignItems: 'center' 
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  loadMoreText: { 
    color: '#7C3AED', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    gap: 12,
    backgroundColor: '#121212',
  },
  inputAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    marginBottom: 8 
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#7C3AED',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sendButtonDisabled: { 
    backgroundColor: '#4B5563', 
    opacity: 0.5 
  },
});

export default CommentBottomSheet;