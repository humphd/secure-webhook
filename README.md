# Secure-Webhook

Securely call Webhook endpoint after your Action finishes

## Usage

Sending a json string, ``url``, and ``hmacSecret`` are required fields, and ``data`` is optional.

```yaml
- name: Webhook
  uses: navied/secure-actions-webhook@0.2.0
  with:
    url: https://example.com
    data: '{ "example": "data" }'
    hmacSecret: ${{ secrets.HMAC_SECRET }}
```

The request will include the header `X-Hub-Signature`, which is the hmac signature of the raw body just like in Github webhooks, and also the header `X-Hub-SHA` which is the SHA of the commit running the github action.

Verify it on your endpoint for integrity.

## Credit

Thanks to https://github.com/koraykoska/secure-actions-webhook for providing the base signature generation code. 