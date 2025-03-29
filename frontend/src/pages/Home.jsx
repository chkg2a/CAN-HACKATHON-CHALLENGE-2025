import React from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import PricingSection from '../components/PricingSection'
import HowGenieWorks from '../components/HowGenieWorks'
import PowerfulFeatures from '../components/PowerfulFeatures'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <div className="">
      <NavBar/>
      <Hero/>
      <HowGenieWorks />
      <PowerfulFeatures />
      <Testimonials />
      <PricingSection />
      <Footer/>
    </div>
  )
}

export default Home
