import React, { useContext } from 'react';
import { GithubPicker } from 'react-color';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';


export const ColorPicker = () => {
    const { options, settings, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    return (
        <>
            <GithubPicker
                color={settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#A9A9A9"}
                onChange={(c) => {
                    setSettings({
                        ...settings,
                        edgeColor: {
                            ...settings.edgeColor,
                            firstColor: c.hex,
                            secondColor: settings.edgeColor?.secondColor
                        },
                        nodeColor: {
                            ...settings.nodeColor,
                            firstColor: c.hex,
                            secondColor: settings.nodeColor?.secondColor
                        }
                    });
                }}
            />
            {
                // if color-coding is enabled, show the second color picker
                ((options.find((option) => option.label === "Color Coded View")?.checked)
                    || (options.find((option) => option.label === "Color coded nodes")?.checked))
                &&
                <GithubPicker
                    color={settings.edgeColor?.secondColor ? (settings.edgeColor?.secondColor) : "#000000"}
                    onChange={(c) => {
                        if (c.hex !== settings.edgeColor?.secondColor) {
                            setSettings({
                                ...settings,
                                edgeColor: {
                                    ...settings.edgeColor,
                                    firstColor: settings.edgeColor?.firstColor,
                                    secondColor: c.hex
                                },
                                nodeColor: {
                                    ...settings.nodeColor,
                                    firstColor: settings.nodeColor?.firstColor,
                                    secondColor: c.hex
                                }

                            });
                        }
                    }}
                />}
        </>
    );
};



