export const shouldResendRequest = (timeOfLastRetrieval) => {
    let shouldResendRequest = false;
    if (timeOfLastRetrieval) {
        const FIVE_MIN = 5 * 60 * 1000;
        const now = new Date();

        const timeSinceLastRequest = now - timeOfLastRetrieval;
        shouldResendRequest = timeSinceLastRequest > FIVE_MIN;
    }
    return shouldResendRequest;
}