import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/FeatureSection'
import HowItWorks from '../components/HowItWorks'

const Home = () => {
  return (
    <div className="">
      <NavBar/>
      <Hero/>
      <FeatureSection />
      <HowItWorks />
      <Footer/>
    </div>
  )
}

export default Home
