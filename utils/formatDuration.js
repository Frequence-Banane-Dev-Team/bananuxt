export const formatDuration = (duration) => {
    // duration in seconds

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = duration - hours * 3600 - minutes * 60;
    

    if (hours === 0) {
        if (minutes === 0) {
            return `${seconds}s`;
        }
        return `${minutes}min`;
    }

    return `${hours}h${minutes}`;
}

