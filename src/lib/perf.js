import { PerformanceObserver, performance } from 'node:perf_hooks'
import { default as logger } from './logger.js'

let measureable
let obs

if (process.env.PERF) {
  measureable = []
  obs = new PerformanceObserver(observerReport)
  obs.observe({ type: 'measure' })
}

export const mark = !process.env.PERF ? () => {} : performance.mark

export const measure = !process.env.PERF ? () => {} : performance.measure

export const observer = (callback) => {
  return new PerformanceObserver(callback).observe({ type: 'measure' })
}

export const register = !process.env.PERF
  ? () => {}
  : (tag, name, a = name, b = name) => {
      if (a === 'now') {
        performance.mark(`${a}_NOW`)
        measureable.push([`${tag}: ${name}`, `${a}_NOW`])
      } else {
        measureable.push([`${tag}: ${name}`, `${a}_BEGIN`, `${b}_END`])
      }
    }

export const run = !process.env.PERF
  ? () => {}
  : () => {
      measureable.forEach((data) => performance.measure(...data))
    }

function observerReport(list, observer) {
  const timeSeries = {}
  for (let { name, duration } of list.getEntries()) {
    timeSeries[`${name}`] = duration
  }

  const script = performance.toJSON().nodeTiming
  timeSeries['Script: Total'] = script.duration

  const debug = performance.toJSON().eventLoopUtilization
  timeSeries['debug: EventLoop Idle'] = debug.idle
  timeSeries['debug: EventLoop Active'] = debug.active
  timeSeries['debug: EventLoop Utilization (%)'] = debug.utilization

  let maxGroup = 0
  let maxName = 0
  let maxValue = 9 // length of Time (ms)
  for (let [entry, value] of Object.entries(timeSeries)) {
    const [name, group = ''] = entry.split(': ').reverse()
    maxGroup = group.length > maxGroup ? group.length : maxGroup
    maxName = name.length > maxName ? name.length : maxName
    maxValue =
      `${value.toFixed(3)}`.length > maxValue
        ? `${value.toFixed(3)}`.length
        : maxValue
  }

  let formatted = [
    `${'Group'.padEnd(maxGroup)} ${'Measurement '.padEnd(
      maxName
    )}${'Time (ms)'.padStart(maxValue)}`,
  ]

  for (let [entry, value] of Object.entries(timeSeries).sort((a, b) => {
    return b[1] - a[1]
  })) {
    const [name, group = ''] = entry.split(': ').reverse()

    formatted.push(
      `${group.padEnd(maxGroup)} ${name.padEnd(maxName, '.')}${value
        .toFixed(3)
        .toString()
        .padStart(maxValue, '.')}`
    )
  }

  logger.info(['', 'Performance', ...formatted].join('\n'))

  performance.clearMarks()
  observer.disconnect()
}
