import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import refresh from "./icon-refresh.svg"
import { Switch } from 'antd';
let timeOfYear = "";
let dayOfWeek = ""
let weekNum = ""
let fetchQuotes: any;
let author = ""
let morning: string = "Good morning";
let afternoon = "Good afternoon"
let evening = "Good evening"
function App() {
  const hour = new Date().getHours()
  const [time, setTime] = useState("");
  const [quotes, setQuotes] = useState(fetchQuotes)
  const [abbrev, setAbbrev] = useState("")
  const [timeZone, setTimezone] = useState("")
  const [more, setMore] = useState(false)

  useEffect(() => {
    fetchQuotes = async () => {
      await axios.get("https://api.quotable.io/random?tags=technology&minLength=100&maxLength=180")

        .then(response => {
          setQuotes(response.data.content)
          author = response.data.author
        })
    }
  })





  useEffect(() => {
    const fetchTime = async () => {
      await axios.get("http://worldtimeapi.org/api/ip")
        .then(response => {
          const currentTime = new Date(response.data.datetime).toLocaleTimeString()
          const abbreviation = response.data.abbreviation
          const tz = response.data.timezone
          setTime(currentTime)
          setAbbrev(abbreviation)
          setTimezone(tz)
          timeOfYear = response.data.day_of_year
          dayOfWeek = response.data.day_of_week
          weekNum = response.data.week_number
        })
    }
    fetchTime()
  }, [])
  return (
    <div>
      <div className="App">
        <div className="quotes-div">
          <p>{quotes}</p>
          <img onClick={fetchQuotes} src={refresh} alt='refresh icon' className='refresh-icon' />
        </div>
        <h2>{author}</h2>
        <div className="time-div">
          <h2>  {hour >= 5 && hour < 12 ? "Good morning, the time is currently: " + time
            : hour >= 12 && hour < 17 ? "Good afternoon, the time is currently: " + time
              : hour >= 18 && hour < 22
                ? "Good evening! the time is currently: " + time
            : "Good night"
      }
          </h2>
          <p>{abbrev}</p>
          <p>{timeZone}</p>

        </div>

        <Switch className='switch' checkedChildren="MORE" onChange={() => setMore(!more)} unCheckedChildren="LESS" />
      </div>
      {more &&
        <section className='additional-data'>
          <div style={{ display: 'flex', gap: 6 }}>
            <div>
              <h2>Current Timezone</h2>
              <p>{timeZone}</p>
            </div>
            <div>
              <h2>Time of the year</h2>
              <p>{timeOfYear}</p>
            </div>
          </div>
          <div>
            <h2>Day of week</h2>
            <p>{dayOfWeek}</p>
          </div>
          <div>
            <h2>Week Number</h2>
            <p>{weekNum}</p>
          </div>
        </section>

      }
    </div>
  );
}

export default App;
