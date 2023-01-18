import React, { useEffect, useState } from 'react';
import { lightningChart, PalettedFill, LUT, ColorRGBA, emptyLine, Themes } from '@arction/lcjs';
import { createWaterDropDataGenerator } from "@arction/xydata";






const BasicSpectogram = () => {

    // Create a new function 
    const generateData = () => {
        const resolutionX = 1000;
        const resolutionY = 1000;

        // Create a XY Chart.
        const chart = lightningChart()
            .ChartXY({
                theme: Themes.darkGold,
            })
            .setTitle(
                `Heatmap Grid Series ${resolutionX}x${resolutionY} (${(
                    (resolutionX * resolutionY) /
                    1000000
                ).toFixed(1)} million data points)`
            ).setPadding({ right: 40 })

        const palette = new LUT({
            units: "intensity",
            steps: [
                { value: 0, color: ColorRGBA(255, 255, 0) },
                { value: 30, color: ColorRGBA(255, 204, 0) },
                { value: 45, color: ColorRGBA(255, 128, 0) },
                { value: 60, color: ColorRGBA(255, 0, 0) },
            ],
            interpolate: false,
        });


        createWaterDropDataGenerator()
            .setRows(resolutionX)
            .setColumns(resolutionY)
            .generate()
            .then((data) => {
                const heatmap = chart
                    .addHeatmapGridSeries({
                        columns: resolutionX,
                        rows: resolutionY,
                        start: { x: 0, y: 0 },
                        end: { x: resolutionX, y: resolutionY },
                        dataOrder: "columns",
                    })
                    // Color Heatmap using previously created color look up table.
                    .setFillStyle(new PalettedFill({ lut: palette }))
                    .setWireframeStyle(emptyLine)
                    .invalidateIntensityValues(data)
                    .setMouseInteractions(false);

                // Add LegendBox.
                const legend = chart.addLegendBox()
                    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
                    .setAutoDispose({
                        type: 'max-width',
                        maxWidth: 0.30,
                    })
                    .add(chart)
            });
    }

    // Call the function but make sure it only runs once
    useEffect(() => {
        generateData()
    }, [])
    

    return (
        <div id="chart" style={{ width: '100%', height: '100%' }}></div>
    )

}

export default BasicSpectogram