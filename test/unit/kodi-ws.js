import KodiWS from '../../src/kodi-ws'
import Connection from '../../src/Connection'

describe('KodiWS', () => {
  context('when the host and port are correct', () => {
    it('resolves an instance of Connection', done => {
      KodiWS('127.0.0.1', 9090).then(connection => {
        expect(connection).to.be.an.instanceof(Connection)
        done()
      })
    })
  })
  context('when an error occurs', () => {
    it('rejects the promise', done => {
      expect(KodiWS('192.168.100.100', 9090)).to.be.rejectedWith('Error: Timed out').and.notify(done)
    })
  })
})
