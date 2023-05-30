import { useContext, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import { Button } from "@mui/material";
import { exportData } from "../shared/RequestsService";


export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(GlobalDataContext) as IGlobalDataContext;
    const {timeRange} = useContext(GlobalDataContext) as IGlobalDataContext;
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

    const exportDataButton = (

        <Button onClick={async () =>{
            // export the data to a csv file
            const resp = await exportData(timeRange, 'coherence');
            if (resp.status === 200 || true) {
                setExported(true);
                // set timer to remove the "exported" message
                setTimeout(() => {
                    setExported(false);
                }, 5000);
            }
        }} >Export Data</Button>
    );

    return (
        <>
            {selection}
            {exportDataButton}
            {exported ? <p>Exported!</p> : <></>}
        </>
    );
};
