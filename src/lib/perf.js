import { PerformanceObserver, performance } from 'node:perf_hooks'

const obs = new PerformanceObserver((items) => {
  for (let { name, duration } of items.getEntries()) {
    console.log(duration, name)
  }
  performance.clearMarks()
})
obs.observe({ type: 'measure' })

export const mark = performance.mark

export const measure = performance.measure
