import { useEffect, useState } from 'react'
import { get, set } from 'idb-keyval'
import { LOCAL_BACKUP_INTERVAL } from '@penx/constants'
import { Label } from '@penx/uikit/label'
import { RadioGroup, RadioGroupItem } from '@penx/uikit/radio-group'

export function BackupInterval() {
  const [interval, setInterval] = useState<string>('')
  useEffect(() => {
    get(LOCAL_BACKUP_INTERVAL).then((v) => {
      setInterval(v || '1h')
    })
  }, [])
  return (
    <div className="relative flex flex-col gap-3">
      <div className="text-lg font-medium">Backup interval</div>
      <div className="mb-1">
        <RadioGroup
          className="flex items-center gap-3"
          value={interval}
          onValueChange={(v: string) => {
            setInterval(v)
            set(LOCAL_BACKUP_INTERVAL, v)
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30m" id="r1" />
            <Label htmlFor="r1">30 minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1h" id="r2" />
            <Label htmlFor="r2">1 hours</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4h" id="r3" />
            <Label htmlFor="r3">4 hours</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
