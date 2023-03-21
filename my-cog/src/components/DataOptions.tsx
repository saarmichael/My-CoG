import { useContext } from "react";
import { ElectrodeFocusContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";


export const DataOptions = () => {
    // return a selection of electrodes from the electrode list context
    const { setElectrode, electrodeList } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
    const selection = (
        <select onChange={(e) => setElectrode(e.target.value)}></select>
    );
    return selection;
};
