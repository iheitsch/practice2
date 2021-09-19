<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Number Bases</title>
<link rel="stylesheet" href="Bases.css" type="text/css">
<script src="Bases.js"></script>
</head>
<body>
<form id="bases">
<%  int MAX_COUNT = 32;
	int MAX_HEX = 16777184;
	int HEX4CONV = 65536;
	int EXPNT = 3;

	boolean countBCk = false;
    String isCountB = "";

    boolean countHCk = false;
    String isCountH = "";
    
    boolean decToHexCk = false;
    String isDecToHex = "";
    
    boolean hexToDecCk = true;
    String isHexToDec = "checked";
    
    boolean decToBinCk = false;
    String isDecToBin = "";
    
    boolean binToDecCk = false;
    String isBinToDec = "";

    boolean hexToBinCk = false;
    String isHexToBin = "";

    boolean binToHexCk = false;
    String isBinToHex = "";
    
    // checks is null on first rendition of page, will contain
    // last settings after that so they can be carried forward
    String[] checks = request.getParameterValues("selected");
    int len = 0;
    if( checks != null ) {
        len = checks.length;
        countBCk = false;
        isCountB = "";
        countHCk = false;
        isCountH = "";
        decToHexCk = false;
        isDecToHex = "";
        hexToDecCk = false;
        isHexToDec = "";
        decToBinCk = false;
        isDecToBin = "";
        binToDecCk = false;
        isBinToDec = "";
        hexToBinCk = false;
        isHexToBin = "";
        binToHexCk = false;
        isBinToHex = "";
    }
    for( int i = 0; i < len; ++i ) {
        //System.out.println("checks[" + i + "]: " + checks[i]);
        if( checks[i].compareTo("countB") == 0 ) {
            countBCk = true;
            isCountB = "checked";
        } else if( checks[i].compareTo("countH") == 0 ) {
            countHCk = true;
            isCountH = "checked";
        } else if( checks[i].compareTo("decToHex") == 0 ) {
            decToHexCk = true;
            isDecToHex = "checked";       
        } else if( checks[i].compareTo("hexToDec") == 0 ) {
            hexToDecCk = true;
            isHexToDec = "checked";
        } else if( checks[i].compareTo("decToBin") == 0 ) {
            decToBinCk = true;
            isDecToBin = "checked";
        } else if( checks[i].compareTo("binToDec") == 0 ) {
            binToDecCk = true;
            isBinToDec = "checked";
        } else if( checks[i].compareTo("hexToBin") == 0 ) {
            hexToBinCk = true;
            isHexToBin = "checked";
        } else if( checks[i].compareTo("binToHex") == 0 ) {
            binToHexCk = true;
            isBinToHex = "checked";
        }
    }
    
    int strtPt = 0;
    String hexNum = "XXXX";
    int maxrow = 8;
	int  maxcol = MAX_COUNT/maxrow;
    int blankRpttrn = 0x2A;
    int blankCpttrn = 0x5;
    boolean running = false;
    int indcatr = 0;
    int possbl = 8;
    String startHere = "b0_0";
    int strtCol = 0;
    String instrs = "blank";
    String instr2 = "blank";
    String instr3 = "blank";
    String instr4 = "blank";
    int stp = EXPNT;
    String[] digits = new String[4]; // EXPNT + 1
    
    genNumbers:
    while( !running ) {
        indcatr = (int)(StrictMath.random()*possbl);
        if( indcatr == 0 && countBCk ) {
        	running = true;
        	strtPt = (int)(MAX_COUNT*Math.random());
        	int rowbits = 0xFF;
        	int colbits = 0xF;
        	blankRpttrn = (int)(rowbits*Math.random()) & 0xF8; // 1 bits = don't display there, 
        	blankCpttrn = (int)(colbits*Math.random()) & 0xE;  // user fills in
        	if( blankRpttrn == 0 ) {
        		if( blankCpttrn == 0 ) {
        			running = false;
        			continue genNumbers;
        		}
        		// set strtCol to Cpptrn bit with 1
        		// Cpttrn is backwards
        		if( ( blankCpttrn & 1 << 1 ) > 0 ) {
        			strtCol = 1;
        		} else if( ( blankCpttrn & 1 << 2 ) > 0 ) {
        			strtCol = 2;
        		} else {
        			strtCol = 3;
        		}
        	}
        	startHere = null;
        	instrs = "Fill in the blank numbers in this binary count";
        	instr2 = "What's next?";
        } else if( indcatr == 1 && countHCk ) {
        	running = true;
        	strtPt = (int)(MAX_HEX*Math.random());
        	int rowbits = 0xFF;
        	int colbits = 0xF;
        	blankRpttrn = (int)(rowbits*Math.random()) & 0xF8; // 1 bits = don't display there, 
        	blankCpttrn = (int)(colbits*Math.random()) & 0xE;  // user fills in
        	if( blankRpttrn == 0 ) {
        		if( blankCpttrn == 0 ) {
        			running = false;
        			continue genNumbers;
        		}
        		// set strtCol to Cpptrn bit with 1
        		// Cpttrn is backwards
        		if( ( blankCpttrn & 1 << 1 ) > 0 ) {
        			strtCol = 1;
        		} else if( ( blankCpttrn & 1 << 2 ) > 0 ) {
        			strtCol = 2;
        		} else {
        			strtCol = 3;
        		}
        	}
        	startHere = null;
        	instrs = "Fill in the blank numbers in this hexadecimal count";
        	instr2 = "What's next?";
        } else if( indcatr == 2 && decToHexCk ) {
        	running = true;
        	strtPt = (int)(HEX4CONV*Math.random());
        	startHere = "b0";        	
        	int  sixtn2pow = 16777216;
        	instrs = "Convert this base 10 number to hexadecimal";
        	instr2 = "How many times does 16^" + EXPNT + " = " + sixtn2pow + " go into " +  strtPt + "?";
        } else if( indcatr == 3 && hexToDecCk ) {
        	running = true;
        	strtPt = (int)(HEX4CONV*Math.random());
        	hexNum = (Integer.toHexString( strtPt )).toUpperCase();
        	stp = hexNum.length();
        	for( int i = 0; i < stp; ++i ) {
        		int frst = stp - 1 - i;
        		int last = frst + 1;
        		digits[i]= hexNum.substring( frst, last );
        	}
        	instrs = "Convert the hexadecimal number 0x" + hexNum + " to base 10";
        	instr2 = "What is the decimal equivalent of least significant hex digit " + digits[0] + "? (Enter)";
        	startHere = "b0_0";
        } else if( indcatr == 4 && decToBinCk ) {
        } else if( indcatr == 5 && binToDecCk ) {
        } else if( indcatr == 6 && hexToBinCk ) {
        } else if( indcatr == 7 && binToHexCk ) {
        }
    }
    %>
<table>
<tr>
<td>
<div id="instrs" class="d3"><%=instrs%></div>
<div id="instr2" class="d4"><%=instr2%></div>
<div id="instr3" class="d4"><%=instr3%></div>
<div id="instr4" class="d4"><%=instr4%></div>
<div class="d1">

<%	if( indcatr == 0 && countBCk ) { %>
<table class="probset">
<%		for( int row = 0; row < maxrow; ++row ) {
			long rpos = 1 << row; 
			boolean displayRow = (rpos & blankRpttrn) > 0; 
			String stripeclr = row%2 == 0? "evenstripe" : "oddstripe";
			//System.out.println("row: " + row + " rpos: " + rpos + " displayRow: " + displayRow); %>
	<tr>
			<td class="mgn">o</td>
<% 			for( int col = 0; col < maxcol; ++col ) {
				int n = col*maxrow + row;
				String val = Integer.toBinaryString(strtPt + n);
				String bid = "b" + n;
				// if selcted to be displayed by blankpattrn, display it 
				long cpos = 1 << col;		
				boolean displayThis = !displayRow && !((cpos & blankCpttrn) > 0);
				if( col == strtCol && startHere == null && !displayThis ) {
					startHere = "b" + n;
				}
				//System.out.println("col: " + col + " cpos: " + cpos + " displayThis: " + displayThis + " val: " + val);
				if( displayThis ) { //  %>
					<td class="entry">
					<input id=<%=bid%> type="text" disabled="true" value=<%=val%> class="nbox <%=stripeclr%>">
					</td>
<%				} else { %>
					<td class="entry">
					<input id=<%=bid%> type="text" class="nbox <%=stripeclr%>"
					onkeyup="checkBCount( event )" onkeydown="erase( event )" >
					</td>
<%				} %>
<% 			} %>
			<td class="mgn">o</td>
	</tr>			
<% 		} %>
</table>
<%	} else if( indcatr == 1 && countHCk ) { %>
<table class="probset">
<%		for( int row = 0; row < maxrow; ++row ) {
			long rpos = 1 << row; 
			boolean displayRow = (rpos & blankRpttrn) > 0; 
			String stripeclr = row%2 == 0? "evenstripe" : "oddstripe";
			//System.out.println("row: " + row + " rpos: " + rpos + " displayRow: " + displayRow); %>
<tr>
		<td class="mgn">o</td>
<% 			for( int col = 0; col < maxcol; ++col ) {
			int n = col*maxrow + row;
			String val = Integer.toHexString(strtPt + n).toUpperCase();
			String bid = "b" + n;
			// if selcted to be displayed by blankpattrn, display it 
			long cpos = 1 << col;		
			boolean displayThis = !displayRow && !((cpos & blankCpttrn) > 0);
			if( col == strtCol && startHere == null && !displayThis ) {
				startHere = "b" + n;
			}
			//System.out.println("col: " + col + " cpos: " + cpos + " displayRow: " + displayRow + " blankCpttrn: " + blankCpttrn + " startHere: " + startHere + " displayThis: " + displayThis);
			//System.out.println("col: " + col + " cpos: " + cpos + " displayThis: " + displayThis + " val: " + val);
			if( displayThis ) { //  %>
				<td class="entry">
				<input id=<%=bid%> type="text" disabled="true" value=<%=val%> class="nbox <%=stripeclr%>">
				</td>
<%				} else { %>
				<td class="entry">
				<input id=<%=bid%> type="text" class="nbox <%=stripeclr%>"
				onkeyup="checkHCount( event )" onkeydown="erase( event )" >
				</td>
<%				} %>
<% 			} %>
		<td class="mgn">o</td>
</tr>			
<% 		} %>
</table>
<%	} else if( indcatr == 2 && decToHexCk ) { 
		%>
		<table></table>
<%	} else if( indcatr == 3 && hexToDecCk ) {
		String sixtnraised = "16^"+EXPNT;
		int powof16 = (int)Math.pow(16, EXPNT); %>
<table class="conversion" >
<tr>
		<th colspan=2 class="evenstripe">Power of 16</th>
<% 		for( int i = 0; i <= EXPNT; ++i ) { %>
			<th colspan=2 class="evenstripe" ><%=sixtnraised%></th>
<% 			int pow = EXPNT - 1 - i;
			sixtnraised = "16^" + pow;
			//System.out.println("i: " + i + " next sixtnraised: " + sixtnraised);
		} %>
</tr>
<tr>
		<th colspan=2 class="oddstripe" >Hex digit</th>
<% 		for( int i = 0; i <= EXPNT; ++i ) {
			int dignum = EXPNT - i; 
			if( dignum >= stp ) { %>
			<th colspan=2 class="oddstripe" ></th>
<% 			} else {
			String did = "d" + dignum; %>
			<th colspan=2 id=<%=did%> class="oddstripe" ><%=digits[dignum]%></th>
<%			} 
		} %>
</tr>
<tr>
<tr>
		<th colspan=2 class="evenstripe" >Power of 16</th>
<% 		for( int i = 0; i <= EXPNT; ++i ) { %>
			<th colspan=2 class="evenstripe" ><%=powof16%></th>
<% 			powof16 /= 16;
			//System.out.println("i: " + i + " next powof16: " + powof16);
		} %>
</tr>
<tr>
		<th colspan=2 class="oddstripe" >Decimal Equivalent</th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			String bid = "b0_" + i; 
			if( i >= stp ) { %>
			<td class="mult oddstripe" ><td class="mult" >
<% 			} else { %>
			<td class="mult oddstripe" >&times</td>
			<td class="mult oddstripe" >
				<input type="text" id=<%=bid%> class="ebox oddstripe"
					onkeyup="checkHDig( event )" onkeydown="erase( event )" >
			</td>
<% 			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank" ></th>
<% 		for( int i = EXPNT; i >= 0; --i ) {
			if( i >= stp ) { %>
			<th colspan=2 class="blank" ></th>
<% 			} else { %>
			<th colspan=2 class="bar" ></th>
<% 			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank evenstripe" ></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			String bid = "b1_" + i;
			boolean simple = false; //(i < stp) && ( i == 0 || digits[i].equals("0") || digits[i].equals("1") );
			if( i >= stp ) { %>
			<td class="mult evenstripe" ><td class="mult" >
<% 			} else if( simple ){ %>
			<td class="mult evenstripe" ></td>
			<td class="mult evenstripe">
				<input type="text" id=<%=bid%> class="ebox"
					onkeyup="checkSmult( event )" onkeydown="erase( event )" >
			</td>
<% 			} else { 
				String id = "a0_" + i + "_"; 
				String aid = id + "5"; %>
			<th colspan=2 class="blank evenstripe digits" >
				<table>
				<tr>
					<td>
					<input id=<%=aid%> class="a1" 
					onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
					onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
						<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
						<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
						<input id=<%=aid%> class="a1"
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "0"; %>
						<input id=<%=aid%> class="a1"
						onkeyup="checkDmult( event )" onkeydown="eraseAll( event )" >
					</td>
				</tr>
				</table>
			</th>
<%			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank oddstripe"></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			boolean nomoremult = true;
			if( i < stp ) {
				char c = digits[i].charAt(0);
    			if( c < '0' || c > '9' ) {
    				nomoremult = false;
    				if( c == 'a' || c == 'A') {
    					nomoremult = true;
    				}
    			}
			}
			if( nomoremult || i == 0 ) { %>
			<td class="mult oddstripe" ><td class="mult oddstripe" >
<% 			} else { 
				String id = "a1_" + i + "_"; %>
			<th colspan=2 class="blank oddstripe digits">
				<table>
				<tr>
					<td>
<%				 	String aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" >
					</td>
					<td>
<%				 	aid = id + "0"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseAll( event )" >
					</td>
					<td>
					<input disabled="true" class="a1" >
					</td>
				</tr>
				</table>
			</th>
<%			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank"></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			boolean nomoremult = true;
			if( i < stp ) {
				char c = digits[i].charAt(0);
				if( c < '0' || c > '9' ) {
					nomoremult = false;
					if( c == 'a' || c == 'A') {
    					nomoremult = true;
    				}
				}
			}
			if( nomoremult || i == 0 ) { %>
			<th colspan=2 class="blank"></th>
<% 			} else { %>
			<th colspan=2 class="bar"></th>
<%			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank evenstripe digits"></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			boolean nomoremult = true;
			if( i < stp ) {
				char c = digits[i].charAt(0);
				if( c < '0' || c > '9' ) {
					nomoremult = false;
					if( c == 'a' || c == 'A') {
    					nomoremult = true;
    				}
				}
			}
			if( nomoremult || i == 0 ) { %>
			<td class="mult" ><td class="mult evenstripe" >
<% 			} else {
			String id = "a2_" + i + "_"; %>
			<th colspan=2 class="blank evenstripe">
				<table>
				<tr>
					<td>
<%				 	String aid = id + "5"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" >
					</td>
					<td>
<%				 	aid = id + "0"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" onkeydown="eraseAll( event )" >
					</td>
				</tr>
				</table>
			</th>
<%			}
		} %>
</tr>
</table>
<%	} %>

</div>
<div>
        <span><button type="button" onclick="skip()" id="skpBx">Skip</button>
        
        <button type="button" onclick="check()" id="chkBx">Done</button></span>
</div>
<div>
	    <a href="/" class="ndx">Home</a>
</div>
<div>
	    <a href="index.html" class="ndx">Back to Practice Index</a>
</div>
<div>
	<table>
	<% for( int i = 0, j = 1; i < 24; i += 2, j += 2 ) {
	    String whatId = "statusBox" + i; 
	    String whatId2 = "statusBox" + j; %>
	    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
	<% } %>
	</table>
</div>
</td>
<td>
<%  String numAttmptdV = "0";
    String numWoErr = "0";
    String consWoErr = "0";
    String corrPerHr = "0";
    String strtTime = String.valueOf(System.currentTimeMillis());
    String errs = "0";
    String tmp = "";    // temporary storage for newly gotten 
                        // request parameter      

    //retrieves the value of the DOM object with name="numAttmptdP"
    if(( tmp = request.getParameter("numAttmptdP")) != null) {
        numAttmptdV = tmp.toString();
    }
    
    if(( tmp = request.getParameter("numWoErrP")) != null) {
        numWoErr = tmp.toString();
    } 
    
    if(( tmp = request.getParameter("consWoErrP")) != null) {
        consWoErr = tmp.toString();
    } 
    
    if(( tmp = request.getParameter("corrPerHrP")) != null) {
        corrPerHr = tmp.toString();
    } 
    
    if(( tmp = request.getParameter("strtTimeP")) != null) {
        strtTime = tmp.toString();
    } 
%>
<div class="d5">
<table >
<tr>
    <th class="title">Score</th>     
</tr>
<tr>    
    <td><label>Problems Attempted</label></td>
    <td>
    <input type="text" id="numAttmptd" name="numAttmptdP" value="<%=numAttmptdV%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Completed Without Error</label></td>   
    <td>
    <input type="text" id="numWoErr" name="numWoErrP" value="<%=numWoErr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Consecutive Without Error</label></td>   
    <td>
    <input type="text" id="consWoErr" name="consWoErrP" value="<%=consWoErr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Correct Per Hour</label></td>   
    <td>
    <input type="text" id="corrPerHr" name="corrPerHrP" value="<%=corrPerHr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Errors This Problem</label></td>
    <td><input type="text" id="errs" name="errs" value="<%=errs%>"
               class="blackbox"></td>
</tr>
</table>
<table >
<tr>
    <th class="title">Types of Problems</th>
</tr>
<tr><td><input type="checkbox" value="countB" name="selected" 
                   <%=isCountB%> onclick="zeroCounts()">
            <label>Count Binary</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="countH" name="selected" 
                   <%=isCountH%> onclick="zeroCounts()">
            <label>Count Hex</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="decToHex" name="selected" 
                   <%=isDecToHex%> onclick="zeroCounts()">
            <label>Base 10 to Hexadecimal</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="hexToDec" name="selected" 
                   <%=isHexToDec%> onclick="zeroCounts()">
            <label>Hexadecimal to Base 10</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="decToBin" name="selected" 
                   <%=isDecToBin%> onclick="zeroCounts()">
            <label>Base 10 to Binary</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="binToDec" name="selected" 
                   <%=isBinToDec%> onclick="zeroCounts()">
            <label>Binary to Base 10</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="hexToBin" name="selected" 
                   <%=isHexToBin%> onclick="zeroCounts()">
            <label>Hexadecimal to Binary</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="binToHex" name="selected" 
                   <%=isBinToHex%> onclick="zeroCounts()">
            <label>Binary to Hexadecimal</label>
        </td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="startHere" name="startHere" value="<%=startHere%>" class="shortbox">
<input type="hidden" id="indcatr" value="<%=indcatr%>">
<input type="hidden" id="hexNum" value="<%=hexNum%>">
</form>
</body>
</html>