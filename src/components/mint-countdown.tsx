import Countdown from 'react-countdown';

interface MintCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  onComplete,
}) => {
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    if (completed) {
      return status ? <span className="text-center text-white">{status}</span> : null;
    } else {
      return (
        <div className="text-center text-white">
            { (days > 0) && 
            <>
              <span>
                {days < 10 ? `${days}` : days}
              </span>
              <span> d </span>
            </>}
            <span>
              {hours < 10 ? `0${hours}` : hours}
            </span>
            <span> h </span>
            <span>
              {minutes < 10 ? `0${minutes}` : minutes}
            </span>
            <span> m </span>
            <span>
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
            <span> s </span>
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
