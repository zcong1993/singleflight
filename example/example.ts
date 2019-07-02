import { Singleflight } from '../src'

const sf = new Singleflight()

const delay = (n: number) => new Promise(resolve => setTimeout(resolve, n))

const fn = async () => {
  console.log('fn called')
  await delay(1000)
  return 'fn result'
}

const errFn = async () => {
  console.log('err fn called')
  await delay(2000)
  throw new Error('panic')
}

Array(10)
  .fill(null)
  .forEach(() => {
    sf.do('test', fn)
      .then(console.log)
      .catch(console.log)

    sf.do('test-err', errFn)
      .then(console.log)
      .catch(err => console.log(`err: ${err.message}`))
  })
