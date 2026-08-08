import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const output = path.join(process.cwd(), '.screenshots', 'admin-final')
const profile = path.join(os.tmpdir(), 'architecture-website-chrome-admin-verify')
const debugBase = 'http://127.0.0.1:9224'
const pageURL = 'http://localhost:3000/admin'

mkdirSync(output, { recursive: true })
rmSync(profile, { recursive: true, force: true })

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--remote-debugging-port=9224',
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForChrome() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(`${debugBase}/json/version`)).ok) return
    } catch {}
    await sleep(100)
  }
  throw new Error('Chrome DevTools did not become ready.')
}

async function capture(width, height, name) {
  const response = await fetch(`${debugBase}/json/new?${encodeURIComponent(pageURL)}`, { method: 'PUT' })
  const target = await response.json()
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  const pending = new Map()
  let commandID = 0

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const resolver = pending.get(message.id)
    if (!resolver) return
    pending.delete(message.id)
    resolver(message)
  })

  const send = (method, params = {}) => {
    const id = ++commandID
    return new Promise((resolve, reject) => {
      pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result))
      socket.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { deviceScaleFactor: 1, height, mobile: width < 600, width })
  await send('Page.navigate', { url: pageURL })
  await sleep(2800)

  const state = await send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const wrap = document.querySelector('.template-minimal__wrap')
      const bounds = wrap?.getBoundingClientRect()
      return {
        url: location.href,
        title: document.title,
        theme: document.documentElement.dataset.theme,
        studioLogo: Boolean(document.querySelector('.studio-admin-logo')),
        welcome: Boolean(document.querySelector('.studio-admin-welcome')),
        bodyFont: getComputedStyle(document.body).fontFamily,
        overflow: document.documentElement.scrollWidth > innerWidth,
        wrap: bounds && { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
      }
    })())`,
    returnByValue: true,
  })
  const screenshot = await send('Page.captureScreenshot', { captureBeyondViewport: false, format: 'png', fromSurface: true })
  writeFileSync(path.join(output, `${name}.png`), Buffer.from(screenshot.data, 'base64'))
  console.log(name, state.result.value)
  socket.close()
}

try {
  await waitForChrome()
  await capture(1440, 900, 'desktop')
  await capture(390, 844, 'mobile')
} finally {
  chrome.kill('SIGTERM')
  await sleep(300)
  rmSync(profile, { recursive: true, force: true })
}
