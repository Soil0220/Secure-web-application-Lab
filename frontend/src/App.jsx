import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/mainPage/MainPage.jsx";
import Register from "./pages/mainPage/RegisterManagement.jsx";
import Login from "./pages/mainPage/LoginManagement.jsx";
import AdminPage from "./pages/adminPage/AdminPage.jsx";
import UserPage from "./pages/userPage/UserPage.jsx";
import AccountPage from "./pages/accountPage/AccountPage.jsx";
import {AuthProvider} from "./contexts/authContext/AuthProvider.jsx";
import {LogProvider} from "./contexts/logContext/LogProvider.jsx";
import {LoadingProvider} from "./contexts/loadingContext/LoadingProvider.jsx";
import {NoticeProvider} from "./contexts/noticeContext/NoticeProvider.jsx";
import {GrantProvider} from "./contexts/grantContext/GrantProvider.jsx";
import {ApplicationProvider} from "./contexts/applicationContext/ApplicationProvider.jsx";
import {DocumentProvider} from "./contexts/documentContext/DocumentProvider.jsx";
import {InquiryProvider} from "./contexts/inquiryContext/InquiryProvider.jsx";
import {FavoriteProvider} from "./contexts/favoriteContext/FavoriteProvider.jsx";
import {AccountProvider} from "./contexts/accountContext/AccountProvider.jsx";
import {ProtectedRoute} from "./components/ProtectedRoute.jsx";

/*
[취약한 버전, 주석을 통해 DEVNOTES.md 파일 노출]

    API 테스트/연동 시 참고:
    백엔드 API 변경사항이나 테스트용 요청은 프로젝트 루트 DEVNOTES.md에 임시 기록
    Bruno 동기화 후 최신 요청은 깃허브 Bruno Collection 기준으로 확인할 것
*/
function App() {

    return (
        <LoadingProvider>
            <AuthProvider>
                <AccountProvider>
                    <FavoriteProvider>
                        <DocumentProvider>
                            <InquiryProvider>
                                <ApplicationProvider>
                                    <GrantProvider>
                                        <LogProvider>
                                            <NoticeProvider>
                                                    <BrowserRouter>
                                                        <Routes>
                                                            {/* Public */}
                                                            <Route path="/" element={<MainPage />} />
                                                            <Route path="/login" element={<Login />} />
                                                            <Route path="/register" element={<Register />} />

                                                            {/* User */}
                                                            <Route element={<ProtectedRoute allowedRoles={['USER']}/>}>
                                                                <Route path="/user" element={<UserPage />} />
                                                            </Route>

                                                            {/* Admin */}
                                                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                                                <Route path="/admin" element={<AdminPage />} />
                                                            </Route>

                                                            {/* Admin, User */}
                                                            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'USER']} />}>
                                                                <Route path="/account" element={<AccountPage />} />
                                                            </Route>
                                                        </Routes>
                                                    </BrowserRouter>
                                            </NoticeProvider>
                                        </LogProvider>
                                    </GrantProvider>
                                </ApplicationProvider>
                            </InquiryProvider>
                        </DocumentProvider>
                    </FavoriteProvider>
                </AccountProvider>
            </AuthProvider>
        </LoadingProvider>
    );
}



export default App;