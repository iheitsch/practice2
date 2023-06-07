/**
 * 
 */
// on clicking on any table input, disable all hints fixit

var halfwidth = 222;
var xygraphleft = 365; // copied from css
var xygraphtop = 90;
var orgX = xygraphleft + halfwidth; 
var orgY = xygraphtop + halfwidth;
var graphstart = 22;
var graphstop = 422;
var pxlsprsq = 20;
var nextI = 0;
var prevX;
var prevY;
var allgood = true;
var lastPt;
// store curve type and parameters for redrawing
var curvetype = "";
var whichcurve = 0;

var form;
var errBx;
var errCtBx;
var xygraph;
var whatrow = new Array;
var pdx = 0;
var maxbx = 10; // should be the same as loop test for statusBox on jsp page
var nmins = 0;
var nmaxes = 0;
var plen;
var xpts = new Array(21);
var ypts = new Array(21);
var captured = new Array(21);
var pointsfound = 0;
var mouseIsDown = false;
var Coords = function( xp, yp ) {
    this.x = xp;
    this.y = yp;
};
//var mouseDownPos = new Coords(-1, -3);
var mouseDownX;
var mouseDownY;
var dragged = false;
var enoughPoints = 2; // needs to be more for anything but straight lines fixit
var par1;
var par2;
var par3;
var mult = 1;
var div = 1;
var bee;
var kay; 
var ache;
var aye;

var nsign = 1;
var op = "";
var n0;
var t0;
var col0;
var colnum = 0;
var tblFilld = false;
var ystops = new Array();

function setMouseDown( ev ) { 
	ev = ev || window.event;
	var mouseDownPos = mouseCoords( ev );
	mouseDownX = mouseDownPos.x;
	mouseDownY = mouseDownPos.y;
	mouseIsDown = true;		
}
function clearMouseDown( ev ) { 
	ev = ev || window.event;
	var mousePos = mouseCoords( ev );
	var mouseUpX = mousePos.x;
	var mouseUpY = mousePos.y;
	var mat = Math;
	var closenuff = 20;
	if( tblFilld &&
		mat.abs(mouseUpX - mouseDownX) < closenuff && 
		mat.abs(mouseUpY - mouseDownY) < closenuff ) {
		checkPt( mouseUpX, mouseUpY );	
	} else if( dragged && pointsfound < enoughPoints ) {
		var doc = document;
		var errct = Number(errCtBx.value);
		errCtBx.value = errct + 1;
	}
	
	mouseIsDown = false;
	dragged = false;
}
function checkCurve( ev ) {
	ev = ev || window.event;
	if( mouseIsDown ) {
		var mat = Math;
		dragged = true;
		var mousePos;
		var mousePos = mouseCoords( ev );
		var closenuff = 10; // pixels

		for( var i = 0; i < plen; ++i ) {
			if( !captured[i] && mat.abs( mousePos.x - xpts[i] ) < closenuff ) { 
				if( mat.abs( mousePos.y - ypts[i] ) < closenuff ) {
					var doc = document;
					pointsfound += 1;
					captured[i] = true;
					if( pointsfound >= enoughPoints ) {
						nextI = lastPt; // don't need to track it any more
						drawCurve( whichcurve );
						if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
							var endinst = doc.getElementById("skpBx").innerHTML;
							doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
							
							clearpage();
							nmins = 0;
							nmaxes = 0;
				  		} else {
							startAgain();
						}
					}
				}
			}
		}
	}
}

function clearpage() {
	var doc = document;
	doc.getElementById("whichcurves").value = "0";
	doc.getElementById("instr2").innerHTML = "";
	if( form.contains(errBx) ) {
  		form.removeChild( errBx );
  	}
  	var whatpts = doc.getElementById("whatpts");
  	if( form.contains(whatpts) ) {
  		form.removeChild( whatpts );
  	}
  	// remove marked dots of last curve
  	var mrx = doc.getElementsByClassName("mrx");
  	var len = mrx.length;
  	for( var i = len-1; i >= 0; --i ) {
  		var parent = mrx[i].parentNode;
		parent.removeChild(mrx[i]);
  	}
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
function drawLine( x1, y1, x2, y2, width, color, clas ) {
	var htmseg = '<line ';
	if( clas ) {
		htmseg += 'class="' + clas + '"';
	}
	htmseg += ' x1="' + x1;
	htmseg += '" y1="' + y1;
	htmseg += '" x2="' + x2;
	htmseg += '" y2="' + y2;
	htmseg += '" style="stroke:' + color;
	htmseg += ';stroke-width:' + width;
	htmseg += ';" />';
	xygraph.innerHTML += htmseg;
}
function checkN( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var nid = ansBx.id; // use global nextI
		rowno = nid.substr(1,nid.length);
		var nextN = num(rowno) + 1;
		var prevval;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( curvetype === "Line" ) {
			expAns = nsign*mult*prevval/div;
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			if( nextN < lastPt ) {
				nextVal = nsign*num(doc.getElementById("x" + nextN).innerHTML)/div;
				nid = "n" + nextN;
				doc.getElementById(nid).focus();
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
			} else {
				doc.getElementById("y0").focus();
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				colnum += 1;			
				if( bee !== 0 ) {
					doc.getElementById("c0_" + colnum).innerHTML = op + " " + bee + " = ";
				} else {
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = "; // times;
				}			
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkT( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var tid = ansBx.id;
		rowno = tid.substr(1,tid.length);
		var xval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( curvetype === "Line" ) {
			expAns = nsign*xval/div;
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			var nextN = num(rowno) + 1;
			if( nextN < lastPt ) {
				tid = "t" + nextN;
				doc.getElementById(tid).focus();
				var curr = doc.getElementById("c" + rowno + "_0");
				var nextVal = doc.getElementById("x" + nextN).innerHTML;
				if( nsign < 0 && nextVal !== "0" ) {
					doc.getElementById("c" + nextN + "_0").innerHTML = "-";
				}
				curr.innerHTML = "";
				curr = doc.getElementById("c" + rowno + "_1");
				doc.getElementById("c" + nextN + "_1").innerHTML = curr.innerHTML;
				curr.innerHTML = "";
			} else {
				var nextBx;
				colnum += 2;
				doc.getElementById("c" + rowno + "_0").innerHTML = "";
				doc.getElementById("c" + rowno + "_1").innerHTML = "";
				if( n0 ) {	
					nextBx = n0;	
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = ";
				} else {
					nextBx = doc.getElementById("y0");
					if( bee !== 0 ) {
						doc.getElementById("c0_" + colnum).innerHTML = op + " " + bee + " = ";
					} else {
						doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = "; // times;
					}
				}
				nextBx.focus();
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkY( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var mat = Math;
		
		var ansVal = num(ansBx.value);
		var yid = ansBx.id;
		var n = yid.substr(1);
		var currx = num(doc.getElementById("x" + n).innerHTML);
		var expY;
		var expY2;
		if( curvetype === "Line" ) {
			expY = nsign*mult*currx/div;
			if( op === "+" ) {
				expY += bee;
			} else if( op === "-" ) {
				expY -= bee;
			}
			expY2 = expY;
		} else if( curvetype === "Circle" || curvetype === "Elipse" ) {
			expY = kay + bee*mat.sqrt(1 - mat.pow((currx - ache)/aye, 2));
			expY = kay - bee*mat.sqrt(1 - mat.pow((currx - ache)/aye, 2));
		}
		if( ansVal === expY || ansVal === expY2 ) {
			errBx.innerHTML = "";
			var nextN = num(n) + 1;
			if( nextN < lastPt ) {
				yid = "y" + nextN;
				doc.getElementById(yid).focus();
				if( nsign < 0 && !n0 && !t0 ) {
					var nextVal = doc.getElementById("x" + nextN).innerHTML;
					if( nextVal !== "0" ) {
						doc.getElementById("c" + nextN + "_0").innerHTML = "-";
					}
				}
				doc.getElementById("c" + n + "_0").innerHTML = "";
				var curr = doc.getElementById("c" + n + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
			} else {
				ansBx.blur();
				var ypts = doc.getElementsByClassName("ypts");
				var len = ypts.length;
				tblFilld = true;
				for( var i = 0; i < len; ++i ) {
					if( ypts[i].value === "") {
						tblFilld = false;
					}
				}
				whatrow = doc.getElementsByClassName("r0");
				len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					whatrow[i].classList.add("hilite");
				}
				if( t0 ) {
					var el = doc.getElementById("on");
					var parent = el.parentNode;
					parent.removeChild(el);
					var tBxs = doc.getElementsByClassName("tBx");
					len = tBxs.length;					
					for( var i = len - 1; i >= 0; --i ) {
						var parent = tBxs[i].parentNode;
						var grandparent = parent.parentNode;
						grandparent.removeChild(parent);
					}
					if( n0 ) {
						var el = doc.getElementById("om");
						var parent = el.parentNode;
						parent.removeChild(el);
						var nBxs = doc.getElementsByClassName("nBx");
						len = nBxs.length;
						for( var i = len - 1; i >= 0; --i ) {
							parent = nBxs[i].parentNode;
							var grandparent = parent.parentNode;
							grandparent.removeChild(parent);
						}
					}
				} else if( n0 ) {
					var el = doc.getElementById("hn");
					var parent = el.parentNode;
					parent.removeChild(el);
					var nBxs = doc.getElementsByClassName("nBx");
					len = nBxs.length;
					for( var i = len - 1; i >= 0; --i ) {
						parent = nBxs[i].parentNode;
						var grandparent = parent.parentNode;
						grandparent.removeChild(parent);
					}
				}
				var tmps = doc.getElementsByClassName("tmp");
				len = tmps.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = tmps[i].parentNode;
					parent.removeChild(tmps[i]);
				}
				doc.getElementById("c-1_0").innerHTML = "Click this";
				col0.innerHTML = "point &#x2192;"; // right arrow
				//doc.getElementById("c" + n + "_" + colnum).innerHTML = ""; // you removed it when you removed tmps
				doc.getElementById("instrs").innerHTML = "";
			}
		} else {
			errBx.innerHTML = "Should be " + expY;
			ansBx.style.color = "red";
			if( num(n)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkPt( mousePosx, mousePosy ){
	if( !dragged ) {
		var doc = document;
		var num = Number;	
		var pct = 0.05;
		var cellheight = 28;
		var expXBx = whatrow[0];
		var expYBx = doc.getElementById("y" + nextI);
		var nomX = expXBx.innerHTML;
		var nomY = expYBx.value;
		var expX = orgX + num(nomX)*pxlsprsq;
		var expY = orgY - num(nomY)*pxlsprsq;	
		var dotX = expX - xygraphleft; // halfwidth + num(nomX)*pxlsprsq;
		var dotY = expY - xygraphtop;
	
		var lowX = expX - pct*expX;
		var highX = expX + pct*expX;
		var lowY = expY - pct*expY;
		var highY = expY + pct*expY;
		if( lowX < mousePosx && mousePosx < highX && 
			lowY < mousePosy && mousePosy < highY ) {
			errBx.innerHTML = "";
			putDot( dotX, dotY );
			if( prevX && prevY ) {
				drawLine( prevX, prevY, dotX, dotY, 2, "black", "mrx" );
			}
			prevX = dotX;
			prevY = dotY;
			var currI = nextI;
			++nextI;
			// remove remnants of showclick
			var hbar = doc.getElementsByClassName("hbar");
			var len = hbar.length;
			for( var i = len - 1; i >= 0; --i  ) {
				var parent = hbar[i].parentNode;
				parent.removeChild(hbar[i]);
			}
			var len = whatrow.length;
			for( var i = 0; i < len; ++i ) {
				whatrow[i].classList.remove("hilite");
			}
			if( nextI < lastPt ) {
				whatrow = doc.getElementsByClassName("r" + nextI);
				var len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					whatrow[i].classList.add("hilite");
				}
				var prevI = currI - 1;
				var prev = doc.getElementById("c" + prevI + "_0");
				var curr = doc.getElementById("c" + currI + "_0");
				doc.getElementById("c" + nextI + "_0").innerHTML = curr.innerHTML;
				curr.innerHTML = prev.innerHTML; 
				prev.innerHTML = "";			
			} else if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
				var endinst = doc.getElementById("skpBx").innerHTML;
				doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
				clearpage();

				nmins = 0;
				nmaxes = 0;
				if( whichcurve > 0 ) { // debug
					drawCurve( whichcurve );
				}		
			} else { // plotted one curve, start another similar one
				startAgain();
			}
		} else {
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
			var hbarExists = doc.getElementsByClassName("hbar");
			if( !hbarExists[0] ) {
				//alert("dotX: " + dotX + " dotY: " + dotY + " nomX: " + nomX + " nomY: " + nomY);
				showClick( dotX, dotY, nomX, nomY );
			}
		}
	}
}
function showClick( x, y, nomX, nomY ) {
	drawLine( graphstart, y, graphstop, y, 2, "red", "hbar" );
	drawLine( x, graphstart, x, graphstop, 2, "red", "hbar" );
	var htmseg = '<circle cx="' + x;
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
	var htmseg = '<circle class="mrx" cx="' + xX;
	htmseg += '" cy="' + xY;
	htmseg += '" r="2" stroke="black" />';
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
function drawCurve( cls ) {
    var num = Number;
	var mat = Math;
	var doc = document;
	var id = "whichparam1_" + cls;
	par1 = doc.getElementById(id).value;
	id = "whichparam2_" + cls;
	par2 = doc.getElementById(id).value;
	id = "whichparam3_" + cls;
	par3 = doc.getElementById(id).value;
	id = "whichparam4_" + cls;
	par4 = doc.getElementById(id).value;
	var gridspace = 20;
	var xstart = -10;
	var xstop = 10;
	var ymax;
	var ymin;
	var hitsrightedge = true;
	///////////////green	gold		orange		burgundy	chocolate
	var colors = ["#33cc33", "#ffbf80", "#ff6600", "#cc0000", "#ac7339", "red"];
	var ltcols = [ "#68e514", "#ffe680", "#ffbb99", "#ff3dd4", "#d2a679", "white" ];
	cls = cls%colors.length;
	var cap = doc.createElement("label");
	var styles = "position: absolute;"
		+ "width: 150px;"
		+ "color: " + ltcols[cls] + ";"
		+ "text-shadow: 0 0 1px #FFFFFF;"

		+ "font-family: Monaco;"
		+ "font-size: 0.8em;";
		
	if( curvetype === "Line" ) {
		var rise = num(par1);
		var run = num(par2);
		var slope = rise/run;
		var intercept = num(par3);
		var ystart = slope*xstart + intercept;
		var ystop = slope*xstop + intercept;

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
			hitsrightedge = false;
			nmins += 1;
		}
		if( ystop > 10 ) {
			ymax = ystop;
			ystop = 10;
			xstop = (ystop - intercept)/slope;
			hitsrightedge = false;
			nmaxes += 1;
		}
	
		// convert to location on window
		xstart = halfwidth + mat.round(xstart*gridspace);
		xstop = halfwidth + mat.round(xstop*gridspace);
		ystart = halfwidth - mat.round(ystart*gridspace);
		ystop = halfwidth - mat.round(ystop*gridspace);
		drawLine( xstart, ystart, xstop, ystop, 2, colors[cls], null );
	
		// re-create equation
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
		cap.innerHTML = "Y = " + intermed + "X" + rest;
	} else if( curvetype === "Circle" || curvetype === "Ellipse" ) {
		//alert("drawing ellipse");
		//var xcent = halfwidth + mat.round(ache*gridspace);
		//var ycent = halfwidth - mat.round(kay*gridspace);
		//var xrad = mat.round(aye*gridspace);
		//var yrad = mat.round(bee*gridspace);
		var htmseg = '<polyline points=" ';
		var h = num(par2);
		var k = num(par3);
		var a = num(par1);
		var b = num(par4);
		for( var xp = h - a; xp <= a + h; xp += 0.1 ) {
			var yp = k + b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));
			var px = halfwidth + mat.round(xp*gridspace);
			var py = halfwidth - mat.round(yp*gridspace);
			htmseg += px + ', ' + py + ' '; 
		}
		var lastbx = maxbx-1;
		//doc.getElementById("statusBox" + lastbx).innerHTML = "a: " + a + " h: " + h + " k: " + k + " b: " + b;
		for( var xp = a + h; xp >= h - a; xp -= 0.1) {
			var yp = k - b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));		
			var px = halfwidth + mat.round(xp*gridspace);
			var py = halfwidth - mat.round(yp*gridspace);
			var newseg = px + ', ' + py + ' '; 
			htmseg += newseg; 
			//doc.getElementById("statusBox" + pdx).innerHTML = "xp: " + xp + " yp: " + yp + " newseg: " + newseg;
			//pdx = (pdx + 1)%(maxbx-1);
		}
		htmseg += '" style="stroke:' + colors[cls];
		htmseg += ';stroke-width:2; fill:none';
		htmseg += ';" />';
		xygraph.innerHTML += htmseg; 
		//htmseg = '<polyline points=" 200,150 175,300 50, 350 ';
		//htmseg += '" style="stroke:' + "blue";
		//htmseg += ';stroke-width:2; fill:none';
		//htmseg += ';" />';
		//xygraph.innerHTML += htmseg; 
	}
	var xp = xygraphleft + xstop; // xyframe left + xstop
	var yp = xygraphtop;
	var yspace = gridspace - 4;
	var aboveframe = 6;
	var belowframe = 4;
	var centerline = yspace/2;
	if( hitsrightedge ) {
		xp += gridspace + 3;

		// find the smallest upper and lower difference, if both combined doesn't have room for another
		// push it right. if there is room move it up or down
		var lowerdiff = 2*yspace;
		var higherdiff = 2*yspace;
		for( var i = 0; i < ystops.length; ++i ) {
			if( ystop >= ystops[i] ) {
				var diff = ystop - ystops[i];
				if( diff < higherdiff ) {
					higherdiff = diff;
				}
			} else {
				var diff = ystops[i] - ystop;
				if( diff < lowerdiff ) {
					lowerdiff = diff;
				}
			}
		}

		if( higherdiff + lowerdiff < 1.7*yspace ) { // in very rare cases with 3 consecutive close lines, a previous
			xp += 140;								// line label may be pushed to the point where the last is out of
			styles += "background: white;";			// order not worth it to fixit ?
		} else {
			if( lowerdiff < yspace ) {
				ystop -= yspace - lowerdiff;
			} else if( higherdiff < yspace ) {
				ystop += yspace - higherdiff;
			}
		}
		ystops.push(ystop);
	}
	if( ymax ) {
		yp += ystop - aboveframe - (1 + nmaxes)*yspace;
	} else if( ymin ) {
		yp += ystop + belowframe + nmins*yspace;
	} else {
		yp += ystop - centerline;
	}
	styles += "left: " + xp + "px;"
			+ "top: " + yp + "px;";

	cap.setAttribute("style", styles);
	form.appendChild( cap ); 
}
function startAgain() {
    var doc = document;
    var Num = Number;
    var nitBx = doc.getElementById("initlzd");
    //alert("starting again");
	if( nitBx.value === "true" ) {
	    var errCt = Num(errCtBx.value);
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
function genpoints ( type, which) {
	var doc = document;
	var num = Number;
	var mat = Math;
	var id = "whichparam1_" + which;
	par1 = num(doc.getElementById(id).value);
	id = "whichparam2_" + which;
	par2 = num(doc.getElementById(id).value);
	id = "whichparam3_" + which;
	par3 = num(doc.getElementById(id).value);
	var xBxs = doc.getElementsByClassName("xpts");
	plen = xBxs.length;
	var xp;
	var yp;
	var sign = "";
	
	if( curvetype === "Line" ) {
		var rise = par1;
		var run = par2;
		var intercept = par3;
		for( var i = 0; i < plen; ++i ) {
			//read 
			xp = num(xBxs[i].innerHTML);
			// calculate
			yp = (rise*xp)/run + intercept;
			// and convert into position on page
			xpts[i] = xygraphleft + halfwidth + xp*pxlsprsq;
			ypts[i] = xygraphtop + halfwidth - yp*pxlsprsq;
			captured[i] = false;
		}
		
		// set global variables for intermediate instructions 
		// since you already looked up the parameters
		if( intercept < 0 ) {
			op = "-";
		} else {
			op = "+";
		}
		bee = mat.abs(intercept);
	
		if( rise*run < 0 ) {
		  	sign = "-";
			nsign = -1;
		 }
		mult = mat.abs(rise);
		div = mat.abs(run);
	}
	return sign;
}
function skip() {
     clearpage();
     if( nextI < lastPt ) {
     	document.getElementById("errct").value = 1;
     }
     allgood = true;
     startAgain(); 
}
window.onload = function() {
	var doc = document;
	var num = Number;
	var mat = Math;
	dragged = false;
	const selectDropdown = document.getElementById("chs");
	selectDropdown.addEventListener('change', skip );
	curvetype = selectDropdown.options[selectDropdown.selectedIndex].text;
	form = doc.getElementById("plots");
	
	if( curvetype !== "Select") {	
		xygraph = document.getElementById("xygraph");
		xygraph.innerHTML += '<rect width="444" height="444" style="fill:rgb(78, 76, 50);" />';
		xygraph.innerHTML += '<rect x="2" y="2" width="440" height="440" style="fill:rgb(191, 128, 64);" />';
		xygraph.innerHTML += '<rect x="18" y="18" width="408" height="408" style="fill:rgb(78, 76, 50);" />';
		xygraph.innerHTML += '<rect x="20" y="20" width="404" height="404" style="fill:rgb(255,255,255);" />';
		
		// draw horizontal and vertical stripes to make a grid
		for( var y = graphstart; y <= graphstop; y += 20 ) {
			drawLine( graphstart, y, graphstop, y, 1, "rgb(0,0,255)", null );
		}
		for( var x = graphstart; x <= graphstop; x += 20 ) {
			drawLine( x, graphstart, x, graphstop, 1, "rgb(0,0,255)", null );
		}
		
		// draw vertical and horizontal axes
		drawLine( halfwidth, graphstart, halfwidth, graphstop, 2, "rgb(255,200,200)", null );
		drawLine( graphstart, halfwidth, graphstop, halfwidth, 2, "rgb(255,200,200)", null );
		
		// draw arrows
		htmseg = '<polygon points="424,' + halfwidth + ' 422,212 444,' + halfwidth + ' 422,232" ';
		htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
		htmseg = '<polygon points="' + halfwidth + ',18 232,22 ' + halfwidth + ',0 212,22" ';
		htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
		// label axes
		htmseg = '<text x="428" y="214" fill="rgb(249, 242, 236)" >X</text>';
		xygraph.innerHTML += htmseg;
		htmseg = '<text x="228" y="16" fill="rgb(249, 242, 236)" >Y</text>';
		xygraph.innerHTML += htmseg;
		var offs = 62;
		offs = 67;
		for( var i = 8; i > -10; i -= 2 ) {
			htmseg = '<text x="' + halfwidth + '" y="' + offs + '" fill="rgb(230, 0, 0)" >' + i + '</text>';
			xygraph.innerHTML += htmseg;
			offs += 40;
		}
		offs = 45;
		offs = 50;
		for( var i = -8; i < 10; i += 2 ) {
			if( i=== 0 ) {
				offs += 7;
			}
			htmseg = '<text x="' + offs + '" y="234" fill="rgb(230, 0, 0)" >' + i + '</text>';
			xygraph.innerHTML += htmseg;
			offs += 40;
		}

		errCtBx = doc.getElementById("errct");
		errBx = doc.createElement("label");
		var styles = "position: absolute;"
	    	+ "top: 123px;"
			+ "left: 340px;"
		    + "writing-mode: vertical-lr;"
	  		+ "display: inline-block;"
	 		+ "height: 350px;"
	 		+ "width: 20px;"
	 		+ "color: white;"
	 		+ "text-shadow: 0 0 1px #000000, 0 0 5px #FF0000;"
			+ "text-orientation: mixed;";
		errBx.setAttribute("style", styles);
			
		form.appendChild( errBx );
		  		
	  	var nputBxs = doc.getElementsByClassName("nput");
		len = nputBxs.length;
	  	for( var i = 0; i < len; ++i ) {
		  	nputBxs[i].type = "text";
		} 
	  	
		whichcurve = num(doc.getElementById("whichcurve").value);
		whatrow = doc.getElementsByClassName("r0");
		sign = genpoints( curvetype, whichcurve );
		lastPt = Number(doc.getElementById("lastPt").value);
	
		if( curvetype === "Line" ) {
		  	n0 = doc.getElementById("n0");
		  	t0 = doc.getElementById("t0");
		  	col0 = doc.getElementById("c0_0");
			var col1 = doc.getElementById("c0_1");
		  			
		  	if( !n0 && !t0 ) {
		  		col0.innerHTML = sign;
				if( bee !== 0 ) {
					col1.innerHTML = op + " " + bee + " = ";
				} else if( mult != 1 ) {
					col1.innerHTML = " &#xd7 " + mult + " = "; // times
				} else if( div != 1) {
					col1.innerHTML = " &#xf7 " + div + " = "; // divided by
				} else {
					col1.innerHTML = " = ";
				}
				colnum = 1;
		  		doc.getElementById("y0").focus();
		  	} else {	  		
				var x0 = doc.getElementById("x0").innerHTML;  		  	
			  	if( t0 ) {
				  	if( x0 !== "0" ) {
				  		col0.innerHTML = sign;
				  	}
				  	col1.innerHTML = " &#xf7 " + div + " = "; // divided by
			  		t0.focus();  		
			  	} else {
			  		colnum = 1;
			  		col1.innerHTML = " &#xd7 " + sign + mult + " = "; // times
			  		n0.focus();
			  	}
		  	}
		} else if( curvetype === "Circle" || curvetype === "Ellipse" ) {
			tblFilld = true; // fixit
			var id = "whichparam1_" + whichcurve;
			aye = num(doc.getElementById(id).value);
			id = "whichparam2_" + whichcurve;
			ache = num(doc.getElementById(id).value);
			id = "whichparam3_" + whichcurve;
			kay = num(doc.getElementById(id).value);
			id = "whichparam4_" + whichcurve;
			bee = num(doc.getElementById(id).value);
			//doc.getElementById("statusBox" + pdx).innerHTML = "ache: " + ache + " kay: " + kay + " aye: " + aye + " bee: " + bee;
			//pdx = (pdx + 1)%maxbx;
		}
		// draw all the curves generated to date in this set
	  	
		nmins = 0;
		nmaxes = 0;
		for( var i = 0; i < whichcurve; i += 1 ) {
			drawCurve( i );
		}
	} else { // don't want to see the table until you select a curve
		var removables = doc.getElementsByClassName("rem");
		var len = removables.length;
		
		for( var i = len-1; i >= 0; --i ) {
			var classList = removables[i].classList;
			while (classList.length > 0) {
			   classList.remove(classList.item(0));
			}
			classList.add("invisible");
		}
	}
}