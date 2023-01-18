import { lightningChart } from '@arction/lcjs'
import React, { useRef, useEffect } from 'react'

interface ChartProps {
    data: any
    id: string
}

interface ChartRef {
    chart: any
    series: any
}

const LCChart:React.FC<ChartProps> = (props: ChartProps) => {
    const { data, id } = props
    const chartRef = useRef<ChartRef | undefined>(undefined)

    useEffect(() => {
        console.log('create chart')
        const chart = lightningChart().ChartXY({ container: id })
        const series = chart.addLineSeries()
        chartRef.current = { chart, series }


        return () => {
            // Destroy chart.
            console.log('destroy chart')
            chart.dispose()
            chartRef.current = undefined
        }
    }, [id])

    useEffect(() => {
        const components = chartRef.current
        if (!components) return

        // Set chart data.
        const { series } = components
        console.log('set chart data', data)
        series.clear().add(data)

    }, [data, chartRef])

    return <div id={id} className='chart'></div>
}

export default LCChart

