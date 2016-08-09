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
      err.message = `Socket error: ${err.message}`
      this.emit('error', err)
    }

    setTimeout(() => {
      if (this.socket.readyState === CONNECTING) {
        this.emit('error', new Error('Timed out'))
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
}
