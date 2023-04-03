import React, { useContext } from 'react';
import { GithubPicker, SliderPicker } from 'react-color';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';


export const ColorPicker = () => {
    const { options, settings, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    return (
        <>
            <SliderPicker
                color={settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#A9A9A9"}
                onChange={(c) => {
                    setSettings({
                        ...settings,
                        edgeColor: {
                            ...settings.edgeColor,
                            firstColor: c.hex
                        },
                        nodeColor: {
                            ...settings.nodeColor,
                            firstColor: c.hex
                        }
                    });
                }}
            />
            {
                // if color-coding is enabled, show the second color picker
                options.find((option) => option.label === "Color Coded View")?.checked &&
                <SliderPicker
                    color={settings.edgeColor?.secondColor ? (settings.edgeColor?.secondColor) : "#000000"}
                    onChange={(c) => {
                        setSettings({
                            ...settings,
                            edgeColor: {
                                ...settings.edgeColor,
                                secondColor: c.hex
                            },
                            nodeColor: {
                                ...settings.nodeColor,
                                secondColor: c.hex
                            }
                        });
                    }}
                />}
        </>
    );
};



