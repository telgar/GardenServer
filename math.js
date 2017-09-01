function roundToClosestMinute (timestamp, closestMinute) {

    return new Date(timestamp).setMinutes(Math.round(new Date(timestamp).getMinutes() / closestMinute) * closestMinute)
}

function roundToClosest(number, closest) {

    let result = number / closest * closest;

    return +result.toFixed(1);
}

module.exports = {
    roundToClosestMinute: roundToClosestMinute,
    roundToClosest: roundToClosest
}