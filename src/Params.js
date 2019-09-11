import React, { useState, useEffect } from 'react';
import './App.css';
import Socket from './Socket';


function Params(props) {
  const [params, setParams] = useState(props.setupState)
  useEffect(() => {
    Socket.sub(props.name, 'Params', setParams)
    return function cleanup() {
      Socket.unsub(props.name, 'Params')
    }
  }, [props.name])
  const handleChange = (event) => {
    setParams({...params, [event.target.name]: event.target.value});
  }
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    Socket.send({type: props.name, payload: params})
  }
  return (
    <div className="Params">
      {Object.entries(params).map((el) => {
        return (<form key={el[0]} onSubmit={handleSubmit}>
          <label>{el[0]}
            <input className="params" type="text" value={el[1]} name={el[0]} onChange={handleChange} />
          </label> 
        </form>)
      })}
    </div>
  );
}



export default Params;


