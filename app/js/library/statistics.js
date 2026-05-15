const STATS_STORAGE_KEY = "wordleStats";

const createDefaultStats = () => {
    return {
        played: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        },
    };
};

export const getStats = () => {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (!savedStats) {
        return createDefaultStats();
    }
    return JSON.parse(savedStats);
};

export const saveStats = (stats) => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
};

export const saveGameResult = (isWin, guessesCount = null) => {
    const stats = getStats();
    stats.played++;
    if (isWin) {
        stats.wins++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.maxStreak) {
            stats.maxStreak = stats.currentStreak;
        }
        if (guessesCount !== null) {
            stats.guessDistribution[guessesCount]++;
        }
    } else {
        stats.losses++;
        stats.currentStreak = 0;
    }
    saveStats(stats);
    console.log("Stats saved:", stats);
};

export const resetStats = () => {
    const defaultStats = createDefaultStats();
    saveStats(defaultStats);
    console.log("Stats reset:", defaultStats);
};
