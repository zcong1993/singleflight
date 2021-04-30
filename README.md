# singleflight

[![NPM version](https://img.shields.io/npm/v/@zcong/singleflight.svg?style=flat)](https://npmjs.com/package/@zcong/singleflight) [![NPM downloads](https://img.shields.io/npm/dm/@zcong/singleflight.svg?style=flat)](https://npmjs.com/package/@zcong/singleflight) [![CircleCI](https://circleci.com/gh/zcong1993/singleflight/tree/master.svg?style=shield)](https://circleci.com/gh/zcong1993/singleflight/tree/master) [![codecov](https://codecov.io/gh/zcong1993/singleflight/branch/master/graph/badge.svg)](https://codecov.io/gh/zcong1993/singleflight)

> singleflight for js

## Install

```sh
$ yarn add @zcong/singleflight
# or npm
$ npm i @zcong/singleflight --save
```

## Example

```ts
import { Singleflight } from '../src'

const sf = new Singleflight()

const delay = (n: number) => new Promise((resolve) => setTimeout(resolve, n))

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
    sf.do('test', fn).then(console.log).catch(console.log)

    sf.do('test-err', errFn)
      .then(console.log)
      .catch((err) => console.log(`err: ${err.message}`))
  })
```

## License

MIT &copy; zcong1993
