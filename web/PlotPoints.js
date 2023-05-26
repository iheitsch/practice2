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

function skip() {
	if( nextI < lastPt ) {
     	document.getElementById("errct").value = 1;
     }
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
function checkPt( ev ){
	ev = ev || window.event;
	var mousePos = mouseCoords( ev );
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
		putDot( dotX, dotY );
		if( prevX && prevY ) {
			drawLine( prevX, prevY, dotX, dotY );
		}
		prevX = dotX;
		prevY = dotY;
		++nextI;
		var hbar = doc.getElementsByClassName("hbar");
		var len = hbar.length;
		for( var i = len - 1; i >= 0; --i  ) {
			var parent = hbar[i].parentNode;
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
function startAgain() { // if you change select mid plot, it doesn't count as error fixit
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
	    if( errCt === 0 && nextI === lastPt ) {
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
	var xygraph = document.getElementById("xygraph");
	xygraph.innerHTML += '<rect width="444" height="444" style="fill:rgb(179,143,0);" />';
	xygraph.innerHTML += '<rect x="2" y="2" width="440" height="440" style="fill:rgb(255, 230,179);" />';
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
	htmseg = '<polygon points="424,222 422,212 444,222 422,232" ';
	htmseg += 'style="fill:rgb(255,230,179);stroke:rgb(179,143,0);stroke-width:1" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<polygon points="222,18 232,22 222,0 212,22" ';
	htmseg += 'style="fill:rgb(255,230,179);stroke:rgb(179,143,0);stroke-width:1" />';
	xygraph.innerHTML += htmseg;
	htmseg = '<text x="428" y="214" fill="rgb(179,143,0)" >X</text>';
	xygraph.innerHTML += htmseg;
	htmseg = '<text x="228" y="16" fill="rgb(179,143,0)" >Y</text>';
	xygraph.innerHTML += htmseg;
	var offs = 62;
	offs = 67;
	for( var i = 8; i > -10; i -= 2 ) {
		//htmseg = '<text x="222" y="' + offs + '" fill="rgb(255,200,200)" >' + i + '</text>';
		htmseg = '<text x="222" y="' + offs + '" fill="rgb(255,102,102)" >' + i + '</text>';
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
		htmseg = '<text x="' + offs + '" y="234" fill="rgb(255,102,102)" >' + i + '</text>';
		xygraph.innerHTML += htmseg;
		offs += 40;
	}
	lastPt = Number(doc.getElementById("lastPt").value);
	// nextI and is meaningless at this point
	//if( doc.getElementById("initlzd").value === "true" && nextI < lastPt ) {
	//	doc.getElementById("consWoErr").value = '0';
	//}
}