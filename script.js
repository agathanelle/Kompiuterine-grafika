var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var allSteps; 
var stepsStarted;
var vector, xStart, yStart;
output.innerHTML = slider.value;

slider.oninput = function()
{
    output.innerHTML = slider.value;
    ctx.clearRect(0,0,500,500);
    stepsStarted = true;
    drawBorder();
    drawFractal(output.innerHTML);
}
function clear()
{
    ctx.clearRect(0,0,500,500);
}
function animateFractal1()
{
    xStart = 0;
    var i = 0;
    var interval = setInterval(frame,100);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1- 0.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#7BB32E';
            ctx.transform(vector,0,0,vector,xStart,0);
            drawShape();
            ctx.restore();
            xStart += 25;
            i+=0.1;
        }
    }
}
function animateFractal2()
{
    xStart = 0;
    yStart = 0;
    var i = 0;
    var interval = setInterval(frame,100);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1-1.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#B80F0A';
            ctx.transform(vector,0,0,vector,xStart,yStart);
            drawShape();
            ctx.restore();
            xStart+=50;
            yStart+=50;
            i+=0.1;
        }
    }
}

function animateFractal3()
{
    xStart = 0;
    yStart = 0;
    var i = 0;
    var interval = setInterval(frame,100);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1- 1.5*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#FEE236';
            ctx.transform(0,vector,vector,0,xStart,yStart);
            drawShape();
            ctx.restore();
            xStart+=25;
            yStart+=50; 
            i+=0.1;
        }
    }
}

function animateFractal4()
{
    xStart = 0;
    yStart = 0;
    var i = 0;
    var interval = setInterval(frame,100);
    function frame()
    {
        if(i >=1) clearInterval(interval);
        else
        {
            vector = 1- 0.75*i;
            clear();
            ctx.save();
            ctx.fillStyle = '#187BCD';
            ctx.transform(0,vector,vector,0,xStart,yStart);
            drawShape();
            ctx.restore();
            xStart+=12.5;
            yStart+=12.5;
            i+=0.1;
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