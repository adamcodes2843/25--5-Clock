import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faArrowsRotate, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

const playButton = <FontAwesomeIcon icon={faPlay} />;
const pauseButton = <FontAwesomeIcon icon={faPause} />;


const BreakSess = ({sessionLength, breakLength, incrementSession, incrementBreak, decrementSession, decrementBreak}) => {

  return (
  <div className="bsLengthBox flex flex-row 2xl:text-5xl text-4xl md:w-6/8 2xl:w-7/12 w-10/12 justify-between items-center text-center font-mono mr-4">
    <div className="sessionBox">
      <h2 id="session-label" className="">Session Length</h2>
      <div className="sessionControl 2xl:mt-4 mt-2">
        <button id="session-increment" onClick={incrementSession}>
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
        <h3 id="session-length">{sessionLength}</h3>
        <button id="session-decrement" onClick={decrementSession}>
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>
    </div>
    <div className="breakBox ml-4">
      <h2 id="break-label" className="">Break Length</h2>
      <div className="breakControl 2xl:mt-4 mt-2">
        <button id="break-increment" onClick={incrementBreak}>
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
        <h3 id="break-length">{breakLength}</h3>
        <button id="break-decrement" onClick={decrementBreak}>
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>
    </div>
  </div>
  );
}

const Timer = ({timeFormatter, playPause, sessBreakLabel, restartButton, changePP}) => {
  
  return (
  <div className="timerBox flex flex-col justify-between items-center font-mono lg:text-6xl text-5xl md:border-4 border-black rounded-xl 3xl:py-10 py-3 w-96">
    <h2 id="timer-label" className="border-b-4 border-black">{sessBreakLabel}</h2>
    <div id="time-left" className="mt-6" >{timeFormatter()}</div>
    <div className="buttonsBox md:text-4xl text-3xl md:mt-4">
      <button id="start_stop" className="p-4" onClick={changePP}>
        {playPause}
      </button>
      <button id="reset" className="p-4" onClick={restartButton}>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>
    </div>
  </div>
  )
}

function App() {
  const [sessionLength, setSessionLength] = useState(25)
  const [breakLength, setBreakLength] = useState(5)
  const [sessBreakLabel, setSessBreakLabel] = useState("Session")
  const [playPause, setPlayPause] = useState(playButton)
  const [timeLeft, setTimeLeft] = useState(1500)

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const changeSessBreak = () => {
    const audio = document.getElementById("beep");
    if(!timeLeft && sessBreakLabel === "Session") {
      setTimeLeft(breakLength * 60)
      setSessBreakLabel("Break")
      audio.play()
    } else if (!timeLeft && sessBreakLabel ==="Break"){
      setTimeLeft(sessionLength * 60)
      setSessBreakLabel("Session")
      audio.pause()
      audio.currentTime = 0
    }
  }

  let timeout;
  useEffect(() => {
    if (playPause === pauseButton)
        timeout = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        changeSessBreak()
      }, 1000);
    else {
        return () => clearTimeout(timeout)
      }
    }, [timeLeft, timeout, playPause])
  
  const incrementSession = () => {
    if (sessionLength < 60 && playPause === playButton) {
      setSessionLength(sessionLength + 1)
      if (sessBreakLabel === "Session")
        setTimeLeft(timeLeft + 60)
    }
  }

  const incrementBreak = () => {
    if (breakLength < 60 && playPause === playButton) {
      setBreakLength(breakLength + 1)
      if (sessBreakLabel === "Break")
        setTimeLeft(timeLeft + 60)
    }
  }

  const decrementSession = () => {
    if (sessionLength > 1 && playPause === playButton) {
      setSessionLength(sessionLength - 1)
      if (sessBreakLabel === "Session")
        setTimeLeft(timeLeft - 60)
    }
  }

  const decrementBreak = () => {
    if (breakLength > 1 && playPause === playButton) {
      setBreakLength(breakLength - 1)
      if (sessBreakLabel === "Break")
        setTimeLeft(timeLeft - 60)
    }
  }

  const restartButton = () => {
    clearTimeout(timeout)
    setPlayPause(playButton)
    setSessBreakLabel("Session")
    setSessionLength(25)
    setBreakLength(5)
    setTimeLeft(1500)
    const audio = document.getElementById("beep")
    audio.pause()
    audio.currentTime = 0
  }

  const changePP = () => {
      if (playPause === pauseButton){
        setPlayPause(playButton)
        clearTimeout(timeout)
      } else if (playPause === playButton){
        setPlayPause(pauseButton)
      }
      
  }
  
  
  return (
    <div className="App bg-gradient-to-r from-green-200 to-pink-200 pt-8 w-screen h-screen overflow-hidden">
      <div className="flex flex-col lg:justify-around justify-between items-center h-[90vh]">
      <BreakSess sessionLength={sessionLength} breakLength={breakLength} incrementSession={incrementSession} incrementBreak={incrementBreak} decrementSession={decrementSession} decrementBreak={decrementBreak} />
      <Timer playPause={playPause} sessBreakLabel={sessBreakLabel}  changePP={changePP} restartButton={restartButton} timeFormatter={timeFormatter} />
      <h1 className="2xl:text-7xl md:pt-8 md:text-6xl text-5xl text-center font-display md:font-medium">25 + 5 <br /> Clock</h1>
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
        </div>
      </div>
  );
}

export default App;