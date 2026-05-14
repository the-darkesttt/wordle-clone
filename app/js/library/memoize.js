export const memoize = (fn, options = {}) => {
    const cache = new Map();

    const maxSize = options.maxSize || Infinity;
    const strategy = options.strategy || "LRU";
    const ttl = options.ttl || null;
    const customEvict = options.customEvict || null;

    const getKey = (args) => {
        return JSON.stringify(args);
    };

    const isExpired = (entry) => {
        if (!ttl) {
            return false;
        }
        return Date.now() - entry.time > ttl;
    };

    const removeExpired = () => {
        for (const [key, entry] of cache) {
            if (isExpired(entry)) {
                console.log("Cache expired:", key);
                cache.delete(key);
            }
        }
    };

    const removeLRU = () => {
        const firstKey = cache.keys().next().value;
        console.log("Cache evicted by LRU:", firstKey);
        cache.delete(firstKey);
    };

    const removeLFU = () => {
        let leastUsedKey = null;
        let leastUses = Infinity;

        for (const [key, entry] of cache) {
            if (entry.uses < leastUses) {
                leastUses = entry.uses;
                leastUsedKey = key;
            }
        }

        console.log("Cache evicted by LFU:", leastUsedKey);
        cache.delete(leastUsedKey);
    };

    const removeCustom = () => {
        if (typeof customEvict === "function") {
            const keyToRemove = customEvict(cache);
            console.log("Cache evicted by custom policy:", keyToRemove);
            cache.delete(keyToRemove);
        } else {
            removeLRU();
        }
    };

    const removeExtraItems = () => {
        while (cache.size > maxSize) {
            if (strategy === "LFU") {
                removeLFU();
            } else if (strategy === "CUSTOM") {
                removeCustom();
            } else {
                removeLRU();
            }
        }
    };

    return (...args) => {
        const key = getKey(args);

        removeExpired();

        if (cache.has(key)) {
            const cachedItem = cache.get(key);

            if (!isExpired(cachedItem)) {
                cachedItem.uses++;
                cache.delete(key);
                cache.set(key, cachedItem);
                console.log("Cache hit:", key);
                console.log("Cache size:", cache.size);

                return cachedItem.value;
            }
        }

        console.log("Cache miss:", key);
        const result = fn(...args);

        cache.set(key, {
            value: result,
            time: Date.now(),
            uses: 1,
        });

        console.log("Cache saved:", key);
        console.log("Cache size:", cache.size);

        removeExtraItems();
        return result;
    };
};
