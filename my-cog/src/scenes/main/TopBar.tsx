import './TopBar.css';
import React, { useState } from 'react';
import { AddFile, handleOpen, handleSave, handleSaveAs, handleUndo, handleRedo, handleFullscreen, handleOptions, handleLogout } from '../../shared/TopBarUtil';
import MyDropzone from '../global/MyDropZone';

interface MenuItem {
    name: string;
    items: JSX.Element[];
}

interface TopBarProps {
    menuItems: MenuItem[];
}

export const TopBar: React.FC<TopBarProps> = ({ menuItems }) => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    return (
        <div className="topbar">
            {menuItems.map((menuItem, index) => (
                <div key={index} className="menu-item" onClick={() => toggleMenu(index)}>
                    {menuItem.name}
                    {activeMenu === index && (
                        <div className="menu-dropdown">
                            {menuItem.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="menu-item">
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <div className="menu-item top-bar__options" onClick={handleOptions}>
                &nbsp;⚙&nbsp;
            </div>
            <div className="menu-item top-bar__logout" onClick={handleLogout}>
                Logout
            </div>
        </div>
    );
};



export const menuItems: MenuItem[] = [
    
    {
        name: 'File',
        items: [
            <div>
                <MyDropzone dropFunc={AddFile} message='Add File'/>
            </div>,
            <div onClick={() => handleOpen()}>
                Open
            </div>,
            <div onClick={() => handleSave()}>
                Save
            </div>,
            <div onClick={() => handleSaveAs()}>
                Save AS
            </div>
        ]
    },
    {
        name: 'Edit',
        items: [
            <div className="menu-item" onClick={() => handleUndo()}>
                Undo
            </div>,
            <div className="menu-item" onClick={() => handleRedo()}>
                Redo
            </div>
        ]
    },
    {
        name: 'View',
        items: [
            <div className="menu-item" onClick={() => handleFullscreen()}>
                Fullscreen
            </div>
        ]
    }
];


export default TopBar;

