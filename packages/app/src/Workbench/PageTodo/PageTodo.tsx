import { Box } from '@fower/react'
import { useUser } from '@penx/hooks'
import { AddTodoForm } from './AddTodoForm'
import { AllTodos } from './AllTodos'
import { useTodoFilter } from './hooks/useTodoFilter'
import { SevenDayTodos } from './SevenDayTodos'
import { TodayTodos } from './TodayTodos'
import { TodoFilter } from './TodoFilter'

export const PageTodo = () => {
  const user = useUser()
  const { isTody, isSevenDay, isAllTodos } = useTodoFilter()

  return (
    <Box p10>
      <Box w={['100%', 680]} mx-auto pb20 column gap3>
        <Box fontBold text4XL>
          Good Morning, {user.username}~
        </Box>
        <TodoFilter />
        {isTody && <TodayTodos />}
        {isSevenDay && <SevenDayTodos />}
        {isAllTodos && <AllTodos />}
      </Box>
      <AddTodoForm></AddTodoForm>
    </Box>
  )
}
