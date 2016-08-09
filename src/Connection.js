import { EventEmitter } from 'events'
import jrpc from 'jrpc-schema'
import has from 'has-value'
import set from 'set-value'
const WebSocket = window.WebSocket

const CONNECTING = 0
// const OPEN = 1
// const CLOSING = 2
// const CLOSED = 3

export default class Connection extends EventEmitter {
  constructor (host = '127.0.0.1', port = 9090, timeout = 500) {
    super()
    this.socket = new WebSocket(`ws://${host}:${port}/jsonrpc`)
    this.closed = true
    this.timeout = timeout
    this.init()
  }

  init () {
    this.socket.onopen = () => {
      this.loadSchema().then(schema => {
        this.socket.onmessage = data => {
          console.log(data)
        }

        this.schema = new jrpc.Schema(schema, this.socket::this.socket.send)

        this.socket.onmessage = ({ data }) => {
          try {
            this.schema.handleResponse(data)
          } catch (err) {
            err.message = `Failed to handle response: ${err.message}`
            this.emit('error', err)
          }
        }

        this.addShortcuts()
        this.closed = false

        this.emit('connect')
      }).catch(err => {
        err.message = `Schema error: ${err.message}`
        this.emit('error', err)
      })
    }

    this.socket.onclose = () => {
      this.close = true
      this.emit('close')
    }

    this.socket.onerror = err => {
      if (!this.socketTimedOut) {
        console.log(err)
        this.emit('error')
      }
    }

    setTimeout(() => {
      if (this.socket.readyState === CONNECTING) {
        this.emit('error', new Error('Timed out'))
        this.socketTimedOut = true
      }
    }, this.timeout)
  }

  loadSchema () {
    const fetchSchema = jrpc.run('JSONRPC.Introspect', [], this.socket::this.socket.send)
    this.socket.onmessage = ({ data }) => fetchSchema.handle(data)

    return fetchSchema.then(schema => {
      this.socket.onmessage = null
      return schema
    })
  }

  addShortcuts () {
    let { methods, notifications } = this.schema.schema

    Object.keys(methods).forEach(method => {
      if (!has(this, method)) {
        set(this, method, methods[method])
      }
    })

    Object.keys(notifications).forEach(method => {
      if (!has(this, method)) {
        set(this, method, notifications[method])
      }
    })
  }

  batch () {
    const rawBatch = this.schema.batch()
    const batch = {
      send: rawBatch.send.bind(rawBatch)
    }

    let { methods } = rawBatch.schema

    Object.keys(methods).forEach(method => {
      if (!has(batch, method)) {
        set(batch, method, methods[method])
      }
    })

    return batch
  }

  run (method) {
    if (!this.schema) throw new Error('Connection not initialized!')

    const args = Array.prototype.slice.call(arguments, 1)
    const methods = this.schema.schema.methods

    return methods[method].apply(methods, args)
  }

  notification (method) {
    return new Promise((resolve, reject) => {
      if (!this.schema) return reject('Connection not initialized!')

      this.schema.schema.notifications[method](resolve)
    })
  }
}
