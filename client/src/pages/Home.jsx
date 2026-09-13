import React from 'react';
import Hero from '../components/ui/Hero';

function Home({ theme, toggleTheme }) {
  return <Hero theme={theme} toggleTheme={toggleTheme} />;
}

export default Home;