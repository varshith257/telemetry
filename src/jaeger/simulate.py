import json
import time

# Get the current time in nanoseconds
current_time = int(time.time() * 1e9)

spans = []
for i in range(1024):
    span = {
        "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
        "spanId": f"00f067aa0ba902b{i:03}",
        "name": f"example-span-{i+1}",
        "startTimeUnixNano": current_time + i * 1000,
        "endTimeUnixNano": current_time + i * 2000,
        "attributes": [
            {"key": "http.method", "value": {"stringValue": "GET" if i % 2 == 0 else "POST"}}
        ]
    }
    spans.append(span)

data = {
    "resourceSpans": [
        {
            "resource": {
                "attributes": [
                    {"key": "service.name", "value": {"stringValue": "example-service"}}
                ]
            },
            "instrumentationLibrarySpans": [
                {"spans": spans}
            ]
        }
    ]
}

# Write the JSON data to a file
with open("payload.json", "w") as f:
    json.dump(data, f, indent=2)
