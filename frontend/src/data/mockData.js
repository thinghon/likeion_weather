export const EMOTIONS = {
  sunny: { id: 'sunny', label: '맑음', icon: '☀️', color: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  cloudy: { id: 'cloudy', label: '흐림', icon: '⛅', color: '#F1F5F9', border: '#94A3B8', text: '#475569' },
  rainy:  { id: 'rainy',  label: '비',   icon: '🌧️', color: '#DBEAFE', border: '#3B82F6', text: '#1D4ED8' },
  storm:  { id: 'storm',  label: '폭풍', icon: '⛈️', color: '#EDE9FE', border: '#7C3AED', text: '#5B21B6' },
}

// 줌 아웃(전국 뷰)에서 표시: 시도별 대표 감정 마크
export const PROVINCE_MARKS = [
  { id: 'p-seoul',   coordinates: [126.978,  37.566], emotion: 'cloudy', label: '서울' },
  { id: 'p-busan',   coordinates: [129.076,  35.180], emotion: 'sunny',  label: '부산' },
  { id: 'p-incheon', coordinates: [126.705,  37.456], emotion: 'rainy',  label: '인천' },
  { id: 'p-daegu',   coordinates: [128.601,  35.871], emotion: 'cloudy', label: '대구' },
  { id: 'p-gwangju', coordinates: [126.853,  35.160], emotion: 'sunny',  label: '광주' },
  { id: 'p-daejeon', coordinates: [127.385,  36.350], emotion: 'storm',  label: '대전' },
  { id: 'p-ulsan',   coordinates: [129.311,  35.538], emotion: 'rainy',  label: '울산' },
  { id: 'p-sejong',  coordinates: [127.289,  36.480], emotion: 'cloudy', label: '세종' },
  { id: 'p-gyeonggi',coordinates: [127.200,  37.300], emotion: 'sunny',  label: '경기' },
  { id: 'p-gangwon', coordinates: [128.200,  37.800], emotion: 'cloudy', label: '강원' },
  { id: 'p-chungbuk',coordinates: [127.700,  36.800], emotion: 'rainy',  label: '충북' },
  { id: 'p-chungnam',coordinates: [126.800,  36.518], emotion: 'sunny',  label: '충남' },
  { id: 'p-jeonbuk', coordinates: [127.153,  35.718], emotion: 'cloudy', label: '전북' },
  { id: 'p-jeonnam', coordinates: [126.991,  34.868], emotion: 'rainy',  label: '전남' },
  { id: 'p-gyeongbuk',coordinates:[128.889,  36.492], emotion: 'storm',  label: '경북' },
  { id: 'p-gyeongnam',coordinates:[128.213,  35.461], emotion: 'cloudy', label: '경남' },
  { id: 'p-jeju',    coordinates: [126.531,  33.500], emotion: 'sunny',  label: '제주' },
]

// 줌 인 시 표시: 개인별 감정 마크
export const INDIVIDUAL_MARKS = [
  { id: 1, coordinates: [126.9780, 37.5665], emotion: 'sunny',  comment: '오늘 날씨처럼 기분도 맑아요',      timestamp: Date.now() - 180000,  region: '서울' },
  { id: 2, coordinates: [129.0756, 35.1796], emotion: 'cloudy', comment: '기차 기다리는 중. 조용한 오후',    timestamp: Date.now() - 300000,  region: '부산' },
  { id: 3, coordinates: [126.5312, 33.4996], emotion: 'rainy',  comment: '갑자기 소나기. 카페에서 쉬는 중',  timestamp: Date.now() - 720000,  region: '제주' },
  { id: 4, coordinates: [126.8000, 36.5184], emotion: 'sunny',  comment: '',                                  timestamp: Date.now() - 60000,   region: '충남' },
  { id: 5, coordinates: [127.7298, 37.8813], emotion: 'storm',  comment: '시험기간 너무 힘들다',             timestamp: Date.now() - 900000,  region: '강원' },
]
