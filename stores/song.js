import { defineStore } from 'pinia'

export const useSongStore = defineStore('song', {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentTrack: null,
    currentEmission: null,
    isLive: false
  }),
  actions: {
    loadSong(emission, track) {
        this.currentTrack = track
        this.currentEmission = emission

        if (this.audio && this.audio.src) {
            this.audio.pause()
            this.isPlaying = false
            this.audio.src = ''
        }

        this.audio = new Audio()
        this.audio.src = track.path
        this.isLive = track.isLive || false

        setTimeout(() => {
            this.isPlaying = true
            this.audio.play()
        }, 200)
    },

    preloadSong(emission, track) {
        this.currentTrack = track
        this.currentEmission = emission

        if (this.audio && this.audio.src) {
            this.audio.pause()
            this.isPlaying = false
            this.audio.src = ''
        }

        this.audio = new Audio()
        this.audio.src = track.path
        this.isLive = track.isLive || false

    },

    loadLive() {
        this.loadSong({
            name: "La radio des étudiant.e.s !",
            cover: "/images/thumbnail_live.png",
          }, {
            name: "Fréquence Banane",
            path: "https://player.frequencebanane.ch/fb_192",
            isLive: true
          })
    },

    preloadLive() {
        this.preloadSong({
            name: "La radio des étudiant.e.s !",
            cover: "/images/thumbnail_live.png",
          }, {
            name: "Fréquence Banane",
            path: "https://player.frequencebanane.ch/fb_192",
            isLive: true
          })
    },

    playOrPauseSong() {
        if (this.audio.paused) {
            this.isPlaying = true
            this.audio.play()
        } else {
            this.isPlaying = false
            this.audio.pause()
        }
    },

    playOrPauseThisSong(emission, track) {
        if (!this.audio || !this.audio.src || (this.currentTrack.name !== track.name)) {
            this.loadSong(emission, track)
            return
        }

        this.playOrPauseSong()
    },

    rewindCurrentSong(delay) {
        if (!this.audio || !this.audio.src) {
            return
        }

        const currentTime = this.audio.currentTime
        this.audio.currentTime = currentTime - delay < 0 ? 0 : currentTime - delay
    },

    resetState() {
        this.isPlaying = false
        this.audio = null
        this.currentEmission = null
        this.currentTrack = null
    }
  },
  persist: true
})