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


function App() {

    return (
        <LoadingProvider>
            <AccountProvider>
                <FavoriteProvider>
                    <DocumentProvider>
                        <InquiryProvider>
                            <ApplicationProvider>
                                <GrantProvider>
                                    <LogProvider>
                                        <NoticeProvider>
                                            <AuthProvider>
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
                                            </AuthProvider>
                                        </NoticeProvider>
                                    </LogProvider>
                                </GrantProvider>
                            </ApplicationProvider>
                        </InquiryProvider>
                    </DocumentProvider>
                </FavoriteProvider>
            </AccountProvider>
        </LoadingProvider>
    );
}



export default App;