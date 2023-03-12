import { BasicHeatMap } from "../../components/BasicHeatMap";
import './GridStyle.css';

export function Box (){
  return (
    <div className="box"
    style={{ margin: 0, height: '100%', paddingBottom: '40px' }}>
      Somebody once told me the world is gonna roll me
    </div>
  );
} 

export function Box1 (){

return (<div className="box">
          <BasicHeatMap />
        </div>)
}

export default Box;