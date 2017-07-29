const express = require('express')
const cors = require('cors')
const low = require('lowdb')
const _ = require('lodash')
const fileAsync = require('lowdb/lib/storages/file-async')
const moment = require('moment');

const constants = require('./constants');

/* Start database using file-async storage, and initialize
let tempDb = low('../temperature.json', {
  storage: fileAsync.read
})
tempDb.defaults({ temperature: [] }).write()

const soildDb = low('../soil.json', {
  storage: fileAsync.read
})
soildDb.defaults({ soil: [] }).write()
*/

exports.setRoutes = function(server) {

    // GET /temperature
    server.get('/temperature', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), celsius: Math.round(o.celsius * 100) / 100 } })
            .value()

        res.send(response)
    })

    // GET /soil
    server.get('/soil', (req, res) => {
        let soildDb = low('../soil.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })        
        const response = soildDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(1)
            .map((o) => { return { label: moment(o.timestamp).format('MMMM Do, h:mm:ss a'), moisture: Math.round(o.moisture * 100) / 100 } })
            .value()

        res.send(response)
    })

    // GET /temperature/hour
    server.get('/temperature/hour', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.HOUR / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 5) * 5)).format('h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, celsius: Math.round(_.meanBy(o.values, 'celsius') * 100) / 100 } })    
            .value()

        res.send(response)
    })

    // GET /soil/hour
    server.get('/soil/hour', (req, res) => {
        let soildDb = low('../soil.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.HOUR / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 5) * 5)).format('h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, moisture: Math.round(_.meanBy(o.values, 'moisture') * 100) / 100 } })    
            .value()

        res.send(response)
    })

    // GET /temperature/day
    server.get('/c', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.DAY / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 30) * 30)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, celsius: Math.round(_.meanBy(o.values, 'celsius') * 100) / 100 } })   
            .value()

        res.send(response)
    })

    // GET /soil/day
    server.get('/soil/day', (req, res) => {
        let soildDb = low('../soil.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.DAY / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 30) * 30)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, moisture: Math.round(_.meanBy(o.values, 'moisture') * 100) / 100 } })   
            .value()

        res.send(response)
    })

    // GET /temperature/week
    server.get('/temperature/week', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.WEEK / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 60) * 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, celsius: Math.round(_.meanBy(o.values, 'celsius') * 100) / 100 } })   
            .value()

        res.send(response)
    })

    // GET /soil/week
    server.get('/soil/week', (req, res) => {
        let soildDb = low('../soil.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .take(constants.WEEK / constants.SAMPLE_RATE)
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 60) * 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, moisture: Math.round(_.meanBy(o.values, 'moisture') * 100) / 100 } })   
            .value()

        res.send(response)
    })

    // GET /temperature/all-time
    server.get('/temperature/all-time', (req, res) => {
        let tempDb = low('../temperature.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })
        const response = tempDb.get('temperature')
            .sortBy(['timestamp'])
            .reverse()
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 60) * 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, celsius: Math.round(_.meanBy(o.values, 'celsius') * 100) / 100 } })   
            .value()    

        res.send(response)
    })

    // GET /soil/all-time
    server.get('/soil/all-time', (req, res) => {
        let soildDb = low('../soil.json', {
            storage: fileArequire('lowdb/lib/storages/file-async').read
        })        
        const response = soilDb.get('soil')
            .sortBy(['timestamp'])
            .reverse()
            .groupBy((o) => moment(new Date(o.timestamp).setMinutes(Math.round(new Date(o.timestamp).getMinutes() / 60) * 60)).format('MMMM Do, h:mm a'))
            .toPairs()
            .map((o) => { return _.zipObject(["label", "values"], o); } )
            .map((o) => { return { label: o.label, moisture: Math.round(_.meanBy(o.values, 'moisture') * 100) / 100 } })   
            .value()    

        res.send(response)
    })
}