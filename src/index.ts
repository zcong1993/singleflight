export type Fn<T = any> = () => T | Promise<T>
export type ResolveFn = (res: any) => void

export interface Call {
  resolveFns: ResolveFn[]
  rejectFns: ResolveFn[]
}

let resolveInstance: Promise<void>

export class Singleflight {
  private singleFlightQueue = new Map<string, Call>()

  do<T = any>(key: string, fn: Fn<T>): Promise<T> {
    const promise: Promise<T> = new Promise((resolve, reject) => {
      const call: Call = this.singleFlightQueue.get(key) || {
        resolveFns: [],
        rejectFns: []
      }

      call.resolveFns.push(resolve)
      call.rejectFns.push(reject)
      this.singleFlightQueue.set(key, call)
      if (call.resolveFns.length === 1) {
        if (!resolveInstance) {
          resolveInstance = Promise.resolve()
        }
        // ensure always work even fn is sync function
        resolveInstance
          .then(() => fn())
          .then(res => {
            const waitCall = this.singleFlightQueue.get(key)
            waitCall.resolveFns.forEach(resolve => resolve(res))
            this.singleFlightQueue.delete(key)
          })
          .catch(err => {
            const waitCall = this.singleFlightQueue.get(key)
            waitCall.rejectFns.forEach(reject => reject(err))
            this.singleFlightQueue.delete(key)
          })
      }
    })

    return promise
  }
}
