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

    const exportDataButton = (

        <Button onClick={async () => {
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
        }} >Export Data</Button>
    );

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#000000" />
    );

    return (
        <>
            {selection}
            {exportDataButton}
            {loading ? loadingGif : <></>}
            {exported ? <p>Exported!</p> : <></>}
        </>
    );
};
