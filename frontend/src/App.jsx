import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/mainPage/MainPage.jsx";
import Register from "./pages/mainPage/RegisterManagement.jsx";
import Login from "./pages/mainPage/LoginManagement.jsx";
import AdminPage from "./pages/adminPage/AdminPage.jsx";
import UserPage from "./pages/userPage/UserPage.jsx";
import { AuthProvider } from "./contexts/authContext/AuthProvider.jsx";
import { LoadingProvider } from "./contexts/loadingContext/LoadingProvider.jsx";
import AccountPage from "./pages/accountPage/AccountPage.jsx";
import {NoticeProvider} from "./contexts/noticeContext/NoticeProvider.jsx";

function App() {

    return (
        <LoadingProvider>
            <NoticeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* 계정 페이지 */}
                            <Route path="/account" element={<AccountPage />} />

                            {/* 일반 사용자 페이지 */}
                            <Route path="/" element={<MainPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/user" element={<UserPage />} />

                            {/* 관리자 전용 라우트 (권한 검증 감싸기) */}
                            <Route path="/admin" element={<AdminPage />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </NoticeProvider>
        </LoadingProvider>
    );
}



export default App;