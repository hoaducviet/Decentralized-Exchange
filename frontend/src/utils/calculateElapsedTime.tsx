
export const calculateElapsedTime = (timestamp: string) => {
    const now = Date.now();
    const transactionTime = new Date(timestamp).getTime();
    const secondsElapsed = Math.floor((now - transactionTime) / 1000);
    if (secondsElapsed < 60) {
        return `${secondsElapsed} seconds ago`;
    } else if (secondsElapsed < 3600) {
        const minutes = Math.floor(secondsElapsed / 60);
        return `${minutes} minutes ago`;
    } else if (secondsElapsed < 86400) {
        const hours = Math.floor(secondsElapsed / 3600);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(secondsElapsed / 86400);
        return `${days} days ago`;
    }
}