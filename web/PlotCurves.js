/**
 * 
 */
// clicking all over the page generates a random line on the graph fixit
// if slopes are close & small, intercepts identical, labels on right side written over one another fixit
// sometimes grabs the line as if you clicked and dragged while you're clicking points fixit
// add or take away a class rather than changing style when possible, it's faster as you dont have to redraw as much fixit
// global variables are faster than doc.getElementById fixit
// click on a valid point should either be ignored or counted correct if table is not filled out fixit
// on clicking on any table input, disable all hints fixit

var halfwidth = 222;
var xygraphleft = 400; // 315; // copied from css
var xygraphtop = 90;
var orgX = xygraphleft + halfwidth; 
var orgY = xygraphtop + halfwidth; 
var pxlsprsq = 20;
var nextI = 0;
var prevX;
var prevY;
var allgood = true;
var lastPt;
// store curve type and parameters for redrawing
var curvetype = "";
var whichcurve = 0;
//var outline;
var instr3;
var whatrow = new Array;
var yindex = 1; // will need to change when you add intermediate inputs fixit
var x = 0;
var maxbx = 10; // should be the same as loop test for statusBox on jsp page
var nmins = 0;
var nmaxes = 0;
var plen;
var xpts = new Array(21); // MAXPTS can you use these anywhere besides checkCurve? fixit
var ypts = new Array(21);
var captured = new Array(21);
var pointsfound = 0;
var mouseIsDown = false;
var Coords = function( xp, yp ) {
    this.x = xp;
    this.y = yp;
};
var mouseDownPos = new Coords(-1, -3);
var dragged = false;
var enoughPoints = 2; // needs to be more for anything but straight lines fixit
var par1;
var par2;
var par3;
var mult = 1;
var div = 1;
var intercept;

var nsign = 1;
var op = "";
var n0;
var t0;
var col0;
var colnum = 0;

function setMouseDown( ev ) { 
	ev = ev || window.event;
	mouseDownPos = mouseCoords( ev );
	mouseIsDown = true;		
}
function clearMouseDown( ev ) { 
	ev = ev || window.event;
	var 	mousePos = mouseCoords( ev );
	var mat = Math;
	var closenuff = 20;
	if( mat.abs(mousePos.x - mouseDownPos.x) < closenuff && 
		mat.abs(mousePos.y - mouseDownPos.y) < closenuff ) {
		checkPt( mousePos );
	} else if( dragged && pointsfound < enoughPoints ) {
		var doc = document;
		var errct = Number(doc.getElementById("errct").value);
		doc.getElementById("errct").value = errct + 1;
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
						//doc.getElementById("instr4").innerHTML = "";
						nextI = lastPt; // don't need to track it any more
						if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
							var endinst = doc.getElementById("skpBx").innerHTML;
							doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
							
							clearpage();
							nmins = 0;
							nmaxes = 0;
							if( whichcurve > 0 ) {
								for( var i = 0; i <= whichcurve; i += 1 ) {
									drawCurve( i );
								}
							}
				  		} else {
							drawCurve( whichcurve );
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
	var form = doc.getElementById("plots");
	if( form.contains(instr3) ) {
  		form.removeChild( instr3 );
  	}
  	var whatpts = doc.getElementById("whatpts");
  	if( form.contains(whatpts) ) {
  		form.removeChild( whatpts );
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
function drawLine( x1, y1, x2, y2 ) {
	var htmseg = '<line x1="' + x1;
	htmseg += '" y1="' + y1;
	htmseg += '" x2="' + x2;
	htmseg += '" y2="' + y2;
	htmseg += '" style="stroke:rgb(0,0,0);stroke-width:2" />';
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += htmseg;
}
function checkN( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var nid = ansBx.id; // use global nextI fixit
		rowno = nid.substr(1,nid.length);
		var nextN = num(rowno) + 1;
		var prevval;
		var nextVal;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( curvetype === "Line" ) {
			expAns = nsign*mult*prevval/div;
		}
		if( num(ansBx.value) === expAns ) {
			//alert("rowno: " + rowno + " nextN: " + nextN + " lastPt: " + lastPt);
			if( nextN < lastPt ) {
				nextVal = nsign*num(doc.getElementById("x" + nextN).innerHTML)/div;
				nid = "n" + nextN;
				doc.getElementById(nid).focus();
				/* var stylewas = instr3.getAttribute("style");
				var strt = stylewas.indexOf("top");
				var frstpart = stylewas.substring(0,strt);
				var wherewas = stylewas.substring(strt + 5);
				var stp = wherewas.indexOf("px");
				var nextstrt = wherewas.indexOf(";") + 1;
				var lastpart = wherewas.substring(nextstrt);
				wherewas = wherewas.substring(0,stp);
				var cellheight = 28;		
				var newpos = num(wherewas) + cellheight;
				var styles = frstpart + "top: " + newpos + "px;" + lastpart;
				instr3.setAttribute("style", styles);
				var smult = mult + "";
				if( nsign < 0 && !t0 ) {
					smult = "-" + smult;
				} */
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				//alert("current cid: " + currCid);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
				//instr3.innerHTML = smult + " times " + nextVal;	
			} else {
				doc.getElementById("y0").focus();
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				colnum += 1;			
				if( intercept ) {
					doc.getElementById("c0_" + colnum).innerHTML = op + " " + intercept + " = ";
				} else {
					doc.getElementById("c0_" + colnum).innerHTML = "What is Y?";
				}			
				//instr3.innerHTML = "What is Y?"
			}
		} else {
			instr3.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(doc.getElementById("errct").value);
		   	doc.getElementById("errct").value = errct + 1;
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
			var nextN = num(rowno) + 1;
			if( nextN < lastPt ) {
				tid = "t" + nextN;
				doc.getElementById(tid).focus();
				/* var stylewas = instr3.getAttribute("style");
				var strt = stylewas.indexOf("top");
				var frstpart = stylewas.substring(0,strt);
				var wherewas = stylewas.substring(strt + 5);
				var stp = wherewas.indexOf("px");
				var nextstrt = wherewas.indexOf(";") + 1;
				var lastpart = wherewas.substring(nextstrt);
				wherewas = wherewas.substring(0,stp);
				var cellheight = 28;		
				var newpos = num(wherewas) + cellheight;
				var styles = frstpart + "top: " + newpos + "px;" + lastpart;
				instr3.setAttribute("style", styles);
				var nextVal = doc.getElementById("x" + nextN).innerHTML;
				if( nsign < 0 && nextVal !== "0" ) {
					if( nextVal.substr(0,1) == "-" ) {
		  				nextVal = "-(" + nextVal + ")";
		  			} else {
		  				nextVal = "-" + nextVal;
		  			}
		  		} */
				//instr3.innerHTML = nextVal + " divided by " + div;
				var curr = doc.getElementById("c" + rowno + "_0");
				//alert("curr cid = " + test);
				var nextVal = doc.getElementById("x" + nextN).innerHTML;
				if( nsign < 0 && nextVal !== 0 ) {
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
					//var nextVal = num(doc.getElementById("t0").value);
					//var smult = mult + "";
					//if( nsign < 0 && mult < 0 ) {
					//		smult = "-(" + smult + ")";
					//}	
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = ";
					//instr3.innerHTML = smult + " &#xd7 " + nextVal; // times	
				} else {
					nextBx = doc.getElementById("y0");
					if( intercept ) {
						doc.getElementById("c0_" + colnum).innerHTML = op + " " + intercept + " = ";
					} else {
						doc.getElementById("c0_" + colnum).innerHTML = "What is Y?";
					}
					//instr3.innerHTML = "What is Y?";
				}
				nextBx.focus();
				//var styles = "position: absolute;"
				  //  + "top: 103px;"
				    //+ "left: 7px;"
				  //  + "width: 100px;";
				//instr3.setAttribute("style", styles);
			}
		} else {
			instr3.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(doc.getElementById("errct").value);
		   	doc.getElementById("errct").value = errct + 1;
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
		
		var yid = ansBx.id;
		var n = yid.substr(1);
		var currx = num(doc.getElementById("x" + n).innerHTML);
		var par1 = doc.getElementById("whichparam1_" + whichcurve).value;
		var par2 = doc.getElementById("whichparam2_" + whichcurve).value;
		var par3 = doc.getElementById("whichparam3_" + whichcurve).value;
		var rise = num(par1);
		var run = num(par2);
		var intercept = num(par3);
		var expY = rise*currx;
		expY = expY/run;
		expY = expY + intercept;
		if( num(ansBx.value) === expY ) {
			var nextN = num(n) + 1;
			if( nextN < lastPt ) {
				yid = "y" + nextN;
				doc.getElementById(yid).focus();
				/* var stylewas = instr3.getAttribute("style");
				var strt = stylewas.indexOf("top");
				var frstpart = stylewas.substring(0,strt);
				var wherewas = stylewas.substring(strt + 5);
				var stp = wherewas.indexOf("px");
				var nextstrt = wherewas.indexOf(";") + 1;
				var lastpart = wherewas.substring(nextstrt);
				wherewas = wherewas.substring(0,stp);
				var cellheight = 28;		
				var newpos = num(wherewas) + cellheight;
				var styles = frstpart + "top: " + newpos + "px;" + lastpart;
				instr3.setAttribute("style", styles); */
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
				//instr3.innerHTML = "What is Y?";
			} else {
				ansBx.blur();
				whatrow = doc.getElementsByClassName("r0");
				var len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					//whatrow[i].setAttribute("style", styles);
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
						len = nBxs.length; // shouldn't be any different from whatrow.length fixit
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
					len = nBxs.length; // shouldn't be any different from whatrow.length fixit
					for( var i = len - 1; i >= 0; --i ) {
						parent = nBxs[i].parentNode;
						var grandparent = parent.parentNode;
						grandparent.removeChild(parent);
					}
				}
				
				//doc.getElementById("xygraph").addEventListener('click', checkPt );
				//var styles = "position: absolute;"
				  //  + "top: 103px;"
				    //+ "left: 7px;"
				    //+ "width: 100px;";
				//instr3.setAttribute("style", styles);
				//instr3.innerHTML = "Click this point &#x2192;"; // right arrow
				col0.innerHTML = "Click this point &#x2192;"; // right arrow
				doc.getElementById("c" + n + "_" + colnum).innerHTML = "";
				doc.getElementById("instrs").innerHTML = "";
			}
		} else {
			instr3.innerHTML = "Should be " + expY;
			ansBx.style.color = "red";
			if( num(n)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(doc.getElementById("errct").value);
		   	doc.getElementById("errct").value = errct + 1;
		}
	}
}
function checkPt( mousePos ){
	if( !dragged ) {
		var doc = document;
		var num = Number;	
		var pct = 0.05;
		var cellheight = 28;
		var expXBx = whatrow[0];
		//var ndx = num(expXBx.id.substr(1));
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
		if( lowX < mousePos.x && mousePos.x < highX && 
			lowY < mousePos.y && mousePos.y < highY ) {
			putDot( dotX, dotY );
			if( prevX && prevY ) {
				drawLine( prevX, prevY, dotX, dotY );
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
			//var styles; // = whatrow[0].getAttribute("style"); may want to strip out border and replace fixit
				//if( styles ) {
				//	styles += "border: none;";
				//} else {
			//		styles = "border: none;";
				//}
			var len = whatrow.length;
			for( var i = 0; i < len; ++i ) {
				//whatrow[i].setAttribute("style", styles);
				whatrow[i].classList.remove("hilite");
			}
			if( nextI < lastPt ) {
				//var stylewas = instr3.getAttribute("style");
				//var strt = stylewas.indexOf("top");
				//var frstpart = stylewas.substring(0,strt);
				//var wherewas = stylewas.substring(strt + 5);
				//var stp = wherewas.indexOf("px");
				//var nextstrt = wherewas.indexOf(";") + 1;
				//var lastpart = wherewas.substring(nextstrt);
				//wherewas = wherewas.substring(0,stp);		
				//var newpos = num(wherewas) + cellheight;
				//var styles = frstpart + "top: " + newpos + "px;" + lastpart;
				//instr3.setAttribute("style", styles);
				whatrow = doc.getElementsByClassName("r" + nextI);
				//styles = whatrow[0].getAttribute("style");
				//if( styles ) {
				//	styles += "border: 2px solid white;";
				//} else {
				//	styles = "border: 2px solid white;";
				//}
				var len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					//whatrow[i].setAttribute("style", styles);
					whatrow[i].classList.add("hilite");
				}
				var curr = doc.getElementById("c" + currI + "_0");
				doc.getElementById("c" + nextI + "_0").innerHTML = curr.innerHTML; 
				curr.innerHTML = "";			
			} else if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
				var endinst = doc.getElementById("skpBx").innerHTML;
				doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
				clearpage();

				nmins = 0;
				nmaxes = 0;
				if( whichcurve > 0 ) {
					for( var i = 0; i <= whichcurve; i += 1 ) {
						drawCurve( i );
					}
				}		
			} else { // plotted one curve, start another similar one
				startAgain();
			}
		} else {
			var errct = Number(doc.getElementById("errct").value);
		   	doc.getElementById("errct").value = errct + 1;
			var hbarExists = doc.getElementsByClassName("hbar");
			if( !hbarExists[0] ) {
				//alert("dotX: " + dotX + " dotY: " + dotY + " nomX: " + nomX + " nomY: " + nomY);
				showClick( dotX, dotY, nomX, nomY );
			}
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
	var xygraph = doc.getElementById("xygraph");
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
	xstart = halfwidth + mat.round(xstart*gridspace);
	xstop = halfwidth + mat.round(xstop*gridspace);
	ystart = halfwidth - mat.round(ystart*gridspace);
	ystop = halfwidth - mat.round(ystop*gridspace);
	cls = cls%colors.length; // can you use drawline? fixit
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
	cap.innerHTML = "Y = " + intermed + "X" + rest;
	var xp = xygraphleft + xstop; // xyframe left + xstop
	if( hitsleftedge ) {
		xp += gridspace + 3;
	}
	var yp = xygraphtop;
	var yspace = gridspace - 3;
	if( ymax ) {
		yp += ystop - (1 + nmaxes)*yspace;
	} else if( ymin ) {
		yp += ystop + nmins*yspace;
	} else {
		yp += ystop;
	}
	var styles = "position: absolute;"
		+ "width: 150px;"
		+ "color: " + ltcols[cls] + ";"
		+ "left: " + xp + "px;"
		+ "top: " + yp + "px;"
		+ "font-family: Monaco;"
		+ "font-size: 0.8em;";
	cap.setAttribute("style", styles);
	var form = doc.getElementById("plots");
	form.appendChild( cap ); 
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
function genpoints ( type, which) {
	var doc = document;
	var num = Number;
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
	// should these be global, set in onload?
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
}
function skip() {
     clearpage();
     if( nextI < lastPt ) {
     	document.getElementById("errct").value = 1; // any way you could hit skip when you just finished? fixit
     }
     allgood = true;
     startAgain(); 
}
window.onload = function() {
	var doc = document;
	var num = Number;
	dragged = false;
	const selectDropdown = document.getElementById("chs");
	selectDropdown.addEventListener('change', skip );
	curvetype = selectDropdown.options[selectDropdown.selectedIndex].text;
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
	// draw vertical and horizontal axes
	var htmseg = '<line x1="' + halfwidth + '" y1="22" x2="' + halfwidth + '" y2="422" style="stroke:rgb(255,200,200);stroke-width:2" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<line x1="22" y1="' + halfwidth + '" x2="422" y2="' + halfwidth + '" style="stroke:rgb(255,200,200);stroke-width:2" />';
	xygraph.innerHTML += htmseg;
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
		//htmseg = '<text x="' + halfwidth + '" y="' + offs + '" fill="rgb(255,200,200)" >' + i + '</text>';
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
		//htmseg = '<text x="' + offs + '" y="234" fill="rgb(255,200,200)" >' + i + '</text>';
		htmseg = '<text x="' + offs + '" y="234" fill="rgb(230, 0, 0)" >' + i + '</text>';
		xygraph.innerHTML += htmseg;
		offs += 40;
	}
	whichcurve = num(doc.getElementById("whichcurve").value);
	nmins = 0;
	nmaxes = 0;
	for( var i = 0; i < whichcurve; i += 1 ) {
		drawCurve( i );
	}

	if( curvetype !== "Select") {
		whatrow = doc.getElementsByClassName("r0");
		genpoints( curvetype, whichcurve );
		lastPt = Number(doc.getElementById("lastPt").value);

	    instr3 = doc.createElement("label");
	    var styles = "position: absolute;"
		    + "top: 123px;"
		    + "left: 7px;"
		    + "width: 100px;";
		instr3.setAttribute("style", styles);

		
	    var form = doc.getElementById("plots");
	  	form.appendChild( instr3 );  	
	  	var nputBxs = doc.getElementsByClassName("nput");
	  	len = nputBxs.length;
	  	for( var i = 0; i < len; ++i ) {
	  		nputBxs[i].type = "text";
	  	}
	  	n0 = doc.getElementById("n0");
	  	t0 = doc.getElementById("t0");
	  	col0 = doc.getElementById("c0_0");
		var col1 = doc.getElementById("c0_1");
		var eqn = doc.getElementById("instr2").innerHTML;
		var aftereq = eqn.indexOf("=") + 2;
	  	var afterX = eqn.indexOf("X") + 2;
	  	var elen = eqn.length;
	  	
	  	var sign = eqn.substr(aftereq, 1);
	  	if( sign === "-" ) {
			nsign = -1;
	  	} else {
	  		sign = ""; // there is no -, you picked up something else
	  	}
	  	if( afterX < elen ) {
	  		op = eqn.substr(afterX, 1);
	  		intercept = eqn.substr(afterX+2, elen);
	  	}
	  	//alert("eqn: " + eqn + " afterX: " + afterX + " op: " + op + " intercept: " + intercept);
	  	if( !n0 && !t0 ) {
	  		//instr3.innerHTML = "What is Y?"; // put better hints fixit
	  		col0.innerHTML = sign;
			if( intercept ) {
				col1.innerHTML = op + " " + intercept + " = ";
			} else {
				col1.innerHTML = "What is Y?";
			}
			colnum = 1;
	  		doc.getElementById("y0").focus();
	  	} else {
	  		
	  		var hn = doc.getElementById("hn").innerHTML; // this stuff can all be extracted from instr2 fixit
			var len = hn.length - 1;
			var npart = hn.substr(0,len);
			
			if( !isNaN(npart) ) {
				mult = num(npart);
				if( mult < 0 ) {
					sign = "-";
					nsign = -1;
					mult = Math.abs(mult);
				}
			}
			var x0 = doc.getElementById("x0").innerHTML;  		  	
		  	if( t0 ) {
		  		div = num(doc.getElementById("ht").innerHTML);
		  		/*if( x0 !== "0" ) {
			  		if( sign === "-" && x0.substr(0,1) == "-" ) {
			  			x0 = "-(" + x0 + ")";
			  		} else {
			  			x0 = sign + x0;
			  		}
			  	} */
			  	if( x0 !== "0" ) {
			  		col0.innerHTML = sign;
			  	}
			  	col1.innerHTML = " &#xf7 " + div + " = "; // divided by
		  		//instr3.innerHTML = x0 + " divided by " + div;
		  		t0.focus();  		
		  	} else {
		  		colnum = 1;
		  		col1.innerHTML = " &#xd7 " +sign + mult + " = "; // times
		  		//instr3.innerHTML = sign + mult + " times " + x0;
		  		n0.focus();
		  	}
		  	var hm = doc.getElementById("hm");
		  	if( hm ) {
		  		hmcont = hm.innerHTML;
		  		mult = num(hmcont.substr(0,hmcont.length-1));
		  		if( mult < 0 ) {
					nsign = -1;
					mult = Math.abs(mult);
		  		}
		  	}
	  	}
	} else { // don't want to see the table until you select a curve
		var styles = "color: #663300;"
			+ "border: none;"
			+ "background-color: #663300;";
		var removables = doc.getElementsByClassName("rem");
		var len = removables.length;
		
		for( var i = 0; i < len; ++i ) {
			removables[i].setAttribute("style", styles);
		}
	}

}