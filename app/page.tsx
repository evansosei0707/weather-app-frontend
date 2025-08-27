"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
} from "lucide-react"

interface WeatherData {
  success: boolean
  city: string
  data?: {
    timestamp: number
    data_fetched_at: number
    temperature: number
    feels_like: number
    humidity: number
    pressure: number
    description: string
    main: string
    wind_speed: number
    wind_direction: number
    clouds: number
    visibility: number
    country: string
    sunrise: number
    sunset: number
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  error?: string
  message?: string
}

const POPULAR_CITIES = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Accra",
  "Kumasi",
  "Kigali",
  "Lagos",
  "Nairobi",
  "Cairo",
  "Berlin",
  "Moscow",
  "Cape Town",
  "Toronto",
]

export default function WeatherApp() {
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState("")

  const fetchWeatherData = async (city: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://wx7jjsj9h2.execute-api.us-east-1.amazonaws.com/prod/weather-data/${city}`
      )
      const data: WeatherData = await response.json()
      setWeatherData(data)

      // Fetch city background image
      if (data.success) {
        fetchCityImage(city)
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setWeatherData({
        success: false,
        city,
        error: "Failed to fetch weather data",
        message: "Please try again later",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCityImage = async (city: string) => {
    try {
      // Using Unsplash API for city images
      // You need to get a free access key from https://unsplash.com/developers
      const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

      if (!UNSPLASH_ACCESS_KEY) {
        console.warn("Unsplash access key not found. Using fallback image.")
        setBackgroundImage(
          `/placeholder.svg?height=1080&width=1920&query=${city} cityscape`
        )
        return
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${city} city skyline&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        setBackgroundImage(data.results[0].urls.full)
      } else {
        // Fallback to a default city image
        setBackgroundImage(
          `/placeholder.svg?height=1080&width=1920&query=${city} cityscape`
        )
      }
    } catch (error) {
      console.error("Error fetching city image:", error)
      // Fallback to placeholder
      setBackgroundImage(
        `/placeholder.svg?height=1080&width=1920&query=${city} cityscape`
      )
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    fetchWeatherData(city)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case "clear":
        return "☀️"
      case "clouds":
        return "☁️"
      case "rain":
        return "🌧️"
      case "snow":
        return "❄️"
      case "thunderstorm":
        return "⛈️"
      case "drizzle":
        return "🌦️"
      case "mist":
      case "fog":
        return "🌫️"
      default:
        return "🌤️"
    }
  }

  return (
    <div
      className={`min-h-screen weather-background transition-all duration-700 ${
        backgroundImage
          ? "bg-cover bg-center"
          : "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
      }`}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
              Weather App
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-pretty">
              Discover the weather in beautiful cities around the world
            </p>
          </div>

          {/* City Selection */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="weather-card border-0">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Select value={selectedCity} onValueChange={handleCitySelect}>
                    <SelectTrigger className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() =>
                      selectedCity && fetchWeatherData(selectedCity)
                    }
                    disabled={!selectedCity || loading}
                    size="icon"
                    className="bg-accent hover:bg-accent/90"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Display */}
          {weatherData && (
            <div className="max-w-4xl mx-auto">
              {weatherData.success && weatherData.data ? (
                <div className="space-y-6">
                  {/* Main Weather Card */}
                  <Card className="weather-card border-0">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <MapPin className="h-5 w-5 text-white/80" />
                          <h2 className="text-2xl font-semibold text-white">
                            {weatherData.city}, {weatherData.data.country}
                          </h2>
                        </div>

                        <div className="text-6xl mb-4">
                          {getWeatherIcon(weatherData.data.main)}
                        </div>

                        <div className="text-5xl font-bold text-white mb-2">
                          {Math.round(weatherData.data.temperature)}°C
                        </div>

                        <div className="text-xl text-white/80 mb-4 capitalize">
                          {weatherData.data.description}
                        </div>

                        <div className="text-white/70">
                          Feels like {Math.round(weatherData.data.feels_like)}°C
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weather Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="weather-card border-0">
                      <CardContent className="p-4 text-center">
                        <Droplets className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {weatherData.data.humidity}%
                        </div>
                        <div className="text-sm text-white/70">Humidity</div>
                      </CardContent>
                    </Card>

                    <Card className="weather-card border-0">
                      <CardContent className="p-4 text-center">
                        <Wind className="h-8 w-8 text-green-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {Math.round(weatherData.data.wind_speed)} m/s
                        </div>
                        <div className="text-sm text-white/70">Wind Speed</div>
                      </CardContent>
                    </Card>

                    <Card className="weather-card border-0">
                      <CardContent className="p-4 text-center">
                        <Gauge className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {weatherData.data.pressure} hPa
                        </div>
                        <div className="text-sm text-white/70">Pressure</div>
                      </CardContent>
                    </Card>

                    <Card className="weather-card border-0">
                      <CardContent className="p-4 text-center">
                        <Eye className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {(weatherData.data.visibility / 1000).toFixed(1)} km
                        </div>
                        <div className="text-sm text-white/70">Visibility</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sun Times */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="weather-card border-0">
                      <CardContent className="p-6 flex items-center gap-4">
                        <Sunrise className="h-10 w-10 text-orange-300" />
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {formatTime(weatherData.data.sunrise)}
                          </div>
                          <div className="text-white/70">Sunrise</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="weather-card border-0">
                      <CardContent className="p-6 flex items-center gap-4">
                        <Sunset className="h-10 w-10 text-orange-300" />
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {formatTime(weatherData.data.sunset)}
                          </div>
                          <div className="text-white/70">Sunset</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="weather-card border-0">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Weather Data Not Available
                    </h3>
                    <p className="text-white/80">
                      {weatherData.message ||
                        "Unable to fetch weather data for this city"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Welcome Message */}
          {!weatherData && (
            <div className="max-w-2xl mx-auto text-center">
              <Card className="weather-card border-0">
                <CardContent className="p-8">
                  <div className="text-6xl mb-6">🌤️</div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Welcome to Weather App
                  </h2>
                  <p className="text-lg text-white/80 text-pretty">
                    Select a city from the dropdown above to view current
                    weather conditions, complete with beautiful city backgrounds
                    and detailed weather information.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
