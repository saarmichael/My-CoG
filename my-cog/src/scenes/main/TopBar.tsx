import './TopBar.css';
import React, { useContext, useEffect, useState } from 'react';
import { AddFile, handleSave, handleSaveAs, handleUndo, handleRedo, handleFullscreen, handleOptions, handleLogout } from '../../shared/TopBarUtil';
import MyDropzone from '../global/MyDropZone';
import { apiGET } from '../../shared/ServerRequests';
import TreeView from '../global/TreeView';
import { Node } from '../global/TreeView';
import ModelPopup from '../global/ModalPopup';
import { ModalProvider } from '../../contexts/ModalContext';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';

interface MenuItem {
    name: string;
    items: JSX.Element[];
}


export const TopBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [openFileList, setOpenFileList] = useState<Node[]>([]); // new state for file list
    const { setChosenFile } = useContext(GlobalDataContext) as IGlobalDataContext;

    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    useEffect(() => {
        setChosenFile("s");
        apiGET('/getFiles').then((response) => {
            let files = response as Node[];
            setOpenFileList(files);
        });
    }, []);

    

    const fileClicked = (file: string) => {
        setChosenFile(file);
    };


    const menuItems: MenuItem[] = [
        {
            name: 'File',
            items: [
                <div>
                    <MyDropzone dropFunc={AddFile} message='Add File'/>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModalProvider>
                        <ModelPopup title='Choose a file' buttonName='Open' content={<TreeView treeData={openFileList} fileClicked={fileClicked}/>}/>
                    </ModalProvider>
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
                <div onClick={() => handleUndo()}>
                    Undo
                </div>,
                <div onClick={() => handleRedo()}>
                    Redo
                </div>
            ]
        },
        {
            name: 'View',
            items: [
                <div onClick={() => handleFullscreen()}>
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
        </div>
    );
};
export default TopBar;

