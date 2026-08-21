import {useState} from "react";
import {AccountContext} from "./AccountContext.jsx";
import {getApi, patchApi} from "../../components/RequestApi.jsx";
import {useAuth} from "../authContext/UseAuth.jsx";

export function AccountProvider({ children }) {

    const [account, setAccount] = useState(null);
    const {session} = useAuth();

    /*계정 조회(안전한 버전)
    const getAccount = async () => {
        try {
            const response = await getApi('/user', {}, true);
            setAccount(response.data.data);
            return response.data;
        } catch (error) {
            const customError = error.response?.data;
            return customError;
        }
    }*/

    //계정 조회(취약한 버전)
    const getAccount = async () => {
        try {

            const response = await getApi(`/user/${session.sessionUser.id}`, {}, true);
            setAccount(response.data.data);
            return response.data;
        } catch (error) {
            const customError = error.response?.data;
            return customError;
        }
    }

    //계좌정보 변경
    const updateBankAccount = async (bankName, accountNum) => {
        try {
            const response = await patchApi('/user', {"bankName" : bankName, "accountNum" : accountNum}, true);
            await getAccount();
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }


    return (
        <AccountContext.Provider
            value={{account, setAccount, getAccount, updateBankAccount}}
        >
            {children}
        </AccountContext.Provider>
    );
}