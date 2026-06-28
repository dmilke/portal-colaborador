import { chromium } from '@playwright/test'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots/Sprint-04')
const BASE_URL = 'http://localhost:3000'

const credentials = { email: 'sprint3@teste.com', password: 'Teste123!' }

async function screenshot(page, name, viewport) {
  const prefix = viewport === 'desktop' ? 'desktop' : 'mobile'
  await page.waitForTimeout(500)
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${prefix}-${name}.png`),
    fullPage: true,
  })
  console.log(`  ✓ ${prefix}/${name}.png`)
}

async function login(context) {
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('load')
  await page.fill('input[name="email"]', credentials.email)
  await page.fill('input[name="password"]', credentials.password)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(3000)
  // After login, wait for RSC to settle
  await page.waitForLoadState('domcontentloaded')
  console.log('  ✓ Logged in at', page.url())
  return page
}

async function takeDesktopScreenshots(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await login(context)

  // 1. Dashboard (already at / after login)
  await page.waitForTimeout(2000)
  console.log('  Screenshot dashboard at', page.url())
  await screenshot(page, 'dashboard', 'desktop')

  // 2. Cargos List
  await page.goto(`${BASE_URL}/cargos`)
  await page.waitForTimeout(3000)
  console.log('  URL:', page.url())
  await screenshot(page, 'cargos-list', 'desktop')

  // 3. Create Cargo
  await page.goto(`${BASE_URL}/cargos/novo`)
  await page.waitForTimeout(2000)
  console.log('  URL:', page.url())
  await screenshot(page, 'create-cargo', 'desktop')

  // 4. Edit Cargo
  await page.goto(`${BASE_URL}/cargos/d729980b-5ecb-40c8-926e-0ac5f0a24ae8`)
  await page.waitForTimeout(2000)
  console.log('  URL:', page.url())
  await screenshot(page, 'edit-cargo', 'desktop')

  // 5. Delete Dialog
  await page.goto(`${BASE_URL}/cargos`)
  await page.waitForTimeout(2000)
  const deleteBtn = page.locator('button:has(svg.lucide-trash2)').first()
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click()
    await page.waitForTimeout(1000)
  }
  await screenshot(page, 'delete-dialog', 'desktop')
  const cancelBtn = page.locator('button:has-text("Cancelar")').first()
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click()
  }

  // 6. Empty State
  await page.waitForTimeout(500)
  await screenshot(page, 'empty-state', 'desktop')

  await context.close()
}

async function takeMobileScreenshots(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await login(context)

  await page.waitForTimeout(2000)
  await screenshot(page, 'dashboard', 'mobile')

  await page.goto(`${BASE_URL}/cargos`)
  await page.waitForTimeout(3000)
  await screenshot(page, 'cargos', 'mobile')

  await page.goto(`${BASE_URL}/cargos/novo`)
  await page.waitForTimeout(2000)
  await screenshot(page, 'form', 'mobile')

  await context.close()
}

async function run() {
  const browser = await chromium.launch({ headless: true })

  console.log('Desktop screenshots:')
  await takeDesktopScreenshots(browser)

  console.log('\nMobile screenshots:')
  await takeMobileScreenshots(browser)

  await browser.close()
  console.log('\n✅ All screenshots saved to docs/screenshots/Sprint-03/')
}

run().catch((err) => {
  console.error('Screenshot error:', err)
  process.exit(1)
})
