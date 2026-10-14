import {test, expect, type Page} from '@playwright/test'

async function fillContactForm(page: Page) {
  await page.goto('/')
  await page.locator('#contact-name').fill('<b>Anthony</b>')
  await page.locator('#contact-email').fill('anthony+blog@example.com')
  await page.locator('#contact-message').fill('Hello & thanks = yes!')
}

test('contact inputs safely display entered text', async ({page}) => {
  await fillContactForm(page)
  await expect(page.locator('#contact-name')).toHaveValue('<b>Anthony</b>')
  await expect(page.locator('#contact-email')).toHaveValue('anthony+blog@example.com')
  await expect(page.locator('#contact-message')).toHaveValue('Hello & thanks = yes!')
  await expect(page.locator('#contact b')).toHaveCount(0)
})

test('successful contact submission encodes all fields, shows the popup, and resets the form', async ({page}) => {
  await page.route('**/__forms.html', (route) => route.fulfill({status: 200, body: 'OK'}))
  await fillContactForm(page)
  const requestPromise = page.waitForRequest('**/__forms.html')
  await page.locator('#submit-form').click()
  const request = await requestPromise
  expect(request.method()).toBe('POST')
  expect(request.headers()['content-type']).toBe('application/x-www-form-urlencoded')
  expect(Object.fromEntries(new URLSearchParams(request.postData()!))).toEqual({
    'form-name': 'contact-form',
    'bot-field': '',
    name: '<b>Anthony</b>',
    email: 'anthony+blog@example.com',
    message: 'Hello & thanks = yes!',
  })
  await expect(page.getByRole('heading', {name: '_success'})).toBeVisible()
  for (const field of ['name', 'email', 'message']) {
    await expect(page.locator(`#contact-${field}`)).toHaveValue('')
  }
})

for (const failure of ['http', 'network'] as const) {
  test(`${failure} failure retains input and allows a successful retry`, async ({page}) => {
    await page.route('**/__forms.html', (route) => failure === 'http'
      ? route.fulfill({status: 500, body: 'Failed'})
      : route.abort('failed'))
    await fillContactForm(page)
    await page.locator('#submit-form').click()
    await expect(page.locator('#contact').getByRole('alert')).toContainText('RuntimeError:')
    if (failure === 'http') await expect(page.locator('#contact').getByRole('alert')).toContainText('Error: 500')
    await expect(page.getByRole('heading', {name: '_success'})).toHaveCount(0)
    await expect(page.locator('#contact-message')).toHaveValue('Hello & thanks = yes!')
    await expect(page.locator('#submit-form')).toBeEnabled()
    await page.route('**/__forms.html', (route) => route.fulfill({status: 200, body: 'OK'}))
    await page.locator('#submit-form').click()
    await expect(page.getByRole('heading', {name: '_success'})).toBeVisible()
    await expect(page.locator('#contact').getByRole('alert')).toHaveCount(0)
  })
}
