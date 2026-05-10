


## routing demo
## rounting params
## switch in routing
## useContext hook demo
## useReducer hook
## useCallback
## useMemo
## lazy loading
## hoc 
## css modules
## jwt token login
## redux toolkit 
## redux thun
## form validation
## pagination (onscroll, normal)
## web socket



## memo use

import React, { useState, memo } from 'react'
// Memoized button component
const MemoButton = memo(() ## {
  console.log('rendered Child')
})
// Main App
export default function App() {
  const [count, setCount] = useState(0);
  console.log('rendered parent')
  const handleClick = () ## {
    setCount(prev ## prev + 1)
  }
  return (
    <div>
      <div style={{display: "flex", flexDirection: "column"}}>
      <p>Count: {count}</p>
      <MemoButton />
      {/* Force parent re-render */}
      <button onClick={handleClick}>Re-render Parent</button>
    </div>
    </div>
  )
}
