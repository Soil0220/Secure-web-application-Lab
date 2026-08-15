import {useInquiry} from "../../contexts/inquiryContext/UseInquiry.jsx";
import {useEffect} from "react";

export default function InquiryManagement({ styles }) {

    const {inquiries, getInquiries} = useInquiry();

    useEffect(() => {
        const run = async () => {
            await getInquiries();
        };
        run();
    }, []);


    return (
        <div>
            <div style={styles.titleRow}>
                <h2 style={styles.contentTitle}>1:1 문의 내역</h2>
                <button style={styles.primaryBtn}>+ 새 문의 작성</button>
            </div>
            {inquiries.map((inq) => (
                <div key={inq.inquiryId} style={styles.dataCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardDetail}>{inq.date}</span>
                        <span style={{ ...styles.statusBadge, backgroundColor: inq.statusBg, color: inq.statusColor }}>
              {inq.status}
            </span>
                    </div>
                    <h4 style={styles.cardTitle}>{inq.title}</h4>
                </div>
            ))}
        </div>
    );
}