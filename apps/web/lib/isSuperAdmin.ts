export function isSuperAdmin(userId: any) {
  return process.env
    .NEXT_PUBLIC_SUPER_ADMIN!.split(',')
    .map((i) => i.trim())
    .includes(userId)
}
