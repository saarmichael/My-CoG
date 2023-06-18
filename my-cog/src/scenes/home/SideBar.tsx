import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CircularProgress, FormGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { GraphVisCheckbox } from "../../components/data_components/GraphVisCheckbox";
import { ColorPicker } from "../../components/tools_components/ColorPicker";
import { IVisGraphOptionsContext, VisGraphOptionsContext } from "../../contexts/VisualGraphOptionsContext";
import { reorganizeOptions } from "../../shared/RequestsService";
import { ServerSettings, getSettings, saveSettings } from "../../shared/ServerRequests";
import './SideBar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { setOptions, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const [showPicker, setShowPicker] = useState(false);
    const [ message, setMessage ] = useState<JSX.Element>(<>Save Settings</>);
    useEffect(() => {
        getSettings().then((data) => {
            let settData = data as unknown as { requestSettings: ServerSettings};
            let reorganizedOptions = reorganizeOptions(settData.requestSettings.options, options);
            setOptions(reorganizedOptions);
            setSettings(settData.requestSettings.settings);
        });
    }, []);
    const saveUserSettings = async () => {
        setMessage(<CircularProgress size={12} sx= {{color:"white"}}/>);
        await saveSettings({ options, settings });
        setMessage(<>Settings Saved!</>);
        setTimeout(() => {
            setMessage(<>Save Settings</>);
        }, 2500);
    };

    const colorPickDiv = (
        <div className="submit-button"
            style={{
                width: '100%', backgroundColor: settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#000000",
            }}
            onClick={() => {
                setShowPicker(!showPicker);
            }}
        >
            Choose color
        </div>
    );

    return (
        <div id="sidebar-container">
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={onClose}>
                    {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                </button>
                <div>
                    <h2>Visual Options</h2>
                    <FormGroup>
                        {options.map((option, index) => {
                            return (
                                <GraphVisCheckbox
                                    key={index}
                                    label={option.label}
                                    checked={option.checked}
                                />
                            );
                        })}
                    </FormGroup>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div>{colorPickDiv}</div>
                        {showPicker ? <div><ColorPicker /></div> : null}
                    </div>

                </div>
                <button onClick={saveUserSettings} style={{ marginBottom: "20px", fontSize: '0.9em' }} className="submit-button">
                    {message}
                </button>
            </div>
        </div>

    );
};

export default Sidebar;