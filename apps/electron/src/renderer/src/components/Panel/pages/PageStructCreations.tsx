import { DatabaseApp } from '../CommandApp/DatabaseApp/DatabaseApp'
import { CommandList } from '../CommandComponents'

export function PageStructCreations() {
  return (
    <CommandList className="p-2 outline-none">
      <DatabaseApp />
    </CommandList>
  )
}
