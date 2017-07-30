function roundToClosestMinute (timestamp, closestMinute) {

    return new Date(timestamp).setMinutes(Math.round(new Date(timestamp).getMinutes() / closestMinute) * closestMinute)
}

function roundToClosest(number, closest) {

    return Math.round(number / closest * closest);
}

module.exports = {
    roundToClosestMinute: roundToClosestMinute,
    roundToClosest: roundToClosest
}