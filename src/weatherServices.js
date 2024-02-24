const API_KEY = 'c7315c8b5c07f6c35c79afac109add61'

const makeIconURL = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`

const getFormattedWeatherData = async (city, units='metric') => {
    try {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`

        const data= await fetch(URL).then((response) => response.json())

        const {
            weather,
            main:{temp,feels_like,temp_max,temp_min, pressure,humidity},
            wind:{speed},
            sys:{country},
            name,
        } = data

        const {description,icon} = weather[0]

        return {
            description,
            iconURL: makeIconURL(icon),
            temp,
            feels_like,
            temp_max,
            temp_min,
            pressure,
            humidity,
            speed,
            country,
            name
        }
    } catch (error) {
       console.log(error)
    }
}

export {getFormattedWeatherData}