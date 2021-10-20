import { Singleflight } from '../src'

it('should work well', async () => {
  const mockRes = 'mock res'
  const fn = jest.fn().mockResolvedValue(mockRes)
  const fnSync = jest.fn().mockReturnValue(mockRes)

  const sf = new Singleflight()

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.do('test', fn).then((res) => expect(res).toBe(mockRes)))
  ).then(() => expect(fn).toBeCalledTimes(1))

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        sf.do('testSync', fnSync).then((res) => expect(res).toBe(mockRes))
      )
  ).then(() => expect(fnSync).toBeCalledTimes(1))
})

it('all should got error', async () => {
  const mockErr = new Error('mock error')
  const fn = jest.fn().mockRejectedValue(mockErr)
  const fnSync = jest.fn().mockImplementation(() => {
    throw mockErr
  })

  const sf = new Singleflight()

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() => expect(() => sf.do('test', fn)).rejects.toThrowError(mockErr))
  ).then(() => expect(fn).toBeCalledTimes(1))

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        expect(() => sf.do('testSync', fnSync)).rejects.toThrowError(mockErr)
      )
  ).then(() => expect(fnSync).toBeCalledTimes(1))
})

it('doWithFresh should works well', async () => {
  const mockRes = 'mock res'
  const fn = jest.fn().mockResolvedValue(mockRes)
  const fnSync = jest.fn().mockReturnValue(mockRes)

  const sf = new Singleflight()

  const results = await Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.doWithFresh('test', fn))
  )

  expect(fn).toBeCalledTimes(1)

  results.forEach((r, i) => {
    expect(r[0]).toBe(mockRes)
    expect(r[1]).toBe(i === 0)
  })

  const results2 = await Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.doWithFresh('testSync', fnSync))
  )

  expect(fnSync).toBeCalledTimes(1)

  results2.forEach((r, i) => {
    expect(r[0]).toBe(mockRes)
    expect(r[1]).toBe(i === 0)
  })
})

it('symbol key should work well', async () => {
  const mockRes = 'mock res'
  const fn = jest.fn().mockResolvedValue(mockRes)
  const fnSync = jest.fn().mockReturnValue(mockRes)

  const sf = new Singleflight()

  const testKey = Symbol.for('testKey')
  const testSyncKey = Symbol.for('testSyncKey')

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.do(testKey, fn).then((res) => expect(res).toBe(mockRes)))
  ).then(() => expect(fn).toBeCalledTimes(1))

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        sf.do(testSyncKey, fnSync).then((res) => expect(res).toBe(mockRes))
      )
  ).then(() => expect(fnSync).toBeCalledTimes(1))
})
