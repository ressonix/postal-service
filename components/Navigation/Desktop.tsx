import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import navigation from '../../config/navItems'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function DesktopNavigation(): ReactElement {
  const router = useRouter()

  navigation.forEach((item) => {
    if (router.pathname === item.href) {
      item.current = true
    } else {
      item.current = false
    }
  })

  return (
    <>
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={classNames(
            item.current
              ? 'bg-blue-700 text-white'
              : 'text-white hover:bg-blue-500 hover:bg-opacity-75',
            'rounded-md py-2 px-3 text-sm font-medium'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </a>
      ))}
    </>
  )
}
