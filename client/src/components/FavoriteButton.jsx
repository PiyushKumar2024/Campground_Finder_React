import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setFavorites } from '../redux/featuresRedux/userSlice';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ campgroundId, isAbsolute = true }) => {
    const { user, isLoggedIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const isFavorited = user?.favorites?.some(fav => fav === campgroundId || fav._id === campgroundId);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (isFavorited) {
                const res = await axios.delete(`http://localhost:3000/user/${user.id}/favorites/${campgroundId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setFavorites(res.data.favorites));
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.favorites = res.data.favorites;
                localStorage.setItem('user', JSON.stringify(storedUser));
            } else {
                const res = await axios.post(`http://localhost:3000/user/${user.id}/favorites/${campgroundId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setFavorites(res.data.favorites));
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.favorites = res.data.favorites;
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
            style={{ 
                width: '40px', 
                height: '40px', 
                zIndex: 10, 
                ...(isAbsolute ? { position: 'absolute', top: '10px', right: '10px' } : {})
            }}
            onClick={handleToggleFavorite}
            disabled={loading}
        >
            {isFavorited ? (
                <i className="bi bi-heart-fill text-danger fs-5"></i>
            ) : (
                <i className="bi bi-heart text-dark fs-5"></i>
            )}
        </button>
    );
};

export default FavoriteButton;
