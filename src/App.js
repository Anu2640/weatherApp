import { useEffect, useState } from 'react';
import './App.css';
import Description from './components/Description';
import { getFormattedWeatherData } from './weatherServices';
import { ClipLoader } from 'react-spinners'

const hotBg = "https://img.freepik.com/premium-photo/field_87394-32838.jpg"
const coldBg = "https://e0.pxfuel.com/wallpapers/176/446/desktop-wallpaper-cold-cool-weather.jpg"

function App() {
  const [city,setCity] = useState("hyderabad")
  const [weather,setWeather] = useState(null)
  const [units,setUnits] = useState('metric')
  const [bg,setBg] = useState(hotBg)
  const [error, setError] = useState(null)
  const [showWeather, setShowWeather] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeatherData = async() => {
      try {
        const data = await getFormattedWeatherData(city,units)
        setWeather(data)
        // dynamic bg
        const threshold = units === 'metric'? 20:68
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hotBg)
        setError(null)
      } catch (error) {
        setError("Data not found!!")
        setShowWeather(false)
      } finally {
        setIsLoading(false)
      }
      }
    fetchWeatherData()
  },[units,city])

  const handleUnitsClick = (e) => {
    const button = e.currentTarget
    const currentUnit = button.innerText.slice(1)
    const isCelsius = currentUnit === "C";
    // button.innerText = isCelsius ? `${'\u00B0'}F` : `${'\u00B0'}C`;
    button.innerText = isCelsius ? `\u00B0F`:`\u00B0C`
    setUnits(isCelsius? 'metric':'imperial')
  }

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  }

  const handleBackBtn = () => {
    setShowWeather(true)
    setCity("hyderabad")
  }

 

  return (
    <>
    {isLoading? (
      <div className="spinner-container">
        <ClipLoader color={"#36D7B7"} loading={isLoading} size={100} />
    </div>
    ):(
    <>
      {showWeather ? (weather ?(
        <div className="App" style={{backgroundImage:`url(${bg})`}}>
          <div className="overlay">
              <div className="container">
                <div className="section section__inputs">
                  <input onKeyDown={enterKeyPressed} type='text' name='city' placeholder='Enter City...'/>
                  <button onClick={(e) => handleUnitsClick(e)}>&deg;F</button>
                </div>
                <div className="section section__temperature">
                  <div className="icon">
                    <h3>{`${weather.name}, ${weather.country}`}</h3>
                    <img src={weather.iconURL} alt='weatherIcon'/>
                    <h3>{weather.description}</h3>
                  </div>
                  <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} \u00B0 ${
                    units === "metric" ? "C" : "F"
                  }`}</h1>
                  </div>
                </div>
                <Description weather={weather} units={units}/>
              </div>
            </div>
        </div>):null) : (
              <div className='errmsg-container'>
                <img src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg" alt="error" className='error-image'/>
                <h1>{error}</h1>
                <button className='btn' onClick={handleBackBtn}>Back</button>
              </div>
            )}
          </>
    )}
    </>
  );
}

export default App;
