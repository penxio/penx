'use client'

import { ReactNode, useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { CameraIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useStructs } from '@penx/hooks/useStructs'
import { localDB } from '@penx/local-db'
import { ImageCreationData } from '@penx/model-type'
import { useSession } from '@penx/session'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { calculateSHA256FromFile } from '@penx/utils/calculateSHA256FromFile'

interface Props {
  children?: ReactNode
}

export function TakePhotoButton({ children }: Props) {
  const addCreation = useAddCreation()

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        // source: CameraSource.Photos,
        allowEditing: false,
        // saveToGallery: true,
        quality: 90,
      })

      const response = await fetch(image.webPath!)
      const blob = await response.blob()
      const ext = blob.type.split('/')[1]

      const file = new File([blob], `image.${ext}`, {
        type: blob.type,
        lastModified: Date.now(),
      })

      const hash = await calculateSHA256FromFile(file)
      const fileId = await localDB.addFile(hash, file)

      await addCreation({
        type: StructType.IMAGE,
        isAddPanel: false,
        data: {
          uploaded: false,
          localUrl: image.webPath!,
          url: '',
          fileId,
        } as ImageCreationData,
      })
    } catch (error) {
      console.log('==========getPhoto error:', error)
    }
  }
  if (children) {
    return (
      <div
        className="inline-flex"
        onClick={(e) => {
          e.stopPropagation()
          takePhoto()
        }}
      >
        {children}
      </div>
    )
  }
  return (
    <Button
      className="size-6"
      size="icon"
      variant="secondary"
      onClick={(e) => {
        e.stopPropagation()
        takePhoto()
      }}
    >
      <CameraIcon size={20}></CameraIcon>
    </Button>
  )
}
