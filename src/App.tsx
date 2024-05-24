import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import refresh from "./icon-refresh.svg"
import { Switch } from 'antd';
import moon from "./moon.svg"
import sun from "./sun.svg"

let timeOfYear = "";
let dayOfWeek = ""
let weekNum = ""
let fetchQuotes: any;
let author = ""
let initialQuote = "Imagination is more important than knowledge. For while knowledge defines all we currently know and understand, imagination points to all we might yet discover and create."
function App() {

  const backgroundImages = {
    daytime: "images/bg-daytime.jpg",
    nighttime: "../images/bg-nightime.jpg",

  };

  const hour = new Date().getHours()
  const [time, setTime] = useState("");
  const [quotes, setQuotes] = useState(initialQuote)
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
  }, [hour])

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
    <div className='container'>

      <div className={`App ${more ? 'active' : ''} `} style={{ backgroundImage: currentBgImage }}>
        <div className="quotes-div">
          <p className='quotes'>{quotes}</p>
          <img onClick={fetchQuotes} src={refresh} alt='refresh icon' className='refresh-icon' />
        </div>
        <h2 className='author'>{author}</h2>
        <div >

          <div className="greeting-div">
            {hour >= 10 && hour < 6 ? <img src={moon} className='moon' alt='moon icon' /> :
              <img src={sun} alt='sun icon' />}
            <h2 className='greeting'>  {hour >= 1 && hour < 12 ? "Good morning"
              : hour >= 12 && hour < 17 ? "Good afternoon"
                : hour >= 18 && hour < 23
                  ? "Good evening"
                  : "Good morning"
            }
              <span>, it is currently:" </span>
            </h2>

          </div>
          <div className='time-div'>
            <p className='time'>{time}</p>
            <p className='abbrev'>{abbrev}</p>
          </div>
          <p className='timezone'>IN {timeZone}</p>
        </div>

        <Switch className='switch' checkedChildren="MORE" onChange={() => setMore(!more)} unCheckedChildren="LESS" />
      </div>
      {more &&
        <section className='additional-data'>
          <div className='dayOfYear'>
            <div>
              <h2>Current Timezone</h2>
              <p>{timeZone}</p>
            </div>
            <div>
              <h2>Day of the year</h2>
              <p>{timeOfYear}</p>
            </div>
          </div>

          <div className='week-div'>
            <div>
              <h2>Day of week</h2>
              <p>{dayOfWeek}</p>
            </div>
            <div>
              <h2>Week Number</h2>
              <p>{weekNum}</p>
            </div>
          </div>
        </section>

      }
    </div>
  );
}

export default App;
