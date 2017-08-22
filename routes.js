const express = require('express')
const cors = require('cors')
const low = require('lowdb')
const _ = require('lodash')
const fileAsync = require('lowdb/lib/storages/file-async')
const moment = require('moment');

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
            .take(100)
            .map((o) => { return { 
                label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), 
                log: o.log
            }})
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
                label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), 
                celsius: math.roundToClosest(o.celsius, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil
    server.get('/soil1', (req, res) => {
        let soilDb = low('../soil1.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { 
                label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), 
                moisture: math.roundToClosest(o.moisture, 100) } })
            .value()

        res.send(response)
    })

    // GET /soil
    server.get('/soil2', (req, res) => {
        let soilDb = low('../soil2.json', {
            storage: require('lowdb/lib/storages/file-async')
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { 
                label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 5)).format('h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 5)).format('h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 5)).format('h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 30)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 30)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 30)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
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
            .groupBy((o) => moment(math.roundToClosestMinute(o.timestamp, 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { 
                label: o.label, 
                moisture: math.roundToClosest(_.mean(o.values.map(x => x.moisture)), 100) } })
            .value()    

        res.send(response)
    })
}