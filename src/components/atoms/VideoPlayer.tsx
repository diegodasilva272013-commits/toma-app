// src/components/atoms/VideoPlayer.tsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors, spacing } from '../../theme/index';
import { LoadingLogo } from './LoadingLogo';

interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  loop?: boolean;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  autoPlay = true,
  loop = true,
  onPlaybackStatusUpdate,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePlaybackUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
    }
    onPlaybackStatusUpdate?.(status);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={autoPlay}
        isLooping={loop}
        onPlaybackStatusUpdate={handlePlaybackUpdate}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingLogo size={80} message="Cargando video..." />
        </View>
      )}

      {!isLoading && (
        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={handlePlayPause}
          activeOpacity={0.9}
        >
          <View style={styles.playPauseBg}>
            <Text style={styles.playPauseIcon}>
              {isPlaying ? '⏸' : '▶'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.xxl,
  },
  playPauseBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 255, 136, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neon.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  playPauseIcon: {
    fontSize: 20,
    color: '#000',
    fontWeight: '900',
  },
});
