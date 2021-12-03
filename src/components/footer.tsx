import React from 'react';
import Link from 'next/link'

const Footer: React.FC = () => {
  return <div className="flex bg-black justify-center py-10">
    <div className="flex flex-col space-y-3">
      <div className="w-full flex justify-center items-center">
        <Link href="/"><img src={'/images/logo.png'} width={200} className="cursor-pointer" /></Link>
      </div>

      <div className="grid grid-cols-2 gap-6 px-10">
        <a href="https://twitter.com/GorillaGNFT" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_twitter.png'} />
        </a>
        <a href="https://discord.com/invite/gorilla" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_discord.png'} />
        </a>
      </div>

      <p className="text-white text-center">Copyright © 2021, All rights reserved.</p>
    </div>
  </div>;
}

export default Footer;