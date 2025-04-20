import { forwardRef } from 'react'
import { Database, useQueryDatabase } from '@penx/hooks/useQueryDatabase'
import { Link } from '@penx/libs/i18n'
import { Editor, Path } from 'slate'
import { FieldIcon } from '../database-ui/shared/FieldIcon'
// import { TTagElement } from '../editor/plugins/tag-plugin/lib/types'
import { LoadingDots } from '../icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'

// import { FieldIcon } from '../shared/FieldIcon'
// import { CellField } from './fields'

interface Props {
  element: any
}

export const TagForm = forwardRef<HTMLDivElement, Props>(function TagForm(
  { element },
  ref,
) {
  const { isLoading, data } = useQueryDatabase({
    id: element.databaseId,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div ref={ref}>
      <div className="flex h-12 items-center justify-between border-b px-3">
        <div className="font-bold">Update tag metadata</div>
        <Button size="xs" variant="secondary" className="text-xs" asChild>
          <Link href={`/~/database?id=${element.databaseId}`}>
            Visit database
          </Link>
        </Button>
      </div>
      <div className="flex max-h-[400px] flex-col gap-4 overflow-auto p-3">
        <div>Coming soon...</div>
        {/* {data?.columns.map((field) => (
          <div key={field.id}>
            <div className="mb-2 flex items-center gap-1 text-foreground/60">
              <FieldIcon fieldType={field.columnType} />
              <Box textXS>{field.displayName}</Box>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  )
})
