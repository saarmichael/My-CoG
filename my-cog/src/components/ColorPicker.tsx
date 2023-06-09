import React, { useContext } from 'react';
import { GithubPicker } from 'react-color';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import './ColorPicker.css';


export const ColorPicker = () => {
    const { options, settings, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    const pickerStyle = {
        default: {
            card: {
                boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                borderRadius: "10px",
            },
            arrow: {
                left: '50%',
                marginLeft: '-7px',
            },
            'triangle-shadow': {
                left: '50%',
                marginLeft: '-8px',
            }
        },
    };

    return (
        <div className="color-picker-wrapper">
            <GithubPicker
                triangle="hide"
                className="picker"
                styles={pickerStyle}
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
                    triangle="hide"
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
        </div>
    );
};



