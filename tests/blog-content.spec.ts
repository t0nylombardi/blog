import {test, expect} from '@playwright/test'
import {writeFile, unlink} from 'node:fs/promises'
import path from 'node:path'

test('development discovers a post added after the content cache is warm', async ({request}, testInfo) => {
  const slug = `content-refresh-${testInfo.project.name.toLowerCase().replaceAll(' ', '-')}-${process.pid}`
  const file = path.join(process.cwd(), 'src/content/blog', `${slug}.md`)
  const warm = await request.get('/blog')
  expect(warm.status()).toBe(200)

  try {
    await writeFile(file, `---\ntitle: Content refresh regression\ndescription: A newly added post must load immediately.\ndate: '2020-01-01'\n---\n\nFresh content regression marker.\n`, {flag: 'wx'})
    const response = await request.get(`/blog/${slug}`)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('Fresh content regression marker.')
  } finally {
    await unlink(file)
  }
})
