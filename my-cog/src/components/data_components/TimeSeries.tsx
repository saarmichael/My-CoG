import {
    ChartXY,
    ColorRGBA,
    ColorShadingStyles,
    Dashboard,
    LUT,
    LegendBox,
    LegendBoxBuilders,
    LineSeries,
    PalettedFill,
    Point,
    PointMarker,
    Themes,
    UIBackground,
    UIDraggingModes,
    UIElement,
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
import { TimeInterval } from '../../shared/GraphRelated';
import { TimeSliderComponent } from './GraphContainer';
import CircularProgress from '@mui/material/CircularProgress';

interface Basic3DSpectogramProps {
    data: number[][];
}

const TimeSeries = () => {
    const { state,
        freqList, setFreqList,
        setFreqRange, duration,
        setDuration,
        setTimeRange,
        activeNodes, setActiveNodes,
        loading,
        setConnectivityType, connectivityType,
        isAnimating, setIsAnimating,
        overlap, setOverlap,
        samplesPerSegment, setSamplesPerSegment,
        timeRange
    } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [legend, setLegend] = useState<LegendBox & UIElement | null>(null);
    const [seriesArray, setSeriesArray] = useState<Array<LineSeries> | null>(null);
    const [seriesData, setSeriesData] = useState<Array<Point[]> | null>(null);
    const [sliderDuration, setSliderDuration] = useState<TimeInterval>({
        resolution: 's',
        start: 0,
        end: 0,
        samplesPerSegment: samplesPerSegment,
        overlap: overlap
    });

    const getData = async (electrodeID: string) => {
        return await getTimeSeries(electrodeID, timeRange);
    };

    let dashboard: Dashboard;
    let chart: ChartXY<PointMarker, UIBackground>;
    let zoomBandChart: ZoomBandChart;

    const createDashboard = async () => {
        dashboard = lightningChart().Dashboard({
            container: 'time-series',
            numberOfColumns: 1,
            numberOfRows: 4,
        }).setRowHeight(3, 0.3);

        chart = dashboard.createChartXY({
            columnIndex: 0,
            columnSpan: 1,
            rowIndex: 0,
            rowSpan: 3,
        }).setTitle('Time Series');

        const seriesArray: Array<LineSeries> = [];
        for (const node of state.nodes) {
            const series = chart
                .addLineSeries({
                    dataPattern: {
                        pattern: 'ProgressiveX',
                    },
                })
                .setStrokeStyle((stroke) => stroke.setThickness(1))
                .setName(node.id);
            seriesArray.push(series);
        }

        setSeriesArray(seriesArray);

        for (const series of seriesArray) {
            const data = await getData(series.getName());
            series.add(data);
        }
        const newLegend = chart.addLegendBox().add(chart)
            .setOrigin(UIOrigins.RightTop)
            .setMargin({ left: 10, right: 10, top: 10, bottom: 10 })

        setLegend(newLegend);

        newLegend.setEntries((entry, component) => {
            entry.onMouseClick((_, event) => {
                if (selectedChannels.includes(entry.getText())) {
                    setSelectedChannels(selectedChannels.filter(channel => channel !== entry.getText()));
                } else {
                    setSelectedChannels([...selectedChannels, entry.getText()]);
                }
            });
        });

    };

    useEffect(() => {
        if (isAnimating) return;
        console.log('createDashboard');
        createDashboard();
    }, [timeRange]);

    useEffect(() => {
        if (!legend) return;
        legend.setEntries((entry, component) => {
            if (selectedChannels.includes(entry.getText())) {
                entry.setOn(true);
            } else {
                entry.setOn(false);
            }
        });
    }, [legend]);

    useEffect(() => {
        if (!state.nodes.length) return;
        if (selectedChannels.length) return;
        setSelectedChannels([state.nodes[0].id]);
    }, [state]);

    return (
        <>
            <div id="time-series" style={{ width: '100%', height: '100%' }}></div>
            <div>
                <TimeSliderComponent lowText="Start" highText="End" sliderDuration={sliderDuration} setSliderDuration={setSliderDuration} />
            </div>
            <div
                className="submit-button"
                style={{
                    padding: '10px',
                    overflow: 'hidden',
                    width: '200px',
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                onClick={() => {
                    setTimeRange(sliderDuration);
                }}
            >
                {loading ? <CircularProgress size={15} sx={{ color: "white" }} /> : <>Get Time Series</>}
            </div>
        </>
    );
};

export default TimeSeries;
