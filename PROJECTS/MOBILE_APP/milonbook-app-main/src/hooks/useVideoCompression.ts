// File: src/hooks/useVideoCompression.ts
import { useState } from 'react';
import { Video } from 'react-native-compressor';
import Toast from 'react-native-toast-message';

type CompressionQuality = 'high' | 'medium' | 'low';

interface CompressionOptions {
  quality?: CompressionQuality; // 'high', 'medium', or 'low'
  minimumFileSizeForCompress?: number; // Minimum file size to trigger compression (in bytes)
}

// Quality presets
const QUALITY_PRESETS = {
  high: {
    bitrate: 3000000, // 3Mbps - Instagram/TikTok quality
    maxSize: 1920, // 1080p
  },
  medium: {
    bitrate: 2000000, // 2Mbps - Good balance
    maxSize: 1280, // 720p
  },
  low: {
    bitrate: 1000000, // 1Mbps - Smaller size
    maxSize: 854, // 480p
  },
};

export const useVideoCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  const compressVideo = async (
    videoUri: string,
    options: CompressionOptions = {}
  ): Promise<{ uri: string; compressed: boolean }> => {
    const {
      compressionMethod = 'auto',
      minimumFileSizeForCompress = 5 * 1024 * 1024, // 5MB
    } = options;

    try {
      setIsCompressing(true);
      setCompressionProgress(0);

      console.log('🎥 Starting video compression...');
      console.log('Original URI:', videoUri);

      // 🔥 Compress video on device with BETTER QUALITY settings
      const compressedUri = await Video.compress(
        videoUri,
        {
          compressionMethod: 'manual',
          bitrate: 2500000, // 2.5Mbps - Good quality for social media
          maxSize: 1920, // Max 1080p resolution
          minimumFileSizeForCompress: minimumFileSizeForCompress,
          getCancellationId: (cancellationId) => {
            console.log('Compression ID:', cancellationId);
          },
        },
        (progress) => {
          setCompressionProgress(progress);
          if (progress % 0.1 === 0) { // Log every 10%
            console.log(`📊 Compression progress: ${(progress * 100).toFixed(0)}%`);
          }
        }
      );

      console.log('✅ Video compressed successfully!');
      console.log('Compressed URI:', compressedUri);

      setIsCompressing(false);
      setCompressionProgress(0);

      return {
        uri: compressedUri,
        compressed: compressedUri !== videoUri,
      };

    } catch (error: any) {
      console.error('❌ Compression error:', error);
      setIsCompressing(false);
      setCompressionProgress(0);

      Toast.show({
        type: 'info',
        text1: 'Compression skipped',
        text2: 'Using original video',
        visibilityTime: 2000,
      });

      // Return original video if compression fails
      return {
        uri: videoUri,
        compressed: false,
      };
    }
  };

  return {
    compressVideo,
    isCompressing,
    compressionProgress,
  };
};