import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import Card from './Card'

const PopularProducts = () => {
    const axionsFetch = useAxiosFetch()
    const [classes, setClasses] = useState([])
    useEffect(()=>{
        const fetchClasses = async ()=>{
            const response = await axionsFetch.get('/classes')
            // console.log(response.data)
            setClasses(response.data)
        }
        fetchClasses()
    },[])
  return (
    <div className='md:w-[80%] mx-auto my-36'>
      <div>
        <h1 className='text-5xl font-bold text-center'>Our <span className='text-secondary'>Popular</span> Products</h1>
        <div className='w-[40%] text-center mx-auto my-4'>
            <p className='text-gray-500'>Explore our popular Products. Here is some popular products based on how many people bought them.</p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
            classes.slice(0,6).map((item, index)=> <Card key={index} item={item}/>)
        }
      </div>
    </div>

    
  )
}

export default PopularProducts
