'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ComponentIcon, SettingsIcon } from 'lucide-react'
import { BarType, useDesignContext } from './hooks/DesignContext'

export function BarToggle() {
  const { barType, setBarType } = useDesignContext()

  return (
    <div>
      <ToggleGroup
        className="w-auto"
        size="sm"
        value={barType}
        onValueChange={(v) => {
          if (!v) return
          setBarType(v as any)
        }}
        type="single"
      >
        <ToggleGroupItem value={BarType.COMPONENT} className="p-2">
          <ComponentIcon />
        </ToggleGroupItem>
        <ToggleGroupItem className="p-2" value={BarType.SETTINGS}>
          <SettingsIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
