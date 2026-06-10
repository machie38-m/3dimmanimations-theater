'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  ExternalLink,
  Clock,
  Film,
  Sparkles,
  SkipForward,
  SkipBack,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

// ─── Types ────────────────────────────────────────────────────────────
interface VideoData {
  id: string
  title: string
  series: 'Takagi-san' | 'Genshin Impact' | 'Honkai Star Rail' | 'Aharen-san'
  duration: string
  durationSeconds: number
  isExternal: boolean
  url?: string
  file?: string
  description: string
  quality?: string
}

// ─── Video Data ───────────────────────────────────────────────────────
const videos: VideoData[] = [
  {
    id: 'bunny-bar-1-klee',
    title: 'Bunny Bar Part 1 - Klee',
    series: 'Genshin Impact',
    duration: '2:50',
    durationSeconds: 170,
    isExternal: false,
    file: '/videos/Bunny_Bar_1_Klee.mp4',
    description: 'Bunny Bar Special Part 1 featuring Klee. 3DimmAnimations classic Bunny Bar series with 720p quality.',
    quality: '720p',
  },
  {
    id: 'bunny-bar-2-diona',
    title: 'Bunny Bar Part 2 - Diona',
    series: 'Genshin Impact',
    duration: '3:45',
    durationSeconds: 225,
    isExternal: false,
    file: '/videos/Bunny_Bar_2_Diona.mp4',
    description: 'Bunny Bar Special Part 2 featuring Diona. The second installment of the popular Bunny Bar series by 3DimmAnimations.',
    quality: '720p',
  },
  {
    id: 'bunny-bar-3-qiqi',
    title: 'Bunny Bar Part 3 - Qiqi',
    series: 'Genshin Impact',
    duration: '4:23',
    durationSeconds: 263,
    isExternal: false,
    file: '/videos/Bunny_Bar_3_Qiqi.mp4',
    description: 'Bunny Bar Special Part 3 featuring Qiqi. The third installment of the Bunny Bar series by 3DimmAnimations.',
    quality: '720p',
  },
  {
    id: 'hook-missionary',
    title: 'Hook - Missionary',
    series: 'Honkai Star Rail',
    duration: '3:40',
    durationSeconds: 220,
    isExternal: false,
    file: '/videos/Hook_Missionary.mp4',
    description: 'Hook from Honkai Star Rail in a missionary position animation by 3DimmAnimations. November 2023 release.',
    quality: '720p',
  },
  {
    id: 'takagi-chii-2k',
    title: 'Takagi & Chii 2K',
    series: 'Takagi-san',
    duration: '5:45',
    durationSeconds: 345,
    isExternal: false,
    file: '/videos/Takagi_Chi_2K.mp4',
    description: 'Takagi-san and Chii in this heartwarming animation by 3DimmAnimations. Beautiful 2K quality release.',
    quality: '480p',
  },
  {
    id: 'aharen-4k',
    title: 'Aharen-san 4K',
    series: 'Aharen-san',
    duration: '6:30',
    durationSeconds: 390,
    isExternal: false,
    file: '/videos/Aharen_4K.mp4',
    description: 'Aharen-san from Aharen-san wa Hakarenai in 720p quality animation by 3DimmAnimations. Optimized for web streaming.',
    quality: '720p',
  },
]

// ─── Series Colors ────────────────────────────────────────────────────
const seriesColors: Record<string, { bg: string; text: string; border: string; gradient: string; glow: string }> = {
  'Takagi-san': {
    bg: 'bg-pink-500/20',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
    gradient: 'from-pink-600 to-rose-500',
    glow: 'shadow-pink-500/25',
  },
  'Genshin Impact': {
    bg: 'bg-orange-500/20',
    text: 'text-orange-300',
    border: 'border-orange-500/30',
    gradient: 'from-orange-600 to-amber-500',
    glow: 'shadow-orange-500/25',
  },
  'Honkai Star Rail': {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    gradient: 'from-blue-600 to-cyan-500',
    glow: 'shadow-blue-500/25',
  },
  'Aharen-san': {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-500',
    glow: 'shadow-emerald-500/25',
  },
}

const filterCategories = ['All', 'Aharen-san', 'Takagi-san', 'Genshin Impact', 'Honkai Star Rail']

// ─── Thumbnail Component ──────────────────────────────────────────────
function VideoThumbnail({ video, className = '' }: { video: VideoData; className?: string }) {
  const colors = seriesColors[video.series]
  const initial = video.title.charAt(0).toUpperCase()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-80`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {/* Animated pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      </div>
      {/* Large initial letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/20 font-bold select-none" style={{ fontSize: '8rem', lineHeight: 1 }}>
          {initial}
        </span>
      </div>
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
          {video.isExternal ? (
            <ExternalLink className="w-7 h-7 text-white/80" />
          ) : (
            <Play className="w-7 h-7 text-white/80 ml-1" />
          )}
        </div>
      </div>
      {/* Duration badge */}
      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-mono flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {video.duration}
      </div>
      {/* Series badge */}
      <div className="absolute top-2 left-2">
        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${colors.bg} ${colors.text} border ${colors.border} backdrop-blur-sm`}>
          {video.series}
        </span>
      </div>
      {/* External badge */}
      {video.isExternal && (
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 backdrop-blur-sm flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            External
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Custom Video Player ──────────────────────────────────────────────
function VideoPlayer({ video, onClose }: { video: VideoData; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [])

  const handleSeek = useCallback((value: number[]) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = value[0]
    setCurrentTime(value[0])
  }, [])

  const handleVolumeChange = useCallback((value: number[]) => {
    const v = videoRef.current
    if (!v) return
    const vol = value[0]
    v.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const changeSpeed = useCallback((speed: number) => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = speed
    setPlaybackRate(speed)
    setShowSpeedMenu(false)
  }, [])

  const skip = useCallback((seconds: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration)
  }, [])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    const bar = progressRef.current
    if (!v || !bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = ratio * v.duration
  }, [])

  const scheduleHideControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      scheduleHideControls()
    }
  }, [isPlaying, scheduleHideControls])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          skip(-10)
          break
        case 'ArrowRight':
          skip(10)
          break
        case 'f':
          toggleFullscreen()
          break
        case 'm':
          toggleMute()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePlayPause, skip, toggleFullscreen, toggleMute])

  // Video events
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay = () => {
      setIsPlaying(true)
      scheduleHideControls()
    }
    const onPause = () => {
      setIsPlaying(false)
      setShowControls(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
    const onTimeUpdate = () => setCurrentTime(v.currentTime)
    const onLoadedMetadata = () => setDuration(v.duration)
    const onWaiting = () => setIsBuffering(true)
    const onPlaying = () => setIsBuffering(false)

    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('loadedmetadata', onLoadedMetadata)
    v.addEventListener('waiting', onWaiting)
    v.addEventListener('playing', onPlaying)

    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('loadedmetadata', onLoadedMetadata)
      v.removeEventListener('waiting', onWaiting)
      v.removeEventListener('playing', onPlaying)
    }
  }, [scheduleHideControls])

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])


  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        onMouseMove={showControlsTemporarily}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={video.file}
          className="w-full h-full object-contain"
          onClick={handlePlayPause}
          playsInline
          volume={volume}
        />

        {/* Buffering Spinner */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Center play button on pause */}
        <AnimatePresence>
          {!isPlaying && !isBuffering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full bg-violet-600/30 backdrop-blur-md flex items-center justify-center border border-violet-400/30">
                <Play className="w-12 h-12 text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-between pointer-events-none"
            >
              {/* Top bar */}
              <div className="bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                    <div>
                      <h2 className="text-white font-semibold text-lg">{video.title}</h2>
                      <p className="text-white/60 text-sm">{video.series} • 3DimmAnimations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 pointer-events-auto">
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group mb-4"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  />
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Skip back */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/10 rounded-full"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>

                    {/* Play/Pause */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                    </Button>

                    {/* Skip forward */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(10)}
                      className="text-white hover:bg-white/10 rounded-full"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/10 rounded-full"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <div className="w-24 hidden sm:block">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Time display */}
                    <span className="text-white/80 text-sm font-mono ml-3 hidden sm:inline">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speed control */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="text-white hover:bg-white/10 rounded-full font-mono"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {playbackRate}x
                      </Button>
                      <AnimatePresence>
                        {showSpeedMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-2 min-w-[100px]"
                          >
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => changeSpeed(speed)}
                                className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                                  playbackRate === speed
                                    ? 'bg-violet-600 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Fullscreen */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/10 rounded-full"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [playingVideo, setPlayingVideo] = useState<VideoData | null>(null)

  const filteredVideos = activeFilter === 'All'
    ? videos
    : videos.filter((v) => v.series === activeFilter)

  const featuredVideo = videos[videos.length - 1] // Most recently added

  const handleVideoClick = (video: VideoData) => {
    if (video.isExternal && video.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer')
    } else {
      setPlayingVideo(video)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/6 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/4 rounded-full blur-[200px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Film className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                3DimmAnimations Theater
              </h1>
              <p className="text-xs text-white/40 font-medium tracking-wider uppercase">
                Premium Animation Collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-violet-500/30 text-violet-300 bg-violet-500/10">
              <Sparkles className="w-3 h-3 mr-1" />
              {videos.length} Videos
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white/90">Featured</h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer"
            onClick={() => handleVideoClick(featuredVideo)}
          >
            <div className="relative h-64 sm:h-80 md:h-96">
              <VideoThumbnail video={featuredVideo} className="absolute inset-0" />
              {/* Gradient overlay for text */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="max-w-xl">
                  <Badge className={`mb-3 ${seriesColors[featuredVideo.series].bg} ${seriesColors[featuredVideo.series].text} border ${seriesColors[featuredVideo.series].border}`}>
                    {featuredVideo.series}
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base mb-4 line-clamp-2">
                    {featuredVideo.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25"
                    >
                      {featuredVideo.isExternal ? (
                        <>
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Watch on External Site
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play Now
                        </>
                      )}
                    </Button>
                    <span className="text-white/40 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredVideo.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className={`absolute inset-0 rounded-2xl ${seriesColors[featuredVideo.series].glow} shadow-2xl`} />
            </div>
          </motion.div>
        </section>

        {/* Filter Buttons */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => {
              const isActive = activeFilter === category
              const count = category === 'All'
                ? videos.length
                : videos.filter((v) => v.series === category).length
              return (
                <Button
                  key={category}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 shadow-lg shadow-violet-500/20'
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {category}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {count}
                  </span>
                </Button>
              )
            })}
          </div>
        </section>

        {/* Video Gallery Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Film className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white/90">
              {activeFilter === 'All' ? 'All Videos' : activeFilter}
            </h2>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white/40 text-sm">{filteredVideos.length} videos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, index) => {
                const colors = seriesColors[video.series]
                return (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className={`relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-xl ${colors.glow}`}>
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <VideoThumbnail video={video} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white/90 group-hover:text-violet-300 transition-colors truncate">
                              {video.title}
                            </h3>
                            <p className="text-white/40 text-sm mt-1 line-clamp-2">
                              {video.description}
                            </p>
                          </div>
                          {video.isExternal && (
                            <ExternalLink className="w-4 h-4 text-violet-400 shrink-0 mt-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {video.series}
                          </span>
                          <span className="text-white/30 text-xs">•</span>
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                          {video.quality && (
                            <>
                              <span className="text-white/30 text-xs">•</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                {video.quality}
                              </span>
                            </>
                          )}
                          {video.isExternal && (
                            <>
                              <span className="text-white/30 text-xs">•</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/20">
                                External
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hover glow effect on the card border */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-20">
              <Film className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">No videos found for this category</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center">
                <Film className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/40 text-sm">3DimmAnimations Theater</span>
            </div>
            <p className="text-white/20 text-xs">
              All animations are created by 3DimmAnimations. This is a fan-made gallery.
            </p>
          </div>
        </footer>
      </main>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && !playingVideo.isExternal && (
          <VideoPlayer
            video={playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
