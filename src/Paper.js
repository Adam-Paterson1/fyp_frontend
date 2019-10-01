import React, { useRef, useEffect } from 'react';
import paper, {Path, Symbol} from 'paper';
// import something from './myscript.js'
const HEIGHT = 200;
const WIDTH = 850;
const count = 85;
const vector = [-10, 0]
const scale = 1

function Paper(props) {

  const PaperRef = useRef(null)
  const indexRef = useRef()
  useEffect(() => {
    const proj = new paper.Project(PaperRef.current)
    indexRef.current = proj.index
    var point1 = new paper.Point(0, HEIGHT/2);
    var point2 = new paper.Point(WIDTH, HEIGHT/2);
    var path1 = new paper.Path(point1, point2);
    path1.strokeColor = 'black';

    // paper.setup(PaperRef.current)
    // Create a symbol, which we will use to place instances of later:
    var path = new Path.Circle({
      center: [0, 0],
      radius: 5,
      fillColor: 'black',
      strokeColor: 'black'
    });
    var symbol = new Symbol(path);
    // Place the instances of the symbol:
    for (var i = 0; i < count; i++) {
      var center = [i * 10, HEIGHT/2 - 10]
      symbol.place(center);
    }

    path = new Path.Circle({
      center: [0, 0],
      radius: 5,
      fillColor: 'green',
      strokeColor: 'green'
    });
    symbol = new Symbol(path);
    // Place the instances of the symbol:
    for (i = 0; i < count; i++) {
      center = [i * 10,  HEIGHT/2]
      symbol.place(center);
    }
    path = new Path.Circle({
      center: [0, 0],
      radius: 5,
      fillColor: 'red',
      strokeColor: 'red'
    });
    symbol = new Symbol(path);
    // Place the instances of the symbol:
    for (i = 0; i < count; i++) {
      center = [i * 10,  HEIGHT/2 + 10]
      symbol.place(center);
    }
  }, [])
  useEffect(() => {
    var layer = paper.projects[indexRef.current].activeLayer;
		for (var i = 1; i < (count * 3 + 1); i++) {
      // console.log('wut', i)
			var item = layer.children[i];
			item.position = item.position.add(vector);
      var position = item.position;
      var viewBounds = paper.view.bounds;
      if (!position.isInside(viewBounds)) {
        var itemBounds = item.bounds;
        if (position.x < -itemBounds.width - 5) {
          position.x = viewBounds.width;
        }
        if (i < count + 1) {
          // console.log('b', i)
          position.y = -props.p /scale * viewBounds.height + (viewBounds.height / 2)
        } else if ( i < count*2+1) {
          // console.log('ii', i)
          position.y = -props.i /scale * viewBounds.height + (viewBounds.height / 2)
        } else {
          position.y = -props.d /scale * viewBounds.height + (viewBounds.height / 2)
        }
      }
		}
  })

  return (
    <div className="PaperBlock">
      <canvas 
        id={props.name}
        ref={PaperRef}
        width={WIDTH}
        height={HEIGHT}
        style={{border:"1px solid #000000"}}
       />
       <div className="errNums">
         <div>{props.p}</div>
         <div>{props.i}</div>
         <div>{props.d}</div>
       </div>
    </div>
  );
}

export default Paper;

