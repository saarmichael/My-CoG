import { useContext, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import { Button } from "@mui/material";
import { exportData } from "../shared/RequestsService";
import ReactLoading from 'react-loading';
import ModalPopup from "../scenes/global/ModalPopup";
import { TextField } from "@mui/material";


const ExportDataModal: React.FC = () => {
    const [exported, setExported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState('');
    const { timeRange } = useContext(GlobalDataContext) as IGlobalDataContext;

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#000000" />
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <form className="form-container" onSubmit={async (event: React.FormEvent) => {
                event.preventDefault();

                setLoading(true);
                const resp = await exportData(timeRange, 'coherence', fileName);
                setLoading(false);

                if (resp.status === 200 || true) {
                    setExported(true);

                    setTimeout(() => {
                        setExported(false);
                    }, 2500);
                }
            }}>
                <TextField
                    label="File Name"
                    value={fileName}
                    onChange={event => setFileName(event.target.value)}
                />
                <input type="submit" className="submit-button" value="Export Data" />
                {loading ? loadingGif : <></>}
                {exported ? <p>Exported!</p> : <></>}
            </form>
        </div>
    );
}



export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { timeRange } = useContext(GlobalDataContext) as IGlobalDataContext;
    // make sure all the electrodes appear in the selection

    const selection = (
        <select onChange={(e) => setElectrode(e.target.value)} value={electrode} >
            {electrodeList.map((elec) => (
                <option key={elec} value={elec}>
                    {elec}
                </option>
            ))}
        </select>
    );

    const [exported, setExported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState('');





    const modal = (
        <div style={{ position: "absolute", bottom: "0", right: '0' }}>
            <ModalPopup
                buttonName="Export Data"
                title="Choose file name"
                content={<ExportDataModal />}
            />
        </div>);

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#000000" />
    );

    return (
        <>
            {selection}
            {modal}
        </>
    );
};
