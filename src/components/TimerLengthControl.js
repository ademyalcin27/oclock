import React from 'react';
import Button from './Button'

const TimerLengthControl = ({titleID, title, minID, onClick, lengthID, length, addID}) => {

    return <div className="length-control">
        <div id={titleID}>{title}</div>
        
        <Button className="btn-level" id={minID} onClick={onClick} value="-">
            <i className="fa fa-arrow-down fa-2x" /> 
        </Button>
        
        <div className="btn-level" id={lengthID}>{length}</div>
        
        <Button className="btn-level" id={addID} onClick={onClick} value="+">
            <i className="fa fa-arrow-up fa-2x" />
        </Button>
  </div>
}
export default TimerLengthControl;