import {test, expect} from '@playwright/test'

const origin = 'https://t0nylombardi.dev'

for (const path of ['/', '/blog', '/projects', '/resume']) {
  test(`${path} exposes consistent canonical and social metadata`, async ({page}) => {
    await page.goto(path, {waitUntil: 'domcontentloaded'})
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${path === '/' ? '' : path}`)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${path === '/' ? '' : path}`)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThan(40)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}

test('robots advertises a sitemap of canonical public pages', async ({request}) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBeTruthy()
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`)
  expect(await robots.text()).not.toMatch(/noindex/i)
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  const xml = await sitemap.text()
  for (const path of ['/blog', '/projects', '/resume']) {
    expect(xml).toContain(`<loc>${origin}${path}</loc>`)
  }
  expect(xml).toContain(`${origin}/blog/rails-console-command-simplified`)
  expect(xml).not.toContain('__forms')
})

test('articles expose structured data and working social images', async ({page, request}) => {
  const path = '/blog/rails-service-objects-to-make-your-rails-controllers-skinny'
  await page.goto(path, {waitUntil: 'domcontentloaded'})
  const article = JSON.parse((await page.locator('#article-schema').textContent())!)
  expect(article['@type']).toBe('BlogPosting')
  expect(article.url).toBe(`${origin}${path}`)
  expect(article.headline).toBe(await page.locator('h1').textContent())
  expect(Number.isNaN(Date.parse(article.datePublished))).toBeFalsy()
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', article.datePublished)
  const image = await request.get(new URL(article.image).pathname)
  expect(image.ok()).toBeTruthy()
  const site = JSON.parse((await page.locator('#site-schema').textContent())!)
  const person = site['@graph'].find((entity: {'@type': string}) => entity['@type'] === 'Person')
  expect(article.publisher['@id']).toBe(person['@id'])
  const breadcrumbs = JSON.parse((await page.locator('#breadcrumb-schema').textContent())!)
  expect(breadcrumbs.itemListElement.map((item: {item: string}) => item.item)).toEqual([
    `${origin}/`, `${origin}/blog`, `${origin}${path}`,
  ])
  const navigation = page.getByRole('navigation', {name: 'Breadcrumb'})
  await expect(navigation.getByRole('link', {name: 'Blog', exact: true})).toHaveAttribute('href', '/blog')
  await expect(navigation.locator('[aria-current="page"]')).toHaveText(article.headline)
  await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content', /max-image-preview:large/)
})

test('Netlify form helper is excluded from indexing', async ({request}) => {
  const response = await request.get('/__forms.html')
  expect(await response.text()).toContain('<meta name="robots" content="noindex"')
})
