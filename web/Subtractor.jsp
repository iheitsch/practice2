<%-- 
    Document   : Subtractor
    Created on : Nov 13, 2015, 3:04:15 PM
    Author     : irene
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>SUBTRACTER</title>
<link rel="stylesheet" href="Subtractor.css" type="text/css">
<script src="Multiplier.js"></script>
<script src="Subtractor.js"></script>
<script src="dragger.js"></script>
</head>
<body>

<%  // 9.3 - 0.014 give wrong error message when you put xx96 for an answer fixit
    final int SZ2_MX = 5; // maximum answer size
    final int maxOps = 2;
    final double NEXP = 2.6; // used to generate # of digits 
    final double DEXP = 1.4; // used to generate digits themselves or # operands
    boolean noBorrowsCk = true;
    boolean borrowsCk = false;
    boolean fxDecPtCk = false;
    boolean varDecPtCk = false;
    String isNoBorrows = "checked";
    String isBorrows = "";
    String isFixedDp = "";
    String isVarDp = "";
    String tmp = "";      // temporary storage for newly gotten 
                          // request parameter
    String whatlvl = "";
    double justLessThn1 = 1 - 1/Double.MAX_VALUE;
    
    if(( tmp = request.getParameter("difflvl")) != null ) {
        noBorrowsCk = false;
        isNoBorrows = "";
        borrowsCk = false;
        isBorrows = "";
        fxDecPtCk = false;
        isFixedDp = "";
        varDecPtCk = false;
        isVarDp = "";  
        whatlvl = tmp;
        if( whatlvl.equals("No Borrows") ) {
            noBorrowsCk = true;
            isNoBorrows = "checked";
        } else if( whatlvl.equals("Borrows")) {
            borrowsCk = true;
            isBorrows = "checked";
        } else if( whatlvl.equals("Fixed Decimal Point")) {
            fxDecPtCk = true;
            isFixedDp = "checked";
        } else if( whatlvl.equals("Variable Decimal Point")) {
            varDecPtCk = true;
            isVarDp = "checked";   
        }
    }
    
    int numOps = 2;
    int colspan = 2*(SZ2_MX + 1);
    int[][] op;           // operand's first index is what operand (top/bottom)
                          // second index is what digit of that operand
    int [] borrows;
    int [] carries;
    
    int operand[] = new int[maxOps];
    for( int idx = 0; idx < maxOps; idx++ ) {
        operand[idx] = 0;
    }

    int opDp[] = new int[maxOps]; // operand decimal point positions
    int maxDp = 0; // max decimal point 
    if( fxDecPtCk || varDecPtCk ) {
        maxDp = (int)(SZ2_MX*Math.random());
    }
    int ansDp = 0;
    int numDig[] = new int[maxOps]; // how many digits do operands have
    String isLinedUp = "true";
    
    int digMax = 10;
    int minDp = 0;
    
    for( int idx = 1; idx >= 0; idx-- ) {
        opDp[idx] = minDp + (int)((maxDp+1-minDp)*(justLessThn1 - Math.pow(Math.random(), DEXP)));
        minDp = opDp[idx]; // lower operand needs to be smaller than upper
                           // so put more digits to the right of the decimal pt
        if( varDecPtCk && idx == 0 && opDp[0] != opDp[1]) {
            isLinedUp = "false";
        }
        if( opDp[idx] > ansDp ) {
            ansDp = opDp[idx];
        }
        numDig[idx] = 0;
        //System.out.println("opDp[" + idx + "] = " + opDp[idx]);
    }
    
    op = new int[maxOps][SZ2_MX+1];
    borrows = new int[SZ2_MX+1];
    carries = new int[SZ2_MX+1];
    //String[] ans;   // final answer string   
    //String[] cas;   // additive carry string 
    //cas = new String[SZ2_MX+1];
    //ans = new String[SZ2_MX+1];
    int jdx;
    int kdx;
    int ldx = 0;
    
    int bdx = 0;            // box index used to track what box is selected
    
    int[] whatBx;
    whatBx = new int[maxOps*SZ2_MX];
    int maxBx = 20;
    
    for( int idx = 0; idx <= SZ2_MX; idx++ ) {
        for( int hdx = 0; hdx < maxOps; hdx++ ) {
            op[hdx][idx] = 0;
        }
        //cas[idx] = "";
        //ans[idx] = "";
        borrows[idx] = 0;
        carries[idx] = 0;
    }
    
    String numAttmptdV = "0";
    String numWoErr = "0";
    String consWoErr = "0";
    String corrPerHr = "0";
    String strtTime = String.valueOf(System.currentTimeMillis());
    String errs = "0";
    
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
    
    // generate number of digits first
    // limit the size so it fits the table
    int maxDig = SZ2_MX - ansDp + opDp[1];
    // more likely to have more digits than less
    numDig[1] = (int)((maxDig-1)*(justLessThn1 - Math.pow(Math.random(), NEXP))) + 2;
    int minDig = 0;
    if( numDig[1] > 2 ) {
        minDig = numDig[1] - 3;
    }
    numDig[0] = (int)((numDig[1]-minDig+1)*(justLessThn1 - Math.pow(Math.random(), NEXP))) + minDig;
    
    for( jdx = numOps-1; jdx >= 0; jdx-- ) {
        for (kdx = 0; kdx < numDig[jdx]-1; kdx++){
            int digMin = 0;
            if( noBorrowsCk ) {
                if( jdx == 0 ) {
                    digMax = op[1][kdx] + 1; // digMax is actually 1 greater than
                                             // maximum allowed digit value
                } else { // jdx == 1: calculating top operand digits
                    if( kdx == numDig[0]-1) {
                        digMin = 1; // has to be at least 1 because 
                    }               // the bottom operand digit can't be 0
                }
            }
            op[jdx][kdx] = digMin + (int)((digMax - digMin)*(justLessThn1 - Math.pow(Math.random(), DEXP)));
            operand[jdx] = operand[jdx] + op[jdx][kdx]*(int)(Math.pow(10.,(double)kdx));
        }
        // if borrows are not allowed or if there is no next digit to borrow from
        if( jdx == 0 && (noBorrowsCk || numDig[0] == numDig[1] ) ) {
            digMax = op[1][kdx] + 1;
        }
        // msb cannot be 0
        op[jdx][kdx] = 1 + (int)((digMax-1)*(justLessThn1 - Math.pow(Math.random(), DEXP)));
        operand[jdx] = operand[jdx] + op[jdx][kdx]*(int)(Math.pow(10.,(double)kdx));
    }
    
    if( operand[1] <= operand[0] ) {
        int lastDig = numDig[0] - 1;
        operand[0] -= (int)(Math.pow(10, lastDig)*op[0][lastDig]);
        operand[0] += (int)(Math.pow(10, lastDig)*(op[0][lastDig]-1));
        op[0][lastDig] = op[0][lastDig] - 1;
        if( op[0][lastDig] == 0 ) {
            numDig[0] -= 1;
        }
    } 

    int dec = 0;
    int nacarries = 0;
    
    int diff = opDp[1] - opDp[0];
    int kdxmax = diff < 0? numDig[1] - diff: numDig[1];
    for (kdx = 0; kdx < kdxmax; kdx++) {
        boolean needsCarry = true;
        int oneidx = kdx+diff;
        if( (0 <= oneidx) && (oneidx < SZ2_MX) ) {
            //System.out.println("op[1][" + oneidx + "] = " + op[1][oneidx] + " dec = " + dec + " op[0][" + kdx + "] = " + op[0][kdx]);
            if( op[0][kdx] <= op[1][kdx+diff] - dec ) {
                needsCarry = false;
            }
        } else if( op[0][kdx] <= 0 - dec ) {
            //System.out.println("zero column, dec = " + dec + " op[0][" + kdx + "] = " + op[0][kdx]);
            needsCarry = false;
        }
        if( needsCarry ) {
            borrows[kdx+1] = (0 < oneidx+1 && oneidx+1 < SZ2_MX)? op[1][oneidx+1] - 1: -1;
            carries[kdx] = 1;
            dec = 1;
            nacarries += 1;          
        } else {
            dec = 0;
        }
        //System.out.println("carries[" + kdx + "] = " + carries[kdx]);
    }

    double maxAns = operand[1]/Math.pow(10,opDp[1]) - operand[0]/Math.pow(10,opDp[0]);
    
    int maxAnDig = 0;
    if( maxAns > 0 ) {
        maxAnDig = 1 + (int)Math.log10(maxAns );
    }
    maxAnDig += ansDp;

    // all the decimal points need to be lined up
    int spacesb4Op[] = new int[maxOps];
    for( int idx = numOps-1; idx >= 0; idx-- ) {
        if( numDig[idx] > opDp[idx] ) {
            // digits in front of the decimal point
            int digsInFront =  numDig[idx] - opDp[idx];
            //System.out.println("idx = " + idx + " digsInFront = " + digsInFront );
            spacesb4Op[idx] = SZ2_MX + 1 - ansDp - digsInFront;
        } else {
            spacesb4Op[idx] = SZ2_MX - ansDp;
        }
    } 

    int ar = 2*nacarries;  // first additive carry 
    int qu = ar + maxAnDig - 1; // lsb of final answer box

    for( int idx = 0; idx < maxAnDig; idx++ ) {
        whatBx[ldx] = qu - idx; // final answer boxes
        ldx++;
    }
    whatBx[ldx] = qu + 1;

    maxBx = ldx; %>
<form id="th-id2" method="get" action="Subtractor.jsp">
<table>
<tr>
<td>
<div class="d1" >

<div class="d2">
<table class="tbl">
<tr><th id="F1" colspan="<%=colspan%>">Subtraction Problem</th></tr>
<%  if( nacarries > 0 ) { %>
    <tr>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {
            int col = SZ2_MX - idx;
            if( carries[col] != 0 ) { 
                String name = "ca" + col; 
                if( col < 0 || col >= SZ2_MX ) {
                     System.out.println("ca col = " + col + "being reduced to 0");
                     col = 0;
                } %>
                <td class="t2">
                    <input type="text" name="<%=name%>" class="f2" 
                    onkeyup="checkBorrow(<%=col%>)"
                    onclick="promptBorrow(<%=col%>)">
                </td>
<%          } else { %>
                <td class="t2"></td>
<%          } 
            if( col > 0 && carries[col-1] != 0 ) { 
                String name = "bo" + col; 
                if( col < 0 || col > SZ2_MX ) {
                     System.out.println("bo col = " + col + "being reduced to 0");
                     col = 0;
                } %>
                <td class="t1">
                    <input type="text" name="<%=name%>" class="f1"
                           onkeyup="checkNewVal(<%=col%>)">
                </td>
<%          } else { %>
                <td class="t1"></td>
<%          } 
        } %>
    </tr>
<%  } %>
<tr class="oprand">
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
        String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
        <td class="t2"><%=possDp%></td>
<%      if( idx < spacesb4Op[1] ) { %>
            <td class="t1"></td>
<%      } else { 
            //int col = numDig[1] - idx + spacesb4Op[1] - 1;
            int col = SZ2_MX - idx;
            String name = "op1" + col;
            //System.out.println("col = " + col + " opDp[1] = " + opDp[1] + " ansDp = " + ansDp);
            int sel = col + opDp[1] - ansDp;
            switch(sel) {
                case 0: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][0]%>
                    </td>
                    <% break;
                case 1: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][1]%>
                    </td>
                    <% break;
                case 2: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][2]%>
                    </td>
                    <% break;
                case 3: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][3]%>
                    </td>
                    <% break;
                case 4: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][4]%>
                    </td>
                    <% break;
                case 5: %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        <%=op[1][5]%>
                    </td>
                    <% break;
                default: name = "ze1" + col; %>
                    <td class="t1" name="<%=name%>" onclick="promptBorrow(<%=col%>)">
                        0
                    </td>
                    <% break;
            }       
        }
    } %>
</tr>

<tr class="oprand">
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) { 
        String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":"";
%>
        <td class="t2"><%=possDp%></td>
<%      if( idx < spacesb4Op[0] - 1 ) { %>            
            <td class="t1"></td>
<%      } else if ( idx == spacesb4Op[0] - 1 ){ %>
            <td class="t1"> - </td>
<%      } else {
            //int col = numDig[0] - idx + spacesb4Op[0]; 
            int col = SZ2_MX - idx;
            String name = "op0" + col;
            int sel = col + opDp[0] - ansDp;
            switch(sel) {
                case 0: %>
                    <td class="t1" name="<%=name%>"><%=op[0][0]%></td>
                    <% break; 
                case 1: %>
                    <td class="t1" name="<%=name%>"><%=op[0][1]%></td>
                    <% break;
                case 2:  %>
                    <td class="t1" name="<%=name%>"><%=op[0][2]%></td>
                    <% break;
                case 3: %>
                    <td class="t1" name="<%=name%>"><%=op[0][3]%></td>
                    <% break; 
                case 4: %>
                    <td class="t1" name="<%=name%>"><%=op[0][4]%></td>
                    <% break;
                case 5: %>
                    <td class="t1" name="<%=name%>"><%=op[0][5]%></td>
                    <% break;
                default: %>
                    <td class="t1">0</td>
                    <% break;
            }
        }
    } %>
</tr> 

    <tr><th class="th-id1" colspan="<%=colspan%>"></th></tr>
    <tr>
<%  int spacesb4an = SZ2_MX + 1 - maxAnDig; // entire width of table minus 
                                            // answer spaces
    for( int idx = 0; idx <= SZ2_MX; idx++ ) {        
        String whatFun = fxDecPtCk || varDecPtCk ? "chooseThis( " + idx + " )": null; %>
        <td class="t2">
        <span name="dec-pt" onclick="<%=whatFun%>" class="dp" >_</span>
        </td>
<%      if( idx >= spacesb4an ) { 
            int col = SZ2_MX - idx;
            if( col < 0 || col > SZ2_MX ) {
                System.out.print("reducing ans col from " + col );
                col = 0;
                System.out.println(" to " + col);
            }
            String name = "an" + col;  %>
            <td class="t1"><input type="text" name="<%=name%>" class="a1" size="1" 
            onkeyup="subtract(<%=col%>)"></td>
<%      } else { 
            String possZero; 
            if( ansDp >= maxAnDig && idx > SZ2_MX - ansDp - 1 ) {
                possZero = "yesThis";
            } else {
                possZero = "notThis";
            }%>
            <td class="t1"><label class="b1" name="<%=possZero%>">0</label></td>
<%      } 
    }  %>  
    </tr>
</table>
</div>
</td>
<td>

<% if( isLinedUp == "false" ) { %>
<table>
    <% for( int i = 0; i < numOps; i++ ) { %>
    <tr class="DragBox">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="t2" style="color:purple">_</td><td class="t1" name="bob" style="color:purple">o</td>
<%      }   %>
    </tr>

<%  }   %>
</table>
<% } %>
<input type="hidden" id="whatbox" value="<%=whatBx[bdx]%>" class="shortbox"> 
<div class="d3">
<!--this is where error messages get displayed//-->
<label id="msg"></label>
</div>
<div class="d3">
<label id="dispBo">
<%  if( nacarries > 0) { %>
            Click on a digit to borrow from it
<%  } %>
</label>
</div>



<div class="d5">
<table>
<tr>    
    <td><label>Problems Attempted</label></td>
    <td class="score" >
    <input type="hidden" id="numAttmptd" name="numAttmptdP" value="<%=numAttmptdV%>"
           class="blackbox"><%=numAttmptdV%>
    </td>
</tr>
<tr>
    <td><label>Completed Without Error</label></td>   
    <td class="score" >
    <input type="hidden" id="numWoErr" name="numWoErrP" value="<%=numWoErr%>"
           class="blackbox"><%=numWoErr%>
    </td>
</tr>
<tr>
    <td><label>Consecutive Without Error</label></td>   
    <td class="score" >
    <input type="hidden" id="consWoErr" name="consWoErrP" value="<%=consWoErr%>"
           class="blackbox"><%=consWoErr%>
    </td>
</tr>
<tr>
    <td><label>Correct Per Hour</label></td>   
    <td class="score" >
    <input type="hidden" id="corrPerHr" name="corrPerHrP" value="<%=corrPerHr%>"
           class="blackbox"><%=corrPerHr%>
    </td>
</tr>
<tr>
    <td><label>Errors This Problem</label></td>
    <td>
    <input type="text" id="errs" name="errs" value="<%=errs%>"
               class="blackbox" disabled >
    </td>
</tr>
<tr>
    <td>
    <button type="reset" value="Reset" onclick="startAgain()" >Next Problem</button>
    </td>
    <td>
    </td>
</tr>
</table>
</div>
                   

<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="ansDp" value="<%=ansDp%>" class="shortbox">
<% for( int idx = 0; idx <= maxBx; idx++ ) { %>
    <input type="hidden" name="nextbox" value="<%=whatBx[idx]%>" class="shortbox">
<% } %>
<input type="hidden" id="bdx" value="<%=bdx%>" class="shortbox">
<input type="hidden" id="lastbox" value="<%=maxBx%>" class="shortbox">
<input type="hidden" id="linedUp" value="<%=isLinedUp%>" class="shortbox">




</div>
</td>
</tr>
    <tr>
        <td>
            <div>
                <a href="/" class="ndx">Home</a>
            </div>
            <div>
                <a href="index.html" class="ndx">Back to Practice Index</a>
            </div>
        </td>
        <td>
            <div class="d4">  
            <table>
                <tr><th colspan="1">Highest Difficulty Level</th></tr>
                <tr><td>
                </td></tr>
                <tr><td>
                    <input type="radio" name="difflvl" value="No Borrows" 
                        <%=isNoBorrows%> onclick="zeroCounts()">
                    <label>No Borrows</label>
                </td></tr>
                <tr><td>
                    <input type="radio" name="difflvl" value="Borrows"
                        <%=isBorrows%> onclick="zeroCounts()">
                    <label>Borrows</label>
                </td></tr>
                <tr><td>
                    <input type="radio" name="difflvl" value="Fixed Decimal Point" 
                        <%=isFixedDp%> onclick="zeroCounts()"> 
                    <label>Fixed Decimal Point</label>
                </td></tr>
                <tr><td>
                    <input type="radio" name="difflvl" value="Variable Decimal Point" 
                        <%=isVarDp%> onclick="zeroCounts()">
                    <label>Variable Decimal Point</label>
                </td></tr>
            </table>
            </div>
        </td>
    </tr>
</table>
</form>
</body>
</html>

