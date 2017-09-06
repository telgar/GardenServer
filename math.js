function roundToClosestMinute (timestamp, closestMinute) {

    var coeff = 1000 * 60 * closestMinute;
    return new Date(Math.round(new Date(timestamp).getTime() / coeff) * coeff);    
    //return new Date(timestamp).setMinutes(Math.round(new Date(timestamp).getMinutes() / closestMinute) * closestMinute)
}

function roundToClosest(number, closest) {

    let result = number / closest * closest;

    return +result.toFixed(1);
}

module.exports = {
    roundToClosestMinute: roundToClosestMinute,
    roundToClosest: roundToClosest
}