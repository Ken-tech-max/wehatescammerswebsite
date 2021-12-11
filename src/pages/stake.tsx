import Head from 'next/head'

import { Toaster } from 'react-hot-toast';
import SubHeader from '../components/sub-header';
import { useWindowSize } from '../hooks/use-window-size';
import StakeItem from '../components/stake-item';

const Stake = () => {

    const {width, height} = useWindowSize();

    return (
        <div>
            <Toaster />
            <Head>
                <title>Gorilla Galaxy</title>
                <meta name="description" content="Genesis is a collection of 4444 unique, randomly generated Gorillas roaming on the Solana blockchain." />
                <link rel="icon" href="/icon.png" />
            </Head>
    
            <SubHeader title="STAKING" />

            <section>
                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Your staked gorillas:</h3>

                <div className="w-full flex justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-10 py-8">
                        <div className="col-span-1"></div>
                        <StakeItem image="/images/stake1.png" title="123" />
                        <StakeItem image="/images/stake2.png" title="345" />
                        <div className="col-span-1"></div>
                    </div>
                </div>

                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Stake a gorilla:</h3>

                <div className="w-full flex justify-center items-center">
                    <button className="button-connect">STAKE</button>
                </div>

                <h3 className="text-white text-center presale-title drop-shadow-lg py-10">Staking Rewards:</h3>

                <div className="w-full flex flex-col justify-center items-center">
                    <p className="text-color-theme text-center font-amiga mb-5">12345 $GLUE</p>
                    <button className="button-connect">CLAIM</button>
                </div>

                <br />
            </section>
        </div>
    );
};

export default Stake;
