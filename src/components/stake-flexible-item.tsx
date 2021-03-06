import React from 'react';
import { STAKE_STATUS } from '../utils/constant';

const StakeFlexibleItem = ({image, name, checked, type, nft, poolData, handleButton}: any) => {

  return <div className={`mx-2 md:mx-5 col-span-1 ${checked ? "border-4 border-purple-800" : "border border-gray-500"} rounded-lg overflow-hidden`}>
    <div className="w-full h-full flex flex-col justify-center items-center space-y-2 pb-2">
      <div className="w-full relative">
        <img src={image} width="100%" />
      </div>
      <p className="text-center text-white p-2 border-t border-gray-500"><span className="text-color-theme font-amiga">{name}</span></p>
      {
        type == STAKE_STATUS.STAKED && 
        <button className="button-stake" onClick={() => handleButton(nft)}>Unstake</button>
      }
    </div>
  </div>;
}

export default StakeFlexibleItem;