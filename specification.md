# Specification

## Version
The current version of the telemetry specification is v1. This will expand interatively.

## Event Structure

Specification for v1 is defined as such.
```
{
    "generator": , // Required. This is your event genrator, can be pwa, bff, pdf-parser
    "version": , // Required. Version of your generator
    "timestamp": , // Required. Timestamp for your event
    "actor": { // Who initiated the event
        "id": , // Required. Id of the actor. For ex: uid incase of an user
        "type": , // Required. User or System depending
    },
    "sid": , // Optional. session id of the requestor stamped by portal
    "did": , // Optional. uuid of the device, created during app installation
    "env": , // Required. Env you service is running on (eg. prod, dev)
    "eventId": , // Required. Id for your event
    "subEvent": , // Optional. 
    "timeTaken": , // Optional. Time taken for this event to complete (Ex. time taken in getting API response)
    "eventData": {} // Required. Data requried for that event.
}
```

## Event Data

### BFF
<!-- TO BE AUTO GENERATED -->