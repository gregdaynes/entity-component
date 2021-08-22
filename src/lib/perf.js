import { PerformanceObserver, performance } from 'node:perf_hooks'

const obs = new PerformanceObserver((items) => {
  const timeSeries = {}
  for (let { name, duration } of items.getEntries()) {
    timeSeries[name] = duration
  }

  console.table([timeSeries])

  performance.clearMarks()
})
obs.observe({ type: 'measure' })

export const mark = performance.mark

export const measure = performance.measure
