# API 명세서: 좌표 기반 지역명 조회

## 개요

브라우저 위치 좌표(`latitude`, `longitude`)를 사람이 읽을 수 있는 국내 지역명으로 변환합니다. 프론트엔드에서 현재 표시 중인 `위치 인식 성공 (36.77, 126.93)` 같은 좌표 텍스트를 `위치 인식 성공 (충남 아산시)`처럼 바꿀 때 사용할 수 있습니다.

이 API는 외부 지도 API 키 없이 동작하며, 백엔드에 저장된 국내 주요 시/군/구 중심점 중 가장 가까운 지역을 반환합니다.

## Endpoint

```http
GET /api/location/resolve/?lat={latitude}&lng={longitude}
```

## Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `lat` | number | 예 | 위도 |
| `lng` | number | 예 | 경도 |

## 성공 응답

Status: `200 OK`

```json
{
  "latitude": 36.77,
  "longitude": 126.93,
  "province": "충남",
  "city": "아산시",
  "region": "충남 아산시",
  "display_name": "충남 아산시",
  "distance_km": 6.72,
  "method": "nearest_city_center"
}
```

## 에러 응답

### 좌표 누락

Status: `400 Bad Request`

```json
{
  "error": "Missing required query parameters (lat, lng)"
}
```

### 좌표 형식 오류

Status: `400 Bad Request`

```json
{
  "error": "lat and lng must be valid numbers"
}
```

### 지원 범위 밖 좌표

Status: `400 Bad Request`

```json
{
  "error": "Coordinates are outside supported Korea bounds"
}
```

### 허용하지 않는 메서드

Status: `405 Method Not Allowed`

```json
{
  "error": "Method not allowed"
}
```

## 프론트 연동 예시

```js
const res = await fetch(`${API_URL}/api/location/resolve/?lat=${lat}&lng=${lng}`)
const location = await res.json()

// location.display_name => "충남 아산시"
```