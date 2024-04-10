import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallery from './Gallery/Gallery'
import PopularProducts from './PopularProducts/PopularProducts'
import PopularBartender from './PopularBartender/PopularBartender'

function Home() {
  return (
    <section>
      <HeroContainer/>
      <div className='max-w-screen-xl mx-auto'>
        <Gallery/>
        <PopularProducts/>
        <PopularBartender/>
      </div>
    </section>
  )
}

export default Home
