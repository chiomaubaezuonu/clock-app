import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios'
import refresh from "./refresh .svg"
import moon from "./moon.svg"
import sun from "./sun.svg"
import arrowDown from "./down-arrow.svg"

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
  const [isRotated, setIsRotated] = useState(false)
  // const [currentBgImage, setCurrentBgImage] = useState(backgroundImages.nighttime);


  // useEffect(() => {
  //   if (hour >= 6 && hour < 18) {
  //     setCurrentBgImage(backgroundImages.daytime);
  //   } else {
  //     setCurrentBgImage(backgroundImages.nighttime);
  //   }
  // }, [hour])

  useEffect(() => {
    fetchQuotes = async () => {
      setIsRotated(true)
      await axios.get("https://api.quotable.io/random?tags=technology&minLength=100&maxLength=180")

        .then(response => {
          setQuotes(response.data.content)
          author = response.data.author
        })
    }
  },)
  const handleRotateClick = () => {
    fetchQuotes(); // Call the fetch function
    setIsRotated(!isRotated)
  };




  useEffect(() => {
    const fetchTime = async () => {
      await axios.get("https://worldtimeapi.org/api/ip")
        .then(response => {
          const currentTime = new Date(response.data.datetime).toLocaleTimeString('en-US', { hour12: false })
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace('PM', "").replace('AM', "");
      setTime(newTime);
    }, 1000); // Update time every second (1000 milliseconds)

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, []);
  // style={{ backgroundImage: currentBgImage }}
  return (
    <div className='container'>
      <div className={`App ${more ? 'active' : ''} ${hour >= 1 && hour <= 16 ? "day" : "night"} `} >
        <div className="quotes-div">
          <p className='quotes'>{quotes}</p>
          <img onClick={handleRotateClick} src={refresh} alt='refresh icon' className={`${isRotated ? 'rotateIcon' : 'refresh-icon'}`} />
          {/* {
            isRotated && <SyncOutlined spin  className='refresh' />
          } */}
        </div>
        <h2 className='author'>{author}</h2>
        <div >

          <div className="greeting-div">
            {hour >= 10 && hour > 6 ?
              <img src={sun} className='moon' alt='moon icon' /> :
              <img src={moon} alt='sun icon' />}
            <h2 className='greeting'>  {hour >= 1 && hour < 12 ? "Good morning"
              : hour >= 12 && hour < 17 ? "Good afternoon"
                : hour >= 6 && hour < 11
                  ? "Good evening"
                  : "Good evening"
            }
              <span>, it is currently </span>
            </h2>

          </div>
          <div className='time-div'>
            <p className='time'>{time}</p>
            <p className='abbrev'>{abbrev}</p>
          </div>
          <p className='timezone'>IN {timeZone}</p>
        </div>

        {/* More switch */}
        <div className='more-switch' onClick={() => setMore(!more)}>
          <p className='more-text'>{`${more ? 'LESS' : 'MORE'}`}</p>
          <div className='arrow-div'>
            <img src={arrowDown} className={` ${more ? 'rotate' : ''}`} alt='down arrow' />
          </div>
        </div>

      </div>
      {more &&
        <section className='additional-data active'>
          <div className='dayOfYear'>
            <div className='small'>
              <p className='first-p'>Current Timezone</p>
              <p className='second-p'>{timeZone}</p>
            </div>
            <div className='small'>
              <p className='first-p'>Day of the year</p>
              <p className='second-p'>{timeOfYear}</p>
            </div>
          </div>

          <div className='week-div'>
            <div className='small'>
              <p className='first-p'>Day of week</p>
              <p className='second-p'>{dayOfWeek}</p>
            </div>
            <div className='small' style={{ marginRight: '2rem' }}>
              <p className='first-p'>Week Number</p>
              <p className='second-p'>{weekNum}</p>
            </div>
          </div>
        </section>

      }
      
    </div>
  );
}

export default App;
