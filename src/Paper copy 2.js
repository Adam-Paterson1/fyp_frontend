import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';
import paper, {Path, Point, Symbol, Group} from 'paper';
// import something from './myscript.js'
const HEIGHT = 200;
const WIDTH = 200;
const count = 22;
const vector = [-10, 0]
const scale = 1

function Paper() {
  const [err, setErr] = useState({p: 0, i: 0, d: 0})

  const PaperRef = useRef(null)
  useEffect(() => {
    paper.setup(PaperRef.current)
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
      var center = [i * 10, HEIGHT/2]
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
      center = [i * 10,  HEIGHT/2]
      symbol.place(center);
    }

    const interval = setInterval(() => {
      setErr({p: 0.5, i: Math.random()-0.5, d: -0.4})
    }, 20);
    return () => clearInterval(interval)

    return function cleanup() {
    }
  }, [])
  useEffect(() => {
    var layer = paper.project.activeLayer;
		for (var i = 0; i < count * 3; i++) {
			var item = layer.children[i];
			item.position = item.position.add(vector);
      var position = item.position;
      var viewBounds = paper.view.bounds;
      if (!position.isInside(viewBounds)) {
        var itemBounds = item.bounds;
        if (position.x < -itemBounds.width - 5) {
          position.x = viewBounds.width;
        }
        if (i < 22) {
          position.y = -err.p /scale * viewBounds.height + (viewBounds.height / 2)
        } else if ( i < 44) {
          position.y = -err.i /scale * viewBounds.height + (viewBounds.height / 2)
        } else {
          position.y = -err.d /scale * viewBounds.height + (viewBounds.height / 2)

        }
      }
		}
  })

  return (
    <div className="PaperBlock">
      <canvas 
        id="myCanvas"
        ref={PaperRef}
        width={WIDTH}
        height={HEIGHT}
        style={{border:"1px solid #000000"}}
       />
    </div>
  );
}

export default Paper;

