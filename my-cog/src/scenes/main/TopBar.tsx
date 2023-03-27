import React from 'react';
import './TopBar.css';

interface ITopBarProps {
    onFileClick: () => void;
    onEditClick: () => void;
    onViewClick: () => void;
    onOptionsClick: () => void;
    onLogoutClick: () => void;
}

export const TopBar: React.FC<ITopBarProps> = ({ onFileClick, onEditClick, onViewClick, onOptionsClick, onLogoutClick }) => {
    return (
        <div className="top-bar">
            <div className="top-bar__item" onClick={onFileClick}>
                File</div>
            <div className="top-bar__item" onClick={onEditClick}>
                Edit
            </div>
            <div className="top-bar__item" onClick={onViewClick}>
                View
            </div>
            
            <div className="top-bar__item top-bar__options" onClick={onOptionsClick}>
            ⚙
            </div>
            <div className="top-bar__item top-bar__logout" onClick={onLogoutClick}>
            Logout
            </div>
        </div>
    );
};

export default TopBar;
