<%-- 
    Document   : Adder
    Created on : Oct 12, 2015, 5:03:24 PM
    Author     : irene
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>ADDER</title>
<link rel="stylesheet" href="Adder.css" type="text/css">
<script src="Multiplier.js"></script>
<script src="Adder.js"></script>
<script src="dragger.js"></script>
</head>
<body>
   
<%  // clicking on decimal points in problems that don't have decimal points
    // gives error fixit
    //System.out.println("*****************************************************");
    //System.out.println("starting addition page");
    //System.out.println("*****************************************************");
    final int SZ2_MX = 5; // maximum answer size
    final int maxOps = 7;
    final double NEXP = 2.6; // used to generate # of digits 
    final double DEXP = 1.4; // used to generate digits themselves or # operands
    boolean noCarriesCk = true;
    boolean carriesCk = false;
    boolean moreThn2Ck = false;
    boolean fxDecPtCk = false;
    boolean varDecPtCk = false;
    String isNoCarries = "checked";
    String isCarries = "";
    String isMoreThn2 = "";
    String isFixedDp = "";
    String isVarDp = "";
    String tmp = "";      // temporary storage for newly gotten 
                          // request parameter
    String whatlvl = "";
    double justLessThn1 = 1 - 1/Double.MAX_VALUE;
    
    if(( tmp = request.getParameter("difflvl")) != null ) {
        noCarriesCk = false;
        isNoCarries = "";
        carriesCk = false;
        isCarries = "";
        moreThn2Ck = false;
        isMoreThn2 = "";
        fxDecPtCk = false;
        isFixedDp = "";
        varDecPtCk = false;
        isVarDp = "";
        whatlvl = tmp;
        if( whatlvl.equals("No Carries") ) {
            noCarriesCk = true;
            isNoCarries = "checked";
        } else if( whatlvl.equals("Carries")) {
            carriesCk = true;
            isCarries = "checked";
        } else if( whatlvl.equals("More Than 2 Operands")) {
            moreThn2Ck = true;
            isMoreThn2 = "checked";
        } else if( whatlvl.equals("Fixed Decimal Point")) {
            fxDecPtCk = true;
            isFixedDp = "checked";
        } else if( whatlvl.equals("Variable Decimal Point")) {
            varDecPtCk = true;
            isVarDp = "checked";
        }
    }
    
    int numOps = 2;
    if( moreThn2Ck || varDecPtCk ) {
        // 2 - 4 operands if maxOps = 4
        // more likely to be 4
        numOps = 2 + (int)((maxOps-1)*(1 - Math.pow(Math.random(), DEXP)));     
    } 
    int colspan = 2*(SZ2_MX + 1);
    int[][] op;           // operand's first index is what operand (top/bottom)
                          // second index is what digit of that operand
    
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
  
    
    int sum[];
    sum = new int[SZ2_MX+1];
    int digMax = 10;
    
    for( int idx = 0; idx < numOps; idx++ ) {
        opDp[idx] = (int)((maxDp+1)*Math.random());
        //System.out.println("opDp[" + idx + "] = " + opDp[idx]);
        if( opDp[idx] > ansDp ) {
            ansDp = opDp[idx];
        }
        numDig[idx] = 0;
    }
    
    op = new int[maxOps][SZ2_MX+1];
    int[] ans;    // final answer   
    int[] carry;   // additive carry string 
    carry = new int[SZ2_MX+1];
    ans = new int[SZ2_MX+1];
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
        sum[idx] = 0;
        carry[idx] = 0;
        ans[idx] = 0;
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
    
    //generate number of digits first, will be neeeded to prevent carries
    /*
    for( jdx = numOps-1; jdx >= 0; jdx-- ) {
        // limit the size so it fits the table
        int maxDig = SZ2_MX - ansDp + opDp[jdx];
        // more likely to have more digits than less
        numDig[jdx] = (int)((maxDig-1)*(justLessThn1 - Math.pow(Math.random(), NEXP))) + 2;
    
            */
    int finalAns = 0;
    double maxAnsPlus1 = Math.pow(10, SZ2_MX+1); // - 1;
    double powOfTen = 0;
    
    finalAns = (int)(maxAnsPlus1*Math.random());
    int maxAnDig = 0;
    if( finalAns > 0 ) {
        maxAnDig = 1 + (int)Math.log10(finalAns );
    }
    
    String isLinedUp = "true";

    if( noCarriesCk ) {
        int ten2pow = (int)Math.pow(10,maxAnDig-1);
        int tmp3 = finalAns;
        operand[0] = 0;
        for( kdx = maxAnDig-1; kdx >= 0; --kdx ) { 
            ans[kdx] = tmp3/ten2pow;
            // bottom operand has to be at least one digit smaller than width of
            // table to allow for "+" sign
            if( kdx < SZ2_MX ) {
                op[0][kdx] = (int)((1+ans[kdx])*Math.random());
            }
            tmp3 = tmp3 - ten2pow*ans[kdx];
            //System.out.println("tmp3 = " + tmp3 + " ans[" + kdx + "] = " + ans[kdx] + " op[0][" + kdx + "] = " + op[0][kdx]);
            ten2pow = ten2pow/10;
            operand[0] = operand[0] + (int)Math.pow(10,kdx)*op[0][kdx];
        }       
           
        numDig[0] = operand[0] == 0 ? 1 : 1 + (int)Math.log10(operand[0]);
        operand[1] = 0;
        numDig[1] = maxAnDig;
        tmp3 = finalAns;
        ten2pow = (int)Math.pow(10,maxAnDig-1);
        //System.out.println("before loop ten2pow = " + ten2pow + " tmp3 = " + tmp3);
        numDig[1] = maxAnDig;
        for( kdx = numDig[1]-1; kdx >= 0; --kdx ) {
            op[1][kdx] = tmp3/ten2pow;
            tmp3 = tmp3 - ten2pow*op[1][kdx];
            if( kdx < numDig[0] ) {
                op[1][kdx] = op[1][kdx] - op[0][kdx];
                if( kdx == numDig[1] - 1 && op[1][kdx] == 0 ) {
                    numDig[1] = numDig[1] - 1;
                }
            }
            //System.out.println("tmp3 = " + tmp3 + " op[1][" + kdx + " ] = " + op[1][kdx] );
            ten2pow = ten2pow/10;
            operand[1] = operand[1] + (int)Math.pow(10,kdx)*op[1][kdx];
        }
        //System.out.println("operand[0] = " + operand[0] + " operand[1] = " + operand[1]);
    
    } else {
        int remaining = finalAns;
        for( jdx = 0; jdx < numOps; ++jdx ) {
            int ten2pow = (int)Math.pow(10,ansDp - opDp[jdx]);
            if( jdx < numOps - 1 && remaining > ten2pow ) {
                int maxOp = remaining/ten2pow;
                int widthLimit = (int)(Math.pow(10,SZ2_MX-ansDp+opDp[0]) - 1);
                if( jdx == 0 && maxOp > widthLimit ) {
                    maxOp = widthLimit;
                }
                // mostly big
                operand[jdx] = 
                    (new Double((maxOp)*(1 - Math.pow(Math.random(),NEXP)))).intValue();
            } else {
                numOps = jdx + 1;
                operand[jdx] = remaining;
                opDp[jdx] = ansDp; 
                // has to be recalculated since opDp may have changed
                ten2pow = (int)Math.pow(10,ansDp - opDp[jdx]);
            }
            
            remaining = remaining - ten2pow*operand[jdx];
            numDig[jdx] = operand[jdx] == 0 ? 1 : 1 + (int)Math.log10(operand[jdx]);
            int tmp3 = operand[jdx];
            ten2pow = (int)Math.pow(10, numDig[jdx]-1);
            //System.out.println("finalAns = " + finalAns + " ansDp =  " + ansDp + " operand[" + jdx + "] = " + operand[jdx] + " opDp[" + jdx + "] = " + opDp[jdx] + " numDig[" + jdx + "] = " + numDig[jdx] + " remaining = " + remaining);
            for( kdx = SZ2_MX; kdx >= 0; --kdx ) {
                int whatDig = kdx - ansDp + opDp[jdx];
                if( 0 <= whatDig && whatDig < numDig[jdx] ) {
                    op[jdx][whatDig] = tmp3/ten2pow;    
                    sum[kdx] += op[jdx][whatDig];
                    //System.out.println("sum[" + kdx + "] = " + sum[kdx]);
                    tmp3 = tmp3 - ten2pow*op[jdx][whatDig];
                    ten2pow = ten2pow/10;
                }
            }
            if( varDecPtCk && jdx > 0 && opDp[jdx] != opDp[jdx-1]) {
                isLinedUp = "false";
            }
        }

        for( kdx = 0; kdx < SZ2_MX + 1; ++kdx ) {
            ans[kdx] = sum[kdx];
            if( kdx > 0 ) {
                ans[kdx] += carry[kdx-1];
                //System.out.println("plus previous carry = " + carry[kdx]);
            }
            carry[kdx] = ans[kdx]/10;
            ans[kdx] = ans[kdx] - 10*carry[kdx];
            //System.out.println("final carry[" + kdx + "] = " + carry[kdx]);
        }
    }
    

    //maxAnDig += ansDp;
    //System.out.print("final answer is " + finalAns + " digits in answer is " + maxAnDig);

    int nacarries = 0;

    int spacesb4Op[] = new int[maxOps];
    // all the decimal points need to be lined up
    for( int idx = numOps-1; idx >= 0; idx-- ) {
        if( numDig[idx] > opDp[idx] ) {
            // digits in front of the decimal point
            int digsInFront =  numDig[idx] - opDp[idx];
            //System.out.println("idx = " + idx + " digsInFront = " + digsInFront );
            spacesb4Op[idx] = SZ2_MX + 1 - ansDp - digsInFront;
        } else {
            spacesb4Op[idx] = SZ2_MX - ansDp;
        }
        if( !noCarriesCk ) {
            int trailingZeros = ansDp - opDp[idx];
            int possCarries = numDig[idx] - 1;
            if( trailingZeros > 0 ) {
                possCarries += trailingZeros;
            }
            if( possCarries > nacarries ) {
                nacarries = possCarries; 
            }
        }
        //System.out.println("numDig[" + idx + "] = " + numDig[idx] + " opDp[" + idx + "] = " + opDp[idx] + " spacesb4Op[" + idx + "] = " + spacesb4Op[idx]);
    }
    //int spacesb4btmOp = SZ2_MX - numDig[0]; // "+" takes up one space
    int spacesb4ca = SZ2_MX - nacarries;
    boolean showCarriesCk = true;
    String isShowCarries = "checked";

    if( request.getParameter("started") == null ) {
        //System.out.println("just started");
        showCarriesCk = true;
        isShowCarries = "checked";
    } else {
        //System.out.println("starting again parameter = >" + request.getParameter("started") + "<" );
        String carrylist[] = request.getParameterValues("showcarries");
        if( carrylist  == null ) {
            showCarriesCk = false;
            isShowCarries = "";
        } else {
            showCarriesCk = true;
            isShowCarries = "checked";
        }
    }
    //System.out.println("showCarriesCk = " + showCarriesCk + " isShowCarries = " + isShowCarries);
    int ar = nacarries;  // first additive carry 
    int qu = ar + maxAnDig - 1; // lsb of final answer box

    for( int idx = 0; idx < maxAnDig; idx++ ) {
        if( showCarriesCk && nacarries > 0 && idx > 0 && ar >= idx &&
                carry[idx-1] > 0 ) {
            whatBx[ldx] = ar - idx; // additive carry 
            //System.out.println("additive carry idx = " + idx + " whatBx[" + ldx + "] = " + whatBx[ldx]);
            ldx++;
        }
        whatBx[ldx] = qu - idx; // final answer boxes
        //System.out.println(" final answer idx = " + idx + " whatBx[" + ldx + "] = " + whatBx[ldx]);
        ldx++;
    }
    whatBx[ldx] = qu + 1;

    maxBx = ldx; %>
<form id="th-id2" method="get" action="Adder.jsp">
<table>
<tr>
<td>
<div class="d1" >

<div class="d2">
<table class="tbl">
<tr><th id="F1" colspan="<%=colspan%>">Addition Problem</th></tr>
<%  if( nacarries > 0 ) { %>
    <tr>
<%      String catype = showCarriesCk? "text" : "hidden";
        for( int idx = 0; idx <= SZ2_MX; idx++ ) {
            if( idx >= spacesb4ca && idx < nacarries + spacesb4ca ) { 
                int col = SZ2_MX - 1 - idx;
                String cid = "ca" + col; 
                if( col < 0 || col >= SZ2_MX ) {
                     System.out.println("ca col = " + col + "being reduced to 0");
                     col = 0;
                } %>
                <td class="t2"><input type="<%=catype%>" id="<%=cid%>" class="c2" 
                     
                     onkeyup="justAddCarry(<%=col%>)"></td>
<%          } else { %>
                <td class="t2"></td>
<%          } %>
        <td class="t1"></td>
<%      } %>
    </tr>
<%  } %>
<%  if( numOps > 6 ) { %>
<tr class="oprand">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
            String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
            <td class="t2"><%=possDp%></td>
<%          if( idx < spacesb4Op[6] ) { %>
                <td class="t1"></td>
<%          } else { 
                int ocol = SZ2_MX - idx;
                String name = "op6" + ocol;
                int col = ocol + opDp[6] - ansDp;
                switch(col) {
                    case 0: %>
                        <td class="t1" name="<%=name%>"><%=op[6][0]%></td>
                        <% break;
                    case 1: %>
                        <td class="t1" name="<%=name%>"><%=op[6][1]%></td>
                        <% break;
                    case 2: %>
                        <td class="t1" name="<%=name%>"><%=op[6][2]%></td>
                        <% break;
                    case 3: %>
                        <td class="t1" name="<%=name%>"><%=op[6][3]%></td>
                        <% break;
                    case 4: %>
                        <td class="t1" name="<%=name%>"><%=op[6][4]%></td>
                        <% break;
                    case 5: %>
                        <td class="t1" name="<%=name%>"><%=op[6][5]%></td>
                        <% break;
                    default: 
                        name = "ze6" + ocol; %>
                        <td class="t1" name="<%=name%>">0</td>
                        <% break;
                }       
            }
        } %>
    
</tr>
<%  }    %>
<%  if( numOps > 5 ) { %>
<tr class="oprand">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
            String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
            <td class="t2"><%=possDp%></td>
<%          if( idx < spacesb4Op[5] ) { %>
                <td class="t1"></td>
<%          } else { 
                int ocol = SZ2_MX - idx;
                String name = "op5" + ocol;
                int col = ocol + opDp[5] - ansDp;
                switch(col) {
                    case 0: %>
                        <td class="t1" name="<%=name%>"><%=op[5][0]%></td>
                        <% break;
                    case 1: %>
                        <td class="t1" name="<%=name%>"><%=op[5][1]%></td>
                        <% break;
                    case 2: %>
                        <td class="t1" name="<%=name%>"><%=op[5][2]%></td>
                        <% break;
                    case 3: %>
                        <td class="t1" name="<%=name%>"><%=op[5][3]%></td>
                        <% break;
                    case 4: %>
                        <td class="t1" name="<%=name%>"><%=op[5][4]%></td>
                        <% break;
                    case 5: %>
                        <td class="t1" name="<%=name%>"><%=op[5][5]%></td>
                        <% break;
                    default:   
                        name = "ze5" + ocol; %>
                        <td class="t1" name="<%=name%>">0</td>
                        <% break;
                }       
            }
        } %>
    
</tr>
<%  }    %>
<%  if( numOps > 4 ) { %>
<tr class="oprand">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
            String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
            <td class="t2"><%=possDp%></td>
<%          if( idx < spacesb4Op[4] ) { %>
                <td class="t1"></td>
<%          } else { 
                int ocol = SZ2_MX - idx;
                String name = "op4" + ocol;
                int col = ocol + opDp[4] - ansDp;
                switch(col) {
                    case 0: %>
                        <td class="t1" name="<%=name%>"><%=op[4][0]%></td>
                        <% break;
                    case 1: %>
                        <td class="t1" name="<%=name%>"><%=op[4][1]%></td>
                        <% break;
                    case 2: %>
                        <td class="t1" name="<%=name%>"><%=op[4][2]%></td>
                        <% break;
                    case 3: %>
                        <td class="t1" name="<%=name%>"><%=op[4][3]%></td>
                        <% break;
                    case 4: %>
                        <td class="t1" name="<%=name%>"><%=op[4][4]%></td>
                        <% break;
                    case 5: %>
                        <td class="t1" name="<%=name%>"><%=op[4][5]%></td>
                        <% break;
                    default:
                        name = "ze4" + ocol; %>
                        <td class="t1" name="<%=name%>">0</td>
                        <% break;
                }       
            }
        } %>
    
</tr>
<%  }    %>
<%  if( numOps > 3 ) { %>
<tr class="oprand">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
            String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
            <td class="t2"><%=possDp%></td>
<%          if( idx < spacesb4Op[3] ) { %>
                <td class="t1"></td>
<%          } else { 
                //int col = numDig[3] - idx + spacesb4Op[3] - 1;
                int ocol = SZ2_MX - idx;
                String name = "op3" + ocol;
                int col = ocol + opDp[3] - ansDp;
                switch(col) {
                    case 0: %>
                        <td class="t1" name="<%=name%>"><%=op[3][0]%></td>
                        <% break;
                    case 1: %>
                        <td class="t1" name="<%=name%>"><%=op[3][1]%></td>
                        <% break;
                    case 2: %>
                        <td class="t1" name="<%=name%>"><%=op[3][2]%></td>
                        <% break;
                    case 3: %>
                        <td class="t1" name="<%=name%>"><%=op[3][3]%></td>
                        <% break;
                    case 4: %>
                        <td class="t1" name="<%=name%>"><%=op[3][4]%></td>
                        <% break;
                    case 5: %>
                        <td class="t1" name="<%=name%>"><%=op[3][5]%></td>
                        <% break;
                    default: 
                        name = "ze3" + ocol; %>
                        <td class="t1" name="<%=name%>">0</td>
                        <% break;
                }       
            }
        } %>
    
</tr>
<%  }    %>
<%  if( numOps > 2 ) { %>
<tr class="oprand">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
            String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
            <td class="t2"><%=possDp%></td>
<%          if( idx < spacesb4Op[2] ) { %>
                <td class="t1"></td>
<%          } else { 
                //int col = numDig[2] - idx + spacesb4Op[2] - 1;
                int ocol = SZ2_MX - idx;
                String name = "op2" + ocol;
                int col = ocol + opDp[2] - ansDp;
                switch(col) {
                    case 0: %>
                        <td class="t1" name="<%=name%>"><%=op[2][0]%></td>
                        <% break;
                    case 1: %>
                        <td class="t1" name="<%=name%>"><%=op[2][1]%></td>
                        <% break;
                    case 2: %>
                        <td class="t1" name="<%=name%>"><%=op[2][2]%></td>
                        <% break;
                    case 3: %>
                        <td class="t1" name="<%=name%>"><%=op[2][3]%></td>
                        <% break;
                    case 4: %>
                        <td class="t1" name="<%=name%>"><%=op[2][4]%></td>
                        <% break;
                    case 5: %>
                        <td class="t1" name="<%=name%>"><%=op[2][5]%></td>
                        <% break;
                    default: 
                        name = "ze2" + ocol; %>
                        <td class="t1" name="<%=name%>">0</td>
                        <% break;
                }       
            }
        } %>
</tr>
<%  }    %>
<tr class="oprand">
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
        String possDp = (SZ2_MX - idx + 1 == ansDp && ansDp > 0 )? ".":""; %>
        <td class="t2"><%=possDp%></td>
<%      if( idx < spacesb4Op[1] ) { %>
            <td class="t1"></td>
<%      } else { 
                int ocol = SZ2_MX - idx;
                String name = "op1" + ocol;
                int col = ocol + opDp[1] - ansDp;
            switch(col) {
                case 0: %>
                    <td class="t1" name="<%=name%>"><%=op[1][0]%></td>
                    <% break;
                case 1: %>
                    <td class="t1" name="<%=name%>"><%=op[1][1]%></td>
                    <% break;
                case 2: %>
                    <td class="t1" name="<%=name%>"><%=op[1][2]%></td>
                    <% break;
                case 3: %>
                    <td class="t1" name="<%=name%>"><%=op[1][3]%></td>
                    <% break;
                case 4: %>
                    <td class="t1" name="<%=name%>"><%=op[1][4]%></td>
                    <% break;
                case 5: %>
                    <td class="t1" name="<%=name%>"><%=op[1][5]%></td>
                    <% break;
                default:
                    name = "ze1" + ocol; %>
                    <td class="t1" name="<%=name%>">0</td>
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
            <td class="t1"> + </td>
<%      } else {
                int ocol = SZ2_MX - idx;
                String name = "op0" + ocol;
                int col = ocol + opDp[0] - ansDp;
            switch(col) {
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
                case 5:  %>
                    <td class="t1" name="<%=name%>"><%=op[0][5]%></td>
                    <% break;
                default:
                    name = "ze0" + ocol; %>
                    <td class="t1" name="<%=name%>">0</td>
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
            String aid = "an" + col;  %>
            <td class="t1"><input type="text" id="<%=aid%>" class="a1" size="1" 
            
            onkeyup="justAdd(<%=col%>)"></td>
<%      } else { 
            String possZero; 
            if( ansDp >= maxAnDig && idx > SZ2_MX - ansDp - 1 ) {
                possZero = "yesThis";
            } else {
                possZero = "notThis";
            } %>
            <td class="t1"><label class="b1" name="<%=possZero%>">0</label></td>
<%      } 
    }  %>  
    </tr>
</table>
</div>
</div>
</td>
<td>

<% if( isLinedUp == "false" ) { %>
<table>
<%  for( int i = 0; i < numOps; i++ ) { %>
        <tr class="DragBox">
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="t2">_</td><td class="t1" name="bob">o</td>
<%      }   %>
        </tr>
<%  }   %>
</table>
<% } %>
<div class="d3">
<!--this is where error messages get displayed//-->
<label id="msg"></label>
</div>
<input type="hidden" id="whatbox" value="<%=whatBx[bdx]%>" class="shortbox"> 
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
    <td><input type="text" id="errs" name="errs" value="<%=errs%>"
               class="blackbox" disabled></td>
</tr>
<tr>
    <td>
    <button type="reset" value="Reset" onclick="startAgain()" >
        Next Problem
    </button>
    </td>
    <td></td>
</tr>
</table>
</div>



                   
<input type="hidden" name="started">
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="ansDp" value="<%=ansDp%>" class="shortbox">
<% for( int idx = 0; idx <= maxBx; idx++ ) { %>
    <input type="hidden" name="nextbox" value="<%=whatBx[idx]%>" class="shortbox">
<% } %>
<input type="hidden" id="bdx" value="<%=bdx%>" class="shortbox">
<input type="hidden" id="lastbox" value="<%=maxBx%>" class="shortbox">
<input type="hidden" id="linedUp" value="<%=isLinedUp%>" class="shortbox">
<table>
<%  String exType = "hidden";
    if( nacarries > 0 ) { %>
    <tr>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {
            if( idx >= spacesb4ca && idx < nacarries + spacesb4ca ) { 
                int col = SZ2_MX - 1 - idx;
                String xid = "exCa" + col; %>
                <td class="t2">
                <input type="<%=exType%>" id="<%=xid%>" value="<%=carry[col]%>" class="c2">
                </td>
<%          } else { %>
                <td class="t2"></td>
<%          } %>
        <td class="t1"></td>
<%      } %>
    </tr>
<%  } %>
 <tr>
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
        <td class="t2"></td>
<%      if( idx >= spacesb4an ) { 
            int col = SZ2_MX - idx;
            String xid = "exAn" + col;  %>
            <td class="t1">
            <input type="<%=exType%>" id="<%=xid%>" value="<%=ans[col]%>" class="a1">
            </td>
<%      } else { %>
            <td class="t1"></td>
<%      }
    }  %>  
    </tr>
</table>
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
    <div class="d3">
    <table>
    <tr>
        <td><input type="checkbox" value="Show Carries" name="showcarries" 
                   <%=isShowCarries%> onclick="zeroCounts()">
        </td>
        <td><label>Show Carries</label></td>
    </tr>
    </table>
</div>
<div class="d4">  
<table>
    <tr><th colspan="1">Highest Difficulty Level</th></tr>
    <tr><td>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="No Carries" 
            <%=isNoCarries%> onclick="zeroCounts()">
        <label>No Carries</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Carries"
            <%=isCarries%> onclick="zeroCounts()">
        <label>Carries</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="More Than 2 Operands" 
            <%=isMoreThn2%> onclick="zeroCounts()"> 
        <label>More Than 2 Operands</label>
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
    </td></tr>
</table>
</form>
</body>
</html>
