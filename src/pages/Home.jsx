import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/FeatureSection'
import HowItWorks from '../components/HowItWorks'
import PricingSection from '../components/PricingSection'

const Home = () => {
  return (
    <div className="">
      <NavBar/>
      <Hero/>
      <FeatureSection />
      <HowItWorks />
      <PricingSection />
      <Footer/>
    </div>
  )
}

export default Home
