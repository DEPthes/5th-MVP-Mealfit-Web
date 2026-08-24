interface KakaoLatLng {
  getLat(): number
  getLng(): number
}

interface KakaoMap {
  relayout(): void
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void
}

interface KakaoMaps {
  load(callback: () => void): void

  LatLng: new (latitude: number, longitude: number) => KakaoLatLng

  Map: new (
    container: HTMLElement,
    options: {
      center: KakaoLatLng
      level: number
    },
  ) => KakaoMap

  Marker: new (options: {
    map?: KakaoMap
    position: KakaoLatLng
    title?: string
  }) => KakaoMarker
}

interface Window {
  kakao?: {
    maps?: KakaoMaps
  }
}