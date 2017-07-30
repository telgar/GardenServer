function roundToClosestMinute (timestamp, closestMinute) {

    return new Date(timestamp).setMinutes(Math.round(new Date(timestamp).getMinutes() / 60) * 60)
}

function roundToClosest(number, closest) {

    return Math.round(number / closest * closest);
}

function percentile(arr, p) {

    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    arr.sort(function (a, b) { return a - b; });

    var index = (arr.length - 1) * p
    lower = Math.floor(index),
    upper = lower + 1,
    weight = index % 1;

    if (upper >= arr.length) return arr[lower];

    return arr[lower] * (1 - weight) + arr[upper] * weight;
}

module.exports = {
    roundToClosestMinute: roundToClosestMinute,
    roundToClosest: roundToClosest,
    percentile: percentile
}