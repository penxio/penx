import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function impact() {
  await Haptics.impact({ style: ImpactStyle.Medium })
}
