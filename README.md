# ObservableSchema
When using `@colyseus/schema` with Vue.js, there is very little integration and things quickly become complex. This package allows you to create an observable state from your room state. Any changes to your room state from the server will be synchronized and available to your Vue code immediately.

## Installation
```
> yarn add observableschema
```

## Usage
```js
import Vue from 'vue'
import * as Colyseus from "colyseus.js"

import { Bind } from 'observableschema'


export default async () => {

  const vueState = Vue.observable({ state: {} })

  const client = new Colyseus.Client('ws://localhost:2567')

  const room = await this.client.joinOrCreate("my_room")

  room.onStateChange.once(state => {
    Bind(vueState.state, state)
  })

  Vue.prototype.$state = vueState.state
}
```

```html
<template>
  <div>
    <span>{{ $state.user }}</span>
  </div>
</template>
```

## Oddities
Due to the way Vue Observables seem to integrate with the Vue frontend, you cannot pass a 'whole' observable to the handler. To ensure updates are always captured, create an observable with a value and then only bind to that value. This is demonstrated in the usage example above.
