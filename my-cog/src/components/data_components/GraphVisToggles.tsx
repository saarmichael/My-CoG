import { useContext } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';

export const GraphVisToggles = () => {

    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    // JSX for color picking: a div when clicked sets showPicker to true, and a color picker when showPicker is true

    return (
        <>

        </>
    );
};