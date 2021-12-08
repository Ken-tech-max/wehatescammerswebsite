import React from 'react';

const Footer: React.FC = () => {
  return <div className="flex bg-black justify-center py-10">
    <div className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-6 px-10">
        <a href="https://twitter.com/gorillaglxy" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_twitter.png'} />
        </a>
        <a href="https://discord.gg/YM6NKnVHsB" target="_blank" className="inline-flex text-center justify-center items-center">
          <img src={'/images/icon_discord.png'} />
        </a>
      </div>

      <p className="text-white text-center">Copyright © 2021, All rights reserved.</p>
    </div>
  </div>;
}

export default Footer;