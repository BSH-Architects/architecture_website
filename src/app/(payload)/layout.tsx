import '@payloadcms/next/css'
import './custom.css'

import type { Metadata } from 'next'
import type { ServerFunctionClient } from 'payload'
import type { ReactNode } from 'react'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import { textFont } from '../(frontend)/fonts'

import { importMap } from './admin/importMap'

export const metadata: Metadata = {
  description: 'Architecture studio content management',
  title: 'Studio CMS',
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      htmlProps={{ className: textFont.variable }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
