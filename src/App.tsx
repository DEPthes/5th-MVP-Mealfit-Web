import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/home/HomePage'
import { HealthDataPage } from '@/pages/health-data/HealthDataPage'
import { AiReportPage } from '@/pages/ai-report/AiReportPage'
import { MapPage } from '@/pages/map/MapPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { SignupPage } from '@/pages/signup/SignupPage'
import { MyPage } from '@/pages/mypage/MyPage'
import { AboutPage } from '@/pages/about/AboutPage'
import { TermsPage } from '@/pages/terms/TermsPage'
import { PrivacyPage } from '@/pages/privacy/PrivacyPage'
import { SupportPage } from '@/pages/support/SupportPage'
import { TeamPage } from '@/pages/team/TeamPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="health-data" element={<HealthDataPage />} />
          <Route path="ai-report" element={<AiReportPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}