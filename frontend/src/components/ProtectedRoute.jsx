import {useAuth} from "../contexts/authContext/UseAuth.jsx";
import {Navigate, Outlet} from "react-router-dom";


export const ProtectedRoute = ({ allowedRoles }) => {

    const { session, isAuthLoading } = useAuth();

    if(isAuthLoading){
        return null;
    }


    //비 로그인
    if(!session) {
        return <Navigate to="/login" replace />;
    }

    //어드민 권한 부족
    if(allowedRoles && !allowedRoles.includes(session.sessionUser.role)){
        return <Navigate to="/login" replace />;
    }

    //하위 라우터 노출
    return <Outlet />;

}