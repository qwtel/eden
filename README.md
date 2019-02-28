# Eden

> Data is Bliss

Simple data conversion API to and from common data formats, such as JSON, YAML, TOML, EDN, etc.

## Usage

```bash
curl --data-binary "@serverless.yml" "https://2drrpzm6i9.execute-api.us-east-1.amazonaws.com/dev?from=yaml&to=edn"
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

It also supports standard HTTP headers for content negotiation. `Accept` defines the return format, while `Content-Type` specifics the source format:

```bash
curl --data-binary "@serverless.yml" -H "Content-Type: application/yaml" -H "Accept: application/edn" https://2drrpzm6i9.execute-api.us-east-1.amazonaws.com/dev
```

## Proxy

Eden can call other APIs and return their result in any format:

```js
const EDEN = 'https://2drrpzm6i9.execute-api.us-east-1.amazonaws.com/dev';
const url = encodeURIComponent('https://jsonplaceholder.typicode.com/todos/1');

fetch(`${EDEN}/fetch?url=${url}&from=json&to=edn`)
  .then(response => response.text())
  .then(text => console.log(text));
```

```clj
{:userId 1, :id 1, :title "delectus aut autem", :completed false}
```

## CLI
Comes with a minimal CLI:

    eden serverless.yml -t edn > serverless.edn

Or via standard input

    cat serverless.yml | eden -f yaml -t edn > serverless.edn

## API
### Parameters (Alias)

* `parse` (`p`, `from`, `f`)
* `stringify` (`s`, `to`, `t`)

### Supported Formats
* `json` (`js`)
* `yaml` (`yml`)
* `toml`
* `edn`
* `csv`
* `xml`
* `url`
