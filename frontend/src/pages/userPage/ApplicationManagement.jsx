import {useApplication} from "../../contexts/applicationContext/UseApplication.jsx";
import {useEffect} from "react";

export default function ApplicationManagement({styles }) {

    const {applications, getApplications} = useApplication();


    useEffect(() => {
        const run = async () => {
            await getApplications();};
        run();
    }, []);


    return (
        <div>
            <h2 style={styles.contentTitle}>지원금 신청 내역</h2>
            {applications.map((app) => (
                <div key={app.applicationId} style={styles.dataCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.categoryText}>{app.category}</span>
                        <span style={{ ...styles.statusBadge, backgroundColor: app.statusBg, color: app.statusColor }}>
              {app.status}
            </span>
                    </div>
                    <h4 style={styles.cardTitle}>{app.title}</h4>
                    <p style={styles.cardDetail}><strong>신청일:</strong> {app.createdAt}</p>
                </div>
            ))}
        </div>
    );
}