import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Adoption from './pages/Adoption'
import Product from './pages/Product'
import Events from './pages/Events'
import Services from './pages/Services'
import Aboutus from './pages/About'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
// import Profile from './pages/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route
      path="/"
      element={
        <Home />
      }
      ></Route>
      <Route
      path="/adoption"
      element={
        <Adoption />
      }
      ></Route>
      <Route
      path="/product"
      element={
        <Product />
      }
      ></Route>
      <Route
      path="/events"
      element={
        <Events />
      }
      ></Route>
      <Route
      path="/services"
      element={
        <Services />
      }
      ></Route>
      <Route
      path="/about"
      element={
        <Aboutus />
      }
      ></Route>
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
