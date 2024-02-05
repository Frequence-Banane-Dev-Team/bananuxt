export const formatDuration = (duration) => {
    // duration in seconds

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    

    if (hours === 0) {
        return `${minutes}min`;
    }

    return `${hours}h${minutes}`;
}

