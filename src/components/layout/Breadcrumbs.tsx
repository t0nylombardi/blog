import Link from 'next/link'
import {JsonLd} from '@/components/JsonLd'
import {absoluteUrl} from '@/lib/seo'

type BreadcrumbItem = {name: string; href: string}

/** The final item is the current page; one list drives navigation and structured data. */
export function Breadcrumbs({items}: {items: readonly BreadcrumbItem[]}) {
  if (items.length === 0) return null

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.href),
        })),
      }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={item.href}>
              {index > 0 && (
                <span aria-hidden="true" className="mr-2">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href} className="underline">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
