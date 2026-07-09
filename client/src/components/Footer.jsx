// import React from 'react'
// import { BsRobot } from 'react-icons/bs'

// function Footer() {
//   return (
//     <div className=' flex justify-center px-4 pb-1 py-4 pt-1 shadow-lg'>
//       <div className='w-full max-w-full bg-white rounded-xl shadow-lg border border-gray-200 py-8 px-3 text-center'>
//     <div className='flex justify-center items-center gap-3 mb-3'>
//         <div className='bg-black text-white p-2 rounded-lg'>
//             <BsRobot size={16}/>

//         </div>
//         <h2 className='font-semibold'>Livio.AI</h2>
//     </div>
//     <p className='text-gray-500 text-sm max-w-xl mx-auto'>
//         AI-powered interview preparation platform designed to improve communication skills, technical depth and professional confidence.
//     </p>
//       </div>
//     </div>
//   )
// }

// export default Footer


import React from 'react'
import { BsRobot, BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs'
import { motion } from 'motion/react'

function Footer() {
  const links = {
    Product: ["Features", "How it works", "Pricing", "Interview History"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  }

  return (
    <footer className='flex justify-center px-4 py-8'>
      <div className='w-full max-w-5xl bg-white rounded-2xl shadow-sm 
        border border-gray-200 py-10 px-8'>

        {/* Top section */}
        <div className='flex flex-col md:flex-row justify-between gap-10 mb-10'>

          {/* Brand */}
          <div className='max-w-xs'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='bg-black text-white p-2 rounded-lg'>
                <BsRobot size={16} />
              </div>
              <h2 className='font-semibold text-lg'>Prepzio.AI</h2>
            </div>
            <p className='text-gray-500 text-sm leading-relaxed'>
              AI-powered interview preparation platform designed to improve
              communication skills, technical depth and professional confidence.
            </p>

            {/* Social icons */}
            <div className='flex gap-4 mt-5'>
              {[
                { icon: <BsGithub size={18} />, href: "#" },
                { icon: <BsLinkedin size={18} />, href: "#" },
                { icon: <BsTwitterX size={18} />, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className='w-9 h-9 rounded-full border border-gray-200 
                    flex items-center justify-center text-gray-600 
                    hover:border-black hover:text-black transition-all duration-200'
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h3 className='font-semibold text-sm text-black mb-3'>
                  {category}
                </h3>
                <ul className='space-y-2'>
                  {items.map((item) => (
                    <li key={item}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 3 }}
                        className='text-sm text-gray-500 hover:text-black 
                          transition-colors duration-200 cursor-pointer'
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-gray-100 mb-6' />

        {/* Bottom section */}
        <div className='flex flex-col md:flex-row justify-between 
          items-center gap-3'>
          <p className='text-xs text-gray-400'>
            © {new Date().getFullYear()} Prepzio.AI — All rights reserved.
          </p>
          <div className='flex items-center gap-1'>
            <span className='text-xs text-gray-400'>Built with</span>
            <span className='text-red-400 text-xs'>♥</span>
            <span className='text-xs text-gray-400'>
              using React · Node.js · MongoDB · AI
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer