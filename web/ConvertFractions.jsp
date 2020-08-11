<%-- 
    Document   : ConvertFractions
    Created on : Aug 3, 2020, 3:36:58 PM
    Author     : khalid
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Convert Fractions</title>
        <link rel="stylesheet" href="ConvertFractions.css" type="text/css">
        <script src="ConvertFractions.js"></script>
</head>
<body>
<% 
    int possbl = 4;
    int indcatr = (int)(StrictMath.random()*possbl);
    String instrs = "blank";
    final int MAXROWS = 4;
    final int MAXCOLS = 3;
    final int MAXDEN = 25;
    int[] num = new int[MAXROWS];
    int[] den = new int[MAXROWS];
    int whol = 1;
    int maxwhol = 5;
    int nrows = 1;
    int ncols = 1;
    int ntwos = 6; // one more than actual max
    int nthrees = 3;
    int nfives = 2;
    String whatOp = "&divide";
    boolean isDivide = true;
    final double EXP = 2.4; //4.4;
    boolean showArros = false;
    if( indcatr < 1 ) {
        instrs = "Simplify this Fraction";
        // come up with the simplified fraction first, then multiply by factors
        int acttwos = (int)(StrictMath.random()*ntwos);
        int actthrees = (int)(StrictMath.random()*nthrees);
        int actfives = (int)(StrictMath.random()*nfives);
        int twofact = (int)(StrictMath.pow(2,acttwos));
        int threefact = (int)(StrictMath.pow(3,actthrees));
        int fivefact = (int)(StrictMath.pow(5,actfives));
        den[0] = twofact*threefact*fivefact;
        //System.out.println("acttwos: " + acttwos + " twofact: " + twofact + " actthrees: " + actthrees + " threefact: " + threefact + " actfives: " + actfives + " fivefact: " + fivefact);
        int numtwos = (new Double((acttwos)*(1 - Math.pow(Math.random(),EXP)))).intValue();
        int numthrees = (new Double((actthrees)*(1 - Math.pow(Math.random(),EXP)))).intValue();
        int numfives = (new Double((actfives)*(1 - Math.pow(Math.random(),EXP)))).intValue();
        twofact = (int)(StrictMath.pow(2,numtwos));
        threefact = (int)(StrictMath.pow(3,numthrees));
        fivefact = (int)(StrictMath.pow(5,numfives));
        num[0] = twofact*threefact*fivefact;
        // how many columns do you really need? max would be # prime factors fixit
        ncols = (int)(acttwos + actthrees + actfives);
    } else if( indcatr < 2 ) {
        instrs = "Convert these Fractions to a Common Denominator and use Arrows to Put in Order, Lowest at the Top";
        showArros = true;
        nrows = 2 + 2; //(int)(StrictMath.random()*(MAXROWS-1));
        int maxcols = 0;
        for( int i = 0; i < nrows; ++i ) {
            int acttwos = (int)(StrictMath.random()*ntwos);
            int actthrees = (int)(StrictMath.random()*nthrees);
            int actfives = (int)(StrictMath.random()*nfives);
            int twofact = (int)(StrictMath.pow(2,acttwos));
            int threefact = (int)(StrictMath.pow(3,actthrees));
            int fivefact = (int)(StrictMath.pow(5,actfives));
            den[i] = twofact*threefact*fivefact;
            num[i] = (new Double((den[i])*(1 - Math.pow(Math.random(),EXP)))).intValue();
            ncols = (int)(acttwos + actthrees + actfives);
            if( ncols > maxcols ) {
                maxcols = ncols;
            }
        }
        ncols = maxcols;
        whatOp = "&times";
        isDivide = false;
    } else if( indcatr < 3 ) {
        // figure out what table is going to look for these before you go any further fixit
        instrs = "Convert this Fraction to a Mixed Number";
        num[0] = 1 + (new Double((MAXDEN)*(1 - Math.pow(Math.random(),EXP)))).intValue();
        den[0] = 1 + (new Double((num[0])*(1 - Math.pow(Math.random(),EXP)))).intValue();
    } else if( indcatr < 4 ) {
        instrs = "Convert this Mixed Number to a Fraction";
        whol = 1 + (int)(StrictMath.random()*maxwhol);
        den[0] = 1 + (new Double((MAXDEN)*(1 - Math.pow(Math.random(),EXP)))).intValue();
        num[0] = 1 + (new Double((den[0])*(1 - Math.pow(Math.random(),EXP)))).intValue();
    }
%>

<table>
<tr>
    <caption><%=instrs%></caption>
</tr>
<%  if( indcatr < 2 ) {
        for( int i = 0; i < nrows; ++i ) { 
            String nclass = "n" + i; 
            String nid = "n" + i + "_0";
            String did = "d" + i + "_0"; %>
        <tr>
<%          if( showArros ) { 
                String upArroId = "u" + i; 
                String dnArroId = "d" + i; %>
    <td>
        <table>
                <tr><td>
                    <i onclick="move()" id="<%=upArroId%>" class="arrow up sym"></i>
                </td></tr>
                <tr><td>
                    <i onclick="move()"  id="<%=dnArroId%>" class="arrow down"></i>
                </td></tr>
            </table>
    </td>
    <%      } %>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[i]%>" class="<%=nclass%>" id="<%=nid%>">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[i]%>" id="<%=did%>">
                </td></tr>
            </table>
        </td>
    <%      String itype = "text";
            String equalSgn = "=";
            String op = whatOp;
            String ntd = "num";
            for( int j = 0, k = 0; j < ncols; ++j ) { 
                k = k + 1;
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; 
                String oid = "o" + i + "_" + k; 
                String eid = "e" + i + "_" + k; %>
    <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
    <%          k = k + 1; 
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; %>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkM( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkM( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
    <%          itype = "hidden";
                ntd = "";
                equalSgn = "";
                op = "";
            }
    %>
        </tr>
    <%  } 
    }  else if( indcatr < 3 ) { %>
    <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="onum">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="oden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="whlprt">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="frcnum">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="frcden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="redprt">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="rednum">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="redden">
                </td></tr>
            </table>
        </td>
    </tr>
    <tr>
        <th colspan="1"></th><th colspan="3" class="bar"></th>
    </tr>
    <tr>
        <td>
            <input onkeyup="checkDen( event )" onkeydown="erase( event )" id="dvsr">
        </td>
        <td class="sym">
            )
        </td>
        <td>
            <input onkeyup="checkNum( event )" onkeydown="erase( event )" id="d0_1">
        </td>
    </tr>
     <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
            <input onkeyup="checkProd( event )" onkeydown="erase( event )" id="prod">
        </td>
    </tr>
    <tr>
        <th colspan="2"></th><th colspan="1" class="bar"></th>
    </tr>
        <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
            <input onkeyup="checkDiff( event )" onkeydown="erase( event )" id="diff">
        </td>
    </tr>
<%  } else { %>
    <tr>
        <td>
            <input disabled="true" value=<%=whol%> id="whlprt">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="onum">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="oden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <table>
                <tr>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum0">  
                    </td>
                    <td class="num">&times</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum1">  
                    </td>
                    <td class="num">+</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum2">  
                    </td>
                </tr>
                <tr><th colspan="5">
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="d0_1">
                </th></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum3">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="frcden4">
                </td></tr>
            </table>
        </td>
    </tr>
<% } %>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <th colspan="2"><button onclick="check()" id="chkBx">Check</button></th>
    </tr>
    </table>
    
<table id="statusTable">
<% for( int i = 0, j = 1; i < 24; i += 2, j += 2 ) {
    String whatId = "statusBox" + i; 
    String whatId2 = "statusBox" + j; %>
    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
<% } %>
</table>
<input type="hidden" id="indcatr" value="<%=indcatr%>">
</body>
</html>
