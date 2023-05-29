import './TopBar.css';
import React, { useEffect, useState } from 'react';
import { AddFile, handleSave, handleSaveAs, handleUndo, handleRedo, handleFullscreen, handleOptions, handleLogout } from '../../shared/TopBarUtil';
import MyDropzone from '../global/MyDropZone';
import { apiGET } from '../../shared/ServerRequests';

interface MenuItem {
    name: string;
    items: JSX.Element[];
}


export const TopBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [showFileList, setShowFileList] = useState<boolean>(false); // new state for file list visibility
    const [openFileList, setOpenFileList] = useState<string[]>([]); // new state for file list

    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    const handleOpenClick = () => {
        setShowFileList(!showFileList); // toggle file list visibility
    };

    // Fetch data when showFileList changes
    useEffect(() => {
        if (showFileList) {
            apiGET('/getFiles').then((response) => {
                let files = response as string[]; // Change this based on the structure of your response
                setOpenFileList(files);
            });
        }
    }, [showFileList]);

    


    const menuItems: MenuItem[] = [
        {
            name: 'File',
            items: [
                <div>
                    <MyDropzone dropFunc={AddFile} message='Add File'/>
                </div>,
                <div onClick={handleOpenClick}>
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

            {/* File list */}
            {showFileList && (
                <div className="file-list">
                    {openFileList.map((file, index) => (
                        <div key={index} className="file-item">
                            {file}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default TopBar;

