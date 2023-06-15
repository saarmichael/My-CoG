import {
    ChartXY,
    Themes,
    Dashboard,
    LegendBox,
    LineSeries,
    Point,
    PointMarker,
    UIBackground,
    UIElement,
    UIOrigins,
    ZoomBandChart,
    lightningChart,
} from '@arction/lcjs';
import { useContext, useEffect, useState } from 'react';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import { getTimeSeries } from '../../shared/ElectrodeDataService';
import { TimeInterval } from '../../shared/GraphRelated';
import { TimeSliderComponent } from './GraphContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

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
            theme: Themes.lightNew,
        }).setRowHeight(3, 0.3);

        chart = dashboard.createChartXY({
            columnIndex: 0,
            columnSpan: 1,
            rowIndex: 0,
            rowSpan: 4,
            theme: Themes.lightNew,
        }).setTitle('');

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
            .setPosition({ x: 100, y: 100 })
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
        <Grid container style={{ height: '70vh', width: '100%', flexDirection: 'column', justifyContent: 'center', padding: 0, margin: 0 }}>
            <h1 className="head" >Time Series Chart</h1>
            <Grid item style={{ height: '85%' }}>
                <div id="time-series" style={{ width: '100%', height: '100%' }}></div>
            </Grid>

            <Grid item style={{ height: '5%' }}>
                <TimeSliderComponent
                    lowText="Start"
                    highText="End"
                    sliderDuration={sliderDuration}
                    setSliderDuration={setSliderDuration}
                />
                <div
                    className="submit-button"
                    style={{
                        padding: '10px',
                        overflow: 'hidden',
                        width: '200px',
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '10px',
                    }}
                    onClick={() => {
                        setTimeRange(sliderDuration);
                    }}
                >
                    {loading ? (
                        <CircularProgress size={15} sx={{ color: 'white' }} />
                    ) : (
                        <>Get Time Series</>
                    )}
                </div>
            </Grid>
        </Grid>

    );
};

export default TimeSeries;
