import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import Home from './components/Home'
import SignIn from './components/Signin'
import Header from './components/Header'

function App() {

  return (
    <div className='App'>
    <Header/>
    <main>

      <Routes>
        <Route path='/' element={<Register/>} />
        <Route path="/home/:userId" element={<Home/>} />
        <Route path='/login' element={<SignIn/>} />
      </Routes>
  
    </main>
    </div>
  )
}

export default App
