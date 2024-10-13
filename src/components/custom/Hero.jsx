import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import './Hero.css'; // Updated CSS

function Hero() {
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef(null);

  // Timer to show content after the video ends
  useEffect(() => {
    const handleVideoEnd = () => {
      setShowContent(true);
      videoRef.current.pause(); // Stop the video when it ends
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.playbackRate = 3;
      }
    };
  }, []);

  return (
    <div className='hero-container'>
      <video className='hero-video' ref={videoRef} autoPlay muted>
        <source src='new_video.mp4' type='video/mp4' />
        Your browser does not support HTML5 video.
      </video>
      {showContent && (
        <div className='hero-content flex flex-col items-center mx-auto gap-9 p-8 rounded-lg shadow-lg ladakh-theme fade-in'>
          <h1 className='font-extrabold text-[50px] text-center hero-title'>
            <span className='text-[#fff]'>Experience the Mystery :</span>
            &nbsp; Your Adventure Awaits
          </h1>
          <p className='text-xl text-gray-300 text-center'>
            Discover breathtaking landscapes, rich culture, and thrilling adventures tailored to your journey.
          </p>
          <Link to={'/create-trip'}>
            <Button className='hero-button'>
              Begin Your Journey, It’s Free.
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Hero;
