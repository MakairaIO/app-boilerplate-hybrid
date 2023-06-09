import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

import { CONTENT_WIDGET_PATHS } from '@/utils/contentWidgetPaths'
import { MakairaAppProvider } from '@/makaira/MakairaAppProvider'
import { MakairaConfigProvider } from '@/makaira/MakairaConfigProvider'

import '@/styles/mixins.scss'
import '@/styles/globals.scss'

const queryClient = new QueryClient()
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const appType = CONTENT_WIDGET_PATHS.includes(router.pathname)
    ? 'content-widget'
    : 'app'

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <MakairaAppProvider {...pageProps} appType={appType}>
          <MakairaConfigProvider>
            <Component {...pageProps} />
          </MakairaConfigProvider>
        </MakairaAppProvider>
      </QueryClientProvider>
    </main>
  )
}
