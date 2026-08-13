import { useContext } from "react";
import { NoticeContext } from "./NoticeContext.jsx";

export function useNotice() {
    return useContext(NoticeContext);
}