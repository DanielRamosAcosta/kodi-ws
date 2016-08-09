import { EventEmitter } from 'events'
const WebSocket = window.WebSocket

const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

export default class Connection extends EventEmitter {
  constructor (host, port) {
    super()
    this.socket = new WebSocket(`ws://${host}:${port}/jsonrpc`)
    this.closed = true
    this.timeout = 500
    this.init()
  }

  init () {
    this.socket.onopen = () => {
      this.emit('connect')
    }

    this.socket.onclose = () => {
      this.emit('close')
    }

    this.socket.onerror = err => {
      this.emit('error', err)
    }

    setTimeout(() => {
      if (this.socket.readyState === CONNECTING) {
        this.emit('error', new Error('Timed out'))
      }
    }, this.timeout)
  }
}
