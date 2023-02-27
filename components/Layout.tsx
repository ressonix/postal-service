import type { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import {
  AtSymbolIcon,
  Bars3Icon,
  CodeBracketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import DesktopNavigation from './Navigation/Desktop'
import MobileNavigation from './Navigation/Mobile'
import package_json from 'package.json'

export interface LayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <>
      <div className="min-h-full">
        <div className="bg-blue-600 pb-32">
          <Disclosure
            as="nav"
            className="border-b border-blue-300 border-opacity-25 bg-blue-600 lg:border-none"
          >
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-blue-400 lg:border-opacity-25">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex items-center">
                        <AtSymbolIcon className="h-8 w-8 text-blue-300" />
                        <h1 className="ml-3 text-lg font-bold text-blue-300">
                          Postal Service
                        </h1>
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          <DesktopNavigation />
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-blue-600 p-2 text-blue-200 hover:bg-blue-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                      <div className="flex items-center">
                        <h1 className="text-sm text-blue-300">
                          Version: {package_json.version}
                        </h1>
                        <a
                          href="https://github.com/ressonix/postal-service"
                          type="button"
                          className="ml-2 flex-shrink-0 rounded-full bg-blue-600 p-1 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                          target="_blank"
                        >
                          <span className="sr-only">View source code</span>
                          <CodeBracketIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-2 pt-2 pb-3">
                    <MobileNavigation />
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-base text-blue-300">{description}</p>
              ) : (
                ''
              )}
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
