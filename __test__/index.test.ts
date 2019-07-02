import { Singleflight } from '../src'

it('should work well', async () => {
  const mockRes = 'mock res'
  const fn = jest.fn().mockResolvedValue(mockRes)

  const sf = new Singleflight()

  for (let i = 0; i < 10; i += 1) {
    sf.do('test', fn).then(res => expect(res).toBe(mockRes))
  }

  expect(fn).toBeCalledTimes(1)
})

it('all should got error', async () => {
  const mockErr = new Error('mock error')
  const fn = jest.fn().mockRejectedValue(mockErr)

  const sf = new Singleflight()

  for (let i = 0; i < 10; i += 1) {
    sf.do('test', fn).catch(err => expect(err).toBe(mockErr))
  }

  expect(fn).toBeCalledTimes(1)
})
