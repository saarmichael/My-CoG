import { useContext, useEffect, useState } from 'react';
import {
    lightningChart,
    LUT,
    ColorRGBA,
    PalettedFill,
    emptyLine,
    ColorShadingStyles,
    LegendBoxBuilders,
    UIElementBuilders,
    UIOrigins,
    UIDraggingModes,
    Themes,
    Dashboard,
    ChartXY,
    PointMarker,
    UIBackground,
    HeatmapGridSeriesIntensityValues
} from '@arction/lcjs';
import { getSpectrogramData, SpectrogramData } from '../shared/getters';
import { ElectrodeFocusContext, IElectrodeFocusContext } from '../contexts/ElectrodeFocusContext';
import { getData, getDataSync } from '../shared/SpectrogramService';



const Spectrogram = () => {
    const { electrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
    let dashboard: Dashboard | null = null;
    let chart2D:  ChartXY<PointMarker, UIBackground> | null = null;
    let heatmapSeries2D: HeatmapGridSeriesIntensityValues | null = null;
    /* asynchronous function that generate resolutionX over resolutionY matrix of random numbers */
    const create2DChart = async () => {
        getData(electrode)
            .then(({ f, t, Sxx }) => {
                const HEATMAP_COLUMNS = f.length
                const HEATMAP_ROWS = t.length
                const dashboard = lightningChart().Dashboard({
                    container: "chart2D",
                    numberOfColumns: 1,
                    numberOfRows: 1,
                    theme: Themes.lightNature,
                })


                const chart2D = dashboard.createChartXY({
                    columnIndex: 0,
                    rowIndex: 0,
                })
                    .setTitle('Generating test data ...')

                chart2D.setTitle(`2D Heatmap Grid ${HEATMAP_ROWS}x${HEATMAP_COLUMNS}`)

                const lut = new LUT({
                    interpolate: true,
                    steps: [
                        { value: 0, color: ColorRGBA(0, 0, 0) },
                        { value: 40, color: ColorRGBA(255, 215, 0) },
                        { value: 60, color: ColorRGBA(255, 0, 0) },
                        { value: 80, color: ColorRGBA(0, 0, 255) },
                    ],
                })

                const heatmapSeries2D = chart2D.addHeatmapGridSeries({
                    columns: HEATMAP_COLUMNS,
                    rows: HEATMAP_ROWS,
                })
                    .setFillStyle(new PalettedFill({ lut }))
                    .setWireframeStyle(emptyLine)
                    .invalidateIntensityValues(Sxx)

                const selectorColorShadingStyle = chart2D.addUIElement(UIElementBuilders.CheckBox)
                    .setPosition({ x: 100, y: 100 })
                    .setOrigin(UIOrigins.RightTop)
                    .setMargin({ top: 40, right: 8 })
                    .setDraggingMode(UIDraggingModes.notDraggable)
                selectorColorShadingStyle.setOn(false)
                // Add legend with color look up table to chart.
                const legend = chart2D.addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
                    .add(chart2D)
            })
    }

    // synchronous function that generate resolutionX over resolutionY matrix of random numbers
    const create2DChartSync = () => {
        const lut = new LUT({
            interpolate: true,
            steps: [
                { value: 0, color: ColorRGBA(0, 0, 0) },
                { value: 40, color: ColorRGBA(255, 215, 0) },
                { value: 60, color: ColorRGBA(255, 0, 0) },
                { value: 80, color: ColorRGBA(0, 0, 255) },
            ],
        })
        const { f, t, Sxx } = getDataSync(electrode)
        const HEATMAP_COLUMNS = f.length
        const HEATMAP_ROWS = t.length
        if (!dashboard) {
            dashboard = lightningChart().Dashboard({
                container: "chart2D",
                numberOfColumns: 1,
                numberOfRows: 1,
                theme: Themes.lightNature,
            })


            chart2D = dashboard.createChartXY({
                columnIndex: 0,
                rowIndex: 0,
            })
                .setTitle('Generating test data ...')

            chart2D.setTitle(`2D Heatmap Grid ${HEATMAP_ROWS}x${HEATMAP_COLUMNS}`)

            

            heatmapSeries2D = chart2D.addHeatmapGridSeries({
                columns: HEATMAP_COLUMNS,
                rows: HEATMAP_ROWS,
            })
                .setFillStyle(new PalettedFill({ lut }))
                .setWireframeStyle(emptyLine)
                .invalidateIntensityValues(Sxx)

            const selectorColorShadingStyle = chart2D.addUIElement(UIElementBuilders.CheckBox)
                .setPosition({ x: 100, y: 100 })
                .setOrigin(UIOrigins.RightTop)
                .setMargin({ top: 40, right: 8 })
                .setDraggingMode(UIDraggingModes.notDraggable)
            selectorColorShadingStyle.setOn(false)
            // Add legend with color look up table to chart.
            const legend = chart2D.addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
                .add(chart2D)
        } else {
            if(heatmapSeries2D) heatmapSeries2D.invalidateIntensityValues(Sxx)
        }
    }

    useEffect(() => {
        create2DChartSync()
    }, [electrode])

    return (
        <div id="chart2D" style={{ width: '100%', height: '100%' }}></div>
    )

}

export default Spectrogram