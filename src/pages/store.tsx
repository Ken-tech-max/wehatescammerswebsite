import Head from 'next/head'

import { Toaster } from 'react-hot-toast';
import HeaderStore from '../components/header-store';
import StoreItem from '../components/store-item';
import { useWindowSize } from '../hooks/use-window-size';

const Store = () => {

    const {width, height} = useWindowSize();

    return (
        <div>
            <Toaster />
            <Head>
                <title>Gorilla Galaxy</title>
                <meta name="description" content="Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain." />
                <link rel="icon" href="/icon.png" />
            </Head>
    
            <HeaderStore title="$GLUE STORE" />

            <section>
                <div className="w-full flex justify-center items-center">
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 px-5 md:px-10 py-8">
                        <StoreItem image="/images/store1.png" title="3D Gorilla1" price="1000" />
                        <StoreItem image="/images/store2.png" title="3D Gorilla2" price="500" />
                        <StoreItem image="/images/store3.png" title="3D Gorilla3" price="100" />
                        <StoreItem image="/images/store4.png" title="3D Gorilla4" price="800" />
                        <StoreItem image="/images/store5.png" title="3D Gorilla5" price="2000" />
                        <StoreItem image="/images/store6.png" title="3D Gorilla6" price="10000" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Store;
