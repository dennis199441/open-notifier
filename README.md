# open-notifier
This is a proxy server for email/SMS deliveries. Currently, we support AWS SES and SendGrid for email messages and Twilio for SMS messages.

## Email
### Heartbeat
#### Request
`GET /api/v1/email/heartbeat`
#### Response
```
Email API is still alive!
```

### Send
#### Request
`POST /api/v1/email/send`

```
{
    "recipient": "a@example.com",
    "subject": "test 1",
    "text": "this is test email 1.",
    "html": "<b>Testing 1</b>"
}
```

#### Response
```
{
    "msg": "200 Send email success.",
    "me": "open-notifier",
    "data": {
        // SES/SendGrid response
    }
}
```

### SendBatch
#### Request
`POST /api/v1/email/send_batch`

```
[
    {
        "recipient": "a@example.com",
        "subject": "test batch 1",
        "text": "this is test batch email 1.",
        "html": "<b>Testing batch 1</b>"
    },
    {
        "recipient": "b@example.com",
        "subject": "test batch 1",
        "text": "this is test batch email 1.",
        "html": "<b>Testing batch 1</b>"
    }
]
```
#### Response
```
{
    "msg": "200 Batch send email success.",
    "me": "open-notifier",
    "data": [
        {
            // SES/SendGrid response
        },
        ...
    ]
}
```

## SMS
### Heartbeat
#### Request
`GET /api/v1/sms/heartbeat`
#### Response
```
Sms API is still alive!
```

### Send
#### Request
`POST /api/v1/sms/send`

```
{
    "recipient": "+9999999999",
    "body": "test sms 1"
}
```

#### Response
```
{
    "msg": "200 Send sms success.",
    "me": "open-notifier",
    "data": {
        // Twilio response
    }
}
```

### SendBatch
#### Request
`POST /api/v1/sms/send_batch`

```
[
    {
        "recipient": "+9999999999",
        "body": "test batch sms 1"
    },
    ...
]
```
#### Response
```
{
    "msg": "200 Batch send sms success.",
    "me": "open-notifier",
    "data": [
        {
            // Twilio response
        },
        ...
    ]
}
```

## Run on local
```
cp variables.env.tmp variables.env

// update variables.env

docker-compose build

docker-compose up -d
```

## Run on Kubernetes
```
cd kubernetes

kubectl apply -f app-deployment.yaml
```
