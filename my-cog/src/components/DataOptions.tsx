import { useContext } from "react";
import { ElectrodeFocusContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";


export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { electrode, setElectrode, electrodeList } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
    // make sure all the electrodes appear in the selection
    
    const selection = (
        <select onChange={(e) => setElectrode(e.target.value)} value={electrode} >
            {electrodeList.map((electrode) => (
                <option key={electrode} value={electrode}>
                    {electrode}
                </option>
            ))}
        </select>
    );
        
    return selection;
};