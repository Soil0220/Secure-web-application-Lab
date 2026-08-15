import { useContext } from "react";
import { InquiryContext } from "./InquiryContext";


export function useInquiry() {
    return useContext(InquiryContext);
}