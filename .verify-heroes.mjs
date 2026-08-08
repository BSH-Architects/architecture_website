import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const output = path.join(process.cwd(), '.screenshots')
const profile = path.join(process.cwd(), '.chrome-verify')
const debugBase = 'http://127.0.0.1:9222'
const pageURL = 'http://localhost:3000/'

mkdirSync(output, { recursive: true })
rmSync(profile, { recursive: true, force: true })

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--remote-debugging-port=9222',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForChrome() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${debugBase}/json/version`)
      if (response.ok) return
    } catch {}
    await sleep(100)
  }
  throw new Error('Chrome DevTools did not become ready.')
}

async function newPage(width, height) {
  const response = await fetch(`${debugBase}/json/new?${encodeURIComponent(pageURL)}`, {
    method: 'PUT',
  })
  const target = await response.json()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  const pending = new Map()
  let commandID = 0

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (!message.id) return
    const resolver = pending.get(message.id)
    if (!resolver) return
    pending.delete(message.id)
    resolver(message)
  })

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  function send(method, params = {}) {
    const id = ++commandID
    return new Promise((resolve, reject) => {
      pending.set(id, (message) => {
        if (message.error) reject(new Error(message.error.message))
        else resolve(message.result)
      })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    deviceScaleFactor: 1,
    height,
    mobile: width < 600,
    width,
  })
  await send('Page.navigate', { url: pageURL })
  await sleep(1300)

  return { send, socket }
}

async function capture(page, name) {
  const result = await page.send('Page.captureScreenshot', {
    captureBeyondViewport: false,
    format: 'png',
    fromSurface: true,
  })
  writeFileSync(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'))
  console.log(name)
}

try {
  await waitForChrome()

  const desktop = await newPage(1440, 900)
  await desktop.send('Runtime.evaluate', {
    expression: "document.getElementById('hero-study-01').scrollIntoView({behavior:'instant'})",
  })
  await capture(desktop, 'study-01-desktop')
  await desktop.send('Runtime.evaluate', {
    expression: "document.getElementById('hero-study-02').scrollIntoView({behavior:'instant'})",
  })
  await sleep(150)
  const apertureState = await desktop.send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const hero = document.getElementById('hero-study-02')
      const aperture = hero?.querySelector('[class*=aperture]')
      return {
        clipPath: aperture ? getComputedStyle(aperture).clipPath : null,
        rect: hero?.getBoundingClientRect().toJSON(),
        revealed: hero?.dataset.revealed,
        scrollY,
      }
    })())`,
    returnByValue: true,
  })
  console.log('aperture-state', apertureState.result.value)
  await capture(desktop, 'study-02-aperture')
  await sleep(1200)
  const finalState = await desktop.send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const hero = document.getElementById('hero-study-02')
      const aperture = hero?.querySelector('[class*=aperture]')
      return {
        clipPath: aperture ? getComputedStyle(aperture).clipPath : null,
        rect: hero?.getBoundingClientRect().toJSON(),
        revealed: hero?.dataset.revealed,
        scrollY,
      }
    })())`,
    returnByValue: true,
  })
  console.log('final-state', finalState.result.value)
  await capture(desktop, 'study-02-desktop')
  desktop.socket.close()

  const mobile = await newPage(390, 844)
  await mobile.send('Runtime.evaluate', {
    expression: "document.getElementById('hero-study-02').scrollIntoView({behavior:'instant'})",
  })
  await sleep(1350)
  await capture(mobile, 'study-02-mobile')
  mobile.socket.close()
} finally {
  chrome.kill('SIGTERM')
  await sleep(300)
  rmSync(profile, { recursive: true, force: true })
}
