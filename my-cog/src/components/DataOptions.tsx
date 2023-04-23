import { useContext } from "react";
import { GlobalDataContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";


export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(GlobalDataContext) as IElectrodeFocusContext;
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
        
    return selection;
};
