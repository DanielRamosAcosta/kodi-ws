import Connection from '../../src/Connection'

const eventTime = 600

describe('Connection#constructor', () => {
  context('with the default parameters', () => {
    it('should create a new instance and connect to kodi', done => {
      let connectSpy = spy()
      let errorSpy = spy()
      const connection = new Connection()
      connection.on('connect', connectSpy)
      connection.on('error', errorSpy)
      console.log(connection)
      setTimeout(() => {
        expect(connectSpy).to.have.been.calledOnce
        expect(errorSpy).to.not.have.been.called
        done();
      }, eventTime)
    })
  })

  context('with some correct parameters', () => {
    it('should create a new instance and connect to kodi', done => {
      let connectSpy = spy()
      let errorSpy = spy()
      const connection = new Connection('127.0.0.1', 9090, 400)
      connection.on('connect', connectSpy)
      connection.on('error', errorSpy)
      setTimeout(() => {
        expect(connectSpy).to.have.been.calledOnce
        expect(errorSpy).to.not.have.been.called
        expect(connection).to.have.property('timeout', 400)
        done()
      }, eventTime)
    })
  })

  context('Edge cases', () => {
    context('with wrong host', () => {
      it('should call error event', function(done) {
        this.timeout(30000)
        let connectSpy = spy()
        let errorSpy = spy()
        const connection = new Connection('192.168.100.100')
        connection.on('connect', connectSpy)
        connection.on('error', errorSpy)
        setTimeout(() => {
          expect(connectSpy).to.not.have.been.called
          expect(errorSpy).to.have.been.calledOnce
          expect(errorSpy.args[0][0].message).to.be.equal('Timed out')
          done()
        }, 22000)
      })
    })
  })
})

describe('Connection', () => {
  describe('#someMethod', () => {
    it('does something useful', done => {
      expect(false).to.equal(true)
      done()
    })
  })
})
