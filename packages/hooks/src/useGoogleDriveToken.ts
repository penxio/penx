import { useQuery } from '@tanstack/react-query'
import { api } from '@penx/api'

export function useGoogleDriveToken() {
  return useQuery({
    queryKey: ['googleDriveToken'],
    queryFn: api.getGoogleDriveToken,
  })
}
