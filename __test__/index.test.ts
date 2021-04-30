import { Singleflight } from '../src'

it('should work well', async () => {
  const mockRes = 'mock res'
  const fn = jest.fn().mockResolvedValue(mockRes)
  const fnSync = jest.fn().mockReturnValue(mockRes)

  const sf = new Singleflight()

  Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.do('test', fn).then((res) => expect(res).toBe(mockRes)))
  ).then(() => expect(fn).toBeCalledTimes(1))

  Promise.all(
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
  const fnSync = jest.fn().mockImplementation(() => mockErr)

  const sf = new Singleflight()

  Promise.all(
    Array(10)
      .fill(null)
      .map(() => sf.do('test', fn).catch((err) => expect(err).toBe(mockErr)))
  ).then(() => expect(fn).toBeCalledTimes(1))

  Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        sf.do('testSync', fnSync).catch((err) => expect(err).toBe(mockErr))
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
