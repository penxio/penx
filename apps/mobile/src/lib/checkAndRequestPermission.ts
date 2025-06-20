import { VoiceRecorder } from 'capacitor-voice-recorder'

export const checkAndRequestRecordPermission = async () => {
  const canRecord = await VoiceRecorder.canDeviceVoiceRecord()
  if (!canRecord.value) {
    return false
  }

  const hasPermission = await VoiceRecorder.hasAudioRecordingPermission()
  if (!hasPermission.value) {
    const permissionResult =
      await VoiceRecorder.requestAudioRecordingPermission()
    return permissionResult.value
  }
  return true
}
