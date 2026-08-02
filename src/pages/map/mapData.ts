export const FOOD_TYPES = ['한식', '중식', '일식', '양식'] as const

export const DETAIL_TYPES = ['전체', '고기', '면', '밥', '찌개·국', '분식'] as const

export type Restaurant = {
  id: string
  name: string
  distance: string
  match: string
  detail: string
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: '베가보쌈',
    distance: '서울 서대문구 명지대 정류장 기준 150m',
    match: '00%',
    detail: '보쌈정식 · 단백질 28g · 하루 목표(109g)의 26% 충족 · 9,500원 · 도보 2분',
  },
  {
    id: '2',
    name: '한술식당',
    distance: '서울 서대문구 명지대 정류장 기준 300m',
    match: '00%',
    detail: '연어덮밥 · 단백질 34g · 하루 목표(109g)의 31% 충족 · 11,000원 · 도보 4분',
  },
  {
    id: '3',
    name: '그린테이블',
    distance: '서울 서대문구 명지대 정류장 기준 340m',
    match: '00%',
    detail: '닭가슴살 샐러드볼 · 단백질 30g · 하루 목표(109g)의 28% 충족 · 8,500원 · 도보 5분',
  },
  {
    id: '4',
    name: '명지식당',
    distance: '서울 서대문구 명지대 정류장 기준 90m',
    match: '00%',
    detail: '순두부찌개 · 100g당 단백질 6g · 7,000원 · 도보 1분',
  },
]
