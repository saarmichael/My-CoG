import './TopBar.css';
import React, { useContext, useEffect, useState } from 'react';
import { AddFile, handleSave, handleSaveAs, handleUndo, handleRedo, handleFullscreen, handleOptions, handleLogout } from '../../shared/TopBarUtil';
import MyDropzone from '../global/DirectoryPicker';
import { apiGET, apiPOST } from '../../shared/ServerRequests';
import TreeView from '../global/TreeView';
import { Node } from '../global/TreeView';
import ModelPopup from '../global/ModalPopup';
import { ModalProvider } from '../../contexts/ModalContext';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import DirectoryPicker from '../global/DirectoryPicker';
import CreateVideoModal from './CreateVideoModal';
import { DataOptions } from '../../components/DataOptions';

interface MenuItem {
    name: string;
    items: JSX.Element[];
}


export const TopBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [openFileList, setOpenFileList] = useState<Node[]>([]);
    const [recentFiles, setRecentFiles] = useState<Node[]>([]);
    const { setChosenFile } = useContext(GlobalDataContext) as IGlobalDataContext;

    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    useEffect(() => {
        setChosenFile("first");
        apiGET('/getFiles').then((response) => {
            let files = response as Node[];
            setOpenFileList(files);
        });
    }, []);

    

    const fileClicked = (file: string) => {
        apiPOST<object>('/setFile', {file: file}).then((response) => {
            if (response.status === 200) {
                setChosenFile(file);
                // check if file in recent files
                let found = false;
                recentFiles.forEach((recentFile) => {
                    if (recentFile.label === file) {
                        found = true;
                    }
                });
                if (!found) {
                    setRecentFiles([...recentFiles, {key: (recentFiles.length + 1).toString() ,label: file, children: [], isFile: true}]);
                }
            } else if (response.status === 400) {
                console.log(response.data.message);
            }
            else {
                console.log(response.data.message);
            }
        });
    };


    const menuItems: MenuItem[] = [
        {
            name: 'File',
            items: [
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModelPopup title='Choose from recent files:' buttonName='Recent Files' content={<TreeView treeData={recentFiles} fileClicked={fileClicked}/>}/>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModalProvider>
                        <ModelPopup title='Choose a file:' buttonName='Choose file' content={<TreeView treeData={openFileList} fileClicked={fileClicked}/>}/>
                    </ModalProvider>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModelPopup title='Choose video name and duration' buttonName='Create graph video' content={<CreateVideoModal/>}/>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <DataOptions />
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
        },
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

