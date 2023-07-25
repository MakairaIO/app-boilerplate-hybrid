export enum APP_TYPE {
  APP = 'app',
  CONTENT_WIDGET = 'content-widget',
  CONTENT_MODAL = 'content-modal',
}

export type AuthInfo = {
  hmac: string
  nonce: string
  domain: string
  instance: string
  makairaHmac: string | null
  makairaNonce: string | null
  slug: string | null
}