export type SubscriptionInSession = {
  planId: number
  startTime: number
  duration: number
}

export enum SubscriptionSource {
  STRIPE = 'STRIPE',
  APPLE = 'APPLE',
}

export interface SessionData {
  isLoggedIn: boolean
  uid: string
  pid: string
  email: string
  name: string
  picture: string
  image: string
  userId: string
  ensName: string | null
  role: string
  siteId: string
  activeSiteId: string
  planType: string
  currentPeriodEnd: string
  billingCycle: string
  subscriptionStatus: string
  subscriptionSource: string
  accessToken: string
  believerPeriodEnd: string
  credits: {
    tokenBalance: number
    transcribeBalance: number
  }
  domain: {
    domain: string
    isSubdomain: boolean
  }
  message: string
  isFree: boolean
  isSubscription: boolean
  isStandard: boolean
  isPro: boolean
  isBeliever: boolean
}

export type GoogleLoginInfo = {
  accessToken: string
  ref: string
  userId: string
}

export type AppleLoginInfo = {
  accessToken: string
  username?: string
  ref?: string
  userId?: string
  clientId?: string
}

export type LoginData =
  | GoogleLoginData
  | AppleLoginData
  | WalletLoginData
  | PasswordLoginData
  | DesktopLoginData
  | RegisterByEmailData
  | RegisterByCodeData
  | LoginBySmsCodeData

export type GoogleLoginData = GoogleLoginInfo & {
  type: 'penx-google'
}

export type AppleLoginData = AppleLoginInfo & {
  type: 'penx-apple'
}

export type WalletLoginData = {
  type: 'wallet'
  message: string
  signature: string
}

export type PasswordLoginData = {
  type: 'password'
  username: string
  password: string
}

export type DesktopLoginData = {
  type: 'desktop-login'
  authToken: string
}

export type RegisterByEmailData = {
  type: 'register-by-email'
  validateToken: string
}

export type RegisterByCodeData = {
  type: 'register-by-email-code'
  code: string
}

export type LoginBySmsCodeData = {
  type: 'login-by-sms-code'
  code: string
}

export function isGoogleLogin(value: any): value is GoogleLoginData {
  return typeof value === 'object' && value?.type === 'penx-google'
}

export function isAppleLogin(value: any): value is AppleLoginData {
  return typeof value === 'object' && value?.type === 'penx-apple'
}

export function isWalletLogin(value: any): value is WalletLoginData {
  return typeof value === 'object' && value?.type === 'wallet'
}

export function isPasswordLogin(value: any): value is PasswordLoginData {
  return typeof value === 'object' && value?.type === 'password'
}

export function isDesktopLogin(value: any): value is DesktopLoginData {
  return typeof value === 'object' && value?.type === 'desktop-login'
}

export function isRegisterByEmail(value: any): value is RegisterByEmailData {
  return typeof value === 'object' && value?.type === 'register-by-email'
}

export function isLoginBySmsCode(value: any): value is LoginBySmsCodeData {
  return typeof value === 'object' && value?.type === 'login-by-sms-code'
}

export type RegisterByCodePayload = {
  email: string
  ref: string
  userId: string
  password: string
}

export function isRegisterByCode(value: any): value is RegisterByCodeData {
  return typeof value === 'object' && value?.type === 'register-by-email-code'
}

export type UpdateSessionData =
  | UpdateProps
  | UpdateProfileData
  | UseCouponData
  | CancelSubscriptionData

export type UpdateProps = {
  type: 'update-props'
  activeSiteId?: string
  [key: string]: any
}

export function isUpdateProps(value: any): value is UpdateProps {
  return typeof value === 'object' && value?.type === 'update-props'
}

export type UpdateProfileData = {
  type: 'update-profile'
  image: string
  displayName: string
  bio: string
}

export function isUpdateProfile(value: any): value is UpdateProfileData {
  return typeof value === 'object' && value?.type === 'update-profile'
}

export type UseCouponData = {
  type: 'use-coupon'
}

export function isUseCoupon(value: any): value is UseCouponData {
  return typeof value === 'object' && value?.type === 'use-coupon'
}

export type CancelSubscriptionData = {
  type: 'cancel-subscription'
  siteId: string
}

export function isCancelSubscription(
  value: any,
): value is CancelSubscriptionData {
  return typeof value === 'object' && value?.type === 'cancel-subscription'
}

export type MobileGoogleLoginInfo = {
  provider: 'google'
  result: {
    idToken: string
    accessToken: {
      userId: string
      refreshToken: string
      token: string
    }
    profile: {
      email: string
      familyName: string
      imageUrl: string
      name: string
    }
  }
}

export type MobileAppleLoginInfo = {
  provider: 'google'
  result: {
    idToken: string
    accessToken: {
      token: string
    }
    profile: {
      email: string
      givenName: string
      familyName: string
      user: string
    }
  }
}
