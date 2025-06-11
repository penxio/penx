import { PurchasesOffering } from '@revenuecat/purchases-capacitor'

export enum SubscriptionType {
  standard = 'standard',
  pro = 'pro',
}

export function getPackage(
  subscriptionType: SubscriptionType,
  isMonthly: boolean,
  allOfferings: Record<string, PurchasesOffering>,
) {
  const offering = allOfferings[subscriptionType]
  // console.log('=======offering:', offering)
  const pkg = isMonthly ? offering.monthly! : offering.annual!
  // console.log('========pkg:', Object.keys(offering), pkg)

  return pkg
}
