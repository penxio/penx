import { useState } from 'react'
import { tinykeys } from 'tinykeys'

window.addEventListener('keydown', (e) => {
  if (e.key === 'F1') {
    console.log('11111111......')
  }
})
window.addEventListener('keyup', (e) => {
  if (e.key === 'F1') {
    console.log('2222222222222')
  }
})

type Item = {
  from: number
  to: number
  text: string
}

tinykeys(window, {
  'Shift+D': () => {
    alert("The 'Shift' and 'd' keys were pressed at the same time")
  },
  'y e e t': () => {
    alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
  },
  '$mod+([0-9])': (event) => {
    event.preventDefault()
    alert(`Either 'Control+${event.key}' or 'Meta+${event.key}' were pressed`)
  },
})

function App(): React.JSX.Element {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <>
      <div className="no-drag bg-green-100">
        {/* <button onClick={ipcHandle}>Transcribe</button> */}
        foo
        <div className="drag bg-red-200" style={{}}>
          Footer
        </div>
      </div>
      {/* {loading && <div>Loading...</div>} */}
      {/* {!loading && <div className="tip">{result}</div>} */}
    </>
  )
}

export default App
