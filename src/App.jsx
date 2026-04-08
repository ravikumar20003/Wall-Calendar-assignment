import React from 'react'
import WallCalendar from './components/WallCalendar.jsx'

// App is the root component.
// It simply renders the WallCalendar component centered on the page.
function App() {
  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <WallCalendar />
    </div>
  )
}

export default App
