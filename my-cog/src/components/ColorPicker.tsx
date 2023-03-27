import React, { useContext } from 'react';
import { GithubPicker } from 'react-color';
import { IVisGraphOption, IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';


export const ColorPicker = () => {
    const { settings, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    return (
        <>
            <GithubPicker
                color={settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#000000"}
                onChange={(c) => {
                    setSettings({
                        ...settings,
                        edgeColor: {
                            ...settings.edgeColor,
                            firstColor: c.hex
                        }
                    });
                }}
            />
            <GithubPicker
                color={settings.edgeColor?.secondColor ? (settings.edgeColor?.secondColor) : "#000000"}
                onChange={(c) => {
                    setSettings({
                        ...settings,
                        edgeColor: {
                            ...settings.edgeColor,
                            secondColor: c.hex
                        }
                    });
                }}
            />
        </>
    );
};



