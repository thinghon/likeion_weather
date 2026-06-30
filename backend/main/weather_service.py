import json
import urllib.request
import urllib.error
import random
import os

# Map Korean province names to OpenWeatherMap city queries
REGION_CITY_MAP = {
    "서울": "Seoul",
    "부산": "Busan",
    "인천": "Incheon",
    "대구": "Daegu",
    "광주": "Gwangju",
    "대전": "Daejeon",
    "울산": "Ulsan",
    "세종": "Sejong",
    "경기": "Suwon",
    "강원": "Chuncheon",
    "충북": "Cheongju",
    "충남": "Cheonan",
    "전북": "Jeonju",
    "전남": "Mokpo",
    "경북": "Andong",
    "경남": "Changwon",
    "제주": "Jeju"
}

def map_weather_id_to_emotion(weather_main, weather_id):
    """
    Map OpenWeatherMap condition codes to our 4 categories:
    - sunny (맑음)
    - cloudy (흐림)
    - rainy (비)
    - storm (폭풍)
    """
    main_lower = weather_main.lower()
    
    if "thunderstorm" in main_lower or weather_id < 300:
        return "storm"
    elif "rain" in main_lower or "drizzle" in main_lower or 300 <= weather_id < 600:
        return "rainy"
    elif "snow" in main_lower or 600 <= weather_id < 700:
        return "rainy"  # Map snow to rainy/wet condition
    elif "clear" in main_lower or weather_id == 800:
        return "sunny"
    else:
        # Clouds, Mist, Smoke, Haze, Dust, Fog, etc.
        return "cloudy"

def fetch_real_weather(region_name):
    """
    Fetch current weather for a region from OpenWeatherMap API.
    If API key is missing or request fails, generate consistent mock weather based on date and region.
    """
    api_key = os.environ.get("OPENWEATHERMAP_API_KEY")
    city = REGION_CITY_MAP.get(region_name, "Seoul")
    
    if api_key:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city},KR&appid={api_key}&units=metric"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=3) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                temp = data["main"]["temp"]
                weather_main = data["weather"][0]["main"]
                weather_id = data["weather"][0]["id"]
                
                mapped_weather = map_weather_id_to_emotion(weather_main, weather_id)
                return {
                    "temp": round(temp, 1),
                    "weather": mapped_weather,
                    "raw_desc": data["weather"][0]["description"]
                }
        except Exception as e:
            print(f"Error fetching OpenWeatherMap for {region_name}: {str(e)}")
            # Fall through to mock on failure
            
    # Mock fallback: Generate deterministic mock weather based on region name hash + current hour
    import time
    from datetime import datetime
    
    current_hour = datetime.now().hour
    # Use region name character sum + day of year to make it consistent for the day but varying by region
    day_of_year = datetime.now().timetuple().tm_yday
    val = sum(ord(c) for c in region_name) + day_of_year + current_hour // 6
    
    weathers = ["sunny", "cloudy", "rainy", "storm"]
    # Adjust weights to make sunny and cloudy more common
    weights = [0.45, 0.35, 0.15, 0.05]
    
    # Deterministic choice based on val
    idx = val % 4
    mock_weather = weathers[idx]
    
    # Temperature ranges by season (roughly based on month)
    month = datetime.now().month
    if 6 <= month <= 8:  # Summer
        mock_temp = 22.0 + (val % 10)
    elif 12 <= month or month <= 2:  # Winter
        mock_temp = -5.0 + (val % 8)
    else:  # Spring/Autumn
        mock_temp = 10.0 + (val % 12)
        
    return {
        "temp": round(mock_temp, 1),
        "weather": mock_weather,
        "raw_desc": "Mock weather"
    }


def fetch_current_weather_detail(region_name):
    """
    상세 현재 날씨(온도/체감/설명/아이콘/습도/풍속)를 서버에서 조회한다.
    OpenWeather 키를 서버에만 두기 위한 프록시용. 키가 없거나 실패하면 None.
    """
    api_key = os.environ.get("OPENWEATHERMAP_API_KEY")
    if not api_key:
        return None

    city = REGION_CITY_MAP.get(region_name, "Seoul")
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city},KR&appid={api_key}&units=metric&lang=kr"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            d = json.loads(response.read().decode('utf-8'))
        return {
            "temp": round(d["main"]["temp"]),
            "feels_like": round(d["main"]["feels_like"]),
            "description": d["weather"][0]["description"],
            "icon": d["weather"][0]["icon"],
            "humidity": d["main"]["humidity"],
            "wind": round(d["wind"]["speed"] * 3.6),
        }
    except Exception as e:
        print(f"Error fetching detailed weather for {region_name}: {str(e)}")
        return None
