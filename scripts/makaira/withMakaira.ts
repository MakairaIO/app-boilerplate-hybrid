import { APP_TYPE } from '@/types/App'
import { getAppTypeFromPath } from '@/utils/getAppTypeFromPath'
import * as crypto from 'crypto'

import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type MakairaAuthData = {
  // New generated HMAC which is used to receive the JWT-token from the Makaira Admin UI
  hmac: string
  // New generated nonce which is used to receive the JWT-token from the Makaira Admin UI
  nonce: string
  // Domain where the app was opened from
  domain: string
  // Instance where the app was opened from
  instance: string
  // HMAC that was received from the Makaira Admin UI
  makairaHmac: string | null

  // read from ENVIRONMENT
  slug: string
}

type ExpectedQueryParams = {
  nonce: undefined | string
  hmac: undefined | string
  instance: undefined | string
  domain: undefined | string
}

type IncomingPageServerSideProp<P> = (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>


/**
 * Using for APP with install in single Makaira's instance and 
 * provided SECRET, SLUG via Environment instead of store in db
 * 
 * @param incomingGSSP 
 * @returns 
 */
export function withMakaira<T>(
  incomingGSSP?: IncomingPageServerSideProp<T> | null
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T & MakairaAuthData>> => {
    const { nonce, domain, instance, hmac } = ctx.query as ExpectedQueryParams

    const url = new URL(ctx.req.url ?? '', `https://${ctx.req.headers.host}`)

    const appType = getAppTypeFromPath(url.pathname)
    let secret = null, slug = null;
    switch (appType) {
      case APP_TYPE.CONTENT_WIDGET:
        secret = process.env.MAKAIRA_APP_SECRET_CONTENT_WIDGET
        slug = process.env.MAKAIRA_APP_SLUG_CONTENT_WIDGET
        break;
      case APP_TYPE.CONTENT_MODAL:
        secret = process.env.MAKAIRA_APP_SECRET_CONTENT_MODAL
        slug = process.env.MAKAIRA_APP_SLUG_CONTENT_MODAL
        break;
      default:
        secret = process.env.MAKAIRA_APP_SECRET
        slug = process.env.MAKAIRA_APP_SLUG
        break;
    }

    if (!secret || !slug) {
      throw Error('[Example App] Environment for Single App were not set')
    }

    // At first, we need to check if the page was requested from the Makaira Admin UI.
    // The UI sends an HMAC and a Nonce which we can use together with our app secret
    // that the request comes from the Makaira Admin UI (because only there the HMAC
    // can be generated).
    const expectedHMAC = crypto
      .createHmac('sha256', secret ?? '')
      .update(`${nonce}:${domain}:${instance}`)
      .digest('hex')

    // If the provided HMAC isn't equal to the expected one (which will also be the
    // case when the query parameters were not provided at all), we will redirect to
    // the bad auth/error page.
    if (expectedHMAC !== hmac && process.env.NODE_ENV !== 'development') {
      return {
        redirect: {
          destination: 'bad-auth',
          permanent: false,
        },
      }
    }

    // To request the JWT/Bearer-Token from the Admin UI we need another HMAC
    // to proof to the Admin UI that we are allowed to receive the tokens.
    // The new HMAC will be signed by our app secret and contain the HMAC
    // from the query parameters so that we can not simply return the received one.
    const tokenNonce = crypto.randomBytes(20).toString('hex')
    const tokenHMAC = crypto
      .createHmac('sha256', secret ?? '')
      .update(`${tokenNonce}:${domain}:${instance}:${hmac}`)
      .digest('hex')

    const secretProps: MakairaAuthData = {
      hmac: tokenHMAC,
      makairaHmac: hmac ?? null,
      nonce: tokenNonce,
      instance: instance ?? process.env.DEV_INSTANCE ?? '',
      domain: domain ?? process.env.DEV_DOMAIN ?? '',
      slug: slug ?? '',
    }

    if (incomingGSSP) {
      const incomingGSSPResult = await incomingGSSP(ctx)

      if ('props' in incomingGSSPResult) {
        const result = {
          props: {
            ...secretProps,
            ...incomingGSSPResult.props,
          },
        }

        // @ts-ignore
        return result
      }

      if ('redirect' in incomingGSSPResult) {
        return { redirect: { ...incomingGSSPResult.redirect } }
      }

      if ('notFound' in incomingGSSPResult) {
        return { notFound: incomingGSSPResult.notFound }
      }
    }

    return {
      // @ts-ignore
      props: secretProps,
    }
  }
}
