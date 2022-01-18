import Head from 'next/head'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import * as anchor from '@project-serum/anchor';
import { MintButton } from '../components/mint-button';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  getCandyMachineState,
  mintMultipleToken,
  mintOneToken,
} from '../utils/candy-machine';
import { toDate, getMintPrice } from '../utils/util';
import { MintCountdown } from '../components/mint-countdown';

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [quantity, setQuantity] = useState(1);

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection,
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log('There was a problem fetching Candy Machine state');
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);

  const onMint = async (quantity: number) => {
    if (quantity == 1) {
      await MintSingle();
    } else if (quantity > 1) {
      await MintMultiple(quantity);
    }
  }

  const MintSingle = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true,
          );
        }

        if (status && !status.err) {
          toast.success('Congratulations! Mint succeeded!');
        } else {
          toast.error('Mint failed! Please try again!');
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      toast.error(message);
    } finally {
      setIsUserMinting(false);
    }
  };

  const MintMultiple = async (quantity: number) => {
    try {
      setIsUserMinting(true);
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const signedTransactions: any = await mintMultipleToken(
          candyMachine,
          quantity,
          wallet.publicKey
        );

        const promiseArray = [];
        const txArray = [];

        for (let index = 0; index < signedTransactions.length; index++) {
          const tx = signedTransactions[index];
          txArray.push(tx);
          promiseArray.push(awaitTransactionSignatureConfirmation(
            tx,
            props.txTimeout,
            props.connection,
            true
          ));
        }

        const allTransactionsResult = await Promise.all(promiseArray);
        let totalSuccess = 0;
        let totalFailure = 0;

        for (let index = 0; index < allTransactionsResult.length; index++) {
          const transactionStatus = allTransactionsResult[index];
          if (!transactionStatus?.err) {
            totalSuccess += 1;
          } else {
            totalFailure += 1;
          }
        }

        toast.success(`Congratulations! Mint Successful.`, { duration: 6000});
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      toast.error(message);
    } finally {
      setIsUserMinting(false);
    }
  }

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  const [imageIndex, setImageIndex] = useState(1);
  const [activeFaqIndex, setActiveFaqIndex] = useState(-1);

  const mintRef = useRef(null);
  const aboutRef = useRef(null);
  const teamRef = useRef(null);
  const roadmapRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const timer=setTimeout(() => {
      let index = (imageIndex + 1) % 10;
      if (index == 0) index = 1;
      if (index > 9) index = 9;
      setImageIndex(index);
    }, 200);
    return () => clearTimeout(timer);
  });

  const handleFaq = (index: number) => {
    if (index == activeFaqIndex) {
        setActiveFaqIndex(-1);
    } else {
        setActiveFaqIndex(index);
    }
  }

  return (
    <main>
      <Toaster />

      <Head>
        <title>Gorilla Galaxy</title>
        <meta name="description" content="Genesis is a collection of 2,222 unique, randomly generated Gorillas roaming on the Solana blockchain." />
        <link rel="icon" href="/icon.png" />
      </Head>

      <Header mintRef={mintRef} aboutRef={aboutRef} teamRef={teamRef} roadmapRef={roadmapRef} faqRef={faqRef} />

      <section>
        <div className="w-full flex justify-center items-center">
          <img src={'/images/background.png'} width="100%" />
        </div>
        <div className="">
          <h3 className="text-color-theme text-center overview-title drop-shadow-lg"></h3>
          <p className="text-white text-center overview-desc px-5 md:px-24"></p>
        </div>
      </section>

      <section ref={mintRef}>
        <h3 className="text-white text-center presale-title drop-shadow-lg pb-10">Mint a Genesis Gorilla</h3>
        <div className="flex flex-row justify-center items-center space-x-10 px-5">
          <div className="flex flex-col justify-center items-center space-y-3">
            {wallet.connected &&
              <>
                {candyMachine && 
                  <>
                    <div className="text-center text-white">
                      Minted / Total {`${candyMachine?.state.itemsRedeemed} / ${candyMachine?.state.itemsAvailable}`}
                    </div>
                    <div className="text-center text-white">
                      Price {getMintPrice(candyMachine)} SOL
                    </div>
                  </>
                }
                <MintCountdown
                  date={toDate(
                    candyMachine?.state.goLiveDate
                      ? candyMachine?.state.goLiveDate
                      : candyMachine?.state.isPresale
                      ? new anchor.BN(new Date().getTime() / 1000)
                      : undefined,
                  )}
                  style={{ justifyContent: 'flex-end' }}
                  status={
                    !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
                      ? 'COMPLETED'
                      : candyMachine?.state.isPresale
                      ? 'PRESALE'
                      : 'MINT IS LIVE'
                  }
                />
                {/* <input 
                  min={1}
                  max={10}
                  disabled={
                    candyMachine?.state.isSoldOut ||
                    isUserMinting ||
                    !candyMachine?.state.isActive
                  }
                  type="number" 
                  className="input-number"
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                  style={{border: 'solid 1px grey', textAlign: 'center', width: '90%', margin: 5}} 
                  value={quantity} /> */}
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={isUserMinting}
                  onMint={() => onMint(quantity)}
                />
              </>
            }
          </div>
          <div className="flex justify-center items-center outer-glow">
            <img src={`/images/art${imageIndex}.png`} width={200} />
            {/* <img src='/images/shuttle_pass.gif' width={200} /> */}
          </div>
        </div>
      </section>
      
      <section ref={aboutRef}>
        <div className="w-full flex justify-center items-center relative px-5 md:px-10">
          <div className="flex flex-col md:flex-row justify-center items-center space-x-5">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
              <h3 className="text-white text-center overview-title drop-shadow-lg">Genesis</h3>
              <div className="overview-desc-panel text-white p-5">
                Gorilla Galaxy: Genesis is a collection of 2,222 unique, randomly generated Gorillas roaming on the Solana blockchain. 
                <br />
                <br />
                Every Genesis Gorilla is unique and programmatically generated from over 130+ possible attributes and traits like background, fur, clothes, mouth, head, earrings and eyes. Some gorillas will be rarer than others. 
                <br />
                <br />
                Your genesis gorilla isn't just a cool picture. It is your ticket into our ecosystem, bringing you value in the real and digital world.
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <img src={'/images/overview.png'} className="z-order-content" />
              <div className="remove-watermark z-order-top"></div>
            </div>
          </div>          
        </div>
      </section>

      <section ref={roadmapRef}>
        <h5 className="text-white presale-title drop-shadow-lg text-center pb-10">Gorilla Ops</h5>
        <div className="w-full flex flex-col px-5 md:px-10 justify-center items-center">
          <div className="phase-panel w-full md:w-5/6">
            <div className="my-10 flex flex-col space-y-4">
              <h5 className="text-color-theme presale-desc mb-5">
                Q1 2022
              </h5>
              <p className="text-white overview-desc">
                - Genesis mint 02/02/2022
              </p>
              <p className="text-white overview-desc">
                - Launch of staking and $GLUE token
              </p>
              <p className="text-white overview-desc">
                - Gorilla Galaxy: Companion Collection mint (Free to holders, minted with $GLUE token)
              </p>
              <p className="text-white overview-desc">
                - Development of Gorilla Galaxy Arcade Begins
              </p>
            </div>

            <div className="my-10 flex flex-col space-y-4">
              <h5 className="text-color-theme presale-desc mb-5">
                Q2 2022
              </h5>
              <p className="text-white overview-desc">
                - Gorilla Galaxy Arcade launch wagers of SOL and GLUE open
              </p>
              <p className="text-white overview-desc">
                - Revenue from the Arcade is collected to be shared with Genesis holders
              </p>
              <p className="text-white overview-desc">
                - Gorilla Galaxy: Generation 2 is announced
              </p>
            </div>

            <div className="my-10 flex flex-col space-y-4">
              <h5 className="text-color-theme presale-desc mb-5">
                Q3 2022
              </h5>
              <p className="text-white overview-desc">
                - First revenue share from the Arcade is distributed to Genesis holders
              </p>
              <p className="text-white overview-desc">
                - Generation 3 emerges via breeding between Genesis and Generation 2
              </p>
            </div>

            <div className="my-10 flex flex-col space-y-4">
              <h5 className="text-color-theme presale-desc mb-5">
                Q4 2022
              </h5>
              <p className="text-white overview-desc">
                - Gorilla Galaxy P2E Game announcement
              </p>
              <p className="text-white overview-desc">
                - Gameplay sneak peeks
              </p>
              <p className="text-white overview-desc">
                - Continuous revenue share airdrops from the Arcade
              </p>
            </div>

            {/* <div className="my-10">
              <p className="text-white overview-desc">
                <br />
                <br />
                We aim to have these models available for Solana metaverse integration when it is available.
                <br />
                <br />
                More to come with Gorilla Ops v2.0....
              </p>
            </div> */}
          </div>
        </div>
      </section>

      <section ref={faqRef}>
        <div className="w-full px-5 md:px-16 pb-10 relative">
          <h3 className="text-white presale-title pb-10 text-center">FAQ</h3>

          <div className="panel-faq">
            <div className={activeFaqIndex == 0 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(0)}>
                    <div>Blockchain?</div>
                    <div className='faq-icon'>{activeFaqIndex == 0 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 0 ? 'active-faq-content' : 'faq-content'}>Solana</div>
            </div>
            <div className={activeFaqIndex == 1 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(1)}>
                    <div>Supply?</div>
                    <div className='faq-icon'>{activeFaqIndex == 1 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 1 ? 'active-faq-content' : 'faq-content'}>The total supply of Genesis gorillas is 2,222.</div>
            </div>
            <div className={activeFaqIndex == 2 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(2)}>
                    <div>When?</div>
                    <div className='faq-icon'>{activeFaqIndex == 2 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 2 ? 'active-faq-content' : 'faq-content'}>Feb 2nd 2022</div>
            </div>
            <div className={activeFaqIndex == 3 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(3)}>
                    <div>Mint price?</div>
                    <div className='faq-icon'>{activeFaqIndex == 3 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 3 ? 'active-faq-content' : 'faq-content'}>Genesis gorillas will cost 0.77 SOL each to mint.</div>
            </div>
            <div className={activeFaqIndex == 4 ? 'faq active-faq' : 'faq'}>
                <div className='faq-header' onClick={() => handleFaq(4)}>
                    <div>Token?</div>
                    <div className='faq-icon'>{activeFaqIndex == 4 ? <img src={'/images/icon_faq_active.png'} width='20' /> : <img src={'/images/icon_faq.png'} width='12' />}</div>
                </div>
                <div className={activeFaqIndex == 4 ? 'active-faq-content' : 'faq-content'}>The token name is $GLUE, this will be released after the collection is sold out. (1 TOKEN = 1 TOKEN)</div>
            </div>
          </div>
        </div>
      </section>

      <section ref={teamRef}>
        <h3 className="text-white text-center overview-title drop-shadow-lg pb-10">GORILLA GALAXY TEAM</h3>
        <div className="w-full flex justify-center items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-8 px-5 md:px-10">
            <div className="col-span-1"></div>

            <div className="col-span-2 flex flex-col justify-center items-center">
              <img src={'/images/team1.png'} width={"80%"} />
              <div className="flex flex-row justify-center items-center space-x-4 mt-5 mb-3">
                <h5 className="text-color-theme text-center team-title">Non-Fungibro</h5>
                <a href="https://twitter.com/NonFungibro?s=21" target="_blank">
                  <img src={'/images/icon_twitter.png'} width={30} height={30} />
                </a>
              </div>
              <p className="text-white text-center overview-desc">CO-FOUNDER</p>
            </div>

            <div className="col-span-2 flex flex-col justify-center items-center">
              <img src={'/images/team2.png'} width={"80%"} />
              <div className="flex flex-row justify-center items-center space-x-4 mt-5 mb-3">
                <h5 className="text-color-theme text-center team-title">CDZ</h5>
                <a href="https://twitter.com/cdz999" target="_blank">
                  <img src={'/images/icon_twitter.png'} width={30} height={30} />
                </a>
              </div>
              <p className="text-white text-center overview-desc">CO-FOUNDER</p>
            </div>

            <div className="col-span-1"></div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full flex justify-center items-center px-5 md:px-10 mb-10">
          <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
            <h3 className="text-color-theme text-center presale-title drop-shadow-lg">Community</h3>
            <div className="w-full flex justify-center items-center">
              <Link href="/"><img src={'/images/logo.png'} width={200} className="cursor-pointer" /></Link>
            </div>
            <a href="https://discord.gg/GZpTs7pG27" target="_blank">
              <button className="button-connect">JOIN OUR DISCORD</button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {(wallet.connected && isUserMinting) &&
        <div className="w-full h-full fixed block top-0 left-0 bg-black opacity-75 z-50 flex justify-center items-center">
          <div
            className="
              animate-spin
              rounded-full
              h-32
              w-32
              border-t-2 border-b-2 border-white
            "
          ></div>
        </div>
      }
    </main>
  );
};

export default Home;



