import { Box, FowerHTMLProps } from '@fower/react'
import { CalendarCheck, ListChecks, Target } from 'lucide-react'
import { TodoFilterType, useTodoFilter } from './hooks/useTodoFilter'

interface FilterItemProps extends FowerHTMLProps<'div'> {}

export const FilterItem = ({ ...rest }: FilterItemProps) => {
  return (
    <Box
      bgNeutral100
      cursorPointer
      textSM
      toCenterY
      h-36
      px3
      roundedFull
      gap1
      {...rest}
    ></Box>
  )
}

export const TodoFilter = () => {
  const { filter, setFilter } = useTodoFilter()
  return (
    <Box>
      <Box toCenterY gap2>
        <FilterItem
          brand500={filter === TodoFilterType.TODAY}
          onClick={() => setFilter(TodoFilterType.TODAY)}
        >
          <Target size={18} />
          <Box>Today</Box>
        </FilterItem>
        <FilterItem
          brand500={filter === TodoFilterType.SEVEN_DAY}
          onClick={() => setFilter(TodoFilterType.SEVEN_DAY)}
        >
          <CalendarCheck size={18}></CalendarCheck>
          <Box>7 todays</Box>
        </FilterItem>
        <FilterItem
          brand500={filter === TodoFilterType.ALL_TODOS}
          onClick={() => setFilter(TodoFilterType.ALL_TODOS)}
        >
          <ListChecks size={18} />
          <Box>All Todos</Box>
        </FilterItem>
      </Box>
    </Box>
  )
}
