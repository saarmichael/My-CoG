import './TopBar.css';
import React, { useContext, useEffect, useState } from 'react';
import { apiGET, apiPOST, logoutRequest } from '../../shared/ServerRequests';
import TreeView, { Node } from '../../components/tools_components/TreeView';
import ModelPopup from '../../components/tools_components/ModalPopup';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import CreateVideoModal from '../../components/tools_components/CreateVideoModal';
import { DataOptions } from '../../components/data_components/DataOptions';
import { Grid } from '@mui/material';

interface MenuItem {
    name: string;
    items: JSX.Element[];
}


export const TopBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [openFileList, setOpenFileList] = useState<Node[]>([]);
    const [recentFiles, setRecentFiles] = useState<Node[]>([]);
    const { chosenFile, setChosenFile } = useContext(GlobalDataContext) as IGlobalDataContext;

    const FileDetailsHeader = (fileName: string) => {
        let parts = fileName.split("_");
        
        let subject = parts[0].split("-")[1];    
        let session = parts[1].split("-")[1];    
        let task = parts[2].split("-")[1];       
        let acquisition = parts[3].split("-")[1];
        let runAndType = parts[4].split("-")[1]; 
        
        // Further split run and file type part
        let runAndTypeParts = runAndType.split(".");
        let run = runAndTypeParts[0];  // "run-4"
        let fileType = runAndTypeParts[1]; // "ieeg.eeg"
        
        const titleStyle = {
            color: "#add8e6"
        };
    
        return (
                <Grid container spacing={10}>
                    <Grid item><span style={titleStyle}>Subject:</span> {subject}</Grid>
                    <Grid item><span style={titleStyle}>Session:</span> {session}</Grid>
                    <Grid item><span style={titleStyle}>Task:</span> {task}</Grid>
                    <Grid item><span style={titleStyle}>Acquisition:</span> {acquisition}</Grid>
                    <Grid item><span style={titleStyle}>Run:</span> {run}</Grid>
                </Grid>
        );
    };
    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    useEffect(() => {
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

    function handleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
    
    function handleLogout() {
        logoutRequest();
    }


    const menuItems: MenuItem[] = [
        {
            name: 'File',
            items: [
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModelPopup title='Choose from recent files:' width="60%" height="75%" buttonName='Recent Files' content={<TreeView treeData={recentFiles} fileClicked={fileClicked}/>}/>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModelPopup title='Choose a file:' width="60%" height="75%" buttonName='Choose file' content={<TreeView treeData={openFileList} fileClicked={fileClicked}/>}/>
                </div>,
            ]
        },
        {
            name: 'Export',
            items: [
                <div onClick={(e) => {e.stopPropagation()}}>
                    <ModelPopup title='Choose video name and duration' buttonName='Create graph video' content={<CreateVideoModal/>}/>
                </div>,
                <div onClick={(e) => {e.stopPropagation()}}>
                    <DataOptions />
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
            <div className="left-section">
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
            </div>

            <h3>{FileDetailsHeader(chosenFile)}</h3>

            <div className="right-section">
                <div className="menu-item top-bar__logout" onClick={handleLogout}>
                    Logout
                </div>
            </div>
        </div>
    );
};
export default TopBar;

