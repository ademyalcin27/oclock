import React, { useState } from 'react';
import { accurateInterval } from '../utils/helper'
import TimerLengthControl from './TimerLengthControl'
import Button from './Button'
const defaultData = {
    brkLength: 5,
    seshLength: 25,
    timerState: 'stopped',
    timerType: 'Session',
    timer: 1500,
    intervalID: '',
    alarmColor: { color: 'white' }
};

const Timer = () => {
    const [data, setData] = useState(defaultData);
    const [audioBeep, setAudioBeep] = useState({});
    
    const lengthControl = (stateToChange, sign, currentLength, timerType) => {
        if (data.timerState === 'running') {
            return;
        }
        if (data.timerType === timerType) {
            if (sign === '-' && currentLength !== 1) {
                setData((prevState) => ({...prevState, [stateToChange]: currentLength - 1 }));
            } else if (sign === '+' && currentLength !== 60) {
                setData((prevState) => ({...prevState, [stateToChange]: currentLength + 1 }));
            }
        } else if (sign === '-' && currentLength !== 1) {
            setData((prevState) => ({...prevState, [stateToChange]: currentLength - 1, timer: currentLength * 60 - 60 }));
        } else if (sign === '+' && currentLength !== 60) {
            setData((prevState) => ({...prevState, [stateToChange]: currentLength + 1, timer: currentLength * 60 + 60 }));
        }
    }
    const setBrkLength = (e) => {
        lengthControl('brkLength', e.currentTarget.value, data.brkLength, 'Session')
    }
    const setSeshLength = (e) => {
        lengthControl('seshLength', e.currentTarget.value, data.seshLength, 'break')
    }
    const beginCountDown = () => {
        const intervalID = accurateInterval(() => {
                        decrementTimer();
                        phaseControl();
                    }, 1000)
        setData((prevState) => ({...prevState, intervalID  }));

    }
    const timerControl = () => {
        if (data.timerState === 'stopped') {
            beginCountDown();
            setData((prevState) => ({...prevState, timerState: 'running'  }));
          } else {
            setData((prevState) => ({...prevState, timerState: 'stopped'  }));
            if (data.intervalID) {
              data.intervalID.cancel();
            }
          }
    }
    const decrementTimer = () => setData((prevState) => ({...prevState, timer: prevState.timer - 1  }));
    const phaseControl = () => {
        let timer = data.timer;
        warning(timer);
        buzzer(timer);
        if (timer < 0) {
          if (data.intervalID) {
            data.intervalID.cancel();
          }
          if (data.timerType === 'Session') {
            beginCountDown();
            switchTimer(data.brkLength * 60, 'Break');
          } else {
            beginCountDown();
            switchTimer(data.seshLength * 60, 'Session');
          }
        }
    }
    const warning = (_timer) => {
      const color = _timer < 61 ? '#a50d0d' : 'white'

      setData((prevState) => ({...prevState, alarmColor: { color }  }))
    }
    const buzzer = (_timer) =>{
      if (_timer === 0) {
        audioBeep.play();
      }
    }
    const switchTimer = (num, str) => {
      setData((prevState) => ({
        ...prevState, 
        ...{ timer: num, timerType: str, alarmColor: { color: 'white' } }  
      }));
    }
    const clockify = () => {
      let minutes = Math.floor(data.timer / 60);
      let seconds = data.timer - minutes * 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return minutes + ':' + seconds;
    }
    const reset = () => {
      const newData = {
        brkLength: 5,
        seshLength: 25,
        timerState: 'stopped',
        timerType: 'Session',
        timer: 1500,
        intervalID: '',
        alarmColor: { color: 'white' }
      }
      setData((prevState) => ({
        ...prevState, 
        newData 
      }));
      if (data.intervalID) {
        data.intervalID.cancel();
      }
      audioBeep.pause();
      audioBeep.currentTime = 0;
    }

    return <div>
      <div className="main-title">25 + 5 Clock</div>
        <TimerLengthControl
          addID="break-increment"
          length={data.brkLength}
          lengthID="break-length"
          minID="break-decrement"
          onClick={setBrkLength}
          title="Break Length"
          titleID="break-label"
        />
         <TimerLengthControl
          addID="session-increment"
          length={data.seshLength}
          lengthID="session-length"
          minID="session-decrement"
          onClick={setSeshLength}
          title="Session Length"
          titleID="session-label"
        />
        <div className="timer" style={data.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{data.timerType}</div>
            <div id="time-left">{clockify()}</div>
          </div>
        </div>
        <div className="timer-control">
          <Button id="start_stop" onClick={timerControl} disabled={data.timerState === 'running'}>
            <i className="fa fa-play fa-2x" />
          </Button>
          <Button id="start_stop" onClick={timerControl} disabled={data.timerState === 'stopped'}>
          <i className="fa fa-pause fa-2x" />
          </Button>
          <Button id="reset" onClick={reset}>
            <i className="fa fa-refresh fa-2x" />
          </Button>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => { setAudioBeep(audio); }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>

}
export default Timer;