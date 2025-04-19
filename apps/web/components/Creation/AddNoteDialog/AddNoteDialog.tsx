import { useState } from 'react'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/ui/dialog'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import {
  refetchAreaCreations,
  useAreaCreations,
} from '@/hooks/useAreaCreations'
import { usePublishPost } from '@/hooks/usePublishPost'
import { editorDefaultValue } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { api } from '@penx/trpc-client'
import { Trans } from '@lingui/react/macro'
import { GateType } from '@penx/db/client'
import { usePlateEditor } from '@udecode/plate/react'
import { add } from 'lodash'
import { useRouter } from 'next/navigation'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { useAddNoteDialog } from './useAddNoteDialog'

const key = 'PUBLISH_NOTE_DIRECTLY'
export function AddNoteDialog() {
  const { isOpen, setIsOpen } = useAddNoteDialog()
  const [value, setValue] = useState(editorDefaultValue)

  return (
    <Dialog modal open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent forceMount className="min-h-[320px] p-6 sm:max-w-[560px]">
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
          </DialogHeader>

          <div className="flex-1">
            <PlateEditor
              className="min-h-52 flex-1"
              value={value}
              draggable={false}
              placeholder="Write your thoughts..."
              onInit={(editor: any) => {
                setTimeout(() => {
                  Transforms.select(editor, Editor.end(editor, [0, 0]))
                  ReactEditor.focus(editor)
                }, 0)
              }}
              onChange={(v) => {
                setValue(v)
              }}
            >
              <Footer value={value} setValue={setValue} />
            </PlateEditor>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Footer({
  value,
  setValue,
}: {
  value: any[]
  setValue: (v: any) => void
}) {
  const site = useSiteContext()
  const { setIsOpen, mold } = useAddNoteDialog()
  const [isLoading, setLoading] = useState(false)
  const { session } = useSession()
  const { publishPost } = usePublishPost()
  const [publishDirectly, setPublishDirectly] = useState(
    localStorage.getItem(key) === 'true' ? true : false,
  )
  const { push } = useRouter()
  const editor = usePlateEditor()

  const title = value.map((node) => Node.string(node)).join(', ')

  async function addNote() {
    setLoading(true)
    try {
      const creation = await api.creation.create.mutate({
        moldId: mold.id,
        type: mold.type,
        siteId: site.id,
        areaId: session?.activeAreaId!,
        title: title,
        content: JSON.stringify(value),
      })
      if (publishDirectly) {
        await publishPost({
          slug: creation.slug,
          gateType: GateType.FREE,
          collectible: false,
          delivered: false,
        })
      }
      await refetchAreaCreations()
      setIsOpen(false)

      setValue(editorDefaultValue)
      // TODO:
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add note')
    }
    setLoading(false)
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="enable-publish"
          checked={publishDirectly}
          onCheckedChange={(checked) => {
            setPublishDirectly(checked)
            if (checked) {
              localStorage.setItem(key, 'true')
            } else {
              localStorage.removeItem(key)
            }
          }}
        />
        <Label htmlFor="enable-publish" className="text-foreground/60">
          <Trans>Publish directly</Trans>
        </Label>
      </div>
      <Button
        size="lg"
        className="flex gap-1"
        disabled={isLoading}
        type="submit"
        onClick={async () => {
          addNote()
        }}
      >
        <div>
          <Trans>Add note</Trans>
        </div>
        {isLoading && <LoadingDots className="bg-background" />}
      </Button>
    </div>
  )
}
