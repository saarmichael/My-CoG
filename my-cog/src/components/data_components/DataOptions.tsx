import { useContext, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { Box, CircularProgress } from "@mui/material";
import { exportData } from "../../shared/RequestsService";
import ModalPopup from "../tools_components/ModalPopup";
import { TextField } from "@mui/material";


const ExportDataModal: React.FC = () => {
    const [exported, setExported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState('');
    const { timeRange, connectivityType } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [error, setError] = useState<boolean>(false);
    const [response, setResponse] = useState<string>('');

    const generateResponseMessage = () => {
        let className = '';
        if (!error) {
            className = 'upload message';
        } else {
            className = 'error message';
        }
        return <p className={className}>{response}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <form className="form-container" onSubmit={async (event: React.FormEvent) => {
                event.preventDefault();

                setLoading(true);
                const resp = await exportData(timeRange, connectivityType, fileName);
                setLoading(false);
                setExported(true);
                setTimeout(() => {
                    setExported(false);
                }, 2500);
                if (resp.status === 200) {
                    setError(false);
                    setResponse('Exported!');
                } else if (resp.status === 400) {
                    setError(true);
                    setResponse(resp.data.message);
                } else {
                    setError(true);
                    setResponse('Unknown error');
                }
            }}>
                <TextField
                    label="File Name"
                    value={fileName}
                    size="small"
                    onChange={event => setFileName(event.target.value)}
                />
                <input type="submit" style={{ marginTop: '10px' }} className="submit-button" value="Export Data" />
                {loading ? 
                    <Box display="flex" justifyContent="center" alignItems="center" marginTop="5px">
                        <CircularProgress size={20} sx= {{color:"purple"}}/> 
                    </Box> 
                : null}
                {exported ? generateResponseMessage() : <></>}
            </form>
        </div>
    );
}



export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { timeRange } = useContext(GlobalDataContext) as IGlobalDataContext;
    // make sure all the electrodes appear in the selection

    const [exported, setExported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState('');

    const modal = (
        <div>
            <ModalPopup
                buttonName="Export Data"
                title="Choose file name"
                content={<ExportDataModal />}
            />
        </div>);

    return (
        <>
            {modal}
        </>
    );
};
