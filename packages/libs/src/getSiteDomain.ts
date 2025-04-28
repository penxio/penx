import { Domain, Site, SubdomainType, User } from '@penx/db/client'

export type SiteWithDomains = Site & { domains: Domain[] }

export function getSiteDomain(domains: Domain[], isCustomDomain = true) {
  const customDomain = domains.find((d) => !d.isSubdomain)
  const sortedDomains = sortDomains(domains.filter((f) => f.isSubdomain))
  const subdomain = sortedDomains.find((d) => d.isSubdomain)

  if (customDomain && isCustomDomain) {
    return {
      domain: customDomain.domain,
      subdomain: subdomain?.domain,
      isSubdomain: false,
    }
  }

  return {
    domain: sortedDomains[0]?.domain,
    isSubdomain: true,
  }
}

export function getSiteSubdomain(domains: Domain[]) {
  const item = domains.find(
    (d) => d.isSubdomain && d.subdomainType === SubdomainType.Custom,
  )
  return item?.domain || ''
}

export function getSiteCustomDomain(domains: Domain[]) {
  const item = domains.find((d) => !d.isSubdomain)
  return item?.domain || ''
}

export function sortDomains(domains: Domain[]): Domain[] {
  const sortKeys = [
    SubdomainType.Custom,
    SubdomainType.EnsName,
    SubdomainType.FarcasterName,
    SubdomainType.Address,
    SubdomainType.UserId,
  ]

  return domains.sort((a, b) => {
    const indexA = sortKeys.indexOf(a.subdomainType as any)
    const indexB = sortKeys.indexOf(b.subdomainType as any)

    // If both types are found in sortKeys, sort by their indices
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one type is found, it should come first
    if (indexA === -1) return 1 // a comes after b
    if (indexB === -1) return -1 // b comes after a

    return 0 // If both are not found, maintain original order
  })
}

export function getSiteCustomSubdomain(domains: Domain[]) {
  const customSubdomain = domains.find(
    (d) => d.isSubdomain && d.subdomainType === SubdomainType.Custom,
  )
  if (customSubdomain) return customSubdomain

  return domains.find((d) => d.isSubdomain)
}
