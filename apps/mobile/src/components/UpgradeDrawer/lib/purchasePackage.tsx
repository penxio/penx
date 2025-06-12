import {
  CustomerInfo,
  Purchases,
  PurchasesOffering,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor'
import { api } from '@penx/api'
import { BillingCycle, PlanType } from '@penx/types'

export async function purchasePackage(
  planType: PlanType,
  billingCycle: BillingCycle,
  selectedPackage: PurchasesPackage,
): Promise<CustomerInfo | null> {
  console.log('====selectedPackage:', selectedPackage)

  const result = await Purchases.purchasePackage({
    aPackage: selectedPackage,
  })
  const { customerInfo, transaction } = result

  console.log('>>>>>>>>>>=========result:', result.customerInfo)

  try {
    await api.syncAppleSubscription({
      planType,
      billingCycle,
      customerId: customerInfo.originalAppUserId,
      subscriptionStatus: 'active',
      currentPeriodEnd: customerInfo.latestExpirationDate!,
      raw: customerInfo,
    })
  } catch (err) {
    console.error('Purchase exception:', err)
    return null
  }

  return null
}
