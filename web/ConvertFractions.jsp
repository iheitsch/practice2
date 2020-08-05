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
    int nrows = 1;
    int ncols = 1;
    int ntwos = 6; // one more than actual max
    int nthrees = 3;
    int nfives = 2;
    String whatOp = "&divide";
    boolean isDivide = true;
    final double EXP = 2.4;
    boolean showArros = false;
    if( indcatr < 1 ) {
        instrs = "Simplify this Fraction";
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
        nrows = 2 + (int)(StrictMath.random()*(MAXROWS-1));
        int maxcols = 0;
        for( int i = 0; i < nrows; ++i ) {
            int acttwos = (int)(StrictMath.random()*ntwos);
            int actthrees = (int)(StrictMath.random()*nthrees);
            int actfives = (int)(StrictMath.random()*nfives);
            int twofact = (int)(StrictMath.pow(2,acttwos));
            int threefact = (int)(StrictMath.pow(3,actthrees));
            int fivefact = (int)(StrictMath.pow(5,actfives));
            den[i] = twofact*threefact*fivefact;
            num[i] = (int)(StrictMath.random()*den[i]);
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
    } else if( indcatr < 4 ) {
        instrs = "Convert this Mixed Number to a Fraction";
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
    <%      if( showArros ) { 
                String upArroId = "u" + i; 
                String dnArroId = "d" + i; %>
    <td>
        <table>
                <tr><td>
                    <i onclick="raise()" id="<%=upArroId%>" class="arrow up"></i>
                </td></tr>
                <tr><td>
                    <i onclick="lower()"  id="<%=dnArroId%>" class="arrow down"></i>
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
            for( int j = 0, k = 0; j < ncols; ++j ) { 
                k = k + 1;
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; 
                String oid = "o" + i + "_" + k; %>
    <td id="<%=oid%>"><%=whatOp%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkN( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td>=</td>
    <%          k = k + 1; 
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; %>
        <td>
            <table>
                <tr><td class="num">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkM( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkM( event )" value=""> 
                </td></tr>
            </table>
        </td>
    <%  itype = "hidden";      } %>
        </tr>
    <%  } 
    }   %>
    </table>
    <button onclick="check()">Check</button>
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
