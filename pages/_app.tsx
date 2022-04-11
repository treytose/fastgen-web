import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Wrapper from '../components/Wrapper';
import { SettingsProvider } from '../store/SettingsContext';

function MyApp({ Component, pageProps }: AppProps) {  
  return (
    <SettingsProvider>      
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>        
    </SettingsProvider>
  )
}

export default MyApp
