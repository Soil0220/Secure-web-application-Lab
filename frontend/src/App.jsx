import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/mainPage/MainPage.jsx";
import Register from "./pages/mainPage/Register.jsx";
import Login from "./pages/mainPage/Login.jsx";
import AdminPage from "./pages/adminPage/AdminPage.jsx";
import UserPage from "./pages/userPage/UserPage.jsx";
import { AuthProvider } from "./contexts/authContext/AuthProvider.jsx";
import { LoadingProvider } from "./contexts/loadingContext/LoadingProvider.jsx";

function App() {

    return (
        <LoadingProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* 일반 사용자 페이지 */}
                        <Route path="/" element={<MainPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/user" element={<UserPage />} />

                        {/* 관리자 전용 라우트 (권한 검증 감싸기) */}
                        <Route
                            path="/admin"
                            element={<AdminPage />}
                        />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </LoadingProvider>
    );
}



export default App;