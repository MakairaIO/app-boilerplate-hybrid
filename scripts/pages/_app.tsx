import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

import { AuthInfo } from '@/types/App'
import { getAppTypeFromPath } from '@/utils/getAppTypeFromPath'
import { requestWithMakaira } from '@/utils/request'
import { MakairaAppProvider } from '@/makaira/MakairaAppProvider'
import { MakairaConfigProvider } from '@/makaira/MakairaConfigProvider'
import { LoadingScreen } from '@/components'

import '@/styles/mixins.scss'
import '@/styles/globals.scss'

const nonAuthPaths = ['/bad-auth', '/example']
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { slug, appType = getAppTypeFromPath(router.pathname)  } = router.query
  const [authInfo, setAuthInfo] = useState<AuthInfo>()
  const shouldCheckAuth = !nonAuthPaths.includes(router.pathname) && process.env.NODE_ENV === 'production';

  const checkAuth = async () => {
    try {
      const data = await requestWithMakaira('/api/auth');
      setAuthInfo(data)
    } catch (error) {
      router.push('/bad-auth')
    }
  }

  useEffect(() => {
    if(shouldCheckAuth && slug) {
      checkAuth()
    }
  }, [router.query])

  if(!authInfo && shouldCheckAuth) {
    return <LoadingScreen />
  }

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <MakairaAppProvider {...pageProps} {...authInfo} slug={slug} appType={appType}>
          <MakairaConfigProvider>
            <Component {...pageProps} {...authInfo}/>
          </MakairaConfigProvider>
        </MakairaAppProvider>
      </QueryClientProvider>
    </main>
  )
}
