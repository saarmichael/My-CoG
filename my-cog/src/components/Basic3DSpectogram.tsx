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
    Themes
} from '@arction/lcjs';
import { getSpectrogramData, SpectrogramData } from '../shared/getters';
import * as elec1_spectrogram from '../shared/ecog_data/elec1_spectrogram.json'
import { ElectrodeFocusContext, IElectrodeFocusContext } from '../contexts/ElectrodeFocusContext';

interface Basic3DSpectogramProps {
    data: number[][];
}


const Basic3DSpectogram = () => {
    const { electrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
    const elec1SpecData = elec1_spectrogram as SpectrogramData
    /* asynchronous function that generate resolutionX over resolutionY matrix of random numbers */
    const getData = async (electrodeID: string): Promise<SpectrogramData> => {
        // get the ID number alone parse it to a number
        const elecNum = parseInt(electrodeID[electrodeID.length - 1]);
        const data = await getSpectrogramData(elecNum);
        return data;
    }

    const create3DChart = () => {
        getData(electrode)
            .then(({ f, t, Sxx }) => {
                const HEATMAP_COLUMNS = t.length
                const HEATMAP_ROWS = f.length
                const dashboard = lightningChart().Dashboard({
                    container: "chart3D",
                    numberOfColumns: 2,
                    numberOfRows: 1,
                    theme: Themes.darkGold,
                })
                    .setColumnWidth(0, 1.0)
                    .setColumnWidth(1, 1.8)

                const chart2D = dashboard.createChartXY({
                    columnIndex: 0,
                    rowIndex: 0,
                })
                    .setTitle('Generating test data ...')

                const chart3D = dashboard.createChart3D({
                    columnIndex: 1,
                    rowIndex: 0,
                })
                    .setTitle('Generating test data ...')

                chart2D.setTitle(`2D Heatmap Grid ${HEATMAP_ROWS}x${HEATMAP_COLUMNS}`)
                chart3D.setTitle(`3D Surface Grid ${HEATMAP_ROWS}x${HEATMAP_COLUMNS} color by Y`)

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

                const surfaceSeries3D = chart3D.addSurfaceGridSeries({
                    columns: HEATMAP_COLUMNS,
                    rows: HEATMAP_ROWS,
                })
                    .setFillStyle(new PalettedFill({ lut, lookUpProperty: 'y' }))
                    .setWireframeStyle(emptyLine)
                    .invalidateHeightMap(Sxx)

                const selectorColorShadingStyle = chart3D.addUIElement(UIElementBuilders.CheckBox)
                    .setPosition({ x: 100, y: 100 })
                    .setOrigin(UIOrigins.RightTop)
                    .setMargin({ top: 40, right: 8 })
                    .setDraggingMode(UIDraggingModes.notDraggable)
                selectorColorShadingStyle.onSwitch((_, state) => {
                    surfaceSeries3D.setColorShadingStyle(state ? new ColorShadingStyles.Phong() : new ColorShadingStyles.Simple())
                    selectorColorShadingStyle.setText(`Color shading style: ${state ? 'Phong' : 'Simple'}`)
                })
                selectorColorShadingStyle.setOn(false)

                // Add legend with color look up table to chart.
                const legend = chart3D.addLegendBox(LegendBoxBuilders.HorizontalLegendBox)
                    .add(chart2D)
                    .add(chart3D)

            })
    }

    useEffect(() => {
        create3DChart()
    }, [create3DChart])

    return (
        <div id="chart3D" style={{ width: '100%', height: '100%' }}></div>
    )

}

export default Basic3DSpectogram