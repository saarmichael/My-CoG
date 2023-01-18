import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';


export const BasicHeatMap = () => {


    // create a matrix 100 X 100 with random values between 0 and 100 
    const matrix = Array.from({ length: 100 }, () => Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100)));

    // use the matrix to create 100 series of 100 data points
    const series = matrix.map((row, i) => ({
        data: row.map((val, j) => ({ x: j, y: val }))
    }));




    // create options for the heatmap
    const options: ApexOptions = {
        chart: {
            width: 180,
            height: 350,
            type: 'heatmap',
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#00800B"],
        title: {
            text: 'HeatMap Chart (Single color)'
        }
    };

    return (
        <div id="chart">
            <Chart options={options} series={series} type="heatmap" height={1000} width={1000} />
        </div>
    );
};
