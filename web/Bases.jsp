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
<% 
	int MAX_COUNT = 32;
	int MAX_HEX = 16777184;
	int HEX4CONV = 65536;
	int BIN4CONV = 29;
	int EXPNT = 3;
	int BEXPNT = 4;
	int DECEXPNT = 4;

	boolean countBCk = false;
    String isCountB = "";

    boolean countHCk = false;
    String isCountH = "";
    
    boolean decToHexCk = false;
    String isDecToHex = "";
    
    boolean hexToDecCk = false;
    String isHexToDec = "";
    
    boolean decToBinCk = false;
    String isDecToBin = "";
    
    boolean binToDecCk = false;
    String isBinToDec = "";

    boolean hexToBinCk = true;
    String isHexToBin = "checked";

    boolean binToHexCk = true;
    String isBinToHex = "checked";
    
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

    String [] powers = { "", "", "", "" };
    
    
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
    int barwidth = EXPNT;
    String[] digits = new String[16]; // big enough for binary 65535
    int[] numQ = new int[BEXPNT+1];
    int frstrow = BEXPNT;
    int frstcol = EXPNT;
    int base = 16;
    
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
        	base = 16;
        	strtPt = (int)(HEX4CONV*Math.random());
        	int dice = (int)(EXPNT*Math.random());
        	for( int i = 1; i < dice && strtPt > 256; ++i ) {
        		strtPt = strtPt/base;
        	}
        	String decStr = Integer.toString( strtPt );
        	stp = decStr.length();
        	for( int i = 0; i < stp; ++i ) {
        		int frst = stp - 1 - i;
        		int last = frst + 1;
        		digits[i]= decStr.substring( frst, last );
        	}
        	barwidth = stp + 1;
        	frstrow = strtPt > 4095? 3 : strtPt > 255? 2 : strtPt > 15? 1 : 0;
        	startHere = "b0"; // make sure it's not a valid box. need to start by selecting fixit     	        	
        	int tmp = strtPt;
        	for( int i = EXPNT; i >= 0; i-- ) {
        		int  sixtn2pow = (int)Math.pow(16, i);
        		numQ[i] = 1;
        		if( tmp >= sixtn2pow ) {
        			int part = tmp/sixtn2pow;
        			numQ[i] += (int)Math.log10((double)part);
        			tmp -= part*sixtn2pow;
                	//System.out.println("strtPt: "  + strtPt + " sixtn2pow: " + sixtn2pow + " numQ[" + i + "]: "  + numQ[i] + " part: " + part + " tmp: " + tmp);
        		}
        	}
        	instrs = "Convert " + strtPt + " base 10 to hexadecimal";
        	instr2 = "Select the highest power of 16 that goes into " +  strtPt;
        } else if( indcatr == 3 && hexToDecCk ) {
        	running = true;
        	base = 16;
        	strtPt = (int)(HEX4CONV*Math.random());
        	hexNum = (Integer.toHexString( strtPt )).toUpperCase();
        	stp = hexNum.length();
        	for( int i = 0; i < stp; ++i ) {
        		int frst = stp - 1 - i;
        		int last = frst + 1;
        		digits[i]= hexNum.substring( frst, last );
        	}
        	instrs = "Convert the hexadecimal number 0x" + hexNum + " to base 10";

            String tmp = "";    // temporary storage for newly gotten 
                                // request parameter      

            //retrieves the value of the DOM object with name="s0"
            if(( tmp = request.getParameter("s0")) != null) {
                powers[0] = tmp.toString();
                instr2 = "What is the decimal equivalent of least significant hex digit " + digits[0] + "? (Enter)";
        		startHere = "q0_0";
            } else {
            	instr2 = "What is any number raised to the 0 power? (Enter)";
	        	startHere = "s0";
            }
            
            if(( tmp = request.getParameter("s1")) != null) {
                powers[1] = tmp.toString();
            } 
            
            if(( tmp = request.getParameter("s2")) != null) {
                powers[2] = tmp.toString();
            } 
            
            if(( tmp = request.getParameter("s3")) != null) {
                powers[3] = tmp.toString();
            } 

        } else if( indcatr == 4 && decToBinCk ) {
        	running = true;
        	base = 2;
        	strtPt = 2 + (int)(BIN4CONV*Math.random());
        	String decStr = Integer.toString( strtPt );
        	stp = decStr.length();
        	for( int i = 0; i < stp; ++i ) {
        		int frst = stp - 1 - i;
        		int last = frst + 1;
        		digits[i]= decStr.substring( frst, last );
        	}
        	barwidth = stp + 1;
        	frstrow = strtPt > 15? 4 : strtPt > 7? 3 : strtPt > 3? 2 : strtPt > 1? 1 : 0;
        	startHere = "b0"; // make sure it's not a valid box. need to start by selecting fixit     	        	
        	int tmp = strtPt;
        	for( int i = BEXPNT; i >= 0; i-- ) {
        		int  two2pow = (int)Math.pow(2, i);
        		numQ[i] = 1;
        		if( tmp >= two2pow ) {
        			int part = tmp/two2pow;
        			numQ[i] += (int)Math.log10((double)part);
        			tmp -= part*two2pow;
                	//System.out.println("strtPt: "  + strtPt + " sixtn2pow: " + sixtn2pow + " numQ[" + i + "]: "  + numQ[i] + " part: " + part + " tmp: " + tmp);
        		}
        	}
        	instrs = "Convert " + strtPt + " base 10 to binary";
        	instr2 = "Select the highest power of 2 that goes into " +  strtPt;
        } else if( indcatr == 5 && binToDecCk ) {
        	running = true;
        	base = 2;
        	strtPt = 2 + (int)(4095*Math.random());
        	frstrow = (int)(Math.log((double)strtPt)/Math.log(2));
        	startHere = "t0";    	        	
        	int tmp = strtPt;
        	instrs = "Convert ";
        	for( int i = frstrow; i >= 0; i-- ) {
        		int  two2pow = (int)Math.pow(2, i);
        		if( tmp >= two2pow ) {
        			int part = tmp/two2pow;
        			tmp -= part*two2pow;
        			digits[i] = "1";
                	//System.out.println("strtPt: "  + strtPt + " sixtn2pow: " + sixtn2pow + " numQ[" + i + "]: "  + numQ[i] + " part: " + part + " tmp: " + tmp);
        		} else {
        			digits[i] = "0";
        		}
        		instrs = instrs + digits[i];
        	}
        	instrs = instrs + " binary to base 10";
        	instr2 = "Type the binary number horizonatally, starting with least"; 
        	instr3 = "signiificant bit at the bottom"; 
        } else if( indcatr == 6 && hexToBinCk ) {
        	running = true;
        	base = 2;
        	strtPt = (int)(HEX4CONV*Math.random());
        	hexNum = (Integer.toHexString( strtPt )).toUpperCase();
        	stp = hexNum.length();
        	for( int i = 0; i < stp; ++i ) {
        		int frst = stp - 1 - i;
        		int last = frst + 1;
        		digits[i]= hexNum.substring( frst, last );
        	}
        	frstcol = stp - 1;
        	instrs = "Convert the hexadecimal number 0x" + hexNum + " to binary";
        	int frstbit = stp*4 - 1;
        	startHere = "b" + frstbit;
        	System.out.println("hex2bin strtPt: " + strtPt + " frstcol: " + frstcol + " startHere: " + startHere);
        } else if( indcatr == 7 && binToHexCk ) {
        	running = true;
        	base = 16;
        	strtPt = (int)(HEX4CONV*Math.random());
        	int tmp = strtPt;
        	instrs = "Convert ";
        	frstcol = (int)(Math.log((double)strtPt)/Math.log(2));
        	for( int i = frstcol; i >= 0; i-- ) {
        		int  two2pow = (int)Math.pow(2, i);
        		if( tmp >= two2pow ) {
        			int part = tmp/two2pow;
        			tmp -= part*two2pow;
        			digits[i] = "1";
                	//System.out.println("strtPt: "  + strtPt + " sixtn2pow: " + sixtn2pow + " numQ[" + i + "]: "  + numQ[i] + " part: " + part + " tmp: " + tmp);
        		} else {
        			digits[i] = "0";
        		}
        		instrs = instrs + digits[i];
        	}
        	instrs = instrs + " binary to Hexadecimal";
        	int frstdig = (int)(Math.log((double)strtPt)/Math.log(16));
        	startHere = "h" + frstdig;
        	System.out.println("bin2hex strtPt: " + strtPt + " frstcol: " + frstcol + " startHere: " + startHere);
        }
    }
    %>
 <span class=leftsd>
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
		String itype = "text"; 
		String rparen = ")"; 
		String isDisabled = "disabled = 'true'"; 
		String visible = "bar";
		 %>
		<table>
<%		for( int i = frstrow; i > 0; --i ) {
			String pid = "p" + i;
			String sid = "s" + i;
			String lid = "l" + i;
			String rname = "b" + i;
			String vbar = "v" + i;
			String tway = "t" + i;
		%>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
<%			//System.out.println("stp: " + stp + " numQ: " + numQ[i]);
			for( int k = 0; k < stp - numQ[i]; ++k ) { %>
				<td></td>
<%			} 
			for( int k = numQ[i] - 1; k>= 0; --k ) { 
				String qid = "q" + i + "_" + k; %>
			<td>
			<input id="<%=qid%>" class="a1 q" type="<%=itype%>" name="<%=rname%>"
			onkeyup="checkQ( event )" onkeydown="erase( event )">
			</td>
<%			} %>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td>
			<th colspan=<%=barwidth%> class="<%=visible%>" name="<%=vbar%>" ></th>
		</tr>
		<tr>
<%			if( i == frstrow ) { %>
			<th colspan=4>
		      <select id=<%=lid%> name="powof16" class="slct" onchange="checkSel( event )">   
		           <option>Select a number</option>
		           <option>1</option>
		           <option>16</option>
		           <option>256</option>
		           <option>4096</option> 
		       </select>
			</th>
<%			} else { 
				int val = (int)Math.pow(16,i); %>
			<th colspan=4 class="invisible" name="<%=vbar%>" >
				<input type="<%=itype%>" disabled="true"
				name="<%=rname%>" value="<%=val%>" class="dvsr" ></th>
<%			} %>
			<td class="sym" id=<%=sid%>><%=rparen%></td>
<%			for( int j = stp-1; j >= 0; --j ) {
				String bid = "b" + numQ[i] + "_" +  i + "_" + j;
				if( j == 0 ) { %>
			<td>
				<input id="<%=bid%>" class="a1" <%=isDisabled%>  type="<%=itype%>"
				name="<%=rname%>" value="<%=digits[j]%>" 
				onkeyup="checkDvdnd( event)" onkeydown="eraseAll( event )" >
			</td>
<%				} else { %>
			<td>
				<input id="<%=bid%>" class="a1" <%=isDisabled%>  type="<%=itype%>"
				name="<%=rname%>" value="<%=digits[j]%>" 
				onkeyup="checkDvdnd( event)" onkeydown="erase( event )" >
			</td>
<%				}
			} %>
		</tr>
<%			for( int k = numQ[i] - 1; k>= 0; --k ) { %>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
	<%			for( int j = j = stp-1; j >= k; --j ) { 
					int l = j - k;
					String mid = "m" + k + "_" +  i + "_" + l; 
					if( j == 0 ) { %>
			<td>
				<input id="<%=mid%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDmult( event )" onkeydown="eraseAll( event )" >
			</td>
<%					} else { %>
			<td>
				<input id="<%=mid%>" class="a1 <%=tway%>" type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDmult( event )" onkeydown="erase( event )" >
			</td>
<%					}
				} %>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
			<th colspan=<%=stp%> class="<%=visible%>" name="<%=vbar%>" ></th>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
	<%			for( int j = stp-1; j >= k; --j ) { 
					String bid = "b" + k + "_" +  i + "_" + j; 
					if( j == 0 || (j == 1 && k == 1) ) {  %>
			<td>
				<input id="<%=bid%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDsub( event )" onkeydown="eraseAll( event )" >
			</td>
<%					} else { %>
			<td>
				<input id="<%=bid%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDsub( event )" onkeydown="erase( event )" >
			</td>
<%					} 
				}
				if( k == 1 ) { 
					String did ="b" + k + "_" +  i + "_0"; %>
			<td>
				<input id="<%=did%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkBD( event )" onkeydown="erase( event )" >
			</td>
<% 				}%>
		</tr>
<%			}
			itype = "hidden";
			rparen = "";
			isDisabled = "";
			for( int j = stp-1; j >= 0; --j ) { 
				digits[j] = "";
			}
			visible = "not";
		} %>
		</table>
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
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			String sid = "s" + i; %>
			<th colspan=2 class="evenstripe" >
			<input type="text" id=<%=sid%> class="ebox evenstripe" name="<%=sid%>"
					onkeyup="checkPow( event )" onkeydown="erase( event )" 
					value=<%=powers[i]%>></th>
<% 			powof16 /= 16;
			//System.out.println("i: " + i + " next powof16: " + powof16);
		} %>
</tr>
<tr>
		<th colspan=2 class="oddstripe" >Decimal Equivalent</th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			String bid = "q" + i + "_0"; 
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
					onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
					onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
						<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
						<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
						<input id=<%=aid%> class="a1"
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
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
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkDmult( event )" onkeydown="eraseDig( event )" >
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
<% 		int chosenCol = -1;
		for( int i = EXPNT; i >= 0; --i ) { 
			boolean nomoremult = true;
			if( 0 < i && i < stp ) {
				char c = digits[i].charAt(0);
				if( c < '0' || c > '9' ) {
					nomoremult = false;
					if( c == 'a' || c == 'A' || c == 0 ) {
    					nomoremult = true;
    				}
				}
				if( chosenCol < 0 && !nomoremult ) {
					//System.out.println("i: " + i + " nomoremult: " + nomoremult + " chosenCol: " + chosenCol);
					chosenCol = i;
					
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
						onkeyup="checkAdd( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkAdd( event )" onkeydown="eraseDig( event )" >
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
<% 	//System.out.println("before chosenCol: " + chosenCol);
	if( chosenCol < 0 ) {
		chosenCol = (int)(Math.log(strtPt)/Math.log(16));
	}
	//System.out.println("chosenCol: " + chosenCol);
	int row = 3;
	String whatstripe = "oddstripe";
	for( int j = 0; j < EXPNT; ++j ) { %>
<tr>
		<th colspan=2 class="blank <%=whatstripe%>" digits"></th>
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

			if( i != chosenCol ) { %>
			<td class="mult" ><td class="mult <%=whatstripe%>" >
<% 			} else {
			String id = "a" + row + "_0_"; %>
			<th colspan=2 class="blank <%=whatstripe%>">
				<table>
				<tr>
					<td>
<%				 	String aid = id + "5"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "0"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkCp( event )" onkeydown="eraseAll( event )" >
					</td>
				</tr>
				</table>
			</th>
<%			}
		} %>
</tr>
<%			row = row + 1;
			whatstripe = whatstripe.compareTo( "evenstripe" ) == 0? "oddstripe" : "evenstripe";
		} %>
<tr>
		<th colspan=2 class="blank"></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			if( i != chosenCol ) { %>
			<th colspan=2 class="blank"></th>
<% 			} else { %>
			<th colspan=2 class="bar"></th>
<%			}
		} %>
</tr>
<tr>
		<th colspan=2 class="blank <%=whatstripe%> digits"></th>
<% 		for( int i = EXPNT; i >= 0; --i ) { 
			if( i != chosenCol ) { %>
			<td class="mult" ><td class="mult <%=whatstripe%>" >
<% 			} else {
			String id = "a" + row + "_0_"; %>
			<th colspan=2 class="blank <%=whatstripe%>">
				<table>
				<tr>
					<td>
<%				 	String aid = id + "5"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "4"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "3"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "2"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "1"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseDig( event )" >
					</td>
					<td>
<%				 	aid = id + "0"; %>
					<input id=<%=aid%> class="a1" 
						onkeyup="checkTot( event )" onkeydown="eraseAll( event )" >
					</td>
				</tr>
				</table>
			</th>
<%			}
		} %>
</tr>
</table>
<%	} else if( indcatr == 4 && decToBinCk ) { 
		String itype = "text"; 
		String rparen = ")"; 
		String isDisabled = "disabled = 'true'"; 
		String visible = "bar";
		 %>
		<table>
<%		for( int i = frstrow; i > 0; --i ) {
			String pid = "p" + i;
			String sid = "s" + i;
			String lid = "l" + i;
			String rname = "b" + i;
			String vbar = "v" + i;
			String tway = "t" + i;
		%>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
<%			//System.out.println("stp: " + stp + " numQ: " + numQ[i]);
			for( int k = 0; k < stp - numQ[i]; ++k ) { %>
				<td></td>
<%			} 
			for( int k = numQ[i] - 1; k>= 0; --k ) { 
				String qid = "q" + i + "_" + k; %>
			<td>
			<input id="<%=qid%>" class="a1 q" type="<%=itype%>" name="<%=rname%>"
			onkeyup="checkQ( event )" onkeydown="erase( event )">
			</td>
<%			} %>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td>
			<th colspan=<%=barwidth%> class="<%=visible%>" name="<%=vbar%>" ></th>
		</tr>
		<tr>
<%			if( i == frstrow ) { %>
			<th colspan=4>
		      <select id=<%=lid%> name="powof16" class="slct" onchange="checkSel( event )">   
		           <option>Select a number</option>
		           <option>1</option>
		           <option>2</option>
		           <option>4</option>
		           <option>8</option>
		           <option>16</option>
		       </select>
			</th>
<%			} else { 
				int val = (int)Math.pow(2,i); %>
			<th colspan=4 class="invisible" name="<%=vbar%>" >
				<input type="<%=itype%>" disabled="true"
				name="<%=rname%>" value="<%=val%>" class="dvsr" ></th>
<%			} %>
			<td class="sym" id=<%=sid%>><%=rparen%></td>
<%			for( int j = stp-1; j >= 0; --j ) {
				String bid = "b" + numQ[i] + "_" +  i + "_" + j; %>
			<td>
				<input id="<%=bid%>" class="a1" <%=isDisabled%>  type="<%=itype%>"
				name="<%=rname%>" value="<%=digits[j]%>" 
				onkeyup="checkDvdnd( event)" onkeydown="erase( event )" >
			</td>
<%			} %>
		</tr>
<%			for( int k = numQ[i] - 1; k>= 0; --k ) { %>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
	<%			for( int j = j = stp-1; j >= k; --j ) { 
					int l = j - k;
					String mid = "m" + k + "_" +  i + "_" + l; %>
			<td>
				<input id="<%=mid%>" class="a1 <%=tway%>" type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDmult( event )" onkeydown="erase( event )" >
			</td>
<%				} %>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
			<th colspan=<%=stp%> class="<%=visible%>" name="<%=vbar%>" ></th>
		</tr>
		<tr>
			<td></td><td></td><td></td><td></td><td></td>
	<%			for( int j = stp-1; j >= k; --j ) { 
					String bid = "b" + k + "_" +  i + "_" + j; %>
			<td>
				<input id="<%=bid%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkDsub( event )" onkeydown="erase( event )" >
			</td>
<%				}
				if( k == 1 ) { 
					String did ="b" + k + "_" +  i + "_0"; %>
			<td>
				<input id="<%=did%>" class="a1 <%=tway%>"  type="<%=itype%>" name="<%=rname%>" 
				onkeyup="checkBD( event )" onkeydown="erase( event )" >
			</td>
<% 				}%>
		</tr>
<%			}
			itype = "hidden";
			rparen = "";
			isDisabled = "";
			for( int j = stp-1; j >= 0; --j ) { 
				digits[j] = "";
			}
			visible = "not";
		} %>
		</table>
<% 	} else if( indcatr == 5 && binToDecCk ) { 
		 %>
		<table>
		<tr>
<%		for( int i = frstrow; i >= 0; --i ) { 
			String did = "d" + i;
			String stripeclass = (i/4)%2 == 0? "oddstripe" : "evenstripe"; %>
			<td id="<%=did%>" class="<%=stripeclass%>" ><%=digits[i]%></td>
<%		} %>
		<td>B</td>
		</tr>
		</table>
		<table >
<%		for( int i = frstrow; i >= 0; --i ) {
			int powOf2 = (int)Math.pow(2,i);		
			String eid = "e" + i; 
			String fid = "f" + i; 
			String tid = "t" + i; 
			String stripeclass = (i/4)%2 == 0? "oddstripe" : "evenstripe"; %>
		<tr >
		<td><input id="<%=tid%>" class="a1 <%=stripeclass%>" type="text" 
		onkeyup="checkbit( event )" onkeydown="erase( event )" ></td>
		<td id="<%=fid%>" class="<%=stripeclass%>" ><%=powOf2%></td>
		<th colspan=5>
		<input id="<%=eid%>" type="text" class="ebox <%=stripeclass%>"
		onkeyup="checkp( event )" onkeydown="erase( event )" ></th>
		</tr>
<%		} %>
		<tr >
		<th colspan=2 ></th>
<%		for( int i = 4; i >= 0; --i ) {
			String bid = "b_" + i;  
			if( i== 0 ) { %>
			<td class="compressed" >
			<input id="<%=bid%>" class="a1" onkeyup="checkTot(event)" onkeydown="eraseAll( event )">
			</td>
<%		 	} else { %>
			<td class="compressed" >
			<input id="<%=bid%>" class="a1" onkeyup="checkTot(event)" onkeydown="eraseAll( event )">
			</td>
<% 			} 
		}%>
		</tr>
		</table>
<% 	} else if( indcatr == 6 && hexToBinCk ) { %>
		<table >
		<tr >
		<td>0x</td>
<%		for( int i = frstcol; i >= 0; --i ) {		
			String hid = "h" + i; %>		
			<th colspan=4>
			<input id="<%=hid%>" type="text" class="ebox" 
			value="<%=digits[i]%>" disabled="true" >
			</th>		
<%		} %>
		<td></td>
		</tr>
		<tr >
		<td></td>
<% 		frstcol = 4*(frstcol + 1) - 1;
		for( int i = frstcol; i >= 0; --i ) {		
			String bid = "b" + i; %>	
			<td>
			<input id="<%=bid%>" type="text" class="a1"
			onkeyup="checkBH( event )" onkeydown="erase( event )" >
			</td>
<%		} %>
		<td>B</td>
		</tr>
		</table>
<% 	} else if( indcatr == 7 && binToHexCk ) { 
		int partial = (frstcol+1)%4;
		int leadzeroes = partial > 0? 4 - partial : 0;%>
		<table >
		<tr>
		<td></td>
<% 		for( int i = leadzeroes + frstcol; i >= 0; --i ) {		
			String bid = "b" + i; %>
			<td>
<%			if( i > frstcol ) { %>
				<input id="<%=bid%>" type="text" class="a1"
				value="0" disabled="true" >
<%			} else { %>
				<input id="<%=bid%>" type="text" class="a1"
				value="<%=digits[i]%>" disabled="true" >		
			
<%			} %>
			</td>
<% 		} %>
		<td>B</td>
	   	</tr>
	   	<tr >
	   	<td>0x</td>
<% 		
		frstcol = (leadzeroes + frstcol + 1)/4 - 1;
		for( int i = frstcol; i >= 0; --i ) {		
			String hid = "h" + i; %>	
			<th colspan=4>
			<input id="<%=hid%>" type="text" class="ebox" 
			onkeyup="checkBH( event )" onkeydown="erase( event )" >
			</th>

<%		} %>
		<td></td>
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
</span>
<span class=rightsd>
<div>
	<table>
	<% for( int i = 0, j = 1; i < 0; i += 2, j += 2 ) {
	    String whatId = "statusBox" + i; 
	    String whatId2 = "statusBox" + j; %>
	    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
	<% } %>
	</table>
</div>
<% if( indcatr == 2 || indcatr == 4 ) { 
	String pref = "0x";
	String suf = "";
	String heading = "Hex";
	String ncols = Integer.toString(frstrow + 3);
	if( indcatr == 4 ) {
		pref = "";
		heading = "Binary";
		suf = "B";
	} %>
<table class="final" >
<tr><th colspan=<%=ncols%> class="final" ><%=heading%></th></tr>
<tr>
<td><%=pref%></td>
<%	for( int i = frstrow; i >= 0; --i ) { 
		String hid = "h" + i; %>
<td><input id="<%=hid%>" class="a1" type="text" 
		onkeyup="checkHD( event )" onkeydown="erase( event )"></td>
<%	} %>
<td><%=suf%></td>
</tr>
</table>
<% } %>
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
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="startHere" name="startHere" value="<%=startHere%>" class="shortbox">
<input type="hidden" id="indcatr" value="<%=indcatr%>">
<input type="hidden" id="hexNum" value="<%=hexNum%>">
<input type="hidden" id="base" value="<%=base%>">
</span>
</form>
</body>
</html>