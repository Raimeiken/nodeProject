import React from 'react'
import image1 from "../../../assets/gallary/coffee-1.jpg"
import image2 from "../../../assets/gallary/coffee-2.jpg"

const Gallery = () => {
  return (
    <div className='md:w-[90%] mx-auto my-28'>
      <div className='mb-16'>
        <h1 className='text-5xl font-bold text-center'>Our Gallery</h1>
      </div>

      {/* image container */}
      <div className='md:grid grid-cols-2 items-center justify-center gap-4'>
        <div className='mb-4 md:mb-0'>
            <img src={image1} alt="" className='md:h-[577px] w-full mx-auto rounded-sm'/>
        </div>

        <div className='gap-4 grid grid-cols-2 items-start'>
            <div>
                <img src={image2} alt="" className='md:h-[280px] rounded-sm'/>
            </div>
            <div>
                <img src={image2} alt="" className='md:h-[280px] rounded-sm'/>
            </div>
            <div>
                <img src={image2} alt="" className='md:h-[280px] rounded-sm'/>
            </div>
            <div>
                <img src={image2} alt="" className='md:h-[280px] rounded-sm'/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery


// import React from 'react';
// import image1 from '../../../assets/gallary/coffee-1.jpg';
// import image2 from '../../../assets/gallary/coffee-2.jpg';

// const Gallery = () => {
//   return (
//     <div className='container mx-auto my-8'>
//       <h1 className='text-4xl font-bold text-center mb-8'>Our Gallery</h1>

//       {/* Image container */}
//       <div className='grid md:grid-cols-2 gap-8'>
//         <div className='mb-4'>
//           <img src={image1} alt="Coffee 1" className='md:h-96 w-full object-cover rounded'/>
//         </div>

//         <div className='grid grid-cols-2 gap-4'>
//           {[...Array(4)].map((_, index) => (
//             <div key={index}>
//               <img src={image2} alt={`Coffee ${index + 2}`} className='md:h-48 w-full object-cover rounded'/>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Gallery;
