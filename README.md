Protanki Resource Server
---

This is typescript implementation of protanki resource server.  
It has own resource cache, and automatically downloads resources from original res. server if it cant found them.

---
## Prerequisites
You need to install typescript as global dependency in order to build project
```shell
$ npm i -g typescript
```

---
## Setup
1. Clone repository
```shell
$ git clone https://github.com/Luminate-D/protanki-resource-server.git
$ cd protanki-resource-server
```
2. Install dependencies & build

```shell
$ npm install
$ tsc
```

---
## Running
```shell
$ node build/app
```

---

You can modify resources as you want or create new, but make sure to invalidate your client cache before opening an issue.