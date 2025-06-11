import { Purchases } from '@revenuecat/purchases-capacitor'

export async function checkSubscriptionStatus(
  entitlementId: string,
): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    const entitlement = customerInfo.entitlements.active[entitlementId]

    console.log(
      '========>>>>>>>entitlement:',
      'entitlementId:',
      entitlementId,
      entitlement,
      'customerInfo:',
      customerInfo,
    )

    if (entitlement) {
      console.log(`Entitlement ${entitlementId} is active.`)
      console.log('Expires on:', entitlement.expirationDate)
      console.log('Will renew:', entitlement.willRenew)
      return true
    } else {
      // 订阅已取消或过期
      console.log(`Entitlement ${entitlementId} is NOT active.`)
      return false
    }
  } catch (error) {
    console.error('Failed to get customer info:', error)
    return false
  }
}

const a = {
  allPurchasedProductIdentifiers: ['io.penx.app.standard.monthly'],
  nonSubscriptionTransactions: [],
  allPurchaseDatesMillis: { 'io.penx.app.standard.monthly': 1749646419000 },
  managementURL: 'https://apps.apple.com/account/subscriptions',
  latestExpirationDate: '2025-06-12T12:53:39Z',
  firstSeen: '2025-06-11T09:49:38Z',
  originalPurchaseDateMillis: 1375340400000,
  requestDateMillis: 1749650313000,
  originalApplicationVersion: '1.0',
  originalAppUserId: '$RCAnonymousID:3533c50896344f69bca21a5c231cde41',
  requestDate: '2025-06-11T13:58:33Z',
  firstSeenMillis: 1749635378000,
  allExpirationDatesMillis: { 'io.penx.app.standard.monthly': 1749732819000 },
  originalPurchaseDate: '2013-08-01T07:00:00Z',
  entitlements: {
    active: {
      Standard: {
        productPlanIdentifier: null,
        productIdentifier: 'io.penx.app.standard.monthly',
        isSandbox: true,
        unsubscribeDetectedAtMillis: null,
        billingIssueDetectedAtMillis: null,
        originalPurchaseDateMillis: 1749646420000,
        ownershipType: 'PURCHASED',
        willRenew: true,
        expirationDate: '2025-06-12T12:53:39Z',
        verification: 'VERIFIED',
        identifier: 'Standard',
        billingIssueDetectedAt: null,
        latestPurchaseDateMillis: 1749646419000,
        unsubscribeDetectedAt: null,
        isActive: true,
        periodType: 'NORMAL',
        latestPurchaseDate: '2025-06-11T12:53:39Z',
        originalPurchaseDate: '2025-06-11T12:53:40Z',
        expirationDateMillis: 1749732819000,
        store: 'APP_STORE',
      },
    },
    verification: 'VERIFIED',
    all: {
      Standard: {
        isSandbox: true,
        ownershipType: 'PURCHASED',
        billingIssueDetectedAtMillis: null,
        unsubscribeDetectedAt: null,
        expirationDate: '2025-06-12T12:53:39Z',
        identifier: 'Standard',
        willRenew: true,
        periodType: 'NORMAL',
        latestPurchaseDate: '2025-06-11T12:53:39Z',
        unsubscribeDetectedAtMillis: null,
        store: 'APP_STORE',
        billingIssueDetectedAt: null,
        originalPurchaseDateMillis: 1749646420000,
        verification: 'VERIFIED',
        latestPurchaseDateMillis: 1749646419000,
        productPlanIdentifier: null,
        originalPurchaseDate: '2025-06-11T12:53:40Z',
        productIdentifier: 'io.penx.app.standard.monthly',
        expirationDateMillis: 1749732819000,
        isActive: true,
      },
    },
  },
  allExpirationDates: {
    'io.penx.app.standard.monthly': '2025-06-12T12:53:39Z',
  },
  subscriptionsByProductIdentifier: {
    'io.penx.app.standard.monthly': {
      store: 'APP_STORE',
      isSandbox: true,
      purchaseDate: '2025-06-11T12:53:39Z',
      productIdentifier: 'io.penx.app.standard.monthly',
      ownershipType: 'PURCHASED',
      originalPurchaseDate: '2025-06-11T12:53:40Z',
      periodType: 'NORMAL',
      unsubscribeDetectedAt: null,
      willRenew: true,
      isActive: true,
      gracePeriodExpiresDate: null,
      refundedAt: null,
      billingIssuesDetectedAt: null,
      price: { amount: 38, currency: 'CNY' },
      expiresDate: '2025-06-12T12:53:39Z',
      storeTransactionId: '2000000938385249',
    },
  },
  latestExpirationDateMillis: 1749732819000,
  activeSubscriptions: ['io.penx.app.standard.monthly'],
  allPurchaseDates: { 'io.penx.app.standard.monthly': '2025-06-11T12:53:39Z' },
}
