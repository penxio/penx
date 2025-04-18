'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LaptopMinimalIcon, SmartphoneIcon } from 'lucide-react'
import { Device, useDesignContext } from './hooks/DesignContext'

export function DeviceToggle() {
  const { device, setDevice } = useDesignContext()

  return (
    <div className="fixed right-4 top-4 z-20">
      <div>
        <ToggleGroup
          className="w-auto"
          size="lg"
          value={device.toString()}
          onValueChange={(v) => {
            setDevice(v as any)
          }}
          type="single"
        >
          <ToggleGroupItem value={Device.PC} className="p-2">
            <LaptopMinimalIcon />
          </ToggleGroupItem>
          <ToggleGroupItem className="p-2" value={Device.MOBILE}>
            <SmartphoneIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
