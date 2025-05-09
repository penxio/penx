import { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Command } from 'cmdk'

// const CommandDialog = styled(Command.Dialog)
// const StyledCommand = styled(Command)

interface CommandWrapperProps {
  isMobile?: boolean
  open: boolean
  setSearch: Dispatch<SetStateAction<string>>
  setOpen: (open: boolean) => void
}

export const CommandWrapper = ({
  children,
  isMobile,
  open,
  setOpen,
  setSearch,
}: PropsWithChildren<CommandWrapperProps>) => {
  if (isMobile) {
    return (
      <Command
        loop
        className="command-panel bg-background left-[50%] flex w-full flex-1 flex-col"
        onValueChange={(value) => {
          console.log(value)
        }}
        shouldFilter={false}
        filter={(value, search) => {
          return 1
        }}
        onKeyUp={(e) => {
          // Escape goes to previous page
          // Backspace goes to previous page when search is empty
          if (e.key === 'Escape' || e.key === 'Backspace') {
            e.preventDefault()
          }
        }}
      >
        {children}
      </Command>
    )
  }
  return (
    <Command.Dialog
      // shadow="0 16px 70px rgba(0,0,0,.2)"
      style={{
        height: 'fit-content',
      }}
      loop
      className="command-panel border-foreground/5 bg-background fixed left-[50%] top-[20vh] z-[10000] w-[640px] -translate-x-[50%] rounded-2xl border shadow-2xl"
      open={open}
      onOpenChange={setOpen}
      onValueChange={(value) => {
        console.log(value)
      }}
      shouldFilter={false}
      filter={(value, search) => {
        return 1
      }}
      onKeyUp={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault()
        }
      }}
    >
      <DialogTitle className="hidden"></DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>
      {children}
    </Command.Dialog>
  )
}
