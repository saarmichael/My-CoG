import {
    ChartXY,
    ColorRGBA,
    ColorShadingStyles,
    Dashboard,
    LUT,
    LegendBoxBuilders,
    PalettedFill,
    PointMarker,
    Themes,
    UIBackground,
    UIDraggingModes,
    UIElementBuilders,
    UIOrigins,
    ZoomBandChart,
    emptyLine,
    lightningChart,
} from '@arction/lcjs';
import { createProgressiveTraceGenerator } from '@arction/xydata';
import { useContext, useEffect, useState } from 'react';
import { ActiveNodeProps, GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import * as elec1_spectrogram from '../../shared/ecog_data/elec1_spectrogram.json';
import { SpectrogramData, getSpectrogramData } from '../../shared/getters';
import { line } from 'd3';
import { getTimeSeries } from '../../shared/ElectrodeDataService';
import { NodeSelection } from '../tools_components/NodeSelection';

interface Basic3DSpectogramProps {
    data: number[][];
}


const TimeSeries = () => {
    const { electrode, timeRange, state, isAnimating } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [selectedChannels, setSelectedChannels] = useState<ActiveNodeProps[]>([]); // 
    /* asynchronous function that generate resolutionX over resolutionY matrix of random numbers */
    const getData = async (electrodeID: string) => {
        return await getTimeSeries(electrodeID, timeRange)
    }

    let dashboard: Dashboard;
    let chart: ChartXY<PointMarker, UIBackground>;
    let zoomBandChart: ZoomBandChart;

    const createDashboard = () => {

        dashboard = lightningChart().Dashboard({
            container: "time-series",
            numberOfColumns: 1,
            numberOfRows: 4
        }).setRowHeight(3, 0.3)

        chart = dashboard.createChartXY({
            columnIndex: 0,
            columnSpan: 1,
            rowIndex: 0,
            rowSpan: 3
        }).setTitle('Time Series')

        const seriesArray = new Array(selectedChannels.length).fill(0).map((_) =>
            chart
                .addLineSeries({
                    dataPattern: {
                        pattern: 'ProgressiveX',
                    },
                })
                .setStrokeStyle((stroke) => stroke.setThickness(1)),
        );
        seriesArray.forEach(async (series, index) => {

            const data = await getData(selectedChannels[index].id)
            series.add(data)
        })
    }


    useEffect(() => {
        if (isAnimating) return;
        console.log('createDashboard')
        createDashboard()
    }, [selectedChannels, timeRange])

    // useEffect(() => {
    //     console.log('electrode changed')
    //     if (!state.nodes.map(node => node.id).includes(electrode)) return; // if the electrode doesn't exist in the list, return
    //     if (selectedChannels.map(node => node.id).includes(electrode)) return; // if the electrode is already active, return
    //     setSelectedChannels([...selectedChannels, {id: electrode, label: electrode}]) // update the list
    // }, [electrode])

    const handleCheckboxClick = (label: string) => {
        const selectedChannelsId = selectedChannels.map((node) => node.id);
        const selectedChannelsLabel = selectedChannels.map((node) => node.label);
        // if the node is already active, remove it from the active nodes list
        if (selectedChannelsLabel.includes(label) || selectedChannelsId.includes(label)) {
            setSelectedChannels(selectedChannels.filter((node) => node.id !== label && node.label !== label));
        } else {
            const node = state.nodes.find((node) => node.id === label || node.style?.label?.value === label);
            if (node) {
                setSelectedChannels([...selectedChannels, { id: node.id, label: node.style?.label?.value ? node.style.label.value : node.id }]);
            }
        }
    }

    return (
        <>
            <div id="time-series" style={{ width: '100%', height: '100%' }}></div>
            <NodeSelection state={state} nodesList={selectedChannels} onClick={handleCheckboxClick} />
        </>
    )

}

export default TimeSeries