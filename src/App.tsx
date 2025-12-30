import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { appRoutes } from './routes'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="main-app">
        <Navbar />
          {/* <Header /> */}
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
          <div>
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
          </div>
          {/* <Footer /> */}
        </div>
    </>
  )
}

export default App
