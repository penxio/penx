export function calcAudioBubbleWidth(
  durationSec: number,
  minWidth = 20,
  maxWidth = 80,
  maxDuration = 60,
): string {
  const sec = Math.max(1, durationSec)
  const effectiveSec = Math.min(sec, maxDuration)
  const width =
    minWidth + ((maxWidth - minWidth) * (effectiveSec - 1)) / (maxDuration - 1)
  return `${width}vw`
}
