export const shouldResendRequest = (timeOfLastRetrieval: Date | undefined) => {
  let shouldResendRequest = false
  if (timeOfLastRetrieval) {
    const FIVE_MIN = 5 * 60 * 1000
    const timeSinceLastRequest = new Date().valueOf() - timeOfLastRetrieval.valueOf()
    shouldResendRequest = timeSinceLastRequest > FIVE_MIN
  }
  return shouldResendRequest
}
