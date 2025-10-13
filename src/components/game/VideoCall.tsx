'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DailyCall } from '@daily-co/daily-js';
import { Video, VideoOff, Mic, MicOff, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dailyManager } from '@/lib/dailyManager';

interface VideoCallProps {
  roomUrl: string;
  userName: string;
  onLeave?: () => void;
  className?: string;
}

export function VideoCall({ roomUrl, userName, onLeave, className }: VideoCallProps) {
  console.log('🎥 [VideoCall] Component rendered with props:', { roomUrl, userName, className });

  const callObjectRef = useRef<DailyCall | null>(null);
  const isInitializingRef = useRef(false);
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  console.log('🎥 [VideoCall] State:', { isJoining, error, hasCallObject: !!callObjectRef.current, isInitializing: isInitializingRef.current, isMounted });

  // Track when component is fully mounted
  useEffect(() => {
    console.log('🎥 [VideoCall] Component mounted, iframe container available');
    setIsMounted(true);
  }, []);

  // Initialize Daily.co call - runs after component is mounted
  useEffect(() => {
    console.log('🎥 [VideoCall] useEffect triggered', {
      roomUrl,
      isMounted,
      hasIframeContainer: !!iframeContainerRef.current,
      hasCallObject: !!callObjectRef.current,
      isInitializing: isInitializingRef.current
    });

    if (!roomUrl) {
      console.log('⚠️ [VideoCall] No roomUrl, skipping initialization');
      return;
    }

    if (!isMounted) {
      console.log('⚠️ [VideoCall] Component not mounted yet, waiting...');
      return;
    }

    if (!iframeContainerRef.current) {
      console.log('⚠️ [VideoCall] No iframe container yet, waiting...');
      return;
    }

    // Prevent duplicate instances
    if (callObjectRef.current || isInitializingRef.current) {
      console.log('⚠️ Call object already exists or initializing, skipping');
      return;
    }

    isInitializingRef.current = true;

    const initializeCall = async () => {
      try {
        console.log('🎥 Initializing Daily.co call...');
        console.log('🎥 Room URL:', roomUrl);
        console.log('🎥 User Name:', userName);
        console.log('✅ Iframe container ready');

        // Get or create call object with iframe container from singleton manager
        const callObject = await dailyManager.getOrCreateCall(iframeContainerRef.current);
        callObjectRef.current = callObject;
        console.log('✅ Call object ready');

        // Set up minimal event listeners
        callObject
          .on('joined-meeting', () => {
            console.log('✅ Successfully joined meeting');
            setIsJoining(false);
          })
          .on('error', handleError)
          .on('loading', () => console.log('📡 Daily.co: Loading...'))
          .on('loaded', () => console.log('✅ Daily.co: Loaded'))
          .on('joining-meeting', () => console.log('🔄 Daily.co: Joining meeting...'))
          .on('left-meeting', () => console.log('👋 Daily.co: Left meeting'));

        console.log('✅ Event listeners set up');

        // Join the meeting with video and audio enabled
        console.log('🔄 Attempting to join meeting...');
        const joinResponse = await callObject.join({
          url: roomUrl,
          userName: userName,
        });

        console.log('✅ Join response:', joinResponse);
      } catch (err) {
        console.error('❌ Error joining call:', err);
        console.error('❌ Error details:', JSON.stringify(err, null, 2));
        setError('No se pudo conectar a la videollamada');
        setIsJoining(false);
        isInitializingRef.current = false;
      }
    };

    initializeCall();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up VideoCall component...');

      // Just clear the local reference, don't destroy the singleton
      callObjectRef.current = null;
      isInitializingRef.current = false;

      console.log('✅ Component cleanup complete');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUrl, userName, isMounted]);

  const handleError = useCallback((error: unknown) => {
    console.error('Daily.co error:', error);
    setError('Error en la videollamada');
  }, []);

  const toggleVideo = async () => {
    if (!callObjectRef.current) return;
    const newVideoState = !localVideo;
    await callObjectRef.current.setLocalVideo(newVideoState);
    setLocalVideo(newVideoState);
  };

  const toggleAudio = async () => {
    if (!callObjectRef.current) return;
    const newAudioState = !localAudio;
    await callObjectRef.current.setLocalAudio(newAudioState);
    setLocalAudio(newAudioState);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const leaveCall = async () => {
    if (callObjectRef.current) {
      try {
        await callObjectRef.current.leave();
        console.log('👋 Left the call');
      } catch (error) {
        console.error('Error leaving call:', error);
      }

      callObjectRef.current = null;
    }

    // Destroy the singleton call object
    await dailyManager.destroyCall();

    onLeave?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Error State Overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/95">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-md">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={onLeave}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Loading State Overlay */}
      {isJoining && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/95">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4" />
            <p className="text-slate-300">Conectando a videollamada...</p>
          </div>
        </div>
      )}

      {/* Daily.co Iframe Container - ALWAYS RENDERED */}
      <div
        ref={iframeContainerRef}
        className="relative w-full min-h-[400px]"
        style={{ aspectRatio: '16 / 9' }}
      />

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <div className="flex items-center justify-center gap-3">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={cn(
              'p-3 rounded-full transition-all duration-200 hover:scale-110',
              localVideo
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            )}
            title={localVideo ? 'Apagar cámara' : 'Encender cámara'}
          >
            {localVideo ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={cn(
              'p-3 rounded-full transition-all duration-200 hover:scale-110',
              localAudio
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            )}
            title={localAudio ? 'Silenciar micrófono' : 'Activar micrófono'}
          >
            {localAudio ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 hover:scale-110"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          {/* Leave Call */}
          <button
            onClick={leaveCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110 ml-2"
            title="Salir de la videollamada"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}