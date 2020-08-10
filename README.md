# ObservableSchema

## Installation
```
> yarn add obserableschema
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

  Vue.prototype.$state = vueState
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
Due to the way Vue Observables seem to integrate with the Vue frontend, you cannot pass a 'whole' observable to the handler. To ensure updates are always captured, ensure you create an observable with a value, then only bind to that value. This is demonstrated in the usage example above.
