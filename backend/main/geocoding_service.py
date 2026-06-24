import math


KOREA_LOCATION_POINTS = [
    {"province": "서울", "city": "서울특별시", "lat": 37.5665, "lng": 126.9780},
    {"province": "부산", "city": "부산광역시", "lat": 35.1796, "lng": 129.0756},
    {"province": "대구", "city": "대구광역시", "lat": 35.8714, "lng": 128.6014},
    {"province": "인천", "city": "인천광역시", "lat": 37.4563, "lng": 126.7052},
    {"province": "광주", "city": "광주광역시", "lat": 35.1595, "lng": 126.8526},
    {"province": "대전", "city": "대전광역시", "lat": 36.3504, "lng": 127.3845},
    {"province": "울산", "city": "울산광역시", "lat": 35.5384, "lng": 129.3114},
    {"province": "세종", "city": "세종특별자치시", "lat": 36.4800, "lng": 127.2890},
    {"province": "경기", "city": "수원시", "lat": 37.2636, "lng": 127.0286},
    {"province": "경기", "city": "성남시", "lat": 37.4200, "lng": 127.1265},
    {"province": "경기", "city": "고양시", "lat": 37.6584, "lng": 126.8320},
    {"province": "경기", "city": "용인시", "lat": 37.2411, "lng": 127.1776},
    {"province": "경기", "city": "부천시", "lat": 37.5034, "lng": 126.7660},
    {"province": "경기", "city": "안산시", "lat": 37.3219, "lng": 126.8309},
    {"province": "경기", "city": "안양시", "lat": 37.3943, "lng": 126.9568},
    {"province": "경기", "city": "평택시", "lat": 36.9921, "lng": 127.1129},
    {"province": "경기", "city": "화성시", "lat": 37.1995, "lng": 126.8312},
    {"province": "강원", "city": "춘천시", "lat": 37.8813, "lng": 127.7298},
    {"province": "강원", "city": "원주시", "lat": 37.3422, "lng": 127.9202},
    {"province": "강원", "city": "강릉시", "lat": 37.7519, "lng": 128.8761},
    {"province": "강원", "city": "속초시", "lat": 38.2070, "lng": 128.5918},
    {"province": "충북", "city": "청주시", "lat": 36.6424, "lng": 127.4890},
    {"province": "충북", "city": "충주시", "lat": 36.9910, "lng": 127.9259},
    {"province": "충북", "city": "제천시", "lat": 37.1326, "lng": 128.1910},
    {"province": "충남", "city": "천안시", "lat": 36.8151, "lng": 127.1139},
    {"province": "충남", "city": "아산시", "lat": 36.7898, "lng": 127.0018},
    {"province": "충남", "city": "서산시", "lat": 36.7848, "lng": 126.4503},
    {"province": "충남", "city": "당진시", "lat": 36.8931, "lng": 126.6283},
    {"province": "충남", "city": "공주시", "lat": 36.4466, "lng": 127.1190},
    {"province": "충남", "city": "논산시", "lat": 36.1871, "lng": 127.0987},
    {"province": "전북", "city": "전주시", "lat": 35.8242, "lng": 127.1480},
    {"province": "전북", "city": "군산시", "lat": 35.9677, "lng": 126.7366},
    {"province": "전북", "city": "익산시", "lat": 35.9483, "lng": 126.9576},
    {"province": "전북", "city": "정읍시", "lat": 35.5699, "lng": 126.8559},
    {"province": "전남", "city": "목포시", "lat": 34.8118, "lng": 126.3922},
    {"province": "전남", "city": "여수시", "lat": 34.7604, "lng": 127.6622},
    {"province": "전남", "city": "순천시", "lat": 34.9506, "lng": 127.4872},
    {"province": "전남", "city": "나주시", "lat": 35.0161, "lng": 126.7108},
    {"province": "전남", "city": "광양시", "lat": 34.9407, "lng": 127.6959},
    {"province": "경북", "city": "포항시", "lat": 36.0190, "lng": 129.3435},
    {"province": "경북", "city": "경주시", "lat": 35.8562, "lng": 129.2247},
    {"province": "경북", "city": "김천시", "lat": 36.1398, "lng": 128.1136},
    {"province": "경북", "city": "안동시", "lat": 36.5684, "lng": 128.7294},
    {"province": "경북", "city": "구미시", "lat": 36.1195, "lng": 128.3446},
    {"province": "경북", "city": "영주시", "lat": 36.8057, "lng": 128.6241},
    {"province": "경북", "city": "경산시", "lat": 35.8251, "lng": 128.7415},
    {"province": "경남", "city": "창원시", "lat": 35.2279, "lng": 128.6811},
    {"province": "경남", "city": "진주시", "lat": 35.1802, "lng": 128.1076},
    {"province": "경남", "city": "통영시", "lat": 34.8544, "lng": 128.4332},
    {"province": "경남", "city": "김해시", "lat": 35.2285, "lng": 128.8894},
    {"province": "경남", "city": "양산시", "lat": 35.3350, "lng": 129.0370},
    {"province": "제주", "city": "제주시", "lat": 33.4996, "lng": 126.5312},
    {"province": "제주", "city": "서귀포시", "lat": 33.2541, "lng": 126.5601},
]


def haversine_km(lat1, lng1, lat2, lng2):
    radius = 6371.0088
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(d_lng / 2) ** 2
    )
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def resolve_location(lat, lng):
    nearest = min(
        KOREA_LOCATION_POINTS,
        key=lambda point: haversine_km(lat, lng, point["lat"], point["lng"]),
    )
    distance_km = haversine_km(lat, lng, nearest["lat"], nearest["lng"])

    return {
        "latitude": lat,
        "longitude": lng,
        "province": nearest["province"],
        "city": nearest["city"],
        "region": f'{nearest["province"]} {nearest["city"]}',
        "display_name": f'{nearest["province"]} {nearest["city"]}',
        "distance_km": round(distance_km, 2),
        "method": "nearest_city_center",
    }
