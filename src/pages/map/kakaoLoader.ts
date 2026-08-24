let kakaoLoadPromise: Promise<void> | null = null

export function loadKakaoMap(): Promise<void> {
  if (window.kakao?.maps) {
    return Promise.resolve()
  }

  if (kakaoLoadPromise) {
    return kakaoLoadPromise
  }

  kakaoLoadPromise = new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_KEY

    if (!appKey) {
      kakaoLoadPromise = null // 에러 시 재시도 가능하도록 초기화
      reject(
        new Error(
          'VITE_KAKAO_MAP_KEY가 없습니다. .env 파일을 확인해주세요.',
        ),
      )
      return
    }

    // 이미 생성된 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk]',
    )

    if (existingScript) {
      // 이미 로드가 완료되었는지 확인
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => resolve())
        return
      }

      existingScript.addEventListener('load', () => {
        window.kakao?.maps?.load(() => resolve())
      })

      existingScript.addEventListener('error', () => {
        kakaoLoadPromise = null
        reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'))
      })

      return
    }

    // 새 스크립트 태그 생성
    const script = document.createElement('script')

    // 프로토콜(https)을 명시한 SDK 주소 설정
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
    script.async = true
    script.dataset.kakaoMapSdk = 'true'

    script.onload = () => {
      if (!window.kakao?.maps) {
        kakaoLoadPromise = null
        reject(new Error('카카오 지도 SDK가 정상적으로 초기화되지 않았습니다.'))
        return
      }

      window.kakao.maps.load(() => {
        resolve()
      })
    }

    script.onerror = () => {
      kakaoLoadPromise = null
      reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'))
    }

    document.head.appendChild(script)
  })

  return kakaoLoadPromise
}