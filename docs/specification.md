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
    "actorId" : , // Required. Id of the actor who initiated the event. For ex: uid incase of an user
    "actorType": , // Required. User or System depending
    "sessionId": , // Optional. session id of the requestor stamped by portal
    "deviceId": , // Optional. uuid of the device, created during app installation
    "env": , // Required. Env you service is running on (e.g. prod, dev)
    "eventId": , // Required. Id for your event
    "event": , // Required. Name of your event
    "subEvent": , // Optional. 
    "timeTaken": , // Optional. Time taken for this event to complete (Ex. time taken in getting API response)
    // user-agent fields
    "os": , // Optional. (e.g. iOS, Android, Windows ...)
    "browser": , // Optional. (e.g. chrome, safari, firefox ...)
    "browserVersion": , Optional. If available, include the version of the browser.
    "deviceType: , // Optional. (e.g. mobile, tablet, desktop ...)
    "platform": Optional. Indicate the platform or framework used by the client, if relevant.
    "ip": , // Optional.
    "eventData": {} // Required. Data requried for that event.
}
```

Generated [`eventData`](./event-schema-docs.md) events schema.