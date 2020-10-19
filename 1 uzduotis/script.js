var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var allSteps; 
var stepsStarted;
var vector, vector2;
output.innerHTML = slider.value;

slider.oninput = function()
{
    output.innerHTML = slider.value;
    clear();
    stepsStarted = true;
    drawBorder();
    drawFractal(output.innerHTML);
}
function clear()
{
    ctx.clearRect(0,0,700,700);
}
function animateFractal1()
{
    var i = 0;
    var interval = setInterval(frame,50);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1- 0.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#7BB32E';
            ctx.transform(vector,0,0,vector,250*i,0);
            drawShape();
            ctx.restore();
            i+=0.01;
        }
    }
   
}
function animateFractal2()
{
    var i = 0;
    var interval = setInterval(frame,50);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1-0.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#B80F0A';
            ctx.transform(vector*Math.cos(Math.PI*i),vector*Math.sin(-Math.PI*i),vector*Math.sin(Math.PI*i),vector*Math.cos(Math.PI*i),500*i,500*i);
            drawShape();
            ctx.restore();
            i+=0.01;
        }
    }
    
}
function animateFractal3()
{
    var i = 0;
    var vector2;
    var interval = setInterval(frame,50);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1- 1.5*i;
            vector2 = 1 - 0.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#FEE236';
            ctx.transform(vector2*Math.cos(Math.PI/2*i),vector2*Math.sin(-Math.PI/2*i),vector*Math.sin(Math.PI/2*i),vector*Math.cos(Math.PI/2*i),250*i,500*i);
            drawShape();
            ctx.restore();
            i+=0.01;
        }
    }
    
}
function animateFractal4()
{
    var i = 0;
    var interval = setInterval(frame,50);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1-1.5*i;
            vector2 =1-0.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#187BCD';
            ctx.transform(vector2*Math.cos(Math.PI/2*i),vector2*Math.sin(Math.PI/2*i)/2,vector*Math.sin(-Math.PI/2*i)/2,vector*Math.cos(Math.PI/2*i),125*i,125*i);
            drawShape();
            ctx.restore();
            i+=0.01;
        }
    }
    
}

function drawShape()
{  
    ctx.beginPath();
    ctx.moveTo(500,0);
    ctx.lineTo(500,375);
    ctx.lineTo(250,500);
    ctx.lineTo(250,375);
    ctx.lineTo(125,500);
    ctx.lineTo(0,500);
    ctx.lineTo(0,375);
    ctx.lineTo(500,0);
    ctx.fill();
}

function drawBorder()
{
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(500,0);
    ctx.lineTo(500,500);
    ctx.lineTo(0,500);
    ctx.closePath();
    ctx.stroke(); 
}

function drawFractal(steps)
{
    if(steps>0)
    {
        steps=steps-1;
        if(stepsStarted==true)
        {
            allSteps = steps;
            stepsStarted = false;
        }
        ctx.save();
        if(steps == allSteps) ctx.fillStyle = '#7BB32E';
        ctx.transform(0.5,0,0,0.5,250,0);
        drawFractal(steps);
        ctx.restore();

        ctx.save();
        if(steps == allSteps) ctx.fillStyle = '#B80F0A';
        ctx.transform(-0.5,0,0,-0.5,500,500);
        drawFractal(steps);
        ctx.restore();

        ctx.save();
        if(steps == allSteps) ctx.fillStyle = '#FEE236';
        ctx.transform(0,-0.5,-0.5,0,250,500);
        drawFractal(steps);
        ctx.restore();

        ctx.save();
        if(steps == allSteps) ctx.fillStyle = '#187BCD';
        ctx.transform(0,0.25,0.25,0,125,125);
        drawFractal(steps);
        ctx.restore();
        
    }
    else drawShape();
}

drawBorder();
drawShape();