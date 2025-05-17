export const TableField = () => {
  const onUndo = () => {
    // TODO
    /*
      if(canUndo){
        undo()
      }
    */
  }

  const onRedo = () => {
    // TODO
    /*
      if(canRedo){
        redo()
      }
    */
  }

  return (
    <div className="flex text-sm">
      <div className="mr-2 cursor-pointer" onClick={onUndo}>
        Undo
      </div>

      <div className="cursor-pointer" onClick={onRedo}>
        Redo
      </div>
    </div>
  )
}
