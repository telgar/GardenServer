const express = require('express')
const cors = require('cors')
const low = require('lowdb')
const _ = require('lodash')
const fileAsync = require('lowdb/lib/storages/file-async')
const moment = require('moment-timezone');

const constants = require('./constants');
const math = require('./math');

exports.setRoutes = function(server) {

    // GET /logs
    server.get('/logs', (req, res) => {
        let tempDb = low('../logs.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('logs')
            .sortBy(['timestamp'])
            .reverse()
            .take(100)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                log: o.log
            }})
            .value()

        res.send(response)
    })

    // GET /time
    server.get('/time', (req, res) => {
        
        const response = moment(new Date()).tz("Europe/London").format('MMMM Do, h:mm:ss a');

        res.send(response)
    })

    // GET /watered
    server.get('/watered', (req, res) => {
        let wateringDb = low('../watering.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = wateringDb.get('logs')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a') })
            .value()

        res.send(response)
    })

    // GET /temperature
    server.get('/temperature', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                celsius: math.roundToClosest(o.celsius, 100) } })
            .value()

        res.send(response)
    })

    // GET /temperatures
    server.get('/temperatures', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(60 * 12)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                celsius: math.roundToClosest(o.celsius, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil1
    server.get('/soil1', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                moisture: math.roundToClosest(o.moisture, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil1s
    server.get('/soil1s', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(60 * 12)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                moisture: math.roundToClosest(o.moisture, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil2
    server.get('/soil2', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                moisture: math.roundToClosest(o.moisture, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil2s
    server.get('/soil2s', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(60 * 12)
            .map((o) => { return { 
                label: moment(o.timestamp).tz("Europe/London").format('MMMM Do, h:mm:ss a'), 
                timestamp: o.timestamp,
                moisture: math.roundToClosest(o.moisture, 100) } })
            .value()

        res.send(response)
    })

    // GET /temperature/hour
    server.get('/temperature/hour', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.HOUR / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 5))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 5)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 5),
                celsius: math.roundToClosest(_.mean(o.values.map(x => x.celsius)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/hour
    server.get('/soil1/hour', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.HOUR / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 5))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 5)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 5),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/hour
    server.get('/soil2/hour', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.HOUR / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 5))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 5)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 5),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /temperature/day
    server.get('/temperature/day', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.DAY / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 30))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 30)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 30),
                celsius: math.roundToClosest(_.mean(o.values.map(x => x.celsius)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/day
    server.get('/soil1/day', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.DAY / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 30))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 30)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 30),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/day
    server.get('/soil2/day', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.DAY / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 30))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 30)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 30),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /temperature/week
    server.get('/temperature/week', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.WEEK / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                celsius: math.roundToClosest(_.mean(o.values.map(x => x.celsius)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/week
    server.get('/soil1/week', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.WEEK / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /soil/week
    server.get('/soil2/week', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.WEEK / constants.SAMPLE_RATE)
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()

        res.send(response)
    })

    // GET /temperature/all-time
    server.get('/temperature/all-time', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: require('lowdb/lib/storages/file-async')
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                celsius: math.roundToClosest(_.mean(o.values.map(x => x.celsius)), 100) } })
            .value()    

        res.send(response)
    })

    // GET /soil/all-time
    server.get('/soil1/all-time', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()    

        res.send(response)
    })

    // GET /soil/all-time
    server.get('/soil2/all-time', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .groupBy((o) => math.roundToClosestMinute(o.timestamp, 60))            
            .toPairs()           
            .map((o) => { return _.zipObject(["timestamp", "values"], o); } )
            .map((o) => { return { 
                label: moment(math.roundToClosestMinute(new Date(o.timestamp), 60)).tz("Europe/London").format('MMMM Do, h:mm a'),
                timestamp: math.roundToClosestMinute(new Date(o.timestamp), 60),
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()    

        res.send(response)
    })
}