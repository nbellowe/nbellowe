var colors = [
  "red",
  "blue",
  //"green", asdf
  '',
  "yellow",
  "purple",
  "white",
  "pink"
];

var BACKGROUND_COLOR = "black",
    CLEAR_DELAY = 1000; //clear a pixel 50ms after drawn

var backCtx= makeContext();
clear(backCtx);
for(var i =0; i<1000; i++)
  makeRandom();



function makeRandom(){
  var randColor = colors[Math.floor(colors.length*Math.random())];
  var randTime = Math.floor(Math.random() * 500000);
  var r1 = Math.random(), r2 = Math.random();
  var size = Math.ceil(Math.random() * 10);
  var speed = Math.random() * 5;
  setTimeout(() =>
    timerGraph(x => r1 * Math.sin(r2*x), randColor, speed, size), randTime);
}



function makeContext(){
  var canv = document.createElement("canvas");
  var ctx = canv.getContext("2d");
  document.body.appendChild(canv);
  ctx.canvas.style.position="absolute";
  ctx.canvas.style.top=ctx.canvas.style.left="0px";
  ctx.canvas.width  = window.innerWidth - 1;
  ctx.canvas.height = window.innerHeight - 1;
  return ctx;
}

function fillIn(s, ctx, col, x, y, w, h){
  setTimeout(() => fillColorRect(ctx,col,x-1,y-1,w+2,h+2), s);
}
function fillColorRect(ctx, col,x,y,w,h){
   	 	var old = ctx.fillStyle;
     	ctx.fillStyle=col;
      ctx.fillRect(x,y,w,h);
     	ctx.fillStyle = old;
}

function clear(ctx,x?,y?,width?,height?){
  fillColorRect(ctx,BACKGROUND_COLOR,x||0,y||0,width||ctx.canvas.width,height||ctx.canvas.height);
}

//color scales, (0-1) => scaled color
function colorScale (x){
	  return Number(parseInt(x,10)).toString(16);
}

//ctx and  function that takes from 0-1 returns from -1, -1
function timerGraph(fn, color, speed, size){
  var ctx = makeContext();
  console.log("A timer is now initializing");
  var CIRCLE = false,
      PIXEL_HEIGHT = size ||4, PIXEL_WIDTH = size || 4, PIXEL_COLOR = color || "red",
      speed = speed || 1,
      STEP_BY = 1, STEP_EVERY = Math.ceil(64/speed),
      XSCALE = 50, YSCALE = ctx.canvas.height/2,
      x = 0, interval = setInterval(drawPoint, STEP_EVERY);
  function drawPoint(){
    console.error(x, STEP_BY)
    var halfHeight = ctx.canvas.height / 2;
    if(x>=ctx.canvas.width)   {
      ctx.canvas.width += 0;
      x=0;
    }
    else
      x+=STEP_BY;

    var y = Math.ceil(halfHeight + (fn(x/ctx.canvas.width * XSCALE) * YSCALE));
    var temp = x;
    console.error("AAA", x, y)
    //setTimeout(() => fillIn(CLEAR_DELAY,ctx,BACKGROUND_COLOR,temp,y,PIXEL_WIDTH,PIXEL_HEIGHT), CLEAR_DELAY);
    fillColorRect(ctx, PIXEL_COLOR, x,y,PIXEL_WIDTH,PIXEL_HEIGHT);

  }

}
