import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import TodoApp from './components/TodoApp'

function App() {

  return (
    <Monetization>
      <TodoApp />
    </Monetization>
  )
}

export default App