import DataContainer from "../../components/DataContainer";
import GraphinTest from "../../components/GraphinTest";
import './GridStyle.css';

export function Box (){
  return (
    <div className="box"
    style={{ margin: 0, height: '100%', paddingBottom: '40px' }}>
      <GraphinTest/>
    </div>
  );
} 

export function Box1 (){

return (<div className="box">
          <DataContainer/>
        </div>)
}

export default Box;