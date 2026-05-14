export const consumeIteratorWithTimeout = (
    iterator,
    timeoutInSeconds,
    callback,
    intervalInMilliseconds = 150,
) => {
    const startTime = Date.now();
    const timeoutInMilliseconds = timeoutInSeconds * 1000;

    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= timeoutInMilliseconds) {
            clearInterval(interval);
            return;
        }

        const nextValue = iterator.next().value;

        callback(nextValue);
    }, intervalInMilliseconds);
};
