export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data?: T
}

export type Gender = 'MALE' | 'FEMALE'

export type ExerciseCount =
  | 'NONE'
  | 'LIGHT'
  | 'MODERATE'
  | 'ACTIVE'

export type ExerciseIntensity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'

export type Goal =
  | 'LOSS'
  | 'MAINTAIN'
  | 'GAIN'

export type Disease =
  | 'GASTROESOPHAGEAL_REFLUX'
  | 'HYPERTENSION'
  | 'DIABETES'
  | 'HYPERLIPIDEMIA'

export type Cuisine =
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'ASIAN'
  | 'SNACK'
  | 'CAFE_DESSERT'
  | 'ETC'

export type FoodType =
  | 'MEAT'
  | 'NOODLE'
  | 'RICE'
  | 'SOUP'
  | 'SNACK'
  | 'SALAD'
  | 'SEAFOOD'
  | 'FRIED'
  | 'DESSERT'
  | 'PIZZA'
  | 'SANDWICH'

export type NutritionSource =
  | 'OFFICIAL'
  | 'ESTIMATED'

export type NutritionFilter =
  | 'HIGH_PROTEIN'
  | 'LOW_CARB'
  | 'HIGH_CARB'
  | 'LOW_SODIUM'
  | 'LOW_FAT'
  | 'REFLUX_ESOPHAGITIS_SAFE'

export type MatchReason =
  | 'MENU_NAME'
  | 'RESTAURANT_NAME'
  | 'REPRESENTATIVE_FOOD'
  | 'FOOD_TYPE_TAG'

export type ReferencePoint =
  | 'MAIN_GATE'
  | 'BACK_GATE'

export interface Nutrition {
  calories?: number
  carbohydrate?: number
  protein?: number
  fat?: number
  sodium?: number
  source?: NutritionSource
  confidence?: number
}

export interface RestaurantResponse {
  restaurantId: number
  name: string
  address: string
  cuisine: Cuisine
  latitude?: number | null
  longitude?: number | null
  distanceToMainGate?: number | null
  distanceToBackGate?: number | null
}

export interface MenuSearchResponse {
  menuId: number
  menuName: string
  price?: number | null
  foodTypes: FoodType[]
  nutrition?: Nutrition | null
  restaurantId: number
  restaurantName: string
  cuisine: Cuisine
  address: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface UpdateProfileRequest {
  nickname: string
  height?: number
  goal: Goal
  targetWeight?: number
  exerciseCount?: ExerciseCount
  exerciseIntensity?: ExerciseIntensity
  diseases?: Disease[]
}