import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";


export const GraphContainer = () => {

    return (
        <>
            <VisGraphOptionsProvider >
                <BasicGraphinGraph />
            </VisGraphOptionsProvider>
        </>
    );

};