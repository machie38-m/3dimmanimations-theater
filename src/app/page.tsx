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
  Clock,
  Film,
  Sparkles,
  SkipForward,
  SkipBack,
  Settings,
  ChevronRight,
  Search,
  Grid3X3,
  LayoutList,
  ArrowUp,
  Heart,
  Eye,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

// ─── Types ────────────────────────────────────────────────────────────
interface VideoData {
  id: string
  title: string
  series: string
  duration: string
  durationSeconds: number
  url: string
  description: string
  quality: string
  date: string
  views?: number
}

// ─── Video Data ───────────────────────────────────────────────────────
const CDN_BASE = 'https://raw.githubusercontent.com/machie38-m/3dimmanimations-theater/video-store/videos'

const videos: VideoData[] = [
  {
    id: 'eula-hilichurl-trouble',
    title: 'Eula - Hilichurl Trouble',
    series: 'Genshin Impact',
    duration: '4:54',
    durationSeconds: 294,
    url: `${CDN_BASE}/Eula_Hilichurl_Trouble.mp4`,
    description: 'Eula encounters hilichurls in the wild. Things start in her favor but quickly take a turn for the worse.',
    quality: '1080p',
    date: '2022-03',
  },
  {
    id: 'ganyu-forest-trouble',
    title: 'Ganyu - Forest Trouble',
    series: 'Genshin Impact',
    duration: '2:43',
    durationSeconds: 163,
    url: `${CDN_BASE}/Ganyu_Forest_Trouble.mp4`,
    description: 'Ganyu ventures into the forest and encounters unexpected trouble. A classic 3DimmAnimations Genshin piece.',
    quality: '1080p',
    date: '2022-02',
  },
  {
    id: 'hu-tao-riding',
    title: 'Hu Tao - Riding',
    series: 'Genshin Impact',
    duration: '1:56',
    durationSeconds: 116,
    url: `${CDN_BASE}/Hu_Tao_Riding.mp4`,
    description: 'Hu Tao riding animation. One of the most iconic 3DimmAnimations Genshin works.',
    quality: '1080p',
    date: '2022-01',
  },
  {
    id: 'hu-tao-dimm',
    title: 'Hu Tao - Dimm Special',
    series: 'Genshin Impact',
    duration: '2:00',
    durationSeconds: 120,
    url: `${CDN_BASE}/Hu_Tao_Dimm.mp4`,
    description: 'Hu Tao in a special Dimm animation. Enhanced quality version by 3DimmAnimations.',
    quality: '1080p',
    date: '2022-01',
  },
  {
    id: 'yae-gorou-shenanigans',
    title: 'Yae & Gorou - Shenanigans',
    series: 'Genshin Impact',
    duration: '6:00',
    durationSeconds: 360,
    url: `${CDN_BASE}/Yae_Gorou_Shenanigans.mp4`,
    description: 'Yae Miko and Gorou in their signature shenanigans. A longer animation with detailed storytelling.',
    quality: '1080p',
    date: '2022-02',
  },
  {
    id: 'bunny-bar-1-klee',
    title: 'Bunny Bar Pt. 1 - Klee',
    series: 'Genshin Impact',
    duration: '2:50',
    durationSeconds: 170,
    url: `${CDN_BASE}/Bunny_Bar_1_Klee.mp4`,
    description: 'Bunny Bar Special Part 1 featuring Klee. The iconic Bunny Bar series by 3DimmAnimations.',
    quality: '1080p',
    date: '2021-12',
  },
  {
    id: 'bunny-bar-2-diona',
    title: 'Bunny Bar Pt. 2 - Diona',
    series: 'Genshin Impact',
    duration: '3:45',
    durationSeconds: 225,
    url: `${CDN_BASE}/Bunny_Bar_2_Diona.mp4`,
    description: 'Bunny Bar Special Part 2 featuring Diona. The second installment of the beloved Bunny Bar series.',
    quality: '1080p',
    date: '2021-12',
  },
  {
    id: 'bunny-bar-3-qiqi',
    title: 'Bunny Bar Pt. 3 - Qiqi',
    series: 'Genshin Impact',
    duration: '4:23',
    durationSeconds: 263,
    url: `${CDN_BASE}/Bunny_Bar_3_Qiqi.mp4`,
    description: 'Bunny Bar Special Part 3 featuring Qiqi. The grand finale of the Bunny Bar trilogy.',
    quality: '720p',
    date: '2021-12',
  },
  {
    id: 'kokkoro-salad',
    title: "Kokkoro's Salad",
    series: 'Princess Connect',
    duration: '6:40',
    durationSeconds: 400,
    url: `${CDN_BASE}/Kokkoro_Salad.mp4`,
    description: "Kokkoro and Yuuki's morning routine animation. The longest 3DimmAnimations video featuring Princess Connect characters.",
    quality: '1080p',
    date: '2022-04',
  },
  {
    id: 'takagi-chi-2k',
    title: 'Takagi & Chii - 2K',
    series: 'Takagi-san',
    duration: '5:45',
    durationSeconds: 345,
    url: `${CDN_BASE}/Takagi_Chi_2K.mp4`,
    description: 'Takagi-san and Chii in a heartwarming family bonding animation. High resolution 2K version.',
    quality: '2K',
    date: '2022-05',
  },
  {
    id: 'aharen-4k',
    title: 'Aharen-san - 4K',
    series: 'Aharen-san',
    duration: '6:30',
    durationSeconds: 390,
    url: `${CDN_BASE}/Aharen_4K.mp4`,
    description: 'Aharen-san and Raidou after class. Ultra high definition 4K animation by 3DimmAnimations.',
    quality: '4K',
    date: '2022-06',
  },
  {
    id: 'hook-missionary',
    title: 'Hook - Missionary',
    series: 'Honkai Star Rail',
    duration: '3:40',
    durationSeconds: 220,
    url: `${CDN_BASE}/Hook_Missionary.mp4`,
    description: 'Hook from Honkai Star Rail. One of the first HSR animations by 3DimmAnimations.',
    quality: '1080p',
    date: '2023-05',
  },
]

// ─── Series Config ────────────────────────────────────────────────────
const seriesConfig: Record<string, {
  color: string
  accent: string
  bg: string
  border: string
  glow: string
  gradient: string
  icon: string
}> = {
  'Genshin Impact': {
    color: 'text-amber-300',
    accent: '#D4A04A',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/15',
    gradient: 'from-amber-600/80 to-orange-600/80',
    icon: '⚡',
  },
  'Honkai Star Rail': {
    color: 'text-sky-300',
    accent: '#5B9BD5',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    glow: 'shadow-sky-500/15',
    gradient: 'from-sky-600/80 to-blue-600/80',
    icon: '🌟',
  },
  'Takagi-san': {
    color: 'text-rose-300',
    accent: '#E57373',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    glow: 'shadow-rose-500/15',
    gradient: 'from-rose-600/80 to-pink-600/80',
    icon: '💕',
  },
  'Aharen-san': {
    color: 'text-emerald-300',
    accent: '#4DB6AC',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/15',
    gradient: 'from-emerald-600/80 to-teal-600/80',
    icon: '🍃',
  },
  'Princess Connect': {
    color: 'text-violet-300',
    accent: '#AB84E6',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-500/15',
    gradient: 'from-violet-600/80 to-purple-600/80',
    icon: '👑',
  },
}

const allSeries = ['All', ...Object.keys(seriesConfig)]

// ─── Thumbnail Component ──────────────────────────────────────────────
function VideoThumbnail({ video, className = '' }: { video: VideoData; className?: string }) {
  const config = seriesConfig[video.series]
  const initial = video.title.charAt(0).toUpperCase()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
      {/* Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(30deg, rgba(212,160,74,0.5) 12%, transparent 12.5%, transparent 87%, rgba(212,160,74,0.5) 87.5%, rgba(212,160,74,0.5)),
          linear-gradient(150deg, rgba(212,160,74,0.5) 12%, transparent 12.5%, transparent 87%, rgba(212,160,74,0.5) 87.5%, rgba(212,160,74,0.5)),
          linear-gradient(30deg, rgba(212,160,74,0.5) 12%, transparent 12.5%, transparent 87%, rgba(212,160,74,0.5) 87.5%, rgba(212,160,74,0.5)),
          linear-gradient(150deg, rgba(212,160,74,0.5) 12%, transparent 12.5%, transparent 87%, rgba(212,160,74,0.5) 87.5%, rgba(212,160,74,0.5))`,
        backgroundSize: '80px 140px',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
      }} />
      {/* Large initial */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/[0.07] font-bold select-none tracking-tighter" style={{ fontSize: '10rem', lineHeight: 0.8 }}>
          {initial}
        </span>
      </div>
      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-white/[0.12] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.12] group-hover:border-[oklch(84%_0.19_80.46/0.3)]">
          <Play className="w-6 h-6 text-white/70 ml-0.5" />
        </div>
      </div>
      {/* Duration */}
      <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] px-2 py-0.5 rounded font-mono tracking-wider flex items-center gap-1 border border-white/[0.06]">
        <Clock className="w-2.5 h-2.5" />
        {video.duration}
      </div>
      {/* Quality badge */}
      <div className="absolute top-2.5 right-2.5">
        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tracking-wider bg-[oklch(84%_0.19_80.46/0.15)] text-[oklch(84%_0.15_80.46)] border border-[oklch(84%_0.19_80.46/0.2)]">
          {video.quality}
        </span>
      </div>
      {/* Series badge */}
      <div className="absolute top-2.5 left-2.5">
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${config.bg} ${config.color} border ${config.border} backdrop-blur-sm tracking-wide`}>
          {video.series}
        </span>
      </div>
    </div>
  )
}

// ─── Video Player ──────────────────────────────────────────────────────
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
    if (v.paused) { v.play().catch(() => {}) } else { v.pause() }
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
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) scheduleHideControls()
  }, [isPlaying, scheduleHideControls])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break
        case ' ': e.preventDefault(); handlePlayPause(); break
        case 'ArrowLeft': skip(-10); break
        case 'ArrowRight': skip(10); break
        case 'f': toggleFullscreen(); break
        case 'm': toggleMute(); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePlayPause, skip, toggleFullscreen, toggleMute])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay = () => { setIsPlaying(true); scheduleHideControls() }
    const onPause = () => { setIsPlaying(false); setShowControls(true); if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }
    const onTimeUpdate = () => setCurrentTime(v.currentTime)
    const onLoadedMetadata = () => setDuration(v.duration)
    const onWaiting = () => setIsBuffering(true)
    const onPlaying = () => setIsBuffering(false)
    v.addEventListener('play', onPlay); v.addEventListener('pause', onPause)
    v.addEventListener('timeupdate', onTimeUpdate); v.addEventListener('loadedmetadata', onLoadedMetadata)
    v.addEventListener('waiting', onWaiting); v.addEventListener('playing', onPlaying)
    return () => {
      v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause)
      v.removeEventListener('timeupdate', onTimeUpdate); v.removeEventListener('loadedmetadata', onLoadedMetadata)
      v.removeEventListener('waiting', onWaiting); v.removeEventListener('playing', onPlaying)
    }
  }, [scheduleHideControls])

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
      className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center" onMouseMove={showControlsTemporarily}>
        <video ref={videoRef} src={video.url} className="w-full h-full object-contain" onClick={handlePlayPause} playsInline volume={volume} />

        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 border-2 border-[oklch(84%_0.19_80.46/0.2)] border-t-[oklch(84%_0.19_80.46)] rounded-full animate-spin" />
          </div>
        )}

        <AnimatePresence>
          {!isPlaying && !isBuffering && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-[oklch(84%_0.19_80.46/0.15)] backdrop-blur-md flex items-center justify-center border border-[oklch(84%_0.19_80.46/0.2)]">
                <Play className="w-10 h-10 text-white/80 ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showControls && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {/* Top bar */}
              <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 md:p-6 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-white font-medium text-base tracking-wide">{video.title}</h2>
                    <p className="text-white/40 text-xs font-mono tracking-wider uppercase mt-0.5">{video.series} · 3DimmAnimations · {video.quality}</p>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-6 pointer-events-auto">
                {/* Progress bar */}
                <div ref={progressRef} className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer group mb-4 hover:h-1.5 transition-all"
                  onClick={handleProgressClick}>
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[oklch(84%_0.19_80.46)] to-[oklch(75%_0.15_60)] rounded-full transition-all"
                    style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[oklch(84%_0.19_80.46)] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 6px)` }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1.5 ml-2">
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <div className="w-20 hidden sm:block">
                        <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} className="cursor-pointer" />
                      </div>
                    </div>
                    <span className="text-white/50 text-xs font-mono ml-2 hidden sm:inline tracking-wider">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <Button variant="ghost" size="sm" onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full font-mono text-xs h-9">
                        <Settings className="w-3.5 h-3.5 mr-1" />{playbackRate}x
                      </Button>
                      <AnimatePresence>
                        {showSpeedMenu && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-[oklch(10%_0.01_95)]/95 backdrop-blur-xl border border-[oklch(84%_0.19_80.46/0.15)] rounded-lg p-1.5 min-w-[90px]">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                              <button key={speed} onClick={() => changeSpeed(speed)}
                                className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors font-mono ${
                                  playbackRate === speed ? 'bg-[oklch(84%_0.19_80.46/0.2)] text-[oklch(84%_0.15_80.46)]' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                                }`}>{speed}x</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9">
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
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
  const [searchQuery, setSearchQuery] = useState('')
  const [playingVideo, setPlayingVideo] = useState<VideoData | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showScrollTop, setShowScrollTop] = useState(false)

  const filteredVideos = videos.filter((v) => {
    const matchesFilter = activeFilter === 'All' || v.series === activeFilter
    const matchesSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.series.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const featuredVideo = videos[0]

  const handleVideoClick = (video: VideoData) => {
    setPlayingVideo(video)
  }

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Series stats
  const seriesStats = Object.entries(seriesConfig).map(([name, config]) => ({
    name,
    count: videos.filter((v) => v.series === name).length,
    ...config,
  }))

  return (
    <div className="min-h-screen lacquer-surface text-white selection:bg-[oklch(84%_0.19_80.46/0.25)]">
      {/* ─── Ambient Background ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[oklch(84%_0.19_80.46/0.03)] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[oklch(70%_0.12_188/0.03)] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[oklch(84%_0.19_80.46/0.015)] rounded-full blur-[200px]" />
      </div>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="relative z-10 border-b hairline-gold sticky top-0 bg-[oklch(7%_0.006_95/85)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[oklch(84%_0.19_80.46/0.2)] to-[oklch(84%_0.19_80.46/0.05)] flex items-center justify-center border border-[oklch(84%_0.19_80.46/0.25)]">
              <Film className="w-4 h-4 text-[oklch(84%_0.19_80.46)]" />
              <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-[oklch(84%_0.19_80.46/0.1)] to-transparent" />
            </div>
            <div>
              <h1 className="text-base font-semibold gold-text tracking-wide">3Dimm Theater</h1>
              <p className="text-[10px] text-white/25 font-mono tracking-[0.2em] uppercase">Premium Animation Collection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/[0.03] border border-[oklch(84%_0.19_80.46/0.1)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-[oklch(84%_0.19_80.46/0.25)] focus:bg-white/[0.05] transition-all w-40 focus:w-56 font-mono tracking-wide"
              />
            </div>
            {/* View toggle */}
            <div className="flex items-center bg-white/[0.03] border border-[oklch(84%_0.19_80.46/0.1)] rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[oklch(84%_0.19_80.46/0.15)] text-[oklch(84%_0.19_80.46)]' : 'text-white/30 hover:text-white/50'}`}>
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[oklch(84%_0.19_80.46/0.15)] text-[oklch(84%_0.19_80.46)]' : 'text-white/30 hover:text-white/50'}`}>
                <LayoutList className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Count */}
            <Badge variant="outline" className="border-[oklch(84%_0.19_80.46/0.2)] text-[oklch(84%_0.15_80.46)] bg-[oklch(84%_0.19_80.46/0.08)] font-mono text-[10px] tracking-wider">
              <Sparkles className="w-2.5 h-2.5 mr-1" />{videos.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Hero / Featured ──────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[oklch(84%_0.19_80.46)]" />
            <span className="text-xs font-mono text-[oklch(84%_0.15_80.46)] tracking-[0.15em] uppercase">Featured</span>
            <div className="flex-1 h-px bg-[oklch(84%_0.19_80.46/0.1)] ml-2" />
          </div>
          <motion.div
            whileHover={{ scale: 1.002 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group relative overflow-hidden rounded-xl border border-[oklch(84%_0.19_80.46/0.12)] cursor-pointer gold-glow"
            onClick={() => handleVideoClick(featuredVideo)}
          >
            <div className="relative h-56 sm:h-72 md:h-96">
              <VideoThumbnail video={featuredVideo} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono tracking-wider ${seriesConfig[featuredVideo.series].bg} ${seriesConfig[featuredVideo.series].color} border ${seriesConfig[featuredVideo.series].border}`}>
                      {featuredVideo.series}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono tracking-wider bg-[oklch(84%_0.19_80.46/0.1)] text-[oklch(84%_0.15_80.46)] border border-[oklch(84%_0.19_80.46/0.15)]">
                      {featuredVideo.quality}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-3xl font-semibold text-white mb-2 tracking-wide group-hover:text-[oklch(84%_0.19_80.46)] transition-colors duration-300">
                    {featuredVideo.title}
                  </h2>
                  <p className="text-white/40 text-sm mb-4 line-clamp-2 font-light">{featuredVideo.description}</p>
                  <div className="flex items-center gap-3">
                    <Button size="sm" className="bg-[oklch(84%_0.19_80.46/0.2)] hover:bg-[oklch(84%_0.19_80.46/0.3)] text-[oklch(84%_0.19_80.46)] border border-[oklch(84%_0.19_80.46/0.25)] hover:border-[oklch(84%_0.19_80.46/0.4)] shadow-none font-mono text-xs tracking-wider">
                      <Play className="w-3.5 h-3.5 mr-1.5" />PLAY NOW
                    </Button>
                    <span className="text-white/25 text-xs font-mono flex items-center gap-1 tracking-wider">
                      <Clock className="w-3 h-3" />{featuredVideo.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Series Filter ────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-[oklch(84%_0.19_80.46)]" />
            <span className="text-xs font-mono text-[oklch(84%_0.15_80.46)] tracking-[0.15em] uppercase">Browse by Series</span>
            <div className="flex-1 h-px bg-[oklch(84%_0.19_80.46/0.1)] ml-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            {allSeries.map((category) => {
              const isActive = activeFilter === category
              const count = category === 'All' ? videos.length : videos.filter((v) => v.series === category).length
              const config = category !== 'All' ? seriesConfig[category] : null
              return (
                <Button key={category} variant={isActive ? 'default' : 'outline'} onClick={() => setActiveFilter(category)}
                  className={`rounded-lg transition-all duration-300 text-xs font-mono tracking-wider h-8 ${
                    isActive
                      ? 'bg-[oklch(84%_0.19_80.46/0.2)] text-[oklch(84%_0.19_80.46)] border-[oklch(84%_0.19_80.46/0.25)] hover:bg-[oklch(84%_0.19_80.46/0.25)] shadow-none'
                      : 'bg-white/[0.02] text-white/35 border-[oklch(84%_0.19_80.46/0.08)] hover:bg-white/[0.05] hover:text-white/60 hover:border-[oklch(84%_0.19_80.46/0.15)] shadow-none'
                  }`}>
                  {config && <span className="mr-1.5 text-sm">{config.icon}</span>}
                  {category}
                  <span className={`ml-1.5 text-[10px] px-1 py-0.5 rounded font-mono ${isActive ? 'bg-[oklch(84%_0.19_80.46/0.2)]' : 'bg-white/[0.05]'}`}>{count}</span>
                </Button>
              )
            })}
          </div>
        </section>

        {/* ─── Video Gallery ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Film className="w-4 h-4 text-[oklch(84%_0.19_80.46)]" />
            <span className="text-xs font-mono text-[oklch(84%_0.15_80.46)] tracking-[0.15em] uppercase">
              {activeFilter === 'All' ? 'All Videos' : activeFilter}
            </span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className="text-white/25 text-[10px] font-mono tracking-wider">{filteredVideos.length} videos</span>
            <div className="flex-1 h-px bg-[oklch(84%_0.19_80.46/0.1)] ml-2" />
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video, index) => {
                  const config = seriesConfig[video.series]
                  return (
                    <motion.div key={video.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }} className="group cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <div className={`relative overflow-hidden rounded-lg border border-[oklch(84%_0.19_80.46/0.08)] bg-white/[0.015] backdrop-blur-sm transition-all duration-300 hover:border-[oklch(84%_0.19_80.46/0.2)] hover:bg-white/[0.03] hover:shadow-lg ${config.glow}`}>
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                          <VideoThumbnail video={video} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        {/* Content */}
                        <div className="p-3">
                          <h3 className="font-medium text-white/85 text-sm group-hover:text-[oklch(84%_0.19_80.46)] transition-colors duration-300 truncate tracking-wide">
                            {video.title}
                          </h3>
                          <p className="text-white/25 text-[11px] mt-1 line-clamp-1 font-light">{video.description}</p>
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border} font-medium tracking-wide`}>
                              {video.series}
                            </span>
                            <span className="text-white/15 text-[9px]">·</span>
                            <span className="text-white/25 text-[10px] font-mono flex items-center gap-0.5 tracking-wider">
                              <Clock className="w-2.5 h-2.5" />{video.duration}
                            </span>
                            <span className="text-white/15 text-[9px]">·</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wider bg-[oklch(84%_0.19_80.46/0.08)] text-[oklch(84%_0.12_80.46)] border border-[oklch(84%_0.19_80.46/0.1)]">
                              {video.quality}
                            </span>
                          </div>
                        </div>
                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-[oklch(84%_0.19_80.46/0.08)] via-transparent to-[oklch(84%_0.19_80.46/0.04)]" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((video, index) => {
                  const config = seriesConfig[video.series]
                  return (
                    <motion.div key={video.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }} className="group cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-[oklch(84%_0.19_80.46/0.06)] bg-white/[0.01] hover:bg-white/[0.03] hover:border-[oklch(84%_0.19_80.46/0.15)] transition-all duration-300">
                        {/* Mini thumbnail */}
                        <div className="relative w-28 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white/40" />
                          </div>
                          <div className="absolute bottom-1 right-1 text-[8px] px-1 py-0.5 rounded bg-black/60 text-white/70 font-mono">{video.duration}</div>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white/80 group-hover:text-[oklch(84%_0.19_80.46)] transition-colors truncate">{video.title}</h3>
                          <p className="text-[11px] text-white/25 mt-0.5 line-clamp-1">{video.description}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>{video.series}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[oklch(84%_0.19_80.46/0.08)] text-[oklch(84%_0.12_80.46)] border border-[oklch(84%_0.19_80.46/0.1)]">{video.quality}</span>
                          </div>
                        </div>
                        <div className="text-white/15 flex-shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Empty state */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-20">
              <Film className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/25 text-sm font-mono tracking-wider">No videos found</p>
              <p className="text-white/15 text-xs font-mono mt-1">Try a different search or filter</p>
            </div>
          )}
        </section>

        {/* ─── Statistics Section ───────────────────────────────────── */}
        <section className="mt-16 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[oklch(84%_0.19_80.46)]" />
            <span className="text-xs font-mono text-[oklch(84%_0.15_80.46)] tracking-[0.15em] uppercase">Collection Stats</span>
            <div className="flex-1 h-px bg-[oklch(84%_0.19_80.46/0.1)] ml-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg border border-[oklch(84%_0.19_80.46/0.08)] bg-white/[0.015]">
              <p className="text-2xl font-semibold gold-text">{videos.length}</p>
              <p className="text-[10px] text-white/25 font-mono tracking-wider uppercase mt-1">Total Videos</p>
            </div>
            <div className="p-4 rounded-lg border border-[oklch(84%_0.19_80.46/0.08)] bg-white/[0.015]">
              <p className="text-2xl font-semibold text-[oklch(70%_0.12_188)]">{Object.keys(seriesConfig).length}</p>
              <p className="text-[10px] text-white/25 font-mono tracking-wider uppercase mt-1">Series</p>
            </div>
            <div className="p-4 rounded-lg border border-[oklch(84%_0.19_80.46/0.08)] bg-white/[0.015]">
              <p className="text-2xl font-semibold gold-text">{Math.round(videos.reduce((a, v) => a + v.durationSeconds, 0) / 60)}m</p>
              <p className="text-[10px] text-white/25 font-mono tracking-wider uppercase mt-1">Total Duration</p>
            </div>
            <div className="p-4 rounded-lg border border-[oklch(84%_0.19_80.46/0.08)] bg-white/[0.015]">
              <p className="text-2xl font-semibold text-[oklch(70%_0.12_188)]">{videos.filter(v => v.quality === '4K' || v.quality === '2K').length}</p>
              <p className="text-[10px] text-white/25 font-mono tracking-wider uppercase mt-1">High-Res Videos</p>
            </div>
          </div>
        </section>

        {/* ─── Footer ───────────────────────────────────────────────── */}
        <footer className="pt-8 border-t border-[oklch(84%_0.19_80.46/0.08)] pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[oklch(84%_0.19_80.46/0.2)] to-[oklch(84%_0.19_80.46/0.05)] flex items-center justify-center border border-[oklch(84%_0.19_80.46/0.15)]">
                <Film className="w-2.5 h-2.5 text-[oklch(84%_0.19_80.46)]" />
              </div>
              <span className="text-white/25 text-xs font-mono tracking-wider">3DimmAnimations Theater</span>
            </div>
            <p className="text-white/15 text-[10px] font-mono tracking-wider">
              All animations created by 3DimmAnimations · Fan-made gallery
            </p>
          </div>
        </footer>
      </main>

      {/* ─── Video Player Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {playingVideo && (
          <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />
        )}
      </AnimatePresence>

      {/* ─── Scroll to Top ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-lg bg-[oklch(84%_0.19_80.46/0.15)] border border-[oklch(84%_0.19_80.46/0.2)] flex items-center justify-center text-[oklch(84%_0.19_80.46)] hover:bg-[oklch(84%_0.19_80.46/0.25)] transition-colors shadow-lg backdrop-blur-sm">
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
