import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import { importMap } from './admin/importMap'

export const metadata: Metadata = {
  description: 'Architecture studio content management',
  title: 'Studio CMS',
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={(args) => handleServerFunctions({ ...args, config, importMap })}
    >
      {children}
    </RootLayout>
  )
}
