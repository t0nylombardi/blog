import {test, expect} from '@playwright/test'

test('about section renders header and copy', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#about')
  await expect(section).toBeVisible()

  await expect(section.getByRole('heading', { name: '_about-me' })).toBeVisible()
  await expect(section.getByText('get a small overview of who I am')).toBeVisible()
})

test('about section shows bio text', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#about')
  await expect(section.getByText(/self-taught/i)).toBeVisible()
})

test.describe('mobile', () => {
  test.skip(({isMobile}) => !isMobile, 'Requires a mobile project viewport')

  test('about section stacks and hides sprites', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section#about')
    await expect(section).toBeVisible()
    await expect(section).toHaveClass(/flex-col-reverse/)

    const sprites = section.locator('div.row-start-1.row-end-2.hidden.md\\:flex')
    await expect(sprites).toBeHidden()
  })
})
