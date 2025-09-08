import React from 'react'
      function main(props) {
       const [count, setCount] = React.useState(1)
       const onClick = React.useCallback(() => {
           setCount(count + 1)
           console.log(count)
       }, [])
       return (
           <button onClick= { onClick } > { count } </button>
       )
   }


