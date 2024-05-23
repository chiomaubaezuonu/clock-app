import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import refresh from "./icon-refresh.svg"
import { Switch } from 'antd';
import moon from "./moon.svg"

let timeOfYear = "";
let dayOfWeek = ""
let weekNum = ""
let fetchQuotes: any;
let author = ""

function App() {

  const backgroundImages = {
    daytime: "./bg-daytime.jpg",
    nighttime: "./bg-nighttime.jpg",
  };

  const hour = new Date().getHours()
  const [time, setTime] = useState("");
  const [quotes, setQuotes] = useState(fetchQuotes)
  const [abbrev, setAbbrev] = useState("")
  const [timeZone, setTimezone] = useState("")
  const [more, setMore] = useState(false)
  const [currentBgImage, setCurrentBgImage] = useState(backgroundImages.nighttime);


  useEffect(() => {
    if (hour >= 6 && hour < 18) {
      setCurrentBgImage(backgroundImages.daytime);
    } else {
      setCurrentBgImage(backgroundImages.nighttime);
    }
  }, [])

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
      <div className="App" style={{ backgroundImage: currentBgImage }}>
        <div className="quotes-div">
          <p className='quotes'>{quotes}</p>
          <img onClick={fetchQuotes} src={refresh} alt='refresh icon' className='refresh-icon' />
        </div>
        <h2 className='author'>{author}</h2>
        <div className="time-div">
          <img src={moon} className='moon' alt='moon icon' />
          <div>
            <h2 className='time'>  {hour >= 1 && hour < 12 ? "Good morning, it is currently: " + time
              : hour >= 12 && hour < 17 ? "Good afternoon, it is currently: " + time
                : hour >= 18 && hour < 23
                  ? "Good evening! it is currently: " + time
                  : "Good morning, it is currently: " + time
            }
            </h2>
            <p>{abbrev}</p>
            <p>IN {timeZone}</p>
          </div>

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
