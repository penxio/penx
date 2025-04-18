'use client'

import AddCollaborator from './AddCollaborator'
import CollaboratorList from './CollaboratorList'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="flex flex-col justify-between space-y-8">
      <AddCollaborator />
      <CollaboratorList />
    </div>
  )
}
