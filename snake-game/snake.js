
var drawSnape = function(snapeToDraw, apple){
  var drawableSnape = {color: "aqua", pixels: snapeToDraw};
  var drawableApple = {color: "pink", pixels: [apple]};
  var drawableObjects = [drawableSnape, drawableApple];
  CHUNK.draw(drawableObjects);
}
var moveSegment = function(segment){
  switch (segment.direction) {
    case "down":
      return {top: segment.top + 1, left: segment.left};
    case "up":
      return {top: segment.top - 1, left: segment.left};
    case "right":
      return { top: segment.top, left: segment.left + 1 };
    case "left":
      return { top: segment.top, left: segment.left - 1 };
    default:
      return segment;
  }
}
var segmentFurtherForwardThan = function(index, snape){
  return snape[index - 1] || snape[index];
}

var moveSnape = function(snape){
  return snape.map(function(oldSnapeSeg, segmentIndex){
    var newSnapeSeg = moveSegment(oldSnapeSeg);
    newSnapeSeg.direction = segmentFurtherForwardThan(segmentIndex, snape).direction;
    return newSnapeSeg;
  });

}
var growSnape = function(snape){
  var indexOfLastSegment = snape.length - 1;
  var lastSegment = snape[indexOfLastSegment];
  snape.push({top: lastSegment.top, left: lastSegment.left});
  return snape;
}
var ate = function(snape, otherThing){
  var head = snape[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}
var advanceGame = function(){
  var newSnape = moveSnape(snape);
  //snape = moveSnape(snape);
  if (ate(newSnape, snape)) {
    CHUNK.endGame();
    CHUNK.flashMessage("OMG YOU cannibal!");
  }
  if (ate(newSnape, [apple])) {
    snape = growSnape(newSnape);
    apple = CHUNK.randomLocation();
  }
  if (ate(newSnape, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }
  snape = newSnape;
  drawSnape(snape, apple);
}
var changeDirection = function(direction){
  snape[0].direction = direction;
}


var apple = CHUNK.randomLocation();
var snape = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
CHUNK.executeNTimesPerSecond(advanceGame, 8);
CHUNK.onArrowKey(changeDirection);
