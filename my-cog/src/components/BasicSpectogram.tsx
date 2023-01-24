import React, { useEffect, useState } from 'react';
import { lightningChart, PalettedFill, LUT, ColorRGBA, emptyLine, Themes } from '@arction/lcjs';
import { createWaterDropDataGenerator } from "@arction/xydata";
import Basic3DSpectogram from './Basic3DSpectogram';


const BasicSpectogram = () => {

    /* asynchronous function that generate resolutionX over resolutionY matrix of random numbers */
    const generateData = async (resolutionX: number, resolutionY: number) => {
        // create a new number matrix of 100 over 100
        const data: number[][] = []
        // loop over the matrix and fill it with random numbers
        for (let i = 0; i < resolutionX; i++) {
            let row = []
            for (let j = 0; j < resolutionY; j++) {
                row.push(Math.random() * 100)
            }
            data.push(row)
        }
        return data
    }

    /* funciton that creates the chart and assigns the data to it */
    const generateChart = () => {
        const resolutionX = 1000;
        const resolutionY = 1000;

        // Create a XY Chart.
        const chart = lightningChart()
            .ChartXY({
                theme: Themes.darkGold
            })
            .setTitle(
                `Heatmap Grid Series ${resolutionX}x${resolutionY} (${(
                    (resolutionX * resolutionY) /
                    10000
                ).toFixed(1)} million data points)`
            ).setPadding({ right: 40 })

        // Create a color look up table (LUT) for the heatmap.
        const palette = new LUT({
            steps: [
                { value: 0, color: ColorRGBA(255, 255, 255) },
                { value: 50, color: ColorRGBA(255, 0, 0) },
                { value: 100, color: ColorRGBA(0, 0, 255) }
            ],
            interpolate: true // Interpolate between steps (which results in smooth color transitions, aka gradient)
        })

        // asychronously generate the data and assign it to the chart
        generateData(resolutionX, resolutionY)
            .then((data) => { // the asychronous step. generateData returns a promise
                console.log(data) // log the data to the console
                const heatmap = chart
                    .addHeatmapGridSeries({ // add a heatmap grid template to the chart
                        columns: resolutionX,
                        rows: resolutionY,
                        start: { x: 0, y: 0 },
                        end: { x: resolutionX, y: resolutionY },
                        dataOrder: "columns",
                    })
                    // Color Heatmap using previously created color look up table.
                    .setFillStyle(new PalettedFill({ lut: palette })) // set the cahrts color palette
                    .setWireframeStyle(emptyLine) // remove the wireframe (the grid lines)
                    .invalidateIntensityValues(data) // THE ACTUAL DATA ASSIGNMENT to the chart
                    .setMouseInteractions(false); // nessasary to enable the chart controls (zoom, pan, etc.)

                // Add LegendBox.
                const legend = chart.addLegendBox() // the legend that shows the color palette
                    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
                    .setAutoDispose({
                        type: 'max-width',
                        maxWidth: 0.30,
                    })
                    .add(chart)
            });
    }

    // call the generateChart function when the component is mounted (created)
    // useEffect(() => {
    //     generateChart()
    // }, [generateChart])


    return (
        <div id="chart" style={{ width: '100%', height: '100%' }}>
            <Basic3DSpectogram />
        </div>
    )

}

export default BasicSpectogram