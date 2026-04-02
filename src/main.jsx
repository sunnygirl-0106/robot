import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RobotArchitecture from './RobotArchitecture.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RobotArchitecture />
  </StrictMode>,
)
