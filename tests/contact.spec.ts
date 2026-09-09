import {test, expect} from '@playwright/test'

test('contact preview follows input and safely renders text', async ({page, isMobile}) => {
  await page.goto('/')
  await page.getByPlaceholder('What is your name?').fill('<b>Anthony</b>')
  await page.getByPlaceholder('what-is@your-email.question').fill('anthony@example.com')
  await page.getByPlaceholder('What do you want to talk about?').fill('A message longer than twenty-five characters')

  const preview = page.locator('#contact pre code')
  await expect(preview).toContainText('name = "<b>Anthony</b>"')
  await expect(preview).toContainText('email = "anthony@example.com"')
  await expect(preview).toContainText('message = "A message longer than twe..."')
  await expect(preview.locator('b')).toHaveCount(0)
  if (isMobile) await expect(preview).toBeHidden()
})

test('successful contact submission loads the popup and resets the form', async ({page}) => {
  await page.route('**/__forms.html', (route) => route.fulfill({status: 200, body: 'OK'}))
  await page.goto('/')
  await page.getByPlaceholder('What is your name?').fill('Anthony')
  await page.getByPlaceholder('what-is@your-email.question').fill('anthony@example.com')
  await page.getByPlaceholder('What do you want to talk about?').fill('Hello')
  await page.getByRole('button', {name: 'Send Message'}).click()
  await expect(page.getByRole('heading', {name: '_success'})).toBeVisible()
  await expect(page.getByPlaceholder('What is your name?')).toHaveValue('')
})
