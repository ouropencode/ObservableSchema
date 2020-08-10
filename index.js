import Vue from 'vue'
import { MapSchema, ArraySchema } from "@colyseus/schema"

const bindOrSet = (state, key, value) => {
  if(typeof value == 'object') {
    Vue.set(state, key, {})
    Bind(state[key], value)
  } else {
    Vue.set(state, key, value)
  }
}

const handleValueChange = (state, obj) => {
  obj.onChange = (changes) => {
    changes.forEach(change => {
      if(typeof change.value == 'number')
        Vue.set(state, change.field, new Number(change.value))
      else if(typeof change.value == 'string' || typeof change.value == 'boolean')
        Vue.set(state, change.field, change.value)
    })
  }
}

const bindMapSchema = (state, map) => {
  for(let key in map)
    bindOrSet(state, key, map[key])

  map.onAdd = (obj, key) => bindOrSet(state, key, obj)

  map.onRemove = (obj, key) => Vue.delete(state, key)

  map.onChange = (obj, key) => {
    if(typeof obj == 'object') return
    Vue.set(state, key, obj)
  }
}

const bindArraySchema = (state, arr) => {
  for(let i = 0; i < arr.length; i++)
    bindOrSet(state, i, arr[i])

  arr.onAdd = (obj, key) => bindOrSet(state, key, obj)

  arr.onRemove = (obj, key) => Vue.delete(state, key)

  arr.onChange = (obj, key) => {
    if(typeof obj == 'object') return
    Vue.set(state, key, obj)
  }
}

const bindObject = (state, obj) => {
  Bind(state, obj)
  handleValueChange(state, obj)
}

export const Bind = (hostState, source) => {
  for(let key in source) {
    let item = source[key]
    if(typeof item == 'function') continue

    if(item === undefined) {
      Vue.set(hostState, key, item)
    } else if(typeof item == 'string' || typeof item == 'number' || typeof item == 'boolean') {
      Vue.set(hostState, key, item)
    } else if(item.constructor == MapSchema) {
      Vue.set(hostState, key, {})
      bindMapSchema(hostState[key], item)
    } else if(item.constructor == ArraySchema) {
      Vue.set(hostState, key, [])
      bindArraySchema(hostState[key], item)
    } else if(typeof item == 'object') {
      Vue.set(hostState, key, {})
      bindObject(hostState[key], item)
    }
  }

  handleValueChange(hostState, source)
}

export const mapState = ($state, keys = []) => {
  const mapped = {}
  keys.forEach(key => {
    mapped[key] = () => {
      const data = $state[key]
      if(data)
        return data
      return undefined
    }
  })
  return mapped
}
