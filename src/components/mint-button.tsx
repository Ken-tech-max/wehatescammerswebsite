import { CandyMachineAccount } from '../utils/candy-machine';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: () => Promise<void>;
  candyMachine?: CandyMachineAccount;
  isMinting: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <div className="loader"></div>;
    } else if (candyMachine?.state.isPresale) {
      return 'PRESALE MINT';
    }

    return 'MINT';
  };

  return (
    <button
      disabled={
        candyMachine?.state.isSoldOut ||
        isMinting ||
        !candyMachine?.state.isActive
      }
      onClick={async () => {
        setClicked(true);
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            setClicked(true);
          } else {
            await requestGatewayToken();
          }
        } else {
          await onMint();
          setClicked(false);
        }
      }}
      className="inline-block button-connect flex justify-center items-center mt-5"
    >
      {getMintButtonContent()}
    </button>
  );
};
