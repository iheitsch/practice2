/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// iMouseDown represents the current mouse button state: up or down 
	/*
	lMouseState represents the previous mouse button state so that we can
	check for button clicks and button releases:
	if(iMouseDown && !lMouseState) // button just clicked!
	if(!iMouseDown && lMouseState) // button just released!
	*/ 
       
var x = 0;
//var dragHelper  = new Array(); // does this need to be an array or should you
// find them by class name every time since they need to change from draggable
// to not draggable? fixit
var redTarg = false;
var greenTarg = false;
var blueTarg = false;
var yellowTarg = false;
var cyanTarg = false;
var magentaTarg = false;
var whiteTarg = false;
var gOperands = new Array();
var dragging = false;
var dragBox = null; // this is the dragHelper clicked on
var boxHeight = 0;
var boxWidth = 0;
var yClick = null;
var xOffs = 0;
var cStrtY = 0;
var cHgtY =  0;
var targPos = 0;
var whatTarg = 0;
var catRed = 0;     
var catMagenta = 0;
var catWhite = 0;
var catYellow = 0;
var catBlue = 0;
var catCyan = 0;
var catGreen = 0;
     
var mouseOffset = null; 
var iMouseDown  = false; 
var lMouseState = false; 
var curTarget   = null;

var noIntermeds = true;
var boxesDragged = false;
var gNtermedIdx = 0;
var gPlaidIdx = 0;
var gPlaids = new Array(); // give it size? fixit
var singDigMul = true;

function getMouseOffset(target, ev){ 
    ev = ev || window.event; 
    var docPosX    = target.style.left.match(/[0-9]+/); // left of target
    var docPosY    = target.style.top.match(/[0-9]+/); // top of target
    var mousePos  = mouseCoords(ev);
    return {x:mousePos.x - docPosX, y:mousePos.y - docPosY}; 
} 
function getPosition(e){ 
    var left = 0; 
    var top  = 0; 
    while (e.offsetParent){ 
        left += e.offsetLeft; 
	top  += e.offsetTop; 
        e     = e.offsetParent; 
    } 
    left += e.offsetLeft; 
    top  += e.offsetTop; 
    return {x:left, y:top}; 
}
function mouseCoords(ev){ 
    var doc = document;
    if(ev.pageX || ev.pageY){ 
	return {x:ev.pageX, y:ev.pageY}; 
    } 
    return { 
	x:ev.clientX + doc.body.scrollLeft - doc.body.clientLeft, 
	y:ev.clientY + doc.body.scrollTop  - doc.body.clientTop
    }; 
} 	
function mouseMove(ev){ 
    ev         = ev || window.event; 
    var mousePos = mouseCoords(ev);
    
            
    if( dragging ){ 
        var dBox = dragBox;
	// if the user is just starting to drag the element 
	if(iMouseDown && !lMouseState){ 
            mouseOffset   = getMouseOffset(dBox, ev); 
	} 
        var leftH = mousePos.x - mouseOffset.x; 
        var topH = mousePos.y - mouseOffset.y;
	dBox.style.left = leftH + "px";
        dBox.style.top = topH + "px";
        
    } 
    // track the current mouse state so we can compare against it next time 
    lMouseState = iMouseDown; 
    // this helps prevent items on the page from being highlighted while dragging 
    return false; 
} 
function mouseUp(ev){ 
    //var mousePos = mouseCoords(ev);   
    if( dragBox ){ 
        //alert("mouse up at x, y: " + mousePos.x + ", " + mousePos.y);
        checklineup();
    } 
    iMouseDown = false; 
    dragging = false;
    xOffs = 0;
} 
function mouseDown(ev){ 
    ev = ev || window.event; 
    iMouseDown = true;
    var doc = document;
    //checkLineup();
    //if( doc.getElementById("linedUp").value === "true" ){ 
    //    checkLineup();
	//return false; 
    //} 

    var mousePos = mouseCoords(ev);
    var dHelper = doc.getElementsByClassName("dragBox");
    var dhlength = dHelper.length;
    var bxHgt = boxHeight;
    var bxWid = boxWidth;
    //doc.getElementById("statusBox" + x).innerHTML = "dhlength: " + dhlength + " mousePosX: " + mousePos.x + " mousePosY: " + mousePos.y;
    //x = (x + 1)%nSbxs;

    for( var i = 0; i < dhlength; ++i ) {
        var dHelp = dHelper[i];
        var hPos = getPosition( dHelp);
        var top = hPos.y; // Num(dHelper[i].style.marginTop.match(/[0-9]+/)); 
        var bottom = top + bxHgt;
        var left = hPos.x; // Num(dHelper[i].style.marginLeft.match(/[0-9]+/));
        var right = left + bxWid;
        //var alreadyMoved = dHelp.getAttribute("moved");
        //doc.getElementById("statusBox" + x).innerHTML = "i: " +i + " top: " + top + " bottom: " + bottom + " left: " + left + " right: " + right;
        //x = (x + 1)%nSbxs;
        //if( alreadyMoved === "pos0" &&
        if( top < mousePos.y && mousePos.y < bottom &&
            left < mousePos.x && mousePos.x < right ) {
            var val = dHelp.value;
            var id = dHelp.id;
            //doc.getElementById("statusBox" + x).innerHTML = "mousedown at target " + i + " value: " + val + " id: " + id;
            //x = (x + 1)%nSbxs;
            // find all possible targets   
            var cats = doc.getElementsByClassName("cat");
            var len = cats.length;
            for( var j = 0; j < len; ++j ){
                if( val === cats[j].value ) {
                    var id = cats[j].id;
                    var idlen = id.length;
                    var idnum = id.substr(1,idlen);
                    redTarg = doc.getElementById("nRed" + idnum).value !== "0";
                    greenTarg = doc.getElementById("nGreen" + idnum).value !== "0";
                    blueTarg = doc.getElementById("nBlue" + idnum).value !== "0";
                    yellowTarg = doc.getElementById("nYellow" + idnum).value !== "0";
                    cyanTarg = doc.getElementById("nCyan" + idnum).value !== "0";
                    magentaTarg = doc.getElementById("nMagenta" + idnum).value !== "0";
                    whiteTarg = doc.getElementById("nWhite" + idnum).value !== "0";
                }
            }
            dragBox = dHelp;
            dragging = true;
        }
    }
} 
function checklineup() {
    var doc = document;
    var num = Number;
    var mat = Math;

    var dHelperIdx = dragBox;
    var bxHgt = boxHeight;
    var bxWid = boxWidth;
    var dPosX = getPosition( dHelperIdx ).x + bxWid/2;
    var dPosY = getPosition( dHelperIdx ).y + bxHgt/2;
    if( doc.getElementById("linedUp").value === "false") {
        var allLinedUp = true;
        // for every distinct prime factor
        // for every venn section
        // count the dhelpers that have been dragged there
        var cats = doc.getElementsByClassName("cat");
        var ncats = cats.length;
        //var sections = new Array( " white", " magenta", " yellow", 
        //                                " cyan", " blue", " red", " green" );


        for( var kdx = 0; kdx < ncats; ++kdx ) {
            var whatCat = cats[kdx];        
            var dVal = num(dHelperIdx.value);
            if( num(whatCat.value) === dVal ) {

                var rad = radius;
                var rCentX = redCenterX;
                var rCentY = redCenterY;
                var gCentX = greenCenterX;
                var gCentY = greenCenterY;
                var bCentX = blueCenterX;
                var bCentY = blueCenterY;
                var w = window;
                var e = doc.documentElement;
                var g = doc.getElementsByTagName('body')[0];
                var y = w.innerHeight|| e.clientHeight|| g.clientHeight;
                var hid = dHelperIdx.id;
                var hidlen = hid.length;
                var pos = hid.indexOf("_");
                var col = num(hid.substr(pos+1, hidlen));
                var origRed = col === 3;
                var origGreen = col === 6;
                var origBlue = col === 0;
                var catid = whatCat.id;
                var catidlen = catid.length;
                var idnum = catid.substr(1,catidlen);
                //doc.getElementById("statusBox" + x).innerHTML = "dVal, catid, idnum:  " + dVal + ", " + catid + ", " + idnum;
                //x = (x + 1)%10;
                var roccurs = num(doc.getElementById("roccurs" + idnum).value);
                var goccurs = num(doc.getElementById("goccurs" + idnum).value);
                var boccurs = num(doc.getElementById("boccurs" + idnum).value);
		var redWasPoss = false;
		var magentaWasPoss = false;
		var whiteWasPoss = false;
		var yellowWasPoss = false;
		var blueWasPoss = false;
		var cyanWasPoss = false;
		var greenWasPoss = false;
                var possPlaces = 0;
                //doc.getElementById("statusBox" + x).innerHTML = "roccurs, goccurs, boccurs:  " + roccurs + ", " + goccurs + ", " + boccurs;
                //x = (x + 1)%10;
                //doc.getElementById("statusBox" + x).innerHTML = "origRed, origGreen, origBlue:  " + origRed + ", " + origGreen + ", " + origBlue;
                //x = (x + 1)%nSbxs;
		if( origRed ) {
                    if( roccurs > goccurs && roccurs > boccurs ) {
                        redWasPoss = true;
                        possPlaces += 1;
                    }
                    if( goccurs > boccurs && roccurs > boccurs) {
                        yellowWasPoss = true;
                        possPlaces += 1;
                    } else if( boccurs > goccurs && roccurs > goccurs ) {
                        magentaWasPoss = true;
                        possPlaces += 1;
                    }
                    if( goccurs > 0 && boccurs > 0) {
                        whiteWasPoss = true;
                        possPlaces += 1;
                    }
		} else if( origBlue ) {
                    if( boccurs > roccurs && boccurs > goccurs ) {
                        blueWasPoss = true;
                        possPlaces += 1;
                    }
                    if( roccurs > goccurs && boccurs > goccurs) {
                        magentaWasPoss = true;
                        possPlaces += 1;
                    } else if( goccurs > roccurs && boccurs > roccurs) {
                        cyanWasPoss = true;
                        possPlaces += 1;
                    }
                    if( roccurs > 0 && goccurs > 0) {
                        whiteWasPoss = true;
                        possPlaces += 1;
                    }
		} else if( origGreen ) {
                    if( goccurs > roccurs && goccurs > boccurs ) {
                        greenWasPoss = true;
                        possPlaces += 1;
                    }
                    if( roccurs > boccurs && goccurs > boccurs) {
                        yellowWasPoss = true;
                        possPlaces += 1;
                    } else if( boccurs > roccurs && goccurs > roccurs) {
                        cyanWasPoss = true;
                        possPlaces += 1;
                    }
                    if( roccurs > 0 && boccurs > 0 ) {
                        whiteWasPoss = true;
                        possPlaces += 1;
                    }
		} else {
                    //alert( dVal + " didn't originate anywhere");
		}
                    
                var whiteBx = doc.getElementById("nWhite" + idnum);
                var nWhite = num(whiteBx.value);
                var whitePoss = nWhite > 0;

                var magentaBx = doc.getElementById("nMagenta" + idnum);
                var nMagenta = num(magentaBx.value);
                var magentaPoss = nMagenta > 0 && magentaWasPoss;

                var yellowBx = doc.getElementById("nYellow" + idnum);
                var nYellow = num(yellowBx.value);
                var yellowPoss = nYellow > 0 && yellowWasPoss; 

                var cyanBx = doc.getElementById("nCyan" + idnum);
                var nCyan = num(cyanBx.value);
                var cyanPoss = nCyan > 0 && cyanWasPoss;

                var blueBx = doc.getElementById("nBlue" + idnum);
                var nBlue = num(blueBx.value);
                var bluePoss = nBlue > 0 && origBlue;

                var redBx = doc.getElementById("nRed" + idnum);
                var nRed = num(redBx.value);
                var redPoss = nRed > 0 && origRed;

                var greenBx = doc.getElementById("nGreen" + idnum);
                var nGreen = num(greenBx.value);
                var greenPoss = nGreen > 0 &&  origGreen;

                var distFromRed = mat.sqrt(mat.pow(dPosX-rCentX, 2) + mat.pow(dPosY-rCentY, 2));
                var distFromGreen = mat.sqrt(mat.pow(dPosX-gCentX, 2) + mat.pow(dPosY-gCentY, 2));
                var distFromBlue = mat.sqrt(mat.pow(dPosX-bCentX, 2) + mat.pow(dPosY-bCentY, 2));
                //doc.getElementById("statusBox" + x).innerHTML = "nWhite: " + nWhite + " distFromRed: " + distFromRed + " distFromGreen: " + distFromGreen + " distFromBlue: " + distFromBlue + " radius: " + rad;
                //x = (x + 1)%nSbxs;
                //alert("nWhite: " + nWhite + " distFromRed: " + distFromRed + " distFromGreen: " + distFromGreen + " distFromBlue: " + distFromBlue + " radius: " + rad );
                if( whitePoss && 
                        distFromRed < rad && 
                        distFromBlue < rad && 
                        distFromGreen < rad ) {
                    
                    var leftPos = whiteXpos;
                    var cW = catWhite;
                    var topPos = whiteYpos + cW*0.03*y;
                    catWhite = cW + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, leftPos, topPos );
                    dHelperIdx.setAttribute("name", "white");
                    //dHelperIdx.setAttribute("position", topPos);
                    dHelperIdx.setAttribute("moved", "pos1"); // race condition doesn't always take efect on time
                    // to check in delDups
                    //alert("about to copy cols leftPos: " + leftPos + " topPos: " + topPos);
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    delDups( dVal, col === 0, col === 3, col === 6, col );
                    nWhite = nWhite - 1;
                } else if( magentaPoss && 
                    distFromRed < rad && 
                    distFromBlue < rad &&
                    distFromGreen > rad ) {
                    var leftPos = magentaXpos;
                    var cM = catMagenta;
                    var topPos = magentaYpos + cM*0.03*y;
                    catMagenta = cM + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, leftPos, topPos ); 
                    dHelperIdx.setAttribute("name", "magenta");
                    //dHelperIdx.setAttribute("position", topPos);
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    delDups( dVal, col === 0, col === 3, true, col );
                    nMagenta = nMagenta - 1;
                } else if( yellowPoss && 
                    distFromRed < rad && 
                    distFromGreen < rad &&
                    distFromBlue > rad ) {
                    var leftPos = yellowXpos;
                    var cY = catYellow;
                    var topPos = yellowYpos + cY*.03*y;
                    catYellow = cY + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, leftPos, topPos );
                    dHelperIdx.setAttribute("name", "yellow");
                    //dHelperIdx.setAttribute("position", topPos);
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    delDups( dVal, true, col === 3, col === 6, col );
                    nYellow = nYellow - 1;
                } else if( cyanPoss && 
                    distFromBlue < rad && 
                    distFromGreen < rad &&
                    distFromRed > rad ) {
                    var leftPos = cyanXpos;
                    var cC = catCyan;
                    var topPos = cyanYpos + cC*.03*y;
                    catCyan = cC + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, leftPos, topPos ); 
                    dHelperIdx.setAttribute("name", "cyan");
                    //dHelperIdx.setAttribute("position", topPos);
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    delDups( dVal, col === 0, true, col === 6, col );
                    nCyan = nCyan - 1;
                } else if( bluePoss && 
                    distFromBlue < rad && 
                    distFromGreen > rad &&
                    distFromRed > rad ) {
                    
                    var cB = catBlue;
                    var topPos = blueYpos + cB*.03*y;
                    catBlue = cB + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, blueXpos, topPos );  
                    dHelperIdx.setAttribute("name", "blue");
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    //dHelperIdx.setAttribute("position", topPos);

                    var instr0 = doc.getElementById("instr0");
                    var instr1 = doc.getElementById("instr1");
                    instr0.style.color = "#e2eeeb";
                    instr1.style.color = "#e2eeeb";
                    instr0.innerHTML = "Drag each prime factor to the section";
                    instr1.innerHTML = "of the Venn diagram where it belongs.";
                    var mx = doc.getElementsByClassName("instrs").length;
                    for( var instIdx = 2; instIdx < mx; ++instIdx) {
                        var whatInstr = doc.getElementById("instr" + instIdx);
                        whatInstr.style.color = "#3961a2";
                    }
                    nBlue = nBlue - 1;
                } else if( redPoss && 
                    distFromBlue > rad && 
                    distFromGreen > rad &&
                    distFromRed < rad ) {
                    
                    var cR = catRed;
                    var topPos = redYpos + cR*.03*y;
                    catRed = cR + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, redXpos, topPos );  
                    dHelperIdx.setAttribute("name", "red");
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    //dHelperIdx.setAttribute("position", topPos);
                    
                    var instr0 = doc.getElementById("instr0");
                    var instr1 = doc.getElementById("instr1");
                    instr0.style.color = "#e2eeeb";
                    instr1.style.color = "#e2eeeb";
                    instr0.innerHTML = "Drag each prime factor to the section";
                    instr1.innerHTML = "of the Venn diagram where it belongs.";
                    var mx = doc.getElementsByClassName("instrs").length;
                    for( var instIdx = 2; instIdx < mx; ++instIdx) {
                        var whatInstr = doc.getElementById("instr" + instIdx);
                        whatInstr.style.color = "#3961a2";
                    }
                    nRed = nRed - 1;
                } else if( greenPoss && 
                    distFromBlue > rad && 
                    distFromGreen < rad &&
                    distFromRed > rad ) {
                    
                    var cG = catGreen;
                    var topPos = greenYpos + cG*.03*y;
                    catGreen = cG + 1;
                    
                    setBox( dHelperIdx, dPosX, dPosY, greenXpos, topPos ); 
                    dHelperIdx.setAttribute("name", "green");
                    dHelperIdx.setAttribute("moved", "pos1");
                    dHelperIdx.class = "deadBox";
                    dHelperIdx.disabled = true;
                    dHelperIdx.blur();
                    //dHelperIdx.setAttribute("position", topPos);
                    var instr0 = doc.getElementById("instr0");
                    var instr1 = doc.getElementById("instr1");
                    instr0.style.color = "#e2eeeb";
                    instr1.style.color = "#e2eeeb";
                    instr0.innerHTML = "Drag each prime factor to the section";
                    instr1.innerHTML = "of the Venn diagram where it belongs.";
                    var mx = doc.getElementsByClassName("instrs").length;
                    for( var instIdx = 2; instIdx < mx; ++instIdx) {
                        var whatInstr = doc.getElementById("instr" + instIdx);
                        whatInstr.style.color = "#3961a2";
                    }
                    nGreen = nGreen - 1;
                } else { // didn't go into any available category. Give instructions
                    var instrs = new Array(5);
                    var instIdx = 0;
                    dHelperIdx.style.color = "red";
                    dHelperIdx.style.border = "3px solid red";
                    var nextCol = col + 1;
                    var origOpBx = doc.getElementById("g0_" + nextCol);
                    if( origOpBx ) {
                        var origOp = origOpBx.value;
                        instrs[instIdx] = "This " + dVal + " factor originated from " + origOp;
                        var whatInstr = doc.getElementById("instr" + instIdx);
                        whatInstr.innerHTML = instrs[instIdx];
                        whatInstr.style.color = "#e2eeeb";
                        ++instIdx;

                        // don't allow inputs to be moved once placed. Create another 
                        // drag box for moving it to the white graph paper and erase 
                        // that drag box once the problem is done

                        if( possPlaces === 1 ) {
                            if( origRed && boccurs === 0 && goccurs === 0 ||
                                    origBlue && goccurs === 0 && roccurs === 0 ||
                                    origGreen && roccurs === 0 && boccurs === 0) {
                                var onlyPlace = redWasPoss? "red" : greenWasPoss? "green" : "blue";
                                instrs[instIdx] = "Only " + origOp + " has a factor of " + dVal + ", so " + dVal + " goes in " + onlyPlace + ".";
                            } else if( whiteWasPoss ) {
                                var otherCol1 = (col + 3)%9 + 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = (col + 6)%9 + 1;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = otherOp1 + " & " + otherOp2 + " have >= number of " + dVal + "s than " + origOp + ", so " + dVal + " goes in white.";
                            } else if( magentaWasPoss ) {
                                var otherCol1 = col === 0? 4 : 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 7;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] =  otherOp1 + " has >= # " + dVal + "s than " + origOp + ", " + otherOp2 + " has none, so " + dVal + " goes in magenta.";
                            } else if( yellowWasPoss ) {
                                var otherCol1 = col === 3? 7 : 4;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 1;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = otherOp1 + " has >= # " + dVal + "s than " + origOp + ", " + otherOp2 + " has none, so " + dVal + " goes in yellow.";
                            } else if( cyanWasPoss ) {
                                var otherCol1 = col === 0? 7 : 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 4;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = otherOp1 + " has >=  # " + dVal + "s than " + origOp + ", " + otherOp2 + " has none, so " + dVal + " goes in cyan.";
                            }
                            whatInstr = doc.getElementById("instr" + instIdx);
                            whatInstr.innerHTML = instrs[instIdx];
                            whatInstr.style.color = "#e2eeeb";
                            ++instIdx;
                        } else {
                            if( whiteWasPoss ) {
                                var otherCol1 = (col + 3)%9 + 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = (col + 6)%9 + 1;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = otherOp1 + " & " + otherOp2 + " have one or more " + dVal + "s also, so " + dVal + " can go in white.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            }
                            if( magentaWasPoss ) {
                                var otherCol1 = col === 0? 4 : 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 7;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = origOp + " & " + otherOp1 + " have >= # " + dVal + "s than " + otherOp2 + ", so " + dVal + " can go in magenta.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            } else if( yellowWasPoss ) {
                                var otherCol1 = col === 3? 7 : 4;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 1;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = origOp + " & " + otherOp1 + " have >= # " + dVal + "s than " + otherOp2 + ", so " + dVal + " can go in yellow.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            } else if( cyanWasPoss ) {
                                var otherCol1 = col === 0? 7 : 1;
                                var otherOp1 = doc.getElementById("g0_" + otherCol1).value;
                                var otherCol2 = 4;
                                var otherOp2 = doc.getElementById("g0_" + otherCol2).value;
                                instrs[instIdx] = origOp + " & " + otherOp1 + " have >= # " + dVal + "s than " + otherOp2 + ", so " + dVal + " can go in cyan.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            }
                            if( redWasPoss ) {
                                var otherOp1 = doc.getElementById("g0_1").value;
                                var otherOp2 = doc.getElementById("g0_7").value;
                                instrs[instIdx] = origOp + " has >= # " + dVal + "s than " + otherOp1 + " or "+ otherOp2 + ", so " + dVal + " can go in red.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            } else if( blueWasPoss ) {
                                var otherOp1 = doc.getElementById("g0_4").value;
                                var otherOp2 = doc.getElementById("g0_7").value;
                                instrs[instIdx] = origOp + " has >= # " + dVal + "s than " + otherOp1 + " or "+ otherOp2 + ", so " + dVal + " can go in blue.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            } else if( greenWasPoss ) {
                                var otherOp1 = doc.getElementById("g0_1").value;
                                var otherOp2 = doc.getElementById("g0_4").value;
                                instrs[instIdx] = origOp + " has >= # " + dVal + "s than " + otherOp1 + " or "+ otherOp2 + ", so " + dVal + " can go in green.";
                                whatInstr = doc.getElementById("instr" + instIdx);
                                whatInstr.innerHTML = instrs[instIdx];
                                whatInstr.style.color = "#e2eeeb";
                                ++instIdx;
                            }
                        }
                        var idx = instIdx;
                        var wasPoss = new Array( whiteWasPoss, magentaWasPoss, 
                                            yellowWasPoss, cyanWasPoss, 
                                blueWasPoss, redWasPoss, greenWasPoss );
                        var poss = new Array( whitePoss, magentaPoss, yellowPoss, 
                                            cyanPoss, bluePoss, redPoss, greenPoss );
                        var sections = new Array( "white", "magenta", "yellow", 
                                            "cyan", "blue", "red", "green" );

                        var raylen = wasPoss.length;

                        for( var i = 0; i < raylen; ++i ) {
                            if( wasPoss[i] && !poss[i] ) {
                                    instrs[instIdx++] = "The " + dVal + "s in the " + sections[i] + " section are accounted for, so don't put it there."; 
                                }
                        }

                        for( ; idx < instIdx; ++idx ) {
                            whatInstr = doc.getElementById("instr" + idx);
                            whatInstr.innerHTML = instrs[idx];
                            whatInstr.style.color = "#e2eeeb";
                        }
                        var mx = doc.getElementsByClassName("instrs").length;
                        while( instIdx < mx ) {
                            whatInstr = doc.getElementById("instr" + instIdx);
                            whatInstr.style.color = "#3961a2";
                            ++instIdx;
                        }
                    } else {
                        alert("leave that one where it was for now"); // fixit
                    }
                }
                whiteBx.value = nWhite;
                magentaBx.value = nMagenta;
                redBx.value = nRed;
                yellowBx.value = nYellow;
                greenBx.value = nGreen;
                cyanBx.value = nCyan;
                blueBx.value = nBlue;
                break;
            }
            //doc.getElementById("statusBox2").innerHTML = "after kdx loop";
        }

        var allboxes = doc.getElementsByClassName("dragBox");
        var len = allboxes.length;
        //doc.getElementById("statusBox0").innerHTML = "len: " + len;
        for( var i = 0; i < len; ++i ) {
	    whatDBx = allboxes[i];
            if( whatDBx.getAttribute("moved") === "pos0" ) {
		// check if it's one of the ones that should not be moved
            	var whatId = whatDBx.id;
	        var idlen = whatId.length;
            	var unPos = whatId.indexOf("_");
            	var row = whatId.substr(1,unPos-1);
            	var col = num(whatId.substr(unPos+1,idlen));
		if( !(row === "0" && (col-1)%3 === 0) ) {
                    allLinedUp = false;
                    break;
		}
            }
        }
        if( allLinedUp ) {
    	doc.getElementById("linedUp").value = "true";
            var mx = doc.getElementsByClassName("instrs").length;
            for( var instIdx = 0; instIdx < mx; ++instIdx) {
                var whatInstr = doc.getElementById("instr" + instIdx);
                whatInstr.style.color = "#3961a2";
            }
            dragBox  = null;
            getMultiplying();
        }
    } else {
        //alert("not original position");
        var paperExists = doc.getElementById("graphPaper");
        if( paperExists ) {
            var frame = doc.getElementById("paperFrame");
            var getstyle = getComputedStyle;
            //var actual = getstyle(frame).width;
            //var actual2 = getstyle(paperExists).width;
            var leftSide = num(getstyle(frame).left.match(/[0-9]+/));
            var paperWid = num(getstyle(paperExists).width.match(/[0-9]+/));
            var rightSide = leftSide + paperWid;
            var topSide = num(getstyle(frame).top.match(/[0-9]+/));
            var bottomSide = 
                topSide + num(getstyle(frame).height.match(/[0-9]+/));
            if( leftSide < dPosX && 
                dPosX <  rightSide &&
                topSide < dPosY &&
                dPosY < bottomSide ) {
                
                var fans = doc.getElementById("fans");
                var fansWid = num(getComputedStyle(fans).width.match(/[0-9]+/));
                var center = mat.floor(leftSide) + paperWid/2 + fansWid/2 - boxWidth; 
                //alert("leftside = " + leftSide + " paperWid: " + paperWid + " fansWid: " + fansWid + " boxWidth: " + boxWidth);
                //alert("on paper center = " + center);
                dHelperIdx.style.left = center + "px";
                dHelperIdx.setAttribute("moved", "pos2");
                dHelperIdx.disabled = true;
                // position vertically so they start at the bottom fixit
                // order biggest to smallest -- no don't
                // put back in circles or in table if dragged off the paper
                // -tricky. going to renumber them and recalculate products and 
                // factids every time?
                // remember their position (can use setAttribute position as the original is no longer neded
                // give them an attribute so you can track them
                // when there is enough of them or there is a 2 of 3 digit multiplication,
                // put in intermediate boxes
                // store gprod somewhere else so when you're done with the onewides
                // you can compare
                // what if you multiply wrong but happen to get the correct answer in the onewides?
                // check for both and display accordingly
            
                //var factors = doc.getElementsByClassName("fact");
                var nFactors = gNfactors;
                var prod = 1;
                var nDgts = -1;
                var operands = gOperands;
                operands[nFactors] = dHelperIdx;
                gOperands = operands;
                nFactors = nFactors + 1;
                gNfactors = nFactors;

                var minus2 = -2;
                var minus1 = -1;
                var ntermedIdx = gNtermedIdx;
                var plaidIdx = gPlaidIdx; // every factor dragged, every intermediate product
                var plaids = gPlaids;     // don't assign factor dragged an array space until
                                          // intermediates are placed. last factor dragged
                                          // should be plaids[plaidIdx-1]. How do I know it's
                                          // last and when does it get assigned?
                                          // assign it last after placing everything and putting intermediates
                if( nFactors > 1 ) {                
                    for( var i = nFactors-2; i < nFactors; ++i ) { // change to start at prev box and go until prod > 9 fixit
                        // is it a table row or simple input?
                        var box = operands[i];
                        var tag = box.tagName;
                        var multiplier = 0;
                        if( tag === "TABLE") {
                            multiplier = evalTbl(box);
                            //doc.getElementById("statusBox" + x).innerHTML = "TABLE multiplier: " + multiplier;
                            //        x = (x + 1)%nSbxs;
                        } else if ( tag === "INPUT") {
                            multiplier = num(box.value.match(/[0-9]+/));
                        }
                        if( i === nFactors - 2 ) {
                            minus2 = multiplier;
                        } else if ( i === nFactors - 1 ) {
                            minus1 = multiplier;
                        }
                        prod = prod*multiplier;
                        //doc.getElementById("statusBox" + x).innerHTML = "prod: " + prod;
                        //x = (x + 1)%nSbxs;
                        if( i === nFactors - 2 ) {
                            nDgts = 1 + mat.floor(mat.log10(multiplier));
                            //doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " nDgts: " + nDgts;
                            //x = (x + 1)%nSbxs;
                        }
                    }
                    gans = (minus2%10)*minus1; //lprod; // should this be minus2*minus1%10? fixit
                    boxesDragged = true; // change the variable name. This indicated multiplication boxes were dragged,
                    // not necessarily intermediate boxes were needed fixit
                    //doc.getElementById("statusBox" + x).innerHTML = "in drag3d checklineup gans set: " + gans;
                    //x = (x + 1)%nSbxs;
                }                   
                // if nFactors > 2 and product > 9 make intermediate box or 2
                // store gprod somewhere else
                // if nFactors = 2 or product <= 9, move the previous one up, put a bar
                var imgHgt = bottomSide - topSide;
                var linespace = 0.06*imgHgt + 1;
                var putHere = gPutHere; //- linespace;
                //var fansleft = mat.floor(leftSide) - 7 + paperWid/2 - fansWid/2; 
                var fansleft = mat.floor(leftSide) + paperWid/2 - fansWid/2;
                if( nFactors > 2 && nDgts > 1 ) { // && prod > 9 
                    // think all you need is the intermediate
                    // answer here. Other boxes added in the
                    // next block fixit
                    singDigMul = false;
                    noIntermeds = false;
                    if( ntermedIdx === 0 ) {
                        fans.setAttribute("name","mult");
                    }
                    var newId = "add";
                    
                    //var dTbl = createTable(newId, ntermedIdx, false, putHere, center );
                    var dTbl = createTable(newId, ntermedIdx, true, putHere, center );
                    //doc.getElementById("statusBox" + x).innerHTML = "add bx at y: " + putHere + " plaidIdx: " + plaidIdx + " id: " + newId;
                    //x = (x + 1)%nSbxs;
                    putHere = mat.round(putHere - linespace);
                    ntermedIdx = ntermedIdx + 1;
                    plaids[plaidIdx] = dTbl;
                    plaidIdx = plaidIdx + 1;
                    
                } else if( nFactors > 2 ) {
                    singDigMul = true;
                    noIntermeds = false;
                    newId = "mult";
                    
                    var dTbl = createTable( newId, ntermedIdx, true, putHere, center );
                    //doc.getElementById("statusBox" + x).innerHTML = "mult bx at y: " + putHere + " plaidIdx: " + plaidIdx + " id: " + newId;
                    //x = (x + 1)%nSbxs;
                    putHere = mat.round(putHere - linespace);
                    plaids[plaidIdx] = dTbl;
                    ntermedIdx = ntermedIdx + 1;
                    plaidIdx = plaidIdx + 1;
                }
                if ( nFactors > 1  ) { // && prod > 9
                    // put a bar
                    var more2left = center - 12;
                    putHere = mat.round(putHere + linespace - 1);
                    putBar(more2left, putHere);
                    if( nDgts > 1 ) {
                        noIntermeds = false;
                        singDigMul = false;
                        if( ntermedIdx === 0 ) {
                            fans.setAttribute("name","add");
                            //var srcid = fans.getAttribute("id");
                            //alert("after setting name: add, srcid: " + srcid);
                        }
                        // create 2+ table rows of answer boxes
                        for( var dgt = nDgts-1; dgt >=0; --dgt ) {
                            var newId = "mult" + dgt;
                            putHere = mat.round(putHere - linespace);
                            //var dTbl = createTable(newId, ntermedIdx, dgt === 0, putHere, center );
                            var dTbl = createTable(newId, ntermedIdx, true, putHere, center );
                            //doc.getElementById("statusBox" + x).innerHTML = "mult" + dgt + " bx at y: " + putHere + " plaidIdx: " + plaidIdx + " id: " + newId;
                            //x = (x + 1)%nSbxs;
                            plaids[plaidIdx] = dTbl;
                            ntermedIdx = ntermedIdx + 1;
                            plaidIdx = plaidIdx + 1;
                        }
                        // put bar
                        var more2left = center - 12;
                        putHere = mat.round(putHere - 1);
                        putBar(more2left, putHere);
                        //doc.getElementById("statusBox" + x).innerHTML = "at least 2 intermediate boxes putting bar at x: " + center + " y: " + putHere;
                        //x = (x + 1)%nSbxs;
                       
                    }

                    putHere = mat.round(putHere - linespace);
                    var prevOp = operands[nFactors-2];
                    prevOp.style.top = putHere + "px";
                    //doc.getElementById("statusBox" + x).innerHTML = "moving previous box to: " + putHere + " plaidIdx: " + plaidIdx;
                    //x = (x + 1)%nSbxs;
                    plaids[plaidIdx] = prevOp;
                    plaidIdx = plaidIdx + 1;
                    //var actY = getPos(prevOp).y;

                }
                
                putHere = mat.round(putHere - linespace);
                //doc.getElementById("statusBox" + x).innerHTML = "curr bx at " + putHere + " plaidIdx: " + plaidIdx;
                //x = (x + 1)%nSbxs;
                dHelperIdx.style.top = putHere + "px";
                //alert("asadf");
                gPutHere = putHere;
                plaids[plaidIdx] = dHelperIdx;
                //plaidIdx = plaidIdx + 1; // didn't think I needed this but perhaps I do
                //plaidIdx = plaidIdx + 1; // if ever called again, needs to write over plaids[plaidIdx]
                gPlaids = plaids;
                gPlaidIdx = plaidIdx;
                gNtermedIdx = ntermedIdx;
                if( noIntermeds ) {
                    //doc.getElementById("statusBox" + x).innerHTML = "setting focus on lsb of onewides";
                    //x = (x + 1)%nSbxs;
                    var leasDig = doc.getElementById("leasDig");
                    leasDig.focus();
                }
            }
/*
            for( var i = 0; i <= plaidIdx; ++i ) {
                var box = plaids[i];
                var tag = box.tagName;
                var valm1 = 0;
                if( tag === "TABLE") {
                    valm1 = evalTbl(box);
                    //doc.getElementById("statusBox" + x).innerHTML = "TABLE multiplier: " + multiplier;
                    //        x = (x + 1)%nSbxs;
                } else if ( tag === "INPUT") {
                    valm1 = num(box.value.match(/[0-9]+/));
                }
                doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " val: " + valm1;
                x = (x + 1)%nSbxs;
            }
/**/
        }
    }
    dragBox  = null;
}

function putBar(more2left, putHere) {
    var doc = document;
    
    var bar = doc.createElement("div");
    doc.body.appendChild( bar );

    //doc.getElementById("statusBox" + x).innerHTML = "at least 2 operands putting bar at: " + putHere;
    //x = (x + 1)%nSbxs;
    var styles = "border: 1px solid black;"
        + "width: 58px;"
        + "height: 0px;"
                        + "position: absolute;"
                        + "top: " + putHere + "px;"
                        + "left: " + more2left + "px;"
                        + "border: 1px solid black";

    bar.setAttribute("style", styles);
    bar.setAttribute("name","paperBar");
}
function createTable(whatName, ntermedIdx, focusHere, putHere, fansleft ) {
    var doc = document;
    
    var dTbl = doc.createElement("table");
    var dBox = doc.createElement("tr");
    var newId = "ntermed" + ntermedIdx;
    dTbl.setAttribute("id", newId);
    dTbl.setAttribute("class","ntrmed");
    dTbl.setAttribute("name",whatName);

    dBox.style.padding = 0;
    dBox.style.margin = 0;
    doc.body.appendChild(dTbl);
    dTbl.appendChild(dBox);
    var nBxs = 7;
    var leasDig = 6;
    for( var i = 0; i < nBxs; ++i ) {
        var td = doc.createElement("td");
        td.style.margin = 0;
        td.style.border = 0;
        td.style.padding = 0;
        var nput = doc.createElement("input");
        nput.style.margin = 0;
        nput.style.padding = 0;
        nput.style.color = "#11397a";
        nput.style.width = "0.58em";
        nput.onkeyup=passFocus;
        td.appendChild(nput);
        dBox.appendChild(td);
        if( focusHere && i === leasDig ) {
                            //doc.getElementById("statusBox" + x).innerHTML = "setting focus on lsb of mult input";
                            //x = (x + 1)%nSbxs;
            doc.activeElement.blur();
            nput.focus();
            nput.onkeydown=eraseAll;
        }
    } 
                    //putHere = mat.round(putHere - linespace);
                    //plaidIdx = plaidIdx - 1; // replaces last current box

   
    dTbl.style.top = putHere + "px";
    dTbl.style.left = fansleft + "px";    
    dTbl.style.position = "absolute";
    return dTbl;
}
function setBox( dHelperIdx, dPosX, dPosY, leftPos, topPos ){
    if( dPosX !== leftPos ) { // line them up if not exact        
        dHelperIdx.style.left = leftPos + "px";
        dHelperIdx.setAttribute("backHomeX", leftPos );
        //var whatWasX = dHelperIdx.getAttribute("backHomeX");
        //alert("whatWasX: " + whatWasX ); 
    }
    if( dPosY !== topPos ) {   
        dHelperIdx.style.top = topPos + "px";
        dHelperIdx.setAttribute("backHomeY", topPos.toString() );
        //var whatWasY = dHelperIdx.getAttribute("backHomeY");
        //alert("whatWasY: " + whatWasY ); 
    }
    dHelperIdx.setAttribute("position", topPos);
    dHelperIdx.style.color = "#3961a2";
    dHelperIdx.style.border = "none";
    //dHelperIdx.setAttribute("moved", "pos1");
}
function delDups( val, col0Moved, col3Moved, col6Moved, col ) {
    var doc = document;
    var num = Number;
    var allBoxes = doc.getElementsByClassName("dragBox");
    var allBxLen = allBoxes.length;
    var deleteThis = new Array(2);
    var one = 0;

    for( var i = 0; i < allBxLen; ++i ) {
        var whatBx = allBoxes[i];  
        if( whatBx ) {
            
            var bxVal = num(whatBx.value);

            if( bxVal === val ) {
                var bxid = whatBx.id;
                var notMovedYet = whatBx.getAttribute("moved") === "pos0";

                var bxidlen = bxid.length;
                var pos = bxid.indexOf("_");
                var bxCol = num(bxid.substr(pos+1, bxidlen));
                if( notMovedYet && bxCol !== col ) {

                    if( bxCol === 0 && !col0Moved ||
                        bxCol === 3 && !col3Moved ||
                        bxCol === 6 && !col6Moved    ) {
                        // list for deletion
                        deleteThis[one] = whatBx;
                        one = one + 1;
                        col0Moved = col0Moved || bxCol === 0;
                        col3Moved = col3Moved || bxCol === 3;
                        col6Moved = col6Moved || bxCol === 6;

                        if( col0Moved && col3Moved && col6Moved ) {
                            break;
                        }
                    }
                }
            }
        }
    }
    for( var i = 0; i < one; i++ ) {
        //whatBx = doc.getElementById(deleteThis[i]);
        var whichParent = deleteThis[i].parentNode;
        whichParent.removeChild( deleteThis[i] );
    }
    var instr0 = doc.getElementById("instr0");
    var instr1 = doc.getElementById("instr1");
    instr0.style.color = "#e2eeeb";
    instr1.style.color = "#e2eeeb";
    instr0.innerHTML = "Drag each prime factor to the section";
    instr1.innerHTML = "of the Venn diagram where it belongs.";
    var mx = doc.getElementsByClassName("instrs").length;
    for( var instIdx = 2; instIdx < mx; ++instIdx) {
        var whatInstr = doc.getElementById("instr" + instIdx);
        whatInstr.style.color = "#3961a2";
    }
}
       
document.onmousemove = mouseMove; 
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp; 
function draggerSetup(){ 
    var doc = document;

    //for( var j = 0; j < nSbxs; j++ ) {
        //doc.getElementById("statusBox" + j).innerHTML = "";
    //}
    
    if( doc.getElementById("linedUp").value !== "true" ) {
        var num = Number;
        var getstyle = getComputedStyle;
	var ghostBoxes = doc.getElementsByClassName("ghost");
	var glen = ghostBoxes.length;
	for( var i = 0; i < glen; ++i ) {
            var whatGhost = ghostBoxes[i];
            var whatId = whatGhost.id;
            var idlen = whatId.length;
            var unPos = whatId.indexOf("_");
            var row = whatId.substr(1,unPos-1);
            var col = num(whatId.substr(unPos+1,idlen));
            var whatValue = whatGhost.value;
            if( row === "0" || (col%3 === 0 && whatValue !== "" ) ) {
                whatGhost.style.background = "#6a91c8"; // midrange
                whatGhost.style.color = "#0c2a5a";
                var testInput = doc.createElement("input");
		var newId = "d" + whatId.substring(1, idlen);
                var pos = getPosition(whatGhost);
		var xcoord = pos.x;
		var ycoord = pos.y;
                //alert("row: " + row + " col: " + col + " xcoord: " + xcoord + " ycoord: " + ycoord);
                testInput.id = newId;
                testInput.type="text";
                testInput.setAttribute("value",whatValue);
                testInput.setAttribute("class","dragBox");
                testInput.style.position = "absolute";
                testInput.setAttribute("moved","pos0"); 
		if( row === "0" && col%3 !== 0 ) {
                    testInput.style.background = "#b4c5e2";
                    testInput.setAttribute("backHomeX",xcoord);
                    testInput.setAttribute("backHomeY",ycoord);
                    //if( col == 1 ) {
                      // alert("value: " + whatValue + " id: " + newId + " backHome x, y: " + xcoord + ", " + ycoord)
                    //}
		} else {
                    testInput.style.background = "#e2eeeb";
		}
                //testInput.style.background = "orange";
                testInput.style.color = "#3961a2";
                testInput.style.left = xcoord + "px";
                testInput.style.top = ycoord + "px";
                //testInput.readonly = true; // readonly does nothing
            	doc.body.appendChild(testInput);
                
            }
	}
        var dHelper  = doc.getElementsByClassName("dragBox");
        var len = dHelper.length;
        for( i = 0; i < len; i++ ) {
            var bxid = dHelper[i].id;
            //doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " id: " + bxid;
            //x = (x + 1)%nSbxs;
        }
        var instr0 = doc.getElementById("instr0");
        var instr1 = doc.getElementById("instr1");
        instr0.style.color = "#e2eeeb";
        instr1.style.color = "#e2eeeb";
        instr0txt = "Drag each prime factor to the section";
        instr1txt = "of the Venn diagram where it belongs.";
        instr2txt = "What";
        instr0.innerHTML = instr0txt;
        instr1.innerHTML = instr1txt;
        var mx = doc.getElementsByClassName("instrs").length;
        for( var instIdx = 2; instIdx < mx; ++instIdx) {
            var whatInstr = doc.getElementById("instr" + instIdx);
            whatInstr.style.color = "#3961a2";
        }
        boxHeight = num(getstyle(dHelper[0]).height.match(/[0-9]+/));
        boxWidth = num(getstyle(dHelper[0]).width.match(/[0-9]+/));
//        dragHelper = dHelper;
    }
}
