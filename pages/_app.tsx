import '../styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../layouts/Header';
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(far, fas)
export default function App({ Component, pageProps }) {
    console.log('pageProps', pageProps);
    return (
        <>
            <Header />
            <Component {...pageProps} />
        </>
    )
  }