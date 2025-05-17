'use client'

import { ChangeEvent, useEffect, useMemo } from 'react'
import { Filter } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { ToolbarBtn } from '../ToolbarBtn'
import { FilterBtns } from './FilterBtns'
import { FilterItem } from './FilterItem'
import { useFilterField } from './useFilterField'

export const FilterField = () => {
  // const { filtersDb, currentView } = useFilterField()
  // if (!currentView) return null
  // return (
  //   <Popover>
  //     <PopoverTrigger>
  //       <ToolbarBtn
  //         isHighlight={!!filtersDb.length}
  //         hightLightColor="orange"
  //         icon={<Filter size={16}></Filter>}
  //       >
  //         {filtersDb.length > 0 && filtersDb.length} Filter
  //       </ToolbarBtn>
  //     </PopoverTrigger>
  //     <PopoverContent>
  //       <PopContent />
  //     </PopoverContent>
  //   </Popover>
  // )
}

// function PopContent() {
//   const {
//     filters,
//     filtersDb,
//     viewColumns,
//     columns,
//     currentView,
//     deleteFilter,
//     setFilters,
//     addFilter,
//     updateFilter,
//   } = useFilterField()
//   // const { isOpen } = usePopoverContext()

//   // useEffect(() => {
//   //   setFilters([...filtersDb])
//   // }, [isOpen])

//   const sortedColumns = useMemo(() => {
//     return currentView.props.viewColumns
//       .map((o) => columns.find((c) => c.id === o.columnId)!)
//       .filter((i) => {
//         const find = filters.find((item) => item.columnId === i.id)
//         return !find
//       })
//   }, [filters])

//   const onChangeValue = (
//     val: ChangeEvent<HTMLInputElement>,
//     columnId: string,
//   ) => {
//     updateFilter(columnId, columnId, { value: val.target.value })
//   }

//   return (
//     <>
//       {!filters.length && (
//         <div className="p-3 text-foreground/40 text-sm">
//           No filters applied to this view
//         </div>
//       )}

//       <div className="bg-background w-[480px]">
//         {!!filters.length && (
//           <div className="p-3 flex flex-col gap-1">
//             {filters.map((filter, index) => (
//               <FilterItem
//                 key={filter.columnId}
//                 filter={filter}
//                 deleteFilter={deleteFilter}
//                 updateFilter={updateFilter}
//                 columns={columns}
//                 sortedColumns={sortedColumns}
//                 onChangeValue={onChangeValue}
//               />
//             ))}
//           </div>
//         )}
//         <Separator />
//         <div className="p-3 flex items-start justify-between">
//           <FilterBtns
//             viewColumns={viewColumns}
//             filters={filters}
//             addFilter={addFilter}
//             currentView={currentView}
//           />
//         </div>
//       </div>
//     </>
//   )
// }
