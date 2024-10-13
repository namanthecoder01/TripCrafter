import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();  // Dynamically fetch current year

  return (
    <footer className='mt-7 py-5 border-t border-gray-300'>
      <div className='text-center text-gray-500'>
        <p>
          Made with <span className='text-red-500'>❤️</span> by{' '}
          <a 
            href='https://www.linkedin.com/in/naman-jain/'  // Add your LinkedIn or any other profile link
            target='_blank' 
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            Naman Jain
          </a>
        </p>
        <p className='mt-2'>
          &copy; {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
