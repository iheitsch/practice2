/**
 * 
 */
// clicking all over the page generates a random line on the graph fixit
var orgX = 437; // xygraph left + 1/2*width
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
var yindex = 1; // will need to change when you add intermediate inputs fixit
var x = 0;
var maxbx = 10; // should be the same as loop test for statusBox on jsp page
var nmins = 0;
var nmaxes = 0;

function skip() {
     document.getElementById("errct").value = 1;
     allgood = true;
     startAgain(); 
}
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red" ) {
	    var ndx = Number(ansBx.id.substr(1));
	    ansBx.value = "";
	    var correct;
	    if( ndx%4 < 2 ) {
	    	correct = "#4e4c32"; // black
	    } else {
	    	correct = "#f9f2ec"; // white
	    }
	    ansBx.style.color = correct;
	    ansBx.style.backgroundColor = "inherit";
	}
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
function checkY( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		
		var yid = ansBx.id;
		var n = yid.substr(1);
		var currx = num(doc.getElementById("x" + n).innerHTML);
		var par1 = doc.getElementById("whichparam1_" + whichcurve).value;
		var par2 = doc.getElementById("whichparam2_" + whichcurve).value;
		var par3 = doc.getElementById("whichparam3_" + whichcurve).value;
		var rise = num(par1);
		var run = num(par2);
		var intercept = num(par3);
		//document.getElementById("statusBox" + x).innerHTML ="rise: " + rise + " run: " + run + " b: " + intercept;
		//x = (x + 1)%maxbx;
		//document.getElementById("statusBox" + x).innerHTML ="currX[" + n + "]: " + currx;
		//x = (x + 1)%maxbx;
		var expY = rise*currx;
		//document.getElementById("statusBox" + x).innerHTML ="rise*currx: " + expY;
		//x = (x + 1)%maxbx;
		expY = expY/run;
		//document.getElementById("statusBox" + x).innerHTML ="rise*currx/run: " + expY;
		//x = (x + 1)%maxbx;
		expY = expY + intercept;
		//document.getElementById("statusBox" + x).innerHTML ="expY[" + n + "]: " + expY;
		//x = (x + 1)%maxbx;
		if( num(ansBx.value) === expY ) {
			nextN = num(n) + 1;
			if( nextN < lastPt ) {
				yid = "y" + nextN;
				doc.getElementById(yid).focus();
			} else {
				ansBx.blur();
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
				instr3.innerHTML = "Click on this point &#x2192;";
			}
		} else {
			ansBx.style.color = "red";
			if( num(n)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(doc.getElementById("errct").value);
		   	doc.getElementById("errct").value = errct + 1;
		}
	}
}
// needs to count correct if you click anywhere along the line or if you drag the mouse along the line fixit
function checkPt( ev ){
	ev = ev || window.event;
	var mousePos = mouseCoords( ev );
	var doc = document;
	var num = Number;	
	var pct = 0.05;
	var pxlsprsq = 20;
	var cellheight = 28;
	var expXBx = whatrow[0];
	var ndx = num(expXBx.id.substr(1));
	var expYBx = doc.getElementById("y" + ndx);
	var nomX = expXBx.innerHTML;
	var nomY = expYBx.value;
	var dotX = 222+num(nomX)*pxlsprsq;
	var dotY = 222-num(nomY)*pxlsprsq;
	var expX = num(nomX)*pxlsprsq + orgX;
	var expY = -num(nomY)*pxlsprsq + orgY;		
	var lowX = expX - pct*expX;
	var highX = expX + pct*expX;
	var lowY = expY - pct*expY;
	var highY = expY + pct*expY;
	//document.getElementById("statusBox" + x).innerHTML ="low: " + lowX + " mousX: " + mousePos.x + " high: " + highX;
	//x = (x + 1)%maxbx;
	//document.getElementById("statusBox" + x).innerHTML ="low: " + lowY + " mousY: " + mousePos.y + " high: " + highY;
	//x = (x + 1)%maxbx;
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
		} else if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ){
			doc.getElementById("instrs").innerHTML = "Choose another";
			doc.getElementById("instr2").innerHTML = "";
			var nputBxs = doc.getElementsByClassName("nput");
		  	len = nputBxs.length;
		  	for( var i = 0; i < len; ++i ) {
		  		nputBxs[i].type = "hidden";
		  	}
			var styles = "color: #663300;"
				+ "border: none;"
				+ "background-color: #663300;";
			var removables = doc.getElementsByClassName("rem");
			var len = removables.length;			
			for( var i = 0; i < len; ++i ) {
				removables[i].setAttribute("style", styles);
			}
			doc.getElementById("whichcurves").value = "0";
			var e = document.getElementById("chs");
			var curvetype = e.options[e.selectedIndex].text;
			var param1;
			var param2;
			var param3;
			var id;
			nmins = 0;
			nmaxes = 0;
			for( var i = 0; i <= whichcurve; i += 1 ) {
				id = "whichparam1_" + i;
				param1 = doc.getElementById(id).value;
				id = "whichparam2_" + i;
				param2 = doc.getElementById(id).value;
				id = "whichparam3_" + i;
				param3 = doc.getElementById(id).value;
				drawcurve( curvetype, num(param1), num(param2), num(param3), i );
			}
			var form = doc.getElementById("plots");
  			form.removeChild( instr3 );			
		} else { // plotted one curve, start another similar one
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
	var doc = document;
	//alert("type: " + type + "  param1: " + par1 + " param2 " + par2);
	var xygraph = doc.getElementById("xygraph");
	var graphxo = 222;
	var graphyo = 222;
	var gridspace = 20;
	var xstart = -10;
	var xstop = 10;
	var rise = num(par1);
	var run = num(par2);
	var slope = rise/run;
	var intercept = num(par3);
	var ystart = slope*xstart + intercept;
	var ystop = slope*xstop + intercept;
	var ymax;
	var ymin;
	var hitsleftedge = true;
	///////////////green	gold		orange		burgundy	chocolate
	var colors = ["#33cc33", "#ffbf80", "#ef5600", "#cc0000", "#ac7339", "red"];
	var ltcols = [ "#68e514", "#ffdb4d", "#ffbb99", "#ff2da4", "#d2a679", "white" ];

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
		ymin = ystop;
		ystop = -10;
		xstop = (ystop - intercept)/slope;
		hitsleftedge = false;
		nmins += 1;
	}
 
	if( ystop > 10 ) {
		ymax = ystop;
		ystop = 10;
		xstop = (ystop - intercept)/slope;
		hitsleftedge = false;
		nmaxes += 1;
	}
	
	// convert to location on window
	xstart = graphxo + mat.round(xstart*gridspace);
	xstop = graphxo + mat.round(xstop*gridspace);
	ystart = graphyo - mat.round(ystart*gridspace);
	ystop = graphyo - mat.round(ystop*gridspace);
	cls = cls%colors.length;
	var htmseg = '<line x1="' + xstart + '" y1="' + ystart;
	htmseg += '" x2="' + xstop + '" y2="' + ystop;
	htmseg += '" style="stroke:' + colors[cls] + ';stroke-width:2" />';			
	xygraph.innerHTML += htmseg;
	
	var cap = doc.createElement("label");
	var intermed = "";
	var absrise = mat.abs(rise);
	var absrun = mat.abs(run);
   	if( !(absrise == 1 && absrun == 1) ) { 
   		intermed += absrise;
   	}
	if( absrun != 1 ) {
	   	intermed = "(" + intermed;
	}
	if( rise*run < 0 ) {
		intermed = "-" + intermed;
	} 		
	if( absrun != 1 ) {
		intermed += "/" + absrun + ")";
	}
   	var rest = "";
	if( intercept != 0 ) {
		if( intercept < 0 ) {
			rest = " - ";
		} else {
		    rest = " + ";
		}
	    rest += Math.abs(intercept);
	}
	cap.innerHTML = "y = " + intermed + "X" + rest;
	var xp = 215 + xstop; // xyframe left + xstop
	if( hitsleftedge ) {
		xp += gridspace + 3;
	}
	var yp = 90;
	if( ymax ) {
		yp += ystop - (1 + nmaxes)*gridspace;
	} else if( ymin ) {
		yp += ystop + nmins*gridspace;
	} else {
		yp += ystop;
	}
	// colors are wrong, position is wrong fixit
	var styles = "position: absolute;"
		+ "width: 150px;"
		+ "color: " + ltcols[cls] + ";"
		+ "left: " + xp + "px;"
		+ "top: " + yp + "px;";
	cap.setAttribute("style", styles);
	var form = doc.getElementById("plots");
	form.appendChild( cap ); 
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
	const selectDropdown = document.getElementById("chs");
	selectDropdown.addEventListener('change', startAgain );
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
	nmins = 0;
	nmaxes = 0;
	for( var i = 0; i < whichcurve; i += 1 ) {
		id = "whichparam1_" + i;
		param1 = doc.getElementById(id).value;
		id = "whichparam2_" + i;
		param2 = doc.getElementById(id).value;
		id = "whichparam3_" + i;
		param3 = doc.getElementById(id).value;
		drawcurve( curvetype, num(param1), num(param2), num(param3), i );
	}
	
	if( curvetype !== "Select") {
		lastPt = Number(doc.getElementById("lastPt").value);

	    instr3 = doc.createElement("label");
	    var styles = "position: absolute;"
		    + "top: 103px;"
		    + "left: 7px;"
		    + "width: 120px;";
		instr3.setAttribute("style", styles);

		instr3.innerHTML = "what is y?";
	    var form = doc.getElementById("plots");
	  	form.appendChild( instr3 );  	
	  	var nputBxs = doc.getElementsByClassName("nput");
	  	len = nputBxs.length;
	  	for( var i = 0; i < len; ++i ) {
	  		nputBxs[i].type = "text";
	  	}
	  	doc.getElementById("y0").focus();
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