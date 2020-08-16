# task-management-api

Task management REST api provides the core functionality for task management system.

## Prequises

The project depends on the following technologies:
- MongoDB 4.x
- Redis 4.x
- NodeJS 12.x LTS

## Setup

In order to setup the project first copy default configs through the following command:
```console
bash setup-config.sh
```

This command will generate a default `.env` file inside root directory with default config. You need to update the connection strings for mongo and redis and setup the google/github oauth tokens (only if you want oauth enabled).

Once you've setup the initial env file you can run the project by simply running the command below:
```console
node index.js
```

## API Docs

### POST /api/auth/login
#### Request
- Headers:
  - `Content-Type` - `application/json`
- Body:
  - `<Object>`
    - `email <String>` - User's email address
    - `password <String>` - User's plaintext password

#### Response
- `<Object>`
  - `token <String>` - JWT token
  - `expire <Number>` - Token expire time
  - `userId <String>` - User identifier

#### Example
```js
// Request
{
  "email": "krasniqi@gmail.com",
  "password": "12345678"
}

// Response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjMyOTNjMGMyZjMyNDM2NzhiMWM5NjMiLCJpYXQiOjE1OTc2MDM4NjE4NTR9.2Gw05hc8p-qZ0G-xByNJ-3LJNR1gb2HH9JtDCDiE6yo",
  "expire": 3600,
  "userId": "5f3293c0c2f3243678b1c963"
}
```

### POST /api/auth/register/admin
Registers the admin users to the system

#### Request
- Headers:
  - `Content-Type` - `application/json`
- Body:
  - `<Object>`
    - `email <String>` - User's email address
    - `password <String>` - User's plaintext password

#### Response
- `<Object>`
  - `token <String>` - JWT token
  - `expire <Number>` - Token expire time
  - `userId <String>` - User identifier

#### Example
```js
// Request
{
  "email": "blerta10@mail.com",
  "password": "12345678"
}

// Response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjMyOTNjMGMyZjMyNDM2NzhiMWM5NjMiLCJpYXQiOjE1OTc2MDM4NjE4NTR9.2Gw05hc8p-qZ0G-xByNJ-3LJNR1gb2HH9JtDCDiE6yo",
  "expire": 3600,
  "userId": "5f3293c0c2f3243678b1c963"
}
```

### POST /api/auth/register
Registers the normal users to the system

#### Request
- Headers:
  - `Content-Type` - `application/json`
- Body:
  - `<Object>`
    - `email <String>` - User's email address
    - `password <String>` - User's plaintext password

#### Response
- `<Object>`
  - `token <String>` - JWT token
  - `expire <Number>` - Token expire time
  - `userId <String>` - User identifier

#### Example
```js
// Request
{
  "email": "blerta10@mail.com",
  "password": "12345678"
}

// Response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjMyOTNjMGMyZjMyNDM2NzhiMWM5NjMiLCJpYXQiOjE1OTc2MDM4NjE4NTR9.2Gw05hc8p-qZ0G-xByNJ-3LJNR1gb2HH9JtDCDiE6yo",
  "expire": 3600,
  "userId": "5f3293c0c2f3243678b1c963"
}
```

### PATCH /api/auth/update/password

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
- Body:
  - `<Object>`
    - `password <String>` - User's new plaintext password

#### Response
No content

#### Example
```js
// Request
{
  "password": "12345678"
}

// Response
''
```

### GET /api/auth/google
Redirects to google oauth service inside the browser

### GET /api/auth/github
Redirects to github oauth service inside the browser

### GET /api/auth/info
Recieves user information

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
- `<Object>`
  - `_id <String>` - User id
  - `email <String>`
  - `role <String>` - User role
  - `googleId <String?>` - Google user id
  - `githubId <String?>` - Github user id
  - `__v <Number>` - Document version

#### Example
```js
// Request
'/api/auth/info'

// Response
{
  "email": "krasniqi@gmail.com",
  "_id": "5f3293c0c2f3243678b1c963",
  "role": "admin"
}
```

### POST /api/tasks
#### Request
- Headers:
  - `Content-Type` - `application/json`,
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token
- Body:
  - `<Object>`
    - `taskName <String>` - Task name
    - `date <Number>` - Task date (unix timestamp)
    - `duration <Number>` - Task duration (hours)

#### Response
- `<Object>`
  - `_id <String>` - Task unique id
  - `uid <String>` - User id
  - `taskName <String>` - Task name
  - `date <Number>` - Task date (unix timestamp)
  - `duration <Number>` - Task duration (hours)
  - `__v <Number>` - Document version

#### Example
```js
// Request
{
  "taskName": "some task name",
  "date": 1597598899551,
  "duration": 3
}

// Response
{
  "_id": "5f3985965b6f296badab554e",
  "uid": "5f3293c0c2f3243678b1c963",
  "taskName": "some task name",
  "date": 1597598899551,
  "duration": 3,
  "__v": 0
}
```

### PATCH /api/tasks/:id
#### Request
- Headers:
  - `Content-Type` - `application/json`,
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token
- Body:
  - `<Object>`
    - `taskName <String>` - Task name
    - `date <Number>` - Task date (unix timestamp)
    - `duration <Number>` - Task duration (hours)

#### Response
- `<Object>`
  - `_id <String>` - Task unique id
  - `uid <String>` - User id
  - `taskName <String>` - Task name
  - `date <Number>` - Task date (unix timestamp)
  - `duration <Number>` - Task duration (hours)
  - `__v <Number>` - Document version

#### Example
```js
// Request
{
  "taskName": "some task name",
  "date": 1597598899551,
  "duration": 3
}

// Response
{
  "_id": "5f3985965b6f296badab554e",
  "uid": "5f3293c0c2f3243678b1c963",
  "taskName": "some task name",
  "date": 1597598899551,
  "duration": 3,
  "__v": 0
}
```

### GET /api/tasks
#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token
- Query string:
  - `from <Number?>` - Optional, filter from date  
  - `to <Number?>` - Optional, filter to date  

#### Response
- `<Array>`
  - `0 <Object>`
    - `_id <String>` - Task unique id
    - `uid <String>` - User id
    - `taskName <String>` - Task name
    - `date <Number>` - Task date (unix timestamp)
    - `duration <Number>` - Task duration (hours)
    - `__v <Number>` - Document version

#### Example
```js
// Request
`/api/tasks`

// Response
[
  {
    "_id": "5f3985965b6f296badab554e",
    "uid": "5f3293c0c2f3243678b1c963",
    "taskName": "some task",
    "date": 1597598899551,
    "duration": 3,
    "__v": 0
  },
  ...
]
```

### GET /api/tasks/export
Same as `GET /api/tasks`, besides it downloads a csv file automatically

### GET /api/tasks/:id
#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
- `<Object>`
  - `_id <String>` - Task unique id
  - `uid <String>` - User id
  - `taskName <String>` - Task name
  - `date <Number>` - Task date (unix timestamp)
  - `duration <Number>` - Task duration (hours)
  - `__v <Number>` - Document version

#### Example
```js
// Request
`/api/tasks/5f3985965b6f296badab554e`

// Response
{
  "_id": "5f3985965b6f296badab554e",
  "uid": "5f3293c0c2f3243678b1c963",
  "taskName": "some task",
  "date": 1597598899551,
  "duration": 3,
  "__v": 0
}
```

### DELETE /api/tasks/:id
#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
No content

#### Example
```js
// Request
`/api/tasks/5f3985965b6f296badab554e`

// Response
''
```

### POST /api/admin/users
Registers the user to the system

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token
- Body:
  - `<Object>`
    - `email <String>` - User's email address
    - `password <String>` - User's plaintext password
    - `role <String>` - User role

#### Response
- `<Object>`
  - `_id <String>` - User id
  - `email <String>`
  - `role <String>` - User role
  - `googleId <String?>` - Google user id
  - `githubId <String?>` - Github user id
  - `__v <Number>` - Document version

#### Example
```js
// Request
{
  "email": "someone4@something.com",
  "password": "12345678",
  "role": "admin"
}

// Response
{
  "_id": "5f398bed8ee78678112b86b0",
  "email": "someone4@something.com",
  "role": "admin",
  "__v": 0
}
```

### PATCH /api/admin/users/:id

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token
- Body:
  - `<Object>`
    - `email <String>` - User's email address
    - `role <String>` - User role

#### Response
- `<Object>`
  - `_id <String>` - User id
  - `email <String>`
  - `role <String>` - User role
  - `googleId <String?>` - Google user id
  - `githubId <String?>` - Github user id
  - `__v <Number>` - Document version

#### Example
```js
// Request
{
  "email": "someone4@something.com",
  "role": "admin"
}

// Response
{
  "_id": "5f398bed8ee78678112b86b0",
  "email": "someone4@something.com",
  "role": "admin",
  "__v": 0
}
```

### GET /api/admin/users

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
- `<Array>`
  - `0 <Object>`
    - `_id <String>` - User id
    - `email <String>`
    - `role <String>` - User role
    - `googleId <String?>` - Google user id
    - `githubId <String?>` - Github user id
    - `__v <Number>` - Document version

#### Example
```js
// Request
'/api/admin/users'

// Response
[
  {
    "_id": "5f28262a6497c81be4c7c229",
    "email": "blerta7krasniqi@gmail.com",
    "role": "admin",
    "githubId": "27725773",
    "googleId": "101731926790480914218",
    "__v": 0
  },
  ...
]
```

### GET /api/admin/users/:id

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
- `<Object>`
  - `_id <String>` - User id
  - `email <String>`
  - `role <String>` - User role
  - `googleId <String?>` - Google user id
  - `githubId <String?>` - Github user id
  - `__v <Number>` - Document version

#### Example
```js
// Request
'/api/admin/users/5f28262a6497c81be4c7c229'

// Response
{
  "_id": "5f28262a6497c81be4c7c229",
  "email": "blerta7krasniqi@gmail.com",
  "role": "admin",
  "githubId": "27725773",
  "googleId": "101731926790480914218",
  "__v": 0
}
```

### DELETE /api/admin/users/:id
#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
No content

#### Example
```js
// Request
`/api/admin/users/5f28262a6497c81be4c7c229`

// Response
''
```

### GET /info
Returns server info

#### Request
- Headers:
  - `Content-Type` - `application/json`
  - `Authorization` - JWT bearer token
  - `X-OAUTH-TOKEN` - OAuth token, use either authorization or x-oauth-token

#### Response
- `<Object>`
  - `serverTime <String>` - Server ISO date/time

#### Example
```js
// Request
`/info`

// Response
{
  "serverTime": "2020-08-16T19:52:22.695Z"
}
```
