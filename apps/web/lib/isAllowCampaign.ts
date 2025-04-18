export function isAllowCampaign(userId: any) {
  return process.env
    .NEXT_PUBLIC_CAMPAIGN_WHITELIST!.split(',')
    .map((i) => i.trim())
    .includes(userId)
}
