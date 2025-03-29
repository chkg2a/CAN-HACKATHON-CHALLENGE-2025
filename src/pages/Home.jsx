import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/FeatureSection'
import Sections from '../components/Sections'

const Home = () => {
  return (
    <div className="">
      <NavBar/>
      <Hero/>
      <FeatureSection />
      <Sections />
      <Footer/>
    </div>
  )
}

export default Home
