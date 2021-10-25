/**
 * 
 */

var orgX = 272;
var orgY = 282;
var nextI = 0;
var prevX;
var prevY;
var allgood = true;
var lastPt;

//document.onmousedown = checkPt;
/*function check() {
	if( allgood ) {
		startAgain();
	}
	return false;
} */
function skip() {
     document.getElementById("errct").value = 1;
     allgood = true;
     startAgain(); 
}
/*
function updateLine( lineObjectHandle, Ax, Ay, Bx, By ) {
	var
		xMin		= Math.min( Ax, Bx ),
		yMin		= Math.min( Ay, By ),
		xMax		= Math.max( Ax, Bx ),
		yMax		= Math.max( Ay, By ),
		boxWidth	= Math.max( xMax-xMin, 1 ),
		boxHeight	= Math.max( yMax-yMin, 1 ),
		tmp			= Math.min( boxWidth, boxHeight, 256 ),
		lineIndex	= (Bx-Ax)*(By-Ay)<0?0:1;

	while( tmp>>=1 ) {
		lineIndex += 2;
	}
	
	lineObjectHandle.src = preloadedImages[lineIndex].src;
	with( lineObjectHandle.style ) {
		width	= boxWidth	+"px"
		height	= boxHeight	+"px"
		left	= xMin		+"px"
		top		= yMin		+"px"
	}
} */
function drawLine( x1, y1, x2, y2 ) {
	var htmseg = '<line x1="' + x1;
	htmseg += '" y1="' + y1;
	htmseg += '" x2="' + x2;
	htmseg += '" y2="' + y2;
	htmseg += '" style="stroke:rgb(0,0,0);stroke-width:2" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
}
/*	var doc = document;
	var objectHandle = doc.getElementById( "line"+ lineIndex );
	if( !objectHandle ) {
		//alert("about to create line " + lineIndex);
		doc.body.innerHTML += "<img id='line"+ lineIndex +"' class='line' >";
		//alert("created line " + lineIndex);
		objectHandle = doc.getElementById( "line"+ lineIndex );		
	}
	//alert("about to update line " + lineIndex);
	updateLine( objectHandle, x1, y1, x2, y2 );
	//alert("just updated");
} */
function checkPt( ev ){
	ev = ev || window.event;
	var mousePos = mouseCoords( ev );
	//if( orgX - 205 < mousePos.x && mousePos.x < orgX + 205 && orgY - 205 < mousePos.y && mousePos.y < orgY + 205 ) {
	    var doc = document;
		var num = Number;	
		var pct = 0.05;
		var pxlsprsq = 20;
		var nomX = doc.getElementById("expX").value;
		var nomY = doc.getElementById("expY").value;
		var dotX = 222+num(nomX)*pxlsprsq;
		var dotY = 222-num(nomY)*pxlsprsq;
		var expX = num(doc.getElementById("expX").value)*pxlsprsq + orgX;
		var expY = -num(doc.getElementById("expY").value)*pxlsprsq + orgY;
		
		var lowX = expX - pct*expX;
		var highX = expX + pct*expX;
		var lowY = expY - pct*expY;
		var highY = expY + pct*expY;
		if( lowX < mousePos.x && mousePos.x < highX && 
			lowY < mousePos.y && mousePos.y < highY ) {
			// do I need a canvas? fixit
			// can you draw lines that aren't horizontal or vertical?'
			//alert("about to put dot");
			putDot( dotX, dotY );
			//alert("about to draw line");
			if( prevX && prevY ) {
				drawLine( prevX, prevY, dotX, dotY );
			}
			prevX = dotX;
			prevY = dotY;
			++nextI;
			var hbar = doc.getElementsByClassName("hbar");
			var len = hbar.length;
			//alert("hbar len: " + len);
			for( var i = len - 1; i >= 0; --i  ) {
				var parent = hbar[i].parentNode;
				//alert("removing hbar[" + i + "]");
				parent.removeChild(hbar[i]);
			}
			if( nextI < lastPt ) {
				doc.getElementById("expX").value = doc.getElementById("x" + nextI).value;
				doc.getElementById("expY").value = doc.getElementById("y" + nextI).value;
			} else {
				doc.getElementById("instrs").innerHTML = "Choose another";
				doc.getElementById("instr2").innerHTML = "";
				doc.getElementById("expX").type = "hidden";
				doc.getElementById("expY").type = "hidden";
			}
		} else {
			var errct = Number(doc.getElementById("errct").value);
	    	doc.getElementById("errct").value = errct + 1;
			//alert("mousePos: " + mousePos.x + ", " + mousePos.y + " exp: " + expX  + ", " + expY);
			var hbarExists = doc.getElementsByClassName("hbar");
			if( !hbarExists[0] ) {
				showClick( dotX, dotY, nomX, nomY );
			}
		}
	//}
}
function showClick( x, y, nomX, nomY ) {
	var htmseg = '<line class="hbar" x1="22" y1="' + y;
	htmseg += '" x2="422" y2="' + y;
	htmseg += '" style="stroke:rgb(255,0,0);stroke-width:2" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
	htmseg = '<line class="hbar" x1="' + x;
	htmseg += '" y1="22" x2="' + x;
	htmseg += '" y2="422" style="stroke:rgb(255,0,0);stroke-width:2" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<circle cx="' + x;
	htmseg += '" cy="' + y;
	htmseg += '" r="2" stroke="red" />';
	xygraph.innerHTML += htmseg;
	/* for( var i = 0; i < 400; i += 125 ) {
		for( var j = 0; j < 400; j += 50 ) {
			htmseg = '<text x="' + i + '" y="' + j + '" fill="red" transform="rotate(270 260,280)">x = ' + i + ' y = ' + j + '</text>';
		xygraph.innerHTML += htmseg;
		}
	} */
	var yp = nomX === "-10"? 35: x + 15;
	var xp = nomY > 0? 200 : 400;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" transform="rotate(270 260,280)">x = ' + nomX + '</text>';
	xygraph.innerHTML += htmseg;
	xp = nomX > 0? 100 : 300;
	yp = nomY === "10"? 25 : y;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" >y = ' + nomY + '</text>';
	xygraph.innerHTML += htmseg;
}
/*	var doc = document;
	adjX = x;
	adjY = y;
	var hbar = doc.createElement("div");
	hbar.setAttribute("name","hbar");
	var styles = "border: 1px solid red;"
			   + "width: 400px;"
			   + "height: 0px;"
    		   + "position: absolute;"
    		   + "top: " + adjY + "px;"
			   + "left: 50px;";

	hbar.setAttribute("style", styles);
	doc.body.appendChild( hbar );
	var vbar = doc.createElement("div");
	vbar.setAttribute("name","vbar");
	styles = "border: 1px solid red;"
			   + "width: 0px;"
			   + "height: 400px;"
    		   + "position: absolute;"
    		   + "top: 50px;"
			   + "left: " + adjX + "px;";
	vbar.setAttribute("style", styles);
	doc.body.appendChild( vbar );
} */
function putDot( xX, xY) {
	var htmseg = '<circle cx="' + xX;
	htmseg += '" cy="' + xY;
	htmseg += '" r="2" stroke="black" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
}
	/*
    var doc = document;
    
    var dot = doc.createElement("div");
    doc.body.appendChild( dot );

    //doc.getElementById("statusBox" + x).innerHTML = "at least 2 operands putting bar at: " + putHere;
    //x = (x + 1)%nSbxs;
	adjX = xX - 5;
	adjY = xY - 28;
    var styles = "border: none;"
        + "width: 3px;"
        + "height: 3px;"
        + "position: absolute;"
        + "top: " + adjY + "px;"
        + "left: " + adjX + "px;"
		+ "color: black;"
		+ "font-size: 200%;";
    dot.setAttribute("style", styles);
	dot.innerHTML = ".";
}*/
function mouseCoords(ev){ 
   ev = ev || window.event;
	if( ev.pageX || ev.pageY ){ 
		return {x:ev.pageX, y:ev.pageY}; 
    } 
	var doc = document;
    return { 
		x:ev.clientX + doc.body.scrollLeft - doc.body.clientLeft, 
		y:ev.clientY + doc.body.scrollTop  - doc.body.clientTop
    }; 
} 
function startAgain() {
    var doc = document;
    var Num = Number;
    var nitBx = doc.getElementById("initlzd");
	if( nitBx.value === "true" ) {
	    var errCt = Num(doc.getElementById("errct").value);
	    var numAttmptd = Num(doc.getElementById("numAttmptd").value);
	    var numWoErr = Num(doc.getElementById("numWoErr").value);
	    var consWoErr = Num(doc.getElementById("consWoErr").value);
	
	    // update problem counts
	    doc.getElementById("numAttmptd").value = numAttmptd + 1;
	    if( errCt === 0 ) {
	            doc.getElementById("numWoErr").value = numWoErr + 1;    
	            doc.getElementById("consWoErr").value = consWoErr + 1;
	    } else {
	        doc.getElementById("consWoErr").value = '0';
	    }
	    
	    var jstime = Num(Date.now());
	    var jatime = Num(doc.getElementById("strtTime").value);
	    var timediff = jstime - jatime;
	    if( timediff === 0 ) {
	        doc.getElementById("corrPerHr").value = 0;
	    } else {
	        doc.getElementById("corrPerHr").value = 
	        Math.floor(3600000*Num(doc.getElementById("numWoErr").value)/timediff);
	    }
	} else {
		nitBx.value = "true";
	}
    if( allgood ) {
        var whatForm = doc.getElementById('plots');
        whatForm.submit();
        return false;
    }
}
window.onload = function() {
	var doc = document;
	//preloadedImages = doc.images||doc.getElementById('preload').getElementsByTagName('img');
	var xygraph = document.getElementById("xygraph");
	//var ctx = xygraph.getContext("2d");
	xygraph.innerHTML += '<rect width="444" height="444" style="fill:rgb(179,143,0);" />';
	xygraph.innerHTML += '<rect x="2" y="2" width="440" height="440" style="fill:rgb(255,230,179);" />';
	xygraph.innerHTML += '<rect x="18" y="18" width="408" height="408" style="fill:rgb(179,143,0);" />';
	xygraph.innerHTML += '<rect x="20" y="20" width="404" height="404" style="fill:rgb(255,255,255);" />';
	for( var y = 22; y < 424; y += 20 ) {
		var htmseg = '<line x1="22" y1="' + y;
		htmseg += '" x2="422" y2="' + y;
		htmseg += '" style="stroke:rgb(0,0,255);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
	}
	for( var x = 22; x < 424; x += 20 ) {
		var htmseg = '<line x1="' + x;
		htmseg += '" y1="22" x2="' +x;
		htmseg += '" y2="422" style="stroke:rgb(0,0,255);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
	}
	var htmseg = '<line x1="222" y1="22" x2="222" y2="422" style="stroke:rgb(255,200,200);stroke-width:2" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<line x1="22" y1="222" x2="422" y2="222" style="stroke:rgb(255,200,200);stroke-width:2" />';
	xygraph.innerHTML += htmseg;
	lastPt = Number(doc.getElementById("lastPt").value);
}