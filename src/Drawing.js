import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';
import paper, {Path, Point, Symbol, Group} from 'paper';
// import something from './myscript.js'
const HEIGHT = 200;
const WIDTH = 200;

function Drawing() {
  const [err, setErr] = useState({p: 0, i: 0, d: 0})

  const PaperRef = useRef(null)
  useEffect(() => {
    paper.setup(PaperRef.current)
    // paper.setup(canvas)
// paper.view.onFrame = function (event) {
// 	var vector = [-10, 0]
// 	moveStars(vector);
// }
    var tool = new paper.Tool();
    var path = new Path();
    let bigP = []
    tool.onMouseDown = function(event) {
      path.removeSegments()
      bigP = [];
      path.strokeColor = 'black';
      path.add(event.point);
    }
    // tool.onMouseMove = function(event) {
    //   mousePos = event.point;
    //   // console.log('m', mousePos)
    // }
    tool.onMouseDrag = function(event) {
      path.add(event.point);
    }
    tool.onKeyDown = function (event) {
      if (event.key === 'space')
        paper.project.activeLayer.selected = !paper.project.activeLayer.selected;
    }
    tool.onMouseUp = function (event) {  
      // When the mouse is released, simplify it:
      path.simplify(1)
      path.segments.forEach((seg) => {
        bigP.push({x:seg.point.x, y: seg.point.y})
      })
      // Select the path, so we can see its segments:
      // path.fullySelected = true;
    }
  }, [])
  // useEffect(() => {
  //   var layer = paper.project.activeLayer;
	// 	for (var i = 0; i < count * 3; i++) {
	// 		var item = layer.children[i];
	// 		item.position = item.position.add(vector);
  //     var position = item.position;
  //     var viewBounds = paper.view.bounds;
  //     if (!position.isInside(viewBounds)) {
  //       var itemBounds = item.bounds;
  //       if (position.x < -itemBounds.width - 5) {
  //         position.x = viewBounds.width;
  //       }
  //       if (i < 22) {
  //         position.y = -err.p /scale * viewBounds.height + (viewBounds.height / 2)
  //       } else if ( i < 44) {
  //         position.y = -err.i /scale * viewBounds.height + (viewBounds.height / 2)
  //       } else {
  //         position.y = -err.d /scale * viewBounds.height + (viewBounds.height / 2)

  //       }
  //     }
	// 	}
  // })

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

export default Drawing;

