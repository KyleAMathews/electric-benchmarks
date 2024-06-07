const path = require(`path`)
const Piscina = require(`piscina`)

const concurrency = parseInt(process.argv[2], 10) || 1

const piscina = new Piscina({
  filename: path.resolve(__dirname, `test-num-rows.mjs`),
  maxThreads: concurrency,
})

const threads = piscina.threads.length
const floor = Math.floor(concurrency / threads)
const extra = concurrency % threads
console.log({ threads, floor, extra })
;(async function () {
  console.log(`run`)
  const promises = Array.from({ length: threads }, (_p, i) => {
    console.log({ i })
    if (i === 0) {
      return piscina.run(floor + extra)
    } else {
      return piscina.run(floor)
    }
  })

  await Promise.all(promises)
  // await piscina.run(1)
  // await piscina.run(1)
})()
