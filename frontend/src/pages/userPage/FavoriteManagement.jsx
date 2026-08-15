import  {useEffect} from 'react';
import {useFavorite} from "../../contexts/favoriteContext/UseFavorite.jsx";

export default function FavoriteManagement({ styles }) {

    const {favorites, getFavorites} = useFavorite();


    useEffect(() => {

        const run = async () => {
            await getFavorites();
        };
        run();
    }, []);


    return (
        <div>
            <h2 style={styles.contentTitle}> 관심목록</h2>
            {favorites.map((favorite) => (
                <div key={favorite.grantId} style={styles.dataCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.categoryText}>{favorite.status}</span>
                        <span style={{ ...styles.statusBadge, backgroundColor: favorite.tagBg, color: favorite.tagColor }}>
              {favorite.cycle}
            </span>
                    </div>
                    <h4 style={styles.cardTitle}>{favorite.title}</h4>
                    <p style={styles.cardDetail}><strong>지원금액:</strong> {favorite.amount}</p>
                    <p style={styles.cardDetail}><strong>신청일:</strong> {favorite.startDate}</p>
                    <p style={styles.cardDetail}><strong>종료일:</strong> {favorite.endDate}</p>
                    <button style={styles.primaryBtn}>바로 신청하기</button>
                </div>
            ))}
        </div>
    );
}