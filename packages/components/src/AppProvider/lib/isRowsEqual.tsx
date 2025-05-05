'use client'

import isEqual from 'react-fast-compare'

export function isRowsEqual(
  remoteRows: any[],
  localRows: any[],
  columns: string[] = [],
) {
  const remote = remoteRows
    .sort((a, b) => {
      return a.id.localeCompare(b.id)
    })
    .map((data) => {
      return columns.map((column) => data[column])
    })

  const local = localRows
    .sort((a, b) => {
      return a.id.localeCompare(b.id)
    })
    .map((data) => {
      return columns.map((column) => data[column])
    })
  console.log('=====remote:', remote, 'local:', local)

  return isEqual(remote, local)
}
