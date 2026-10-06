import {test, expect} from '@playwright/test'

test('contact link scrolls again when the contact hash is already active', async ({page, isMobile}) => {
  test.skip(isMobile, 'Contact navigation link is desktop-only')
  await page.goto('/')

  const link = page.getByRole('link', {name: '_contact-me'})
  const contact = page.locator('#contact')
  await link.click()
  await expect(page).toHaveURL(/\/#contact$/)
  await expect(contact).toBeInViewport()

  await page.locator('#hello').evaluate((element) => element.scrollIntoView())
  await expect(contact).not.toBeInViewport()
  await link.click()
  await expect(contact).toBeInViewport()
})

test('primary navigation changes routes without reloading the document', async ({page}) => {
  await page.goto('/')
  await page.evaluate(() => Reflect.set(window, '__navigationMarker', 'same-document'))
  const documentRequests: string[] = []
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      documentRequests.push(request.url())
    }
  })

  for (const path of ['/blog', '/projects', '/resume']) {
    if (await page.locator('#hamburger').isVisible()) {
      await page.locator('#hamburger').click()
    }
    await page.locator(`#navlinks a[href="${path}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.evaluate(() => Reflect.get(window, '__navigationMarker'))).toBe('same-document')
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  }
  await page.goBack()
  await expect(page).toHaveURL(/\/projects$/)
  expect(await page.evaluate(() => Reflect.get(window, '__navigationMarker'))).toBe('same-document')
  expect(documentRequests).toEqual([])
})
