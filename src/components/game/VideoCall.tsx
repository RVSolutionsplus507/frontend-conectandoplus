'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DailyCall, DailyParticipant } from '@daily-co/daily-js';
import { Video, VideoOff, Mic, MicOff, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dailyManager } from '@/lib/dailyManager';

interface VideoCallProps {
  roomUrl: string;
  userName: string;
  onLeave?: () => void;
  className?: string;
}

interface ParticipantTile {
  id: string;
  user_name: string;
  video: boolean;
  audio: boolean;
  local: boolean;
  screen?: boolean;
}

export function VideoCall({ roomUrl, userName, onLeave, className }: VideoCallProps) {
  const callObjectRef = useRef<DailyCall | null>(null);
  const isInitializingRef = useRef(false);
  const [participants, setParticipants] = useState<ParticipantTile[]>([]);
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Daily.co call
  useEffect(() => {
    if (!roomUrl) return;

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

        // Get or create call object from singleton manager
        const callObject = await dailyManager.getOrCreateCall();
        callObjectRef.current = callObject;
        console.log('✅ Call object ready');

        // Set up event listeners
        callObject
          .on('joined-meeting', handleJoinedMeeting)
          .on('participant-joined', handleParticipantUpdate)
          .on('participant-updated', handleParticipantUpdate)
          .on('participant-left', handleParticipantLeft)
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

        // Explicitly enable video and audio after joining
        await callObject.setLocalVideo(true);
        await callObject.setLocalAudio(true);
        console.log('✅ Video and audio enabled');

        setIsJoining(false);
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
  }, [roomUrl, userName]);

  const handleJoinedMeeting = useCallback(() => {
    console.log('✅ Successfully joined meeting');
    updateParticipants();
  }, []);

  const handleParticipantUpdate = useCallback(() => {
    updateParticipants();
  }, []);

  const handleParticipantLeft = useCallback(() => {
    updateParticipants();
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error('Daily.co error:', error);
    setError('Error en la videollamada');
  }, []);

  const updateParticipants = () => {
    if (!callObjectRef.current) return;

    const participantsObj = callObjectRef.current.participants();
    const participantsList: ParticipantTile[] = Object.values(participantsObj).map((p: DailyParticipant) => ({
      id: p.session_id,
      user_name: p.user_name || 'Jugador',
      video: p.video,
      audio: p.audio,
      local: p.local,
      screen: p.screen,
    }));

    setParticipants(participantsList);
  };

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

  // Calculate grid layout based on number of participants
  const getGridLayout = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid-cols-3 grid-rows-2';
    return 'grid-cols-4 grid-rows-2';
  };

  if (error) {
    return (
      <div className={cn('bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center', className)}>
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={onLeave}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    );
  }

  if (isJoining) {
    return (
      <div className={cn('bg-slate-900/50 border border-slate-700 rounded-xl p-8 text-center', className)}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4" />
        <p className="text-slate-300">Conectando a videollamada...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Video Grid */}
      <div className={cn('grid gap-2 p-3', getGridLayout(participants.length))}>
        {participants.map((participant) => (
          <ParticipantVideo
            key={participant.id}
            participant={participant}
            callObject={callObjectRef.current}
          />
        ))}
      </div>

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

// Individual participant video tile
function ParticipantVideo({
  participant,
  callObject,
}: {
  participant: ParticipantTile;
  callObject: DailyCall | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!callObject) return;

    // Set up video track
    if (videoRef.current && participant.video) {
      const videoTrack = callObject.participants()[participant.id]?.tracks?.video?.persistentTrack;
      if (videoTrack) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
      }
    }

    // Set up audio track (only for remote participants)
    if (audioRef.current && !participant.local && participant.audio) {
      const audioTrack = callObject.participants()[participant.id]?.tracks?.audio?.persistentTrack;
      if (audioTrack) {
        audioRef.current.srcObject = new MediaStream([audioTrack]);
      }
    }
  }, [callObject, participant, participant.video, participant.audio]);

  return (
    <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-all duration-200 group">
      {/* Video Element */}
      {participant.video ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.local}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-purple-400">
              {participant.user_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Audio Element (only for remote participants) */}
      {!participant.local && <audio ref={audioRef} autoPlay />}

      {/* Participant Name Badge */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <span className="text-xs font-medium text-white truncate max-w-[120px]">
            {participant.user_name}
            {participant.local && ' (Tú)'}
          </span>
        </div>

        <div className="flex gap-1">
          {!participant.audio && (
            <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-1">
              <MicOff size={12} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Local indicator */}
      {participant.local && (
        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          Tu cámara
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-200 pointer-events-none" />
    </div>
  );
}