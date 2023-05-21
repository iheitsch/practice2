/**
 * 
 */

var orgX = 432; // xygraph left + 1/2*width
var orgY = 312; // xygraph top + 1/2 height
var nextI = 0;
var prevX;
var prevY;
var allgood = true;
var lastPt;
// store curve type and parameters for redrawing
var curvetype;
var whichcurve;
//var outline;
var instr3;
var whatrow = new Array;
yindex = 1;

///////////////green	gold		orange		burgundy	chocolate
var colors = ["#33cc33", "#ffbf80", "#ef5600", "#cc0000", "#562300", "red"];

function skip() {
     document.getElementById("errct").value = 1;
     allgood = true;
     startAgain(); 
}
function drawLine( x1, y1, x2, y2 ) {
	var htmseg = '<line x1="' + x1;
	htmseg += '" y1="' + y1;
	htmseg += '" x2="' + x2;
	htmseg += '" y2="' + y2;
	htmseg += '" style="stroke:rgb(0,0,0);stroke-width:2" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
}
// needs to count correct if you click anywhere along the line or if you drag the mouse along the line fixit
function checkPt( ev ){
	ev = ev || window.event;
	var mousePos = mouseCoords( ev );
	var doc = document;
	var num = Number;	
	var pct = 0.05;
	var pxlsprsq = 20;
	var cellheight = 23;
	var expXBx = whatrow[0];
	var expYBx = whatrow[yindex]; //doc.getElementById("expY");
	var nomX = expXBx.innerHTML;
	var nomY = expYBx.innerHTML;
	var dotX = 222+num(nomX)*pxlsprsq;
	var dotY = 222-num(nomY)*pxlsprsq;
	var expX = num(nomX)*pxlsprsq + orgX;
	var expY = -num(nomY)*pxlsprsq + orgY;		
	var lowX = expX - pct*expX;
	var highX = expX + pct*expX;
	var lowY = expY - pct*expY;
	var highY = expY + pct*expY;
	if( lowX < mousePos.x && mousePos.x < highX && 
		lowY < mousePos.y && mousePos.y < highY ) {
		putDot( dotX, dotY );
		if( prevX && prevY ) {
			drawLine( prevX, prevY, dotX, dotY );
		}
		prevX = dotX;
		prevY = dotY;
		++nextI;
		// remove remnants of showclick
		var hbar = doc.getElementsByClassName("hbar");
		var len = hbar.length;
		for( var i = len - 1; i >= 0; --i  ) {
			var parent = hbar[i].parentNode;
			parent.removeChild(hbar[i]);
		}
		var styles; // = whatrow[0].getAttribute("style"); may want to strip out border and replace fixit
			//if( styles ) {
			//	styles += "border: none;";
			//} else {
				styles = "border: none;";
			//}
		var len = whatrow.length;
		for( var i = 0; i < len; ++i ) {
			whatrow[i].setAttribute("style", styles);
		}
		if( nextI < lastPt ) {
			/* outline.setAttribute("style", styles); */
			var stylewas = instr3.getAttribute("style");
			//alert("stylewas: " + stylewas);
			var strt = stylewas.indexOf("top");
			var frstpart = stylewas.substring(0,strt);
			var wherewas = stylewas.substring(strt + 5);
			var stp = wherewas.indexOf("px");
			var nextstrt = wherewas.indexOf(";") + 1;
			var lastpart = wherewas.substring(nextstrt);
			wherewas = wherewas.substring(0,stp);		
			var newpos = num(wherewas) + cellheight;
			//alert("wherewas: |" + wherewas + "| newpos: " + newpos);
			var styles = frstpart + "top: " + newpos + "px;" + lastpart;
			instr3.setAttribute("style", styles);
			whatrow = doc.getElementsByClassName("r" + nextI);
			styles = whatrow[0].getAttribute("style");
			if( styles ) {
				styles += "border: 2px solid white;";
			} else {
				styles = "border: 2px solid white;";
			}
			var len = whatrow.length;
			for( var i = 0; i < len; ++i ) {
				whatrow[i].setAttribute("style", styles);
			}
			
			//expXBx.value = doc.getElementById("x" + nextI).innerHTML;
			//expYBx.value = doc.getElementById("y" + nextI).innerHTML;
		} else if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ){
			doc.getElementById("instrs").innerHTML = "Choose another";
			doc.getElementById("instr2").innerHTML = "";
			var styles = "color: #663300;"
				+ "border: none;"
				+ "background-color: #663300;";
			var removables = doc.getElementsByClassName("rem");
			var len = removables.length;
			
			for( var i = 0; i < len; ++i ) {
				removables[i].setAttribute("style", styles);
			}
			//expXBx.type = "hidden";
			//expYBx.type = "hidden";
			doc.getElementById("whichcurves").value = "0";
			var e = document.getElementById("chs");
			var curvetype = e.options[e.selectedIndex].text;
			//alert("whichcurve: " + whichcurve + " curvetype: " + curvetype);
			var param1;
			var param2;
			var param3;
			var id;
			for( var i = 0; i <= whichcurve; i += 1 ) {
				id = "whichparam1_" + i;
				//alert("getElement ID " + id);
				param1 = doc.getElementById(id).value;
				id = "whichparam2_" + i;
				//alert("getElement ID " + id);
				param2 = doc.getElementById(id).value;
				id = "whichparam3_" + i;
				//alert("getElement ID " + id);
				param3 = doc.getElementById(id).value;
				//alert("param1,2[ "  + i + " ]: " + param1 + ", " + param2)
				drawcurve( curvetype, num(param1), num(param2), num(param3), i );
			}
			var form = doc.getElementById("plots");
  			form.removeChild( instr3 );			
		} else { // plotted one curve, start another similar
			startAgain();
		}
	} else {
		var errct = Number(doc.getElementById("errct").value);
	   	doc.getElementById("errct").value = errct + 1;
		var hbarExists = doc.getElementsByClassName("hbar");
		if( !hbarExists[0] ) {
			showClick( dotX, dotY, nomX, nomY );
		}
	}
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
	var yp = nomX === "-10"? 55: x + 15;
	var xp = nomY > 0? 200 : 400;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" transform="rotate(270 260,280)">x = ' + nomX + '</text>';
	xygraph.innerHTML += htmseg;
	xp = nomX > 0? 100 : 300;
	yp = nomY === "10"? 35 : y;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" >y = ' + nomY + '</text>';
	xygraph.innerHTML += htmseg;
}
function putDot( xX, xY) {
	var htmseg = '<circle cx="' + xX;
	htmseg += '" cy="' + xY;
	htmseg += '" r="2" stroke="black" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
}
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
// draw smoothed, extended and labelled curve
function drawcurve( type, par1, par2, par3, cls ) {
    var num = Number;
	var mat = Math;
	//alert("type: " + type + "  param1: " + par1 + " param2 " + par2);
	var xygraph = document.getElementById("xygraph");
	var graphxo = 222;
	var graphyo = 222;
	var gridspace = 20;
	var xstart = -10;
	var xstop = 10;
	var slope = num(par1)/num(par2);
	var intercept = num(par3);
	var ystart = slope*xstart + intercept;
	var ystop = slope*xstop + intercept;
	//alert("xstart: " + xstart + " ystart: " + ystart + " xstop: " + xstop + " ystop: " + ystop);
	// make sure endpoints are on the graph
	if( ystart < -10 ) {
		ystart = -10;
		xstart = (ystart - intercept)/slope;
	}
	if( ystart > 10 ) {
		ystart = 10;
		xstart = (ystart - intercept)/slope;
	}
	if( ystop < -10 ) {
		ystop = -10;
		xstop = (ystop - intercept)/slope;
	}
	if( ystop > 10 ) {
		ystop = 10;
		xstop = (ystop - intercept)/slope;
	}
	//alert("limiting -10 to +10 xstart: " + xstart + " ystart: " + ystart + " xstop: " + xstop + " ystop: " + ystop);
	
	// convert to location on window
	xstart = graphxo + mat.round(xstart*gridspace);
	xstop = graphxo + mat.round(xstop*gridspace);
	ystart = graphyo - mat.round(ystart*gridspace);
	ystop = graphyo - mat.round(ystop*gridspace);
	//alert("on graph xstart: " + xstart + " ystart: " + ystart + " xstop: " + xstop + " ystop: " + ystop);

	cls = cls%colors.length;
	//alert("color: " + colors[cls]);
	var htmseg = '<line x1="' + xstart + '" y1="' + ystart;
	htmseg += '" x2="' + xstop + '" y2="' + ystop;
	htmseg += '" style="stroke:' + colors[cls] + ';stroke-width:2" />';			
	xygraph.innerHTML += htmseg;
	
	//htmseg = '<line x1="' + graphxo + '" y1="' + graphyo;
	//htmseg += '" x2="242" y2="202" style="stroke:rgb(255, 0, 0);stroke-width:1" />';			
	//xygraph.innerHTML += htmseg;
}
//if someone clicks the select in the middle of a set, it gets hosed fixit
function startAgain() {
    var doc = document;
    var Num = Number;
    var nitBx = doc.getElementById("initlzd");
	//alert("nitBx value: " + nitBx.value );
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
	var num = Number;
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += '<rect width="444" height="444" style="fill:rgb(78, 76, 50);" />';
	xygraph.innerHTML += '<rect x="2" y="2" width="440" height="440" style="fill:rgb(191, 128, 64);" />';
	xygraph.innerHTML += '<rect x="18" y="18" width="408" height="408" style="fill:rgb(78, 76, 50);" />';
	xygraph.innerHTML += '<rect x="20" y="20" width="404" height="404" style="fill:rgb(255,255,255);" />';
	// draw horizontal and vertical stripes to make a grid
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
	htmseg = '<polygon points="424,222 422,212 444,222 422,232" ';
	htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<polygon points="222,18 232,22 222,0 212,22" ';
	htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<text x="428" y="214" fill="rgb(249, 242, 236)" >X</text>';
	xygraph.innerHTML += htmseg;
	htmseg = '<text x="228" y="16" fill="rgb(249, 242, 236)" >Y</text>';
	xygraph.innerHTML += htmseg;
	var offs = 62;
	offs = 67;
	for( var i = 8; i > -10; i -= 2 ) {
		//htmseg = '<text x="222" y="' + offs + '" fill="rgb(255,200,200)" >' + i + '</text>';
		htmseg = '<text x="222" y="' + offs + '" fill="rgb(230, 0, 0)" >' + i + '</text>';
		xygraph.innerHTML += htmseg;
		offs += 40;
	}
	offs = 45;
	offs = 50;
	for( var i = -8; i < 10; i += 2 ) {
		if( i=== 0 ) {
			offs += 7;
		}
		//htmseg = '<text x="' + offs + '" y="234" fill="rgb(255,200,200)" >' + i + '</text>';
		htmseg = '<text x="' + offs + '" y="234" fill="rgb(230, 0, 0)" >' + i + '</text>';
		xygraph.innerHTML += htmseg;
		offs += 40;
	}
	whichcurve = num(doc.getElementById("whichcurve").value);
	var e = document.getElementById("chs");
	var curvetype = e.options[e.selectedIndex].text;
	//alert("whichcurve: " + whichcurve);
	var param1;
	var param2;
	var param3;
	var id;
	for( var i = 0; i < whichcurve; i += 1 ) {
		id = "whichparam1_" + i;
		//alert("getElement ID " + id);
		param1 = doc.getElementById(id).value;
		id = "whichparam2_" + i;
		//alert("getElement ID " + id);
		param2 = doc.getElementById(id).value;
		id = "whichparam3_" + i;
		//alert("getElement ID " + id);
		param3 = doc.getElementById(id).value;
		//alert("param1,2[ "  + i + " ]: " + param1 + ", " + param2)
		drawcurve( curvetype, num(param1), num(param2), num(param3), i );
	}
	
	if( curvetype !== "Select") {
		lastPt = Number(doc.getElementById("lastPt").value);
		whatrow = doc.getElementsByClassName("r0");
		var styles = whatrow[0].getAttribute("style");
		if( styles ) {
			styles += "border: 2px solid white;";
		} else {
			styles = "border: 2px solid white;";
		}
		var len = whatrow.length;
		for( var i = 0; i < len; ++i ) {
			whatrow[i].setAttribute("style", styles);
		}
	    instr3 = doc.createElement("label");
	    styles = "position: absolute;"
		    + "top: 103px;"
		    + "left: 7px;"
		    + "width: 120px;";
		instr3.setAttribute("style", styles);
		instr3.innerHTML = "Click on this point &#x2192;";
	    var form = doc.getElementById("plots");
	  	form.appendChild( instr3 );
	} else {
		var styles = "color: #663300;"
			+ "border: none;"
			+ "background-color: #663300;";
		var removables = doc.getElementsByClassName("rem");
		var len = removables.length;
		
		for( var i = 0; i < len; ++i ) {
			removables[i].setAttribute("style", styles);
		}
	}

	if( doc.getElementById("initlzd").value === "true" && nextI < lastPt ) {
		doc.getElementById("consWoErr").value = '0';		
	}
}