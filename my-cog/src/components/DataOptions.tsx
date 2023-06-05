import { useContext, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import { Button } from "@mui/material";
import { exportData } from "../shared/RequestsService";
import ReactLoading from 'react-loading';




export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { timeRange } = useContext(GlobalDataContext) as IGlobalDataContext;
    // make sure all the electrodes appear in the selection

    const [exported, setExported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const exportDataButton = (

        <div onClick={async () => {
            // export the data to a csv file
            setLoading(true);
            const resp = await exportData(timeRange, 'coherence');
            setLoading(false);
            if (resp.status === 200 || true) {
                setExported(true);
                // set timer to remove the "exported" message
                setTimeout(() => {
                    setExported(false);
                }, 2500);
            }
        }} style={ {marginRight: "5px"} }>Export Data</div>
    );

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#FFFFFF" />
    );

    return (
        <div style={ { display: "flex", width: "100%" } }>
            <div style={ { alignSelf: "flex-start" } }>{exportDataButton}</div>
            {loading ? loadingGif : <></>}
            <div style={ { alignSelf: "flex-end" } }>{exported ? "Exported!" : <></>}</div>
        </div>
    );
};
