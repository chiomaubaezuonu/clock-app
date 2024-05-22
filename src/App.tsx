import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import refresh from "./icon-refresh.svg"

function App() {

  const [time, setTime] = useState("1");
  const [quotes, setQuotes] = useState()
  
  useEffect(() => {
    const fetchQuotes = async () => {
      await axios.get("https://api.quotable.io/random?tags=technology&minLength=100&maxLength=180")
        .then(response => {
          setQuotes(response.data.content)
        })
    }
    fetchQuotes()
  }, [])


  useEffect(() => {
    const fetchTime = async () => {
      await axios.get("http://worldtimeapi.org/api/ip")
        .then(response => {
          console.log(response.data)
          setTime(response.data.datetime)
        })
    }
    fetchTime()
  }, [])
  return (
    <div className="App">
      <div className="quotes-div">
        <p>{quotes}</p>
        <img src={refresh} alt='refresh icon' className='refresh-icon' />
      </div>
      <h2>{quotes}</h2>
      {new Date(time).toLocaleString()}
    </div>
  );
}

export default App;
