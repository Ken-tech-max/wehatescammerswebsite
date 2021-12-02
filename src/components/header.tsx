import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from '../hooks/use-window-size';
import { useLocalStorage } from '@solana/wallet-adapter-react';

const Header = ({mintRef, aboutRef, teamRef, roadmapRef}: any) => {

  const {width, height} = useWindowSize();

  const [isMenuShowed, setIsMenuShowed] = useState(false);
  const [tag, setTag] = useLocalStorage("TAG", "");

  const handleClickMenu = () => {
    setIsMenuShowed(!isMenuShowed);
  }

  const scrollTo = (ref: any, tag: string) => {
    if (ref == undefined || ref == null) {
      setTag(tag);
      window.location.href = '/';
    } else {
      window.scroll(
        {
          top: ref.current.offsetTop,
          behavior: "smooth",
        }
      );
    }
    
    if (width <= 1280) handleClickMenu();
  }

  return <div className="theme-header md:px-10 w-full">
    <div className="w-full flex flex-row justify-center items-center md:space-x-8">
      <div className="pl-3 md:pl-0">
        <Link href="/"><img src={'/images/logo.png'} width={(width > 768) ? '100px' : '70px'} className="cursor-pointer" /></Link>
      </div>
      {width > 1280 ?
        <>
          <div className="flex-grow flex flex-row space-x-16 items-center justify-center">
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none" onClick={() => scrollTo(mintRef, 'MINT')} >
              MINT
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none" onClick={() => scrollTo(aboutRef, 'ABOUT')} >
              ABOUT
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none" onClick={() => scrollTo(teamRef, 'TEAM')} >
              TEAM
            </button>
            <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none" onClick={() => scrollTo(roadmapRef, 'ROADMAP')} >
              ROADMAP
            </button>
          </div>
          <WalletMultiButton className="button-connect" />
        </>
        :
        <>
          <div className="flex-grow flex justify-center items-center">
            <WalletMultiButton className="button-connect" />
          </div>
          <button className="inline-flex justify-center items-center pr-3" onClick={handleClickMenu} >
            <img src={'/images/icon_menu.png'} width="35" />
          </button>
        </>
      }
    </div>
    {isMenuShowed &&
      <div className="flex flex-col space-y-2 w-full theme-bg-color p-2">
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item" onClick={() => scrollTo(mintRef, 'MINT')} >
          MINT
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item" onClick={() => scrollTo(aboutRef, 'ABOUT')} >
          ABOUT
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item" onClick={() => scrollTo(teamRef, 'TEAM')} >
          TEAM
        </button>
        <button className="outline-none bg-transprent theme-header-link text-white uppercase focus:outline-none header-menu-item" onClick={() => scrollTo(roadmapRef, 'ROADMAP')} >
          ROADMAP
        </button>

        <div className="grid grid-cols-7 gap-6 pt-5">
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <a href="https://mobile.twitter.com/gorilla" className="inline-flex text-center justify-center items-center">
            <img src={'/images/icon_twitter.png'} />
          </a>
          <a href="https://discord.com/invite/gorilla" className="inline-flex text-center justify-center items-center">
            <img src={'/images/icon_discord.png'} />
          </a>
          <a href="https://www.instagram.com/gorilla/" className="inline-flex text-center justify-center items-center">
            <img src={'/images/icon_instagram.png'} />
          </a>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
        </div>
      </div>
    }
  </div>;
}

export default Header;