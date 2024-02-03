import { defineStore } from 'pinia'

async function loadAudio(url) {

    const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Connection': 'keep-alive',
        }
    });

    const blob = await result.blob();

    if (blob) {
        const audioSource = new Audio();
        audioSource.src = URL.createObjectURL(blob);
        return audioSource;
    } else {
        console.warn("Can not load audio file.");
    }
    return null;

    

}

export const useSongStore = defineStore('song', {
    state: () => ({
        isPlaying: false,
        audio: null,
        currentTrack: null,
        currentEmission: null,
        isLive: false,
        isLoaded: false
    }),
    actions: {
        async loadSong(emission, track) {
            this.currentTrack = track
            this.currentEmission = emission
            this.isLoaded = false

            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            } else {
                this.audio = new Audio()
            }

            if (track.isLive) {
                this.audio.src = track.path
            } else {
                let newAudio = await loadAudio(track.path)
                if (this.currentTrack.name !== track.name) {
                    // The track has changed, we don't want to play the new audio
                    return
                }
                this.audio.src = newAudio.src
            }
            this.isLive = track.isLive || false

            setTimeout(() => {
                this.isPlaying = true
                this.audio.play()
            }, 200)
        },

        async preloadSong(emission, track) {
            this.currentTrack = track
            this.currentEmission = emission
            this.isLoaded = false

            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            } else {
                this.audio = new Audio()
            }

            if (track.isLive) {
                this.audio.src = track.path
            } else {
                let newAudio = await loadAudio(track.path)
                if (this.currentTrack.name !== track.name) {
                    // The track has changed, we don't want to play the new audio
                    return
                }
                this.audio.src = newAudio.src
            }
            this.isLive = track.isLive || false

        },

        loadLive() {
            const config = useRuntimeConfig();
            const BASE_URL = config.public.BASE_URL;

            const imageUrl = BASE_URL + "/images/thumbnail_live.png"
            this.loadSong({
                name: "La radio des étudiant.e.s !",
                cover: imageUrl,
            }, {
                name: "Fréquence Banane",
                path: "https://player.frequencebanane.ch/fb_192",
                isLive: true
            })
        },

        preloadLive() {
            const config = useRuntimeConfig();
            const BASE_URL = config.public.BASE_URL;

            const imageUrl = BASE_URL + "/images/thumbnail_live.png"

            this.preloadSong({
                name: "La radio des étudiant.e.s !",
                cover: imageUrl,
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
            this.isLive = false
            this.isLoaded = false
        }
    },
    persist: true
})