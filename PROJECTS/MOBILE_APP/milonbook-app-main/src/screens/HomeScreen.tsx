import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { usePosts } from '../hooks/usePosts';
import { useLike } from '../hooks/useLike';
import { useComment } from '../hooks/useComments';
import { API_BASE_URL } from '../api/apiClient';
import Video from 'react-native-video';
import CommentBottomSheet from '../components/CommentBottomSheet'; // Import your sheet

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
};

// Reusable Comment Item (same as in bottom sheet)
const CommentItem = ({ comment, onReply }: { comment: any; onReply?: () => void }) => {
  const { isLiked, likesCount, toggleLike, isLoading: isLikeLoading } = useLike({
    id: comment._id,
    type: 'comment',
    initialLiked: comment.isLiked || false,
    initialLikesCount: comment.likesCount || 0,
  });

  const username = comment.user?.name || comment.user?.username || 'User';

  return (
    <View style={styles.commentPreviewItem}>
      <Image
        source={{
          uri: comment.user?.profilePicture
            ? `${API_BASE_URL}/${comment.user.profilePicture.replace(/^\//, '')}`
            : 'https://i.pravatar.cc/150',
        }}
        style={styles.commentPreviewAvatar}
      />
      <View style={styles.commentPreviewContent}>
        <Text style={styles.commentPreviewText}>
          <Text style={styles.commentPreviewUsername}>{username}</Text>{' '}
          {comment.text}
        </Text>
        <View style={styles.commentPreviewActions}>
          <TouchableOpacity
            onPress={toggleLike}
            disabled={isLikeLoading}
            style={styles.commentPreviewLike}
          >
            <Icon
              name="heart"
              size={12}
              color={isLiked ? '#EF4444' : '#9CA3AF'}
              solid={isLiked}
            />
            {likesCount > 0 && (
              <Text style={[styles.commentPreviewLikeCount, isLiked && { color: '#EF4444' }]}>
                {likesCount}
              </Text>
            )}
          </TouchableOpacity>
          {onReply && (
            <TouchableOpacity onPress={onReply}>
              <Text style={styles.commentPreviewReplyText}>Reply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Post Item with Comment Preview
const PostItem = ({ item, openComments, getFullUrl }: { item: any; openComments: (item: any) => void; getFullUrl: (path: string) => string }) => {
  const user = item?.userId || {};
  const avatar = user?.profilePicture
    ? `${API_BASE_URL}/${user.profilePicture.replace(/^\//, '')}`
    : 'https://i.pravatar.cc/150';
  const username = user?.name || user?.username || 'User';
  const mediaUrl = item?.mediaUrl
    ? `${API_BASE_URL}/${item.mediaUrl.replace(/^\//, '')}`
    : '';

  const { isLiked, likesCount, toggleLike, isLoading: isLikeLoading } = useLike({
    id: item._id,
    type: 'post',
    initialLiked: item.isLiked || false,
    initialLikesCount: item.likesCount || 0,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  // Show only first 2 comments
  const previewComments = item.comments?.slice(0, 2) || [];

  return (
    <View style={styles.postCard}>
      {/* HEADER */}
      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <Image source={{ uri: avatar }} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUsername}>{username}</Text>
            <Text style={styles.postTime}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="ellipsis-h" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* MEDIA */}
      {item.mediaType === 'video' ? (
        <Video source={{ uri: mediaUrl }} style={styles.postImage} resizeMode="cover" repeat paused />
      ) : item.mediaUrl ? (
        <Image source={{ uri: mediaUrl }} style={styles.postImage} resizeMode="cover" />
      ) : (
        <View style={styles.noImagePlaceholder}>
          <Icon name="image" size={48} color="#D1D5DB" />
          <Text style={styles.noImageText}>No media</Text>
        </View>
      )}

      {/* ACTIONS */}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={toggleLike} disabled={isLikeLoading} style={styles.actionButton}>
          <Icon name="heart" size={24} color={isLiked ? '#EC4899' : '#94a3b8'} solid={isLiked} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openComments(item)} style={styles.actionButton}>
          <Icon name="comment" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.postStats}>
        <Text style={styles.likesText}>
          <Text style={styles.statBold}>{likesCount}</Text> likes
        </Text>

        {item.caption && (
          <Text style={styles.captionText}>
            <Text style={styles.usernameInCaption}>{username}</Text> {item.caption}
          </Text>
        )}

        {/* COMMENT PREVIEWS */}
        {previewComments.map((comment: any) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}

        {/* VIEW ALL COMMENTS */}
        {item.commentsCount > 0 && (
          <TouchableOpacity onPress={() => openComments(item)}>
            <Text style={styles.viewAllComments}>
              View all {item.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

function HomeScreen({ navigation }: Props): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isCommentSheetVisible, setIsCommentSheetVisible] = useState(false);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts();

  const moments = [
    { id: '1', username: 'spotlight', avatar: 'https://i.pravatar.cc/150?img=1', isViewed: false },
    { id: '2', username: 'techsavage_l...', avatar: 'https://i.pravatar.cc/150?img=2', isViewed: false },
    { id: '3', username: 'SaXXi_Off', avatar: 'https://i.pravatar.cc/150?img=3', isViewed: false },
    { id: '4', username: 'manga_st', avatar: 'https://i.pravatar.cc/150?img=4', isViewed: false },
    { id: '5', username: 'travel_life', avatar: 'https://i.pravatar.cc/150?img=5', isViewed: true },
  ];

  const getFullUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${clean}`;
  };

  const openComments = (post: any) => {
    setSelectedPost(post);
    setIsCommentSheetVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const allPosts = data?.pages?.flatMap((page) => page?.posts || []) || [];

  const renderMoment = ({ item }: any) => (
    <TouchableOpacity style={styles.momentItem} activeOpacity={0.75}>
      <LinearGradient
        colors={item.isViewed ? ['#9CA3AF', '#D1D5DB'] : ['#00B5D8', '#7C3AED', '#EC4899']}
        style={styles.storyRing}
      >
        <View style={styles.storyInnerBorder}>
          <Image source={{ uri: item.avatar }} style={styles.storyImage} />
        </View>
      </LinearGradient>
      <Text style={styles.momentUsername} numberOfLines={1}>{item.username}</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: any) => <PostItem item={item} openComments={openComments} getFullUrl={getFullUrl} />;

  const ListHeaderComponent = () => (
    <View style={styles.momentsSection}>
      <Text style={styles.sectionTitle}>Moments</Text>
      <FlatList
        data={moments}
        renderItem={renderMoment}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.momentsList}
      />
    </View>
  );

  const ListFooterComponent = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#7C3AED" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load posts</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="image" size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>Be the first to share something!</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/milobook2.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerIcons}>
           <TouchableOpacity 
              style={styles.headerIcon}
              onPress={() => navigation.navigate('DiscoverScreen')}
            >
              <Image
                source={{ uri: getFullUrl('/uploads/1763555535994_profile.jpg') }}
                style={styles.headerAvatar}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Trending')}
            >
              <Icon name="search" size={22} color="#111" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="bell" size={22} color="#111" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FEED */}
        <FlatList
          data={allPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item?._id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7C3AED']}
              tintColor="#7C3AED"
            />
          }
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={60}
          windowSize={10}
        />

        {/* COMMENT BOTTOM SHEET */}
        <CommentBottomSheet
          visible={isCommentSheetVisible}
          onClose={() => setIsCommentSheetVisible(false)}
          item={selectedPost}
          type="post"
          currentUserAvatar="https://i.pravatar.cc/150" // Replace with real user avatar later
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  commentPreviewItem: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  commentPreviewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentPreviewContent: {
    flex: 1,
  },
  commentPreviewText: {
    fontSize: 13.5,
    color: '#111827',
    lineHeight: 18,
  },
  commentPreviewUsername: {
    fontWeight: '600',
  },
  commentPreviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  commentPreviewLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentPreviewLikeCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  commentPreviewReplyText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  viewAllComments: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  headerIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 18,
  },
  headerIcon: {
    position: 'relative',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EC4899',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  momentsSection: {
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  momentsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  momentItem: {
    alignItems: 'center',
    marginRight: 6,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  storyInnerBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storyImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  momentUsername: {
    fontSize: 11,
    color: '#4b5563',
    maxWidth: 74,
    textAlign: 'center',
    marginTop: 6,
  },
  postCard: {
    backgroundColor: '#ffffff',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    paddingBottom: 10,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  postUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: '#f9fafb',
  },
  noImagePlaceholder: {
    width: width,
    height: width,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 18,
  },
  actionButton: {
    padding: 2,
  },
  postStats: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  likesText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  statBold: {
    fontWeight: '600',
  },
  captionText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  usernameInCaption: {
    fontWeight: '600',
  },
  hashtags: {
    fontSize: 14,
    color: '#7C3AED',
    marginBottom: 6,
  },
  viewComments: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default HomeScreen;