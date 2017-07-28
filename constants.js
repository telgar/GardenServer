// Time
const MINUTE = 1000 * 60;
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24
const WEEK = DAY * 7

// Logging
const SAMPLE_RATE = 1000 * 60;
const LOG_LIMIT = DAY * 30;

module.exports = {
    // Time
    MINUTE: MINUTE,
    HOUR: HOUR,
    DAY: DAY,
    WEEK: WEEK,
    // Logging
    SAMPLE_RATE: SAMPLE_RATE,
    LOG_LIMIT: LOG_LIMIT
};