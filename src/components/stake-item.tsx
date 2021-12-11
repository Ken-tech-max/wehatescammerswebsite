import React, { useState } from 'react';
import Link from 'next/link';
import { useWindowSize } from '../hooks/use-window-size';

const StakeItem = ({image, title, price}: any) => {

  const {width, height} = useWindowSize();

  return <div className="mx-2 md:mx-5 col-span-1 border border-gray-500 rounded-lg overflow-hidden">
    <div className="w-full h-full flex flex-col justify-center items-center space-y-2 pb-2">
      <div className="w-full relative">
        <img src={image} width="100%" />
      </div>
      <p className="text-center text-white p-2 border-t border-gray-500"><span className="text-color-theme font-amiga">{title}</span></p>
    </div>
  </div>;
}

export default StakeItem;