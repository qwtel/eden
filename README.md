# Eden
> Data is Bliss

Simple data conversion service to and from common data formats, such as JSON, YAML, TOML, EDN, etc.

## Usage
Eden uses standard HTTP headers for content negotiation. `Accept` defines the return format, while `Content-Type` specifics the source format. E.g.:

```bash
curl -H "Content-Type: application/yaml" --data-binary "@serverless.yml" -H "Accept: application/edn" https://2drrpzm6i9.execute-api.us-east-1.amazonaws.com/dev
```

Converts from:

```yml
service: eden
provider:
  name: aws
  runtime: nodejs8.10
functions:
  eden:
    handler: index.handler
    events:
      - http: POST /
      - http: 'POST {proxy+}'
plugins:
  - serverless-offline
```

to 

```clj
{:service "eden",
 :provider {:name "aws", :runtime "nodejs8.10"},
 :functions
 {:eden
  {:handler "index.handler",
   :events [{:http "POST /"} {:http "POST {proxy+}"}]}},
 :plugins ["serverless-offline"]}
```
