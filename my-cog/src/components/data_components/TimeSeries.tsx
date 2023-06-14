import {
    ColorRGBA,
    ColorShadingStyles,
    LUT,
    LegendBoxBuilders,
    PalettedFill,
    Themes,
    UIDraggingModes,
    UIElementBuilders,
    UIOrigins,
    emptyLine,
    lightningChart,
} from '@arction/lcjs';
import { createProgressiveTraceGenerator } from '@arction/xydata';
import { useContext, useEffect } from 'react';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import * as elec1_spectrogram from '../../shared/ecog_data/elec1_spectrogram.json';
import { SpectrogramData, getSpectrogramData } from '../../shared/getters';
import { line } from 'd3';
import { getTimeSeries } from '../../shared/ElectrodeDataService';

interface Basic3DSpectogramProps {
    data: number[][];
}


const TimeSeries = () => {
    const { electrode, timeRange } = useContext(GlobalDataContext) as IGlobalDataContext;
    const elec1SpecData = elec1_spectrogram as SpectrogramData
    /* asynchronous function that generate resolutionX over resolutionY matrix of random numbers */
    const getData = async (electrodeID: string) => {
        return await getTimeSeries(electrodeID, timeRange)
    }

    

    const createLine = () => {
        getData(electrode)
            .then(data => {
                const dashboard = lightningChart().Dashboard({
                    container: "time-series",
                    numberOfColumns: 1,
                    numberOfRows: 4
                }).setRowHeight(3, 0.3)
            
                const chart = dashboard.createChartXY({
                    columnIndex: 0,
                    columnSpan: 1,
                    rowIndex: 0,
                    rowSpan: 3
                }).setTitle('Time Series')
            
                const zoomBandChart = dashboard.createZoomBandChart({
                    columnIndex: 0,
                    columnSpan: 1,
                    rowIndex: 3,
                    rowSpan: 1,
                    axis: chart.getDefaultAxisX()
                })
                const line = chart.addLineSeries()
                line.add(data)
            })
    }

    useEffect(() => {
        createLine()
    }, [createLine, electrode])

    return (
        <div id="time-series" style={{ width: '100%', height: '100%' }}></div>
    )

}

export default TimeSeries