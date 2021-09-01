<%-- 
    Document   : Divider
    Created on : Dec 3, 2015, 12:23:00 PM
    Author     : irene
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>DIVIDER</title>
<link rel="stylesheet" href="Divider.css" type="text/css">
<script src="Multiplier.js"></script>
<script src="Subtractor.js"></script>
<script src="Divider.js"></script>
<%-- do i need this script? does it break anything? fixit --%>
<script type="text/javascript">
window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13){if(e.target.nodeName=='INPUT'&&e.target.type=='text'){e.preventDefault();return false;}}},true);
</script>
</head>
<body>
   
<%
    // 2nd divisor dig around 5 is harder to estimate fixit
    // count it wrong if the user gueses a quotient digit 3 times fixit
    // showBorrows mode is really slow. any way to speed it up? fixit
    //System.out.println("------------------------Start Anew!-------------------------");
    final int SZ2_MX = 12; // maximum dividend + divisor + 1 size
    final int maxOps = 2;
    final double NEXP = 2.6; // used to generate # of digits    
    final double DEXP = 1.4; // used to generate digits themselves or # operands
    final boolean cmdebug = false;
    final boolean lastboxdebug = false;
    
    boolean immFeedBkCk = false;    
    boolean remaindersCk = false;
    boolean exDpCk = false;
    boolean recDpCk = false;
    boolean rndOffCk = true;
    String isImmFeedBk = "";
    String isEstRequired = "";
    String isRemainders = "";
    String isExDp = "";
    String isRecDp = "";
    String isRndOff = "checked";
    String tmp = "";      // temporary storage for newly gotten 
                          // request parameter
    String whatlvl = "";
    if(( tmp = request.getParameter("difflvl")) != null ) {
        immFeedBkCk = false;
        remaindersCk = false;
        exDpCk = false;
        recDpCk = false;
        rndOffCk = false;
        isImmFeedBk = "";
        isEstRequired = "";
        isRemainders = "";
        isExDp = "";
        isRecDp = "";
        isRndOff = "";
        whatlvl = tmp;
        if( whatlvl.equals("Immediate Feedback") ) {
            immFeedBkCk = true;
            isImmFeedBk = "checked";
        } else if( whatlvl.equals("Estimation Required")) {

            isEstRequired = "checked";
        } else if( whatlvl.equals("Remainders")) {
            remaindersCk = true;
            isRemainders = "checked";
        } else if( whatlvl.equals("Exact Decimals")) {
            exDpCk = true;
            isExDp = "checked";
        } else if( whatlvl.equals("Recurring Decimals")) {
            recDpCk = true;
            isRecDp = "checked";
        } else if( whatlvl.equals("Round Off")) {
            rndOffCk = true;
            isRndOff = "checked";
        }
    }
   
    boolean showBrowsCk = false;
    String isShowBrows = "";

    boolean showMcarriesCk = false;
    String isShowMcarries = "";

    if( request.getParameter("startAgain") == null ) {
        showMcarriesCk = false;
        isShowMcarries = "";
        showBrowsCk = false;
        isShowBrows = "";
    } else {
        //System.out.println("starting again parameter = >" + request.getParameter("startAgain") + "<" );
        String mcarrylist[] = request.getParameterValues("showmcarries");
        if( mcarrylist  == null ) {
            showMcarriesCk = false;
            isShowMcarries = "";
        } else {
            showMcarriesCk = true;
            isShowMcarries = "checked";
        }
        String helplist[] = request.getParameterValues("showborrows");
        if( helplist  == null ) {
            showBrowsCk = false;
            isShowBrows = "";
        } else {
            showBrowsCk = true;
            isShowBrows = "checked";
        }
    }

    
    int quotDp = 1; // 1 corresponds to integer with no decimal part
    int dvsrDp = 1;
    int dvdDp = 1;
    int nTwos = 0;
    int nFives = 0;

    if( exDpCk ) {
        //dvsrDp = 2 + (int)(3*Math.random()); // 2-4
        //dvsrDp = 1 + (int)(4*Math.random()); // 1-4
        nTwos = (int)(5*Math.random());
        nFives = (int)(5*Math.random());
        //dvsrDp = 4; // leading 0 in quotient having issues
    }
        
    int dsMaxDg = 2 + (int)(3*Math.random()); // 2-4 digits
    long tmplong = 1L;
    int leadzeros = 0;
    int spacesb4quot = 0;
    String roundString = "";
    int nSigDig = 0;
    String header = "Division Problem";
    int quotDigs = 1;
    int pattLength = 0;
    int [] qt;
    int [] ds;
    int [] dd;
    boolean [] visible;
    int [] rm;
    int [] cspan;
    int [] bspan;
    int [] dspan;
    cspan = new int[SZ2_MX];
    bspan = new int[SZ2_MX];
    dspan = new int[SZ2_MX];
    
    qt = new int[SZ2_MX];
    ds = new int[SZ2_MX];
    dd = new int[SZ2_MX];
    visible = new boolean[SZ2_MX];
    rm = new int[SZ2_MX - 2];
    int bqspan = 1;
    int cqspan = 1;
    
    int [] numBringDn;
    int [] actBringDn;
    numBringDn = new int[SZ2_MX];
    actBringDn = new int[SZ2_MX];
    tmplong = 1;
    boolean needsXtraDig = rndOffCk;
    long dividnd = 1L;
    int divisor = 1;
    int dvsrDigs = 1;
    int tmpint = 1;
    int dvdDigs = 0;
    boolean dsdpsettled = false;
    boolean dddpsettled = false;
    boolean qtdpsettled = false;
    int dqspan = 1 + 2*(SZ2_MX + 1);
    int rmdrDigs = 0;
    int remainder = 0;
    int expDvdDp = 1;    
    int expQuotDp = 1;
    long quotient = 1L;
    int bbspan = 1;
    int cbspan = 1;
    int dbspan =  1;

	int colspan = 2*(SZ2_MX + 1) + 1;
	int [][] borrows;
	int [][] ncarries; // tracks if carry is needed	    
	int [][] mcarries; // multiplicative carries	    
	int [][] operand = new int[SZ2_MX][maxOps];
	int [][] actDig = new int[SZ2_MX][maxOps];
	int [][] wcDig = new int[SZ2_MX][maxOps];
	int [][] spacesb4Op = new int[SZ2_MX][maxOps];

	int whatquotDig = 0;
    boolean running = false;
    genNumbers:
    while( !running ) {
    	running = true;

	    if( remaindersCk || exDpCk || rndOffCk ) {
	        dsMaxDg = 1 + (int)(3*Math.random()); // 1-3 digits
	    } else if( recDpCk ) {
	        dsMaxDg = 1 + (int)(2*Math.random()); // 1-2 digits
	    }
	    //dsMaxDg = 3; // dbfxt
	    //int dsMaxDg = 3 + (int)(2*Math.random()); // 3-5 digits
	    //dsMaxDg = 3;
	    int dsMax = (int)(Math.pow(10, dsMaxDg)) - 2;
	    divisor = 2 + (int)(dsMax*Math.random());
	    //divisor = 418; // dbfxt
	
	    dvsrDigs = (int)Math.log10(divisor) + 1;

	    int qtMaxDg = 7 - dvsrDigs;
	    qtMaxDg = 6 - dvsrDigs;
	    if( remaindersCk ) {
	        qtMaxDg = 6 - dvsrDigs;
	    } else if( exDpCk ) {
	        qtMaxDg = 5 - dvsrDigs;
	    } else if( recDpCk ) {
	        qtMaxDg = 1;//2 - dvsrDigs;
	    }
	
	    int qtMax = (int)(Math.pow(10, qtMaxDg)) - 1;
	
	    quotient = 1 + (int)(qtMax*Math.random());
   
	    if( exDpCk ) {
	        int t = 0;
	        int f = 0;
	        int totWidth = 1 + (int)Math.log10(divisor) + 1 + (int)Math.log10(quotient*divisor);
	        long prevQuot = quotient;
	        int prevDiv = divisor;
	        int prevT = t;
	        int prevF = f;
	        while( totWidth < SZ2_MX - 2 && (t < nTwos && f < nFives)) {
	            prevQuot = quotient;
	            prevDiv = divisor;
	            prevT = t;
	            prevF = f;
	            boolean heads = (Math.random() < 0.5);
	            if( t < nTwos && heads ) {
	                t++;
	                quotient = quotient*2;
	                divisor = divisor*5;
	            } else if( f < nFives) {
	                f++;
	                quotient = quotient*5;
	                divisor = divisor*2;
	            }
	            dvsrDigs = 1 + (int)Math.log10(divisor);
	            dvdDigs = 1 + (int)Math.log10(quotient*divisor);
	            totWidth = dvsrDigs + dvdDigs;
	        }
	        if( totWidth >= SZ2_MX - 2 ) {
	            quotient = prevQuot;
	            divisor = prevDiv;
	            t = prevT;
	            f = prevF;
	            dvsrDigs = 1 + (int)Math.log10(divisor);
	            dvdDigs = 1 + (int)Math.log10(quotient*divisor);
	            totWidth = dvsrDigs + dvdDigs;
	        }
	    }
	    /* dbfxt 
	    quotient = 90037;
	    divisor = 3;
	    dvsrDigs = 1;
	    /* dbfxt */
	    quotDigs = (int)Math.log10(quotient) + 1;
    
	    if( exDpCk || rndOffCk ) {
	        dvsrDp = 1 + (int)(dsMaxDg*Math.random()); 
	        //dvsrDp = 1; // dbfxt
	        if( dvsrDp > dvsrDigs ) {
	            dvsrDigs = dvsrDp;
	        }
	        //int maxQtDp = SZ2_MX + 1 - 2*dvsrDigs;
	        int maxQtDp = SZ2_MX - 2*dvsrDigs;
	        quotDp = 1 + (int)(maxQtDp*Math.random());
	        //quotDp = 7; // dbfxt        
	    }
	    
	    dividnd = quotient*divisor;
	    if( recDpCk ) {
	        int diceRoll = 1 + (int)(7*Math.random());
	        int denominator = 1;
	        int multiplier = 10000000;
	        dsMax = 7;
	
	        int minQdp = 8;
	        if( diceRoll == 7 ) {
	            denominator = 13; // repeats every six digits
	            minQdp = 8;
	            multiplier = 10000000;
	            //dsMax = 7;
	        } else if( diceRoll == 6 ) {
	            denominator = 7; // repeats every six digits
	            minQdp = 8;
	            multiplier = 10000000;
	            //dsMax = 14; 
	        } else if( diceRoll == 5 ) {
	            denominator = 41; // repeats every five digits
	            minQdp = 7;
	            multiplier = 1000000;
	            //dsMax = 24;            
	        } else if( diceRoll == 4 ) {
	            denominator = 37; // repeats every three digits
	            minQdp = 5; // need at least 4 decimal places in case 0.2702 = 100 / 37
	            multiplier = 10000;
	            //dsMax = 27;   // 27 = 1000/37
	        } else if( diceRoll == 3 ) {
	            denominator = 11; // repeats every two digits
	            minQdp = 4; // need at least 3 decimal places in case 0.909 = 100 / 11
	            multiplier = 1000;
	            //dsMax = 90;   // 90 = 1000/11
	        } else if( diceRoll == 2 ) {
	            denominator = 9; // repeats every digit
	            minQdp = 2;
	            multiplier = 100;
	            //dsMax = 111; // = 1000/9
	        } else if( diceRoll == 1 ) {
	            denominator = 3; // repeats every digit
	            minQdp = 2;
	            multiplier = 100;
	            //dsMax = 333; // = 1000/3
	        }
	        dsMaxDg = (SZ2_MX - minQdp)/2 - 1;
	        // divisor decimal point should be mostly small
	        dvsrDp = 1 + (new Double(dsMaxDg*(Math.pow(Math.random(),NEXP)))).intValue();
	        dsMaxDg = dsMaxDg - 1 - (int)(Math.log10(denominator));
	        dsMax = (int)(Math.pow(10, dsMaxDg)) - 1;
	        divisor = 1 + (int)(dsMax*Math.random());
	        
	        int origDvsr = divisor;
	        divisor = divisor*denominator; 
	        dvsrDigs = (int)Math.log10(divisor) + 1;     
	        if( dvsrDp > dvsrDigs ) {
	            dvsrDigs = dvsrDp;
	        }
	        qtMaxDg = SZ2_MX - 2*dvsrDigs - (int)(Math.log10(multiplier/denominator));
	        quotDp = 1 + (new Double((qtMaxDg)*(1 - Math.pow(Math.random(),NEXP)))).intValue();
	        while( quotient % denominator == 0 ) { // make sure division is not exact
	            quotient = 1 + (int)(qtMax*Math.random());
	        }
	        dividnd = quotient*origDvsr*multiplier; // calculate without denominator it cancels algebraically but may have round off error
	
	        quotient = quotient*multiplier;
	        int dvMaxDg = SZ2_MX - dvsrDigs - 1;
	        dvdDigs = (int)Math.log10(dividnd) + 1;
	        while( dvdDigs < dvMaxDg ) {
	            quotient = quotient*10;
	            dividnd = dividnd*10;
	            dvdDigs = (int)Math.log10(dividnd) + 1;
	        }
	        quotient = quotient / denominator;
	        quotDigs = (int)Math.log10(quotient) + 1;
	        if( quotDp < minQdp ) {
	            quotDp = minQdp;
	        }        
	    }
       
	    if( rndOffCk ) {
	
	        if( dvsrDp > dvsrDigs ) {
	            dvsrDigs = dvsrDp;
	        }
	        int dvMaxDg = 1 + (int)((SZ2_MX - dvsrDigs)*Math.random());
	        dvdDp = dvsrDp + (int)(1 + (dvMaxDg - dvsrDp)*Math.random());
	        long dvMax = (long)(Math.pow(10, dvMaxDg)) - 1;
	        if( dvdDp == dvMaxDg ) {
	        	dvMax /= 10;
	        }
	        dividnd = (int)(dvMax*Math.random());
	        if( dividnd < Long.MAX_VALUE ) {
	        	dividnd += 1;
	        }
	        System.out.println("dvMaxDg: " + dvMaxDg + " dvMax: " + dvMax + " dividnd: " + dividnd + " dvdDp: " + dvdDp);
	        
	        /* dbfxt 
	        divisor = 35;
	        dvsrDigs = 2;
	        dvsrDp = 1;
	        dividnd = 3499965;
	        
	        divisor = 873;
	        dvsrDigs = 3;
	        dvsrDp = 3;
	        dividnd = 2;	        
	        divisor = 98;
	        dvsrDigs = 2;
	        dvsrDp = 3;
	        dividnd = 99325174;
	        /* dbfxt */

	        double dquot = (double)dividnd / (double)divisor;
	        quotient = (long)dquot;
	        quotDigs = 1;
	        quotDp = 1;
	        if( quotient > 0 ) {
	            quotDigs = 1 + (int)Math.log10(quotient);
	            if( quotDigs > SZ2_MX - dvsrDigs - 2 ) {
	            	quotDigs = SZ2_MX - dvsrDigs - 2;
	            }         		
	            //quotDp = 1 + (int)(1 + quotDigs*Math.random()); // don't allow it to be too big
	        }
	
	        /* dbfxt 
	        quotDp = 2;     
	        quotDp = 5;
	        quotDp = 8;
	        /* dbfxt */
	        
	        System.out.println("before while loop divisor = " + divisor + " dvsrDp = " + dvsrDp + " dividnd = " + dividnd + " quotDp = " + quotDp );
	        // find worst case Dp and Digs, find width of problem and adjust up or down
	        int quotWidth = SZ2_MX + 2;
	        //dvdDp = 1 + (dvsrDp - 1) + (quotDp - 1);
	        quotDp = dvdDp - dvsrDp + 1;
	        boolean firstPass = true;
	        int origSpaces = 0;
	        int whatsBigger = quotDigs;
	        
	        while( quotWidth > SZ2_MX + 1 || quotWidth < SZ2_MX + 1 ) {
	            if( !firstPass ) {
	                spacesb4quot = origSpaces;
	                if( quotWidth > SZ2_MX + 1 ) {
	                    dquot = dquot / 10;
	                    quotient = (long)dquot;
	                    // shouldn't dividnd be divided by 10 also? fixit
	                } else {
	                    dquot = dquot * 10;
	                    quotient = (long)dquot;
	                    dividnd = dividnd * 10;
	                    quotDp += 1;
	                    dvdDp += 1;
	                }
	            }
	            quotDigs = 1;
	            if( quotient > 0 ) {
	                quotDigs = 1 + (int)Math.log10(quotient);
	            }
	            dvdDigs = (int)Math.log10(dividnd) + 1;
	            //System.out.println("line 609 divisor = " + divisor + " dividend = " + dividnd + " quotient = " + quotient + " quotDigs = " + quotDigs + " quotDp = " + quotDp);
	            
	            tmplong = dividnd/(long)Math.pow(10, dvdDigs-1);
	            // add as many dividend digits as needed to form a number that the
	            // divisor goes into at least once
	            if( firstPass ) {
	                spacesb4quot = dvsrDigs + 1;
	                //System.out.println("line 616 dividend = " + tmplong + " divisor = " + divisor);
	                for( int idx = dvdDigs-1; tmplong < divisor; --idx ) {
	                    if( idx > 0 ) {
	                        tmplong = tmplong*10 + (dividnd % (long)Math.pow(10, idx))/(long)Math.pow(10, idx-1);
	                    } else {
	                        tmplong = tmplong*10;
	                    }
	                    spacesb4quot += 1;
	                }
	                origSpaces = spacesb4quot;
	            }
	            //System.out.println("before adjustments spacesb4quot = " + spacesb4quot);
	            dvdDp = 1 + (dvsrDp - 1) + (quotDp - 1);
	            if( dvdDp > dvdDigs ) {
	                spacesb4quot += (dvdDp - dvdDigs);
	            }
	            //System.out.println("after adding leading dividend zeros spacesb4quot = " + spacesb4quot);
	            // back off leading zeros
	            whatsBigger = quotDigs;
	            if( quotDp > quotDigs ) {
	                leadzeros = quotDp - quotDigs;
	                spacesb4quot -= leadzeros;
	                whatsBigger = quotDp;
	            }
	            //System.out.println("after subtracting leading quotient zeros spacesb4quot = " + spacesb4quot);
	            quotWidth = spacesb4quot + whatsBigger;
	            //System.out.println("quotWidth = " + quotWidth + " = spacesb4quot + whatsBigger = " + spacesb4quot + " + "  + quotDigs );
	            firstPass = false;
	        } // end while( quotWidth > SZ2_MX + 1 || quotWidth < SZ2_MX + 1
	        boolean sigDig = Math.random() > 0.5;
	        /* dbfxt 
	        sigDig = true;
	        /* dbfxt */
	        int n = 0;
	        if( sigDig ) {
	            n = 1 + (int)((quotDigs-1)*Math.random());
	            /* dbfxt 
	            n = 1 + (int)((4)*Math.random());
	            n = 6;
	            /* dbfxt */
	            header = " significant digit";
	            nSigDig = quotDigs - 1 - n;
	            System.out.println("significant digit n: " + n + " quotDigs: " + quotDigs + " nSigDig: " + nSigDig);
	        } else {        
	            n = (int)((quotDp-1)*Math.random());
	            /* dbfxt           
	            n = 1;
	            /* dbfxt */
	            header = " decimal place";
	            nSigDig = quotDp - 2 - n;
	            System.out.println("decimal n: " + n + " quotDp: " + quotDp + " nSigDig: " + nSigDig);
	            if( nSigDig < 0 ) {
	            	nSigDig = 0;
	            }
	        }
	        quotDigs = whatsBigger;
	        int nPlus1 = n + 1;
	        roundString = "When you have " + nPlus1;
	
	        roundString = roundString + header;
	        if( nPlus1 != 1 ) {
	            roundString = roundString + "s";
	        }
	        roundString = roundString + ", click on last digit to cross it off";
	        if( n != 1 ) {
	            header = header + "s";
	        }
	        header = "Round to " + n + header;
	    }  else { // not round off check
	        // remove trailing zeros after the decimal point
	        tmpint = quotDp - 1;
	        for( int i = 0; i < tmpint; i++ ) {       
	            if( quotient % 10 == 0 ) {
	                quotient = quotient / 10;
	                dividnd = dividnd / 10;
	                quotDigs -= 1;
	                quotDp -= 1;
	            } else {
	                break;
	            } 
	        }
	        if( quotDp > quotDigs ) {
	            leadzeros = quotDp - quotDigs;
	            quotDigs = quotDp;
	        }
	        dvdDp = 1 + (dvsrDp - 1) + (quotDp - 1);
	        dvdDigs = (int)Math.log10(dividnd) + 1;
	    }
    	
	    expDvdDp = 1 + (dvdDp - 1) - (dvsrDp - 1);
	    expQuotDp = expDvdDp;
	    dsdpsettled = 1 == dvsrDp;
	    dddpsettled = expDvdDp == dvdDp;
	    qtdpsettled = (dsdpsettled && dddpsettled && quotDp == 1 ) ||
	            !( exDpCk || recDpCk || rndOffCk );
	    
	    if( dvdDp > dvdDigs ) {
	        dvdDigs = dvdDp;
	    }
	    
	    int rmdrMxDg = SZ2_MX - dvsrDigs - 1 - dvdDigs - 1;
	    int rmdrMax = 0;
    
	    if( remaindersCk ) {
	        rmdrMax = (int)(Math.pow(10, rmdrMxDg)) - 1;
	        if( rmdrMax >= divisor ) {
	            rmdrMax = divisor - 1;
	        }
	        remainder = (new Double((1+rmdrMax)*(1 - Math.pow(Math.random(),DEXP)))).intValue();
	        rmdrDigs = remainder > 0? (1 + (int)Math.log10(remainder)) : 1;
	        dividnd += remainder;
	    }
	    /* dbfxt 
	    divisor = 111;
	    quotient = 510;
	    dividnd = 56610;
	    dvdDigs = 5;
	    /* */
 
	    qt = new int[SZ2_MX];
	    ds = new int[SZ2_MX];
	    dd = new int[SZ2_MX];
	    visible = new boolean[SZ2_MX];
	    rm = new int[SZ2_MX - 2];
	    
	    bqspan = 2*dvsrDigs + 1;
	    cqspan = 2*dvdDigs + 1;
	    
	
	    tmplong = quotient;
	    needsXtraDig = rndOffCk;
	    // check if 9999 will round up to 10000 (or similar)
	    for( int idx = 0; idx < quotDigs; ++idx ) {
	        qt[idx] = (int)(tmplong % 10);
	        tmplong = tmplong / 10;
	        
	        numBringDn[idx] = 0;
	        actBringDn[idx] = 0;
	        
	        if( rndOffCk && idx > nSigDig ) {
	            if( qt[idx] < 9 || qt[nSigDig] < 5 ) {
	                needsXtraDig = false;
	            }
	        }
	    }
    
	    if( recDpCk ) {
	        String quotString = "";
	        for( int idx = quotDigs-1; idx >= 0; --idx ) {
	            quotString = quotString + qt[idx];
	            if( idx == quotDp-1 ) {
	                 quotString = quotString + ".";
	            }
	        }
	        // find the length of the repeat pattern    
	        boolean breakall = false;
	        for( int idx = quotDigs-1; idx > 0; --idx ) {
	            int firstPattDig = qt[idx];
	            for( int jdx = idx-1; jdx >= 0; --jdx ) {
	                if( qt[jdx] == firstPattDig ) {
	                    int secPattDig = qt[idx-1];
	                    if( jdx > 0 && qt[jdx-1] == secPattDig ) {
	                        pattLength = idx - jdx;
	                        int restOfDec = quotDp - 1 - pattLength;
	                        quotString = "";
	                        for( int mdx = quotDp-2, ndx = 0; mdx >= 0 && ndx < pattLength; --mdx, ++ndx ) {
	                            quotString = quotString + qt[mdx];
	                        }
	                        breakall = true;
	                        break;
	                    }
	                }
	            }
	            if( breakall ) {
	                break;
	            }
	        }
	    }
	    tmplong = divisor;
	    for( int idx = 0; idx < dvsrDigs; ++idx ) {
	        ds[idx] = (int)(tmplong % 10);
	        tmplong = tmplong / 10;
	        
	    }
	    tmplong = dividnd;
	    boolean inVisibleSoFar = dvdDp > 1;
	    for( int idx = 0; idx < dvdDigs; ++idx ) {
	        dd[idx] = (int)(tmplong % 10);
	        tmplong = tmplong / 10;
	        if( inVisibleSoFar && idx < dvdDp - 1 && dd[idx] == 0 ) {
	            visible[idx] = false;
	            cqspan -= 2;
	        } else {
	            visible[idx] = true;
	            inVisibleSoFar = false;
	        }
	    }
	    dqspan = 1 + 2*(SZ2_MX + 1) - bqspan - cqspan;
	    
	    tmpint = remainder;
	    for( int idx = 0; idx < rmdrDigs; ++idx ) {
	        rm[idx] = (int)tmpint % 10;
	        tmpint = tmpint / 10;
	    }
    
	    if( !rndOffCk ) {
	        spacesb4quot = dvsrDigs + 1;
	        tmpint = dd[dvdDigs-1];
	        // add as many dividend digits as needed to form a number that the
	        // divisor goes into at least once
	        for( int idx = dvdDigs-2; idx >= 0 && tmpint < divisor; --idx ) {
	            tmpint = 10*tmpint + dd[idx];
	            spacesb4quot += 1;
	        }
	        int qd = quotDigs - 1;
	        // back off leading zeros
	        while( qt[qd] == 0 && qd > 0 ) {
	            spacesb4quot -= 1;
	            qd -= 1;
	        }
	    }

    	bbspan = 1 + 2*(spacesb4quot + quotDigs - quotDp + 1);
    	cbspan = 2*pattLength - 1;
    	dbspan =  1 + 2*(SZ2_MX + 1) - bbspan - cbspan;
    
	    whatquotDig = quotDigs-1; // there may be more quotient digits than subtractions

	    while( whatquotDig >= 0 && qt[whatquotDig] == 0 ) {
	        //System.out.println("line 330 qt[" + whatquotDig + "] = " + qt[whatquotDig]);
	        whatquotDig -= 1;
	        if( whatquotDig < 0 ) {
	        	running = false;
	        	continue genNumbers;
	        }
	    }
    } // end while !running
    //System.out.println("line 333 qt[" + whatquotDig + "] = " + qt[whatquotDig]);
    tmplong = dividnd;
    // use only the first few digits
    long lastDig = 0;
    int worstCaseQdig = 9;
    while( tmplong > qt[whatquotDig]*divisor ) {
        lastDig = tmplong % 10;
        tmplong = tmplong / 10;
    }
    // back off the last digit removed
    if( tmplong != qt[whatquotDig]*divisor ) {
        tmplong = tmplong*10 + lastDig;
    }
    int nsubs = 0; // actual subtractions
    System.out.println("immFeedBkCk: " + immFeedBkCk + " remaindersCk: " + remaindersCk + " exDpCk: " + exDpCk + " recDpCk: " + recDpCk + " rndOffCk: " + rndOffCk);
    System.out.println("dividnd: " + dividnd + " dvdDp: " + dvdDp + " divisor: " + divisor + " dvsrDp: " + dvsrDp + " quotient: " + quotient + " quotDp: " + quotDp);
    while( whatquotDig >= 0 ) {
        if( nsubs > quotDigs - 1 || whatquotDig > SZ2_MX - 1 ){
            //System.out.println("nsubs = " + nsubs + " is greater than quotDigs = " + quotDigs + " or whatQuotDig = " + whatquotDig + " is greater than SZ2_MX = " + SZ2_MX);
            break;
        }
        operand[nsubs][0] = qt[whatquotDig]*divisor;
        int WCoperand0 = worstCaseQdig*divisor; // worst case, biggest operand
        operand[nsubs][1] = (int)(tmplong - operand[nsubs][0]);
        //System.out.println("line 970 nsubs = " + nsubs + " qt[" + whatquotDig + "] = " + qt[whatquotDig] + " last dividend = " + tmplong + " product = " + operand[nsubs][0] );
        int WCoperand1 = (int)(tmplong - divisor); 

        actDig[nsubs][0] = operand[nsubs][0] > 0? 
                (int)Math.log10(operand[nsubs][0]) + 1: 1;
        actDig[nsubs][1] = operand[nsubs][1] > 0? 
                (int)Math.log10(operand[nsubs][1]) + 1: 1;
        wcDig[nsubs][0] = WCoperand0 > 0? 
                (int)Math.log10(WCoperand0) + 1: 1;
        //wcDig[nsubs][1] = WCoperand1 > 0? 
        //        (int)Math.log10(WCoperand1) + 1: 1;
        wcDig[nsubs][1] = WCoperand1 > 0? 
                (int)Math.log10(WCoperand1) + 2: 2;
        //System.out.println("line 983 whatQuotDig = " + whatquotDig + " operand[" + nsubs + "][0] = " + operand[nsubs][0] + "  WCoperand0 = " + WCoperand0 + " WCoperand1 = " + WCoperand1 );       
        if( operand[nsubs][1] < 0 ) {
            //System.out.println("tmplong = " + tmplong + " operand[" + nsubs + "][0] = " + operand[nsubs][0] + " diff = " + operand[nsubs][1] + " that's messed up");
            break;
        }

        int mostPossProdDig = (int)Math.log10(9*divisor) + 1;
        spacesb4Op[nsubs][0] = spacesb4quot + quotDigs - whatquotDig - mostPossProdDig - 1;
        //System.out.println("line 991 nsubs = " + nsubs + " spacesb4quot = " + spacesb4quot + "+ quotDigs = " + quotDigs + "- whatQuotDig = " + whatquotDig + " - mostPossProdDig = " + mostPossProdDig + " - 1 = " + " spacesb4Op[" + nsubs + "][0] = " + spacesb4Op[nsubs][0]);

        spacesb4Op[nsubs][1] = spacesb4quot + quotDigs - whatquotDig - wcDig[nsubs][1] - 1;
        cspan[nsubs] = 2*wcDig[nsubs][0] + 1;
        bspan[nsubs] = 2*(spacesb4Op[nsubs][0]) + 1;
        dspan[nsubs] = 1 + 2*(SZ2_MX + 1) - bspan[nsubs] - cspan[nsubs];
        if( whatquotDig == 0 ) {
            break; // don't need to generate tmpint nsubsor the next loop, you're 
        }          // done
        boolean restAreZero = false;
        if( operand[nsubs][1] == 0 ) {            // if difference is zero
            restAreZero = true;                     // check if there is 
            for( int idx = whatquotDig-1; idx >= 0; --idx ) { // anything but zeros left
                if( dd[idx] != 0 ) {
                    restAreZero = false;
                    break; // rest are not zero, stop checking
                }
            }
        }
        if( restAreZero ) {  
            break; // all checked to be zero, break out of outer loop
        }

        // bring down as many new digits as needed to get something divisor
        // will go into
        tmplong = operand[nsubs][1];
        actBringDn[nsubs] = 0;
        //numBringDn[nsubs] = SZ2_MX + 1 - spacesb4Op[nsubs][1] - wcDig[nsubs][1];
        numBringDn[nsubs] = dvsrDigs + 1 + dvdDigs - spacesb4Op[nsubs][1] - wcDig[nsubs][1];
        //actBringDn[nsubs] = SZ2_MX + 1 - spacesb4Op[nsubs][1] - actDig[nsubs][1];
        boolean breakout = false;
        while( tmplong < divisor ) {
            if( whatquotDig < 1 ) {
                //System.out.println("line 1024 no more quote digits tmpint = " + tmpint + " actBringDn[" + nsubs + "] = " + actBringDn[nsubs]);
                breakout = true; // don't want to break, want to bring down zeroes if there are no more dividend digits fixit
                break;
            }
            tmplong = 10*tmplong + dd[whatquotDig-1]; // not the right digit if divisor is big fixit how did i miss this?
            whatquotDig = whatquotDig - 1;
            actBringDn[nsubs] += 1;
        }
        if( breakout ) {
            break;
        }
        //System.out.println("line 1039 dvsrDigs: " + dvsrDigs + " dvdDigs: " + dvdDigs);
        //System.out.println("line 1040 operand[" + nsubs + "][1] = " + operand[nsubs][1] + " actDig[" + nsubs + "][1] = " + actDig[nsubs][1] + " actBringDn[" + nsubs + "] = " + actBringDn[nsubs]);
        //System.out.println("line 1041 spacesb4Op[" + nsubs + "][1] = " + spacesb4Op[nsubs][1] + " wcDig[" + nsubs + "][1] = " + wcDig[nsubs][1] + " numBringDn[" + nsubs + "] = " + numBringDn[nsubs]);
        nsubs = nsubs + 1;
    } 

    String isLinedUp = "true";
    
    int digMax = 10;
    int minDp = 0;

    borrows = new int[quotDigs][(SZ2_MX+1)];
    ncarries = new int[quotDigs+1][(SZ2_MX+1)];
    
    mcarries = new int[quotDigs][SZ2_MX+1];
    for( int idx = 0; idx < quotDigs; idx++ ){
        for( int jdx = 0; jdx < dvsrDigs-1; jdx++ ){
            mcarries[idx][jdx] = qt[idx]*ds[jdx];
            if( jdx > 0 ){
                mcarries[idx][jdx] = mcarries[idx][jdx] + mcarries[idx][jdx-1];
            }    
            mcarries[idx][jdx] = mcarries[idx][jdx]/10;
            //System.out.print(" mcarries[" + idx + "][" + jdx + "] = " + mcarries[idx][jdx]);
        }
    }
    String[] ans;   // final answer string   
    String[] cas;   // additive carry string 
    cas = new String[SZ2_MX+1];
    ans = new String[SZ2_MX+1];

    int kdx;
    //int bdx = 0;            // box index used to track what box is selected
    
    int maxBx = 20;                      
    int sbx;
    for( sbx = 0; sbx < quotDigs; ++sbx ) {
        for( int idx = 0; idx <= SZ2_MX; idx++ ) {
            cas[idx] = "";
            ans[idx] = "";
            borrows[sbx][idx] = 0;
            ncarries[sbx][idx] = 0;
        }
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
    
    int [] nacarries;
    nacarries = new int[quotDigs];
    
    for( sbx = 0; sbx < quotDigs; ++ sbx ) {
        nacarries[sbx] = 0;
        int sbxminus1 = sbx - 1;
        int kdxmax = sbx == 0? 
                dvdDigs - quotDigs + 1 + leadzeros : 
                wcDig[sbxminus1][1] + numBringDn[sbxminus1] - 1;
        if( kdxmax > SZ2_MX + 1 ) {
            //System.out.println("kdxmax = " + kdxmax + " is greater than 1 + SZ2_MX = " + SZ2_MX );
            break;
        }
        if( sbx > 0 ) {
            //System.out.println("wcDig[" + sbxminus1 + "][1] = " + wcDig[sbxminus1][1] + " numBringDn[" + sbxminus1 + "] = " + numBringDn[sbxminus1]);
        }
        for (kdx = 0; kdx < kdxmax; kdx++) {
            boolean needsCarry = true;
            if( kdx >= kdxmax-1 || (sbx > 0 && wcDig[sbxminus1][1] < 2 ) ) {
                needsCarry = false;
            }
            if( needsCarry ) {
                ncarries[sbx][kdx] = 1;
                nacarries[sbx] += 1;          
            }
            //System.out.println("ncarries[" + sbx + "][" + kdx + "] = " + ncarries[sbx][kdx] + " nacarries[" + sbx + "] = " + nacarries[sbx]);
        }
    }
    
    int nmcars = 0;
    int crows = 0;
    for( int idx = quotDigs - 1; idx >= 0; --idx ) {
        nmcars += (dvsrDigs - 1);
        crows += 1;
    }
    
    int whatBx = nmcars;
    if( needsXtraDig ) {
        whatBx += 1;
    }
    
    String browType = "hidden";    
    if( showBrowsCk ) {
        browType = "text";
    }
    String cmtype = cmdebug? "text" : "hidden";
    String lbtype = lastboxdebug? "text" : "hidden";%>
<div >
<form id="th-id2" method="get" action="Divider.jsp">
<table class="d1">
<tbody>
<tr>
<td class="d2">
<table id="tbl">
<tr><th id="F1" colspan="<%=colspan%>"><%=header%></th></tr>
<%  // these are filler    
    for( sbx = SZ2_MX - 3; sbx >= crows; --sbx ) { 
        String rid = "r" + sbx; %>
        <tr>
        <td class="t2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>            
                <td class="t1"></td>
                <td class="t2"></td>            
<%      } %>
        </tr>
<%  }
    for( sbx = crows - 1; sbx > 0; --sbx ) { %>
        <tr>
<%      int mcol = dvsrDigs - 2;
        String vid = "cm" + mcol + "_" + sbx; %>
        <td class="t2">
<%      if( nmcars > 0 ) { %>
                <input type="<%=cmtype%>" id="<%=vid%>" class="c2" 
                    onkeyup="checkMcarry(<%=mcol%>,<%=sbx%>)" >
            
 <%     } %>
        </td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="t1"></td>
<%          if( idx < dvsrDigs - 2 && nmcars > 0 ) { 
                mcol = dvsrDigs - 3 - idx;
                vid = "cm" + mcol + "_" + sbx; %>
                <td class="t2">
                    <input type="<%=cmtype%>" id="<%=vid%>" class="c2" 
                            onkeyup="checkMcarry(<%=mcol%>,<%=sbx%>)" >
                </td>
<%          } else {  %>
                <td class="t2"></td>
<%          } %>

<%      } %>
        </tr>
<%  }

	if( recDpCk ) { %>
    <tr><th class="th-class4" colspan="<%=bbspan%>"></th>
        <th class="th-class4" colspan="<%=cbspan%>" id="overbar">
        </th>
        <th class="th-class4" colspan="<%=dbspan%>"></th>
    </tr>
<%  } %>
	<tr>
<%  int mcol = dvsrDigs - 2;
    String vid = "cm" + mcol + "_0";  
    String tid = "tc" + SZ2_MX; %>
    <td class="t2" id="td15" name="notthestartdig">
<%  if( nmcars > 0 ) { %>
            <input type="<%=cmtype%>" id="<%=vid%>" class="c2" 
                onkeyup="checkMcarry(<%=mcol%>,0)">
<%  } %>
    </td>
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) {  
        String whatFun = qtdpsettled? "showQuotDigs( event )" : null;
        //String whatFun = null;
        int col = spacesb4quot + quotDigs - 1 - idx;
        tid = "td" + col;
        String tic = "tc" + col;
        String xid = "xt" + col;
        if( needsXtraDig && idx == spacesb4quot - 1 ) { %>
            <td class="t1" id="<%=tid%>" onclick="<%=whatFun%>" name="notthestartdig">
                <input type="<%=lbtype%>" class="a1" size="1"
                    id="<%=xid%>" name="quotdigs"
                    onkeyup="checkRoundOff( event )" >
            </td>

<%      } else if( idx < spacesb4quot || spacesb4quot + quotDigs + rmdrDigs < idx ) { %>
                <td class="t1" id="<%=tid%>" onclick="<%=whatFun%>" name="notthestartdig"></td>
<%      } else if( spacesb4quot <= idx && idx < spacesb4quot + quotDigs ) {
            String qid = "qt" + col; %>
            <td class="t1"  id="<%=tid%>" name="quotTd" onclick="<%=whatFun%>">
                <input type="<%=lbtype%>" id="<%=qid%>" class="a1" size="1"
                    name="quotdigs"
                    onkeyup="divide(<%=immFeedBkCk%>, <%=col%>, <%=qt[col]%> )" >
            </td>
<%      } else if( remaindersCk && idx == spacesb4quot + quotDigs ) { %>
            <td class="t1" id="<%=tid%>" onclick="<%=whatFun%>" name="notthestartdig"><label id="dispR">
                R
            </label>
            </td>
<%      } else if( remaindersCk && remainder > 0 ) { 
            col = spacesb4quot + quotDigs + rmdrDigs - idx;
            String rid = "r" + col; 
            String rname = "rmdr"; %>
            <td class="t1" id="<%=tid%>" onclick="<%=whatFun%>" name="notthestartdig">
                <input type="<%=lbtype%>" id="<%=rid%>" name="<%=rname%>" 
                    class="a1" size="1" 
                    onkeyup="checkRemainder( <%=col%>, <%=rm[col]%> )"
            ></td>
<%      } else { %>
            <td class="t1" id="<%=tid%>" onclick="<%=whatFun%>" name="notthestartdig"></td>
<%      }

        if( idx < dvsrDigs - 2 && nmcars > 0 ) { 
            col = dvsrDigs - 3 - idx;
            vid = "cm" + col + "_0"; %>
            <td class="t2" id="<%=tic%>" onclick="<%=whatFun%>" name="notthestartdig">
                <input type="<%=cmtype%>" id="<%=vid%>" class="c2" 
                                  onkeyup="checkMcarry(<%=col%>,0)">
            </td>
<%      } else if( spacesb4quot <= idx && idx < spacesb4quot + quotDigs ) {  
            int jdx = idx - spacesb4quot; %>
            <td class="t2" id="<%=tic%>" onclick="<%=whatFun%>" name="notthestartdig">
                <span name="quotDp" onclick="chooseDivThis( event, <%=jdx%>, 'quotDp' )" class="dp" >_</span>
            </td>
<%      } else { %>
            <td class="t2" id="<%=tic%>" onclick="<%=whatFun%>" name="notthestartdig">
            </td>
<%      }
    } %>
</tr>
<tr><th class="th-id1" colspan="<%=bqspan%>"></th>
    <th colspan="<%=cqspan%>"></th>
    <th class="th-id1" colspan="<%=dqspan%>"></th>
</tr>
<%    if( nacarries[0] > 0 ) { %>
        <tr>
            <td class="s2"></td>
    <%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {
                int ocol = dvsrDigs + dvdDigs - idx;
                int ccol = ocol - 1;
                int col = dvsrDigs + dvdDigs - quotDigs - idx + leadzeros;
                //System.out.println("idx = " + idx + " col = " + col + " ocol = " + ocol);
                String name = "boca0"; 
                if( col >= 0 && ncarries[0][col] != 0 ) { 
                    String bid = "bo" + ocol + "_0" ; 
                    if( ocol < 0 || ocol > SZ2_MX ) {
                         //System.out.println("bo ocol = " + ocol + "being reduced to 0");
                         ocol = 0;
                    } %>
                    <td class="s1">
                        <input type="<%=browType%>" name="<%=name%>" id="<%=bid%>"
                        class="f1" onkeyup="checkNewDivVal(<%=ocol%>, 0 )">
                    </td>
    <%          } else { %>
                    <td class="s1"></td>
    <%          } 
                if( col >= 0 && ncarries[0][col] != 0 ) { 
                    String cid = "ca" + ccol + "_0"; 
                    if( ccol < 0 || ccol >= SZ2_MX ) {
                         //System.out.println("ca ocol = " + ocol + "being reduced to 0");
                         ocol = 0;
                    } %>
                    <td class="s2">
                        <input type="<%=browType%>" name="<%=name%>" id="<%=cid%>"
                        class="f2" onkeyup="checkDivBorrow(<%=ccol%>, 0)" 
                        onclick="promptDivBorrow( event )" >
                    </td>
    <%          } else { %>
                    <td class="s2"></td>
    <%          } 
                
            } %>
        </tr>
<% } %>
<tr>
    <td class="t2"></td>
<%  for( int idx = 0; idx <= SZ2_MX; idx++ ) { 
        if( idx < dvsrDigs ) { 
            int col = dvsrDigs - 1 - idx; %>
            <td class="t1" name="dvsrdigs" ><%=ds[col]%></td>
<%      } else if( idx == dvsrDigs ) { %>
            <td class="t1" >)</td>
<%      } else if( idx <= dvsrDigs + dvdDigs ) { 
            int col = dvsrDigs +  dvdDigs - idx;
            //System.out.println("dividend col = " + col); 
            String vclass = visible[col]? "t1" : "t3";
            String did = "dd" + col + "_0"; %>
            <td class="<%=vclass%>" name="dvddigs" id="<%=did%>" >
            <%=dd[col]%>
            </td>
<%      } else { %>
            <td class="t1" ></td>
<%      }
        if( dvsrDigs - idx == dvsrDp  && (exDpCk || recDpCk || rndOffCk) ) { 
            int jdx = idx;
            // fp = black, dp = invisible, ep = red
            String dclass = dvsrDp > 1 ? "fp" : "dp"; 
            String whatFun = "chooseDivThis( event, " + jdx + ", 'dvsrDp' )";
            if( dsdpsettled ) {
                whatFun = "null";
            } else {
                dclass = "ep";
            } %>
            <td class="t2">
                <span name="dvsrDp" onclick="<%=whatFun%>" class="<%=dclass%>" >.</span>
            </td>
<%      } else if( dvdDigs - (idx - dvsrDigs - 1) == dvdDp  && (exDpCk || recDpCk || rndOffCk) ) { 
            int jdx = idx - dvsrDigs - 1; 
            //String dclass = dsdpsettled ? dvdDp > 1? "fp" : "dp" : "ep"; 
            String dclass = dvdDp > 1 ? "fp" : "dp"; 
            String whatFun = "chooseDivThis( event, " + jdx + ", 'dvdDp' )";
            if( dsdpsettled ) {
                whatFun = "null";
            } else {
                dclass = "ep";
            } %>
            <td class="t2">
                <span name="dvdDp" onclick="<%=whatFun%>" class="<%=dclass%>" >.</span>
            </td>
<%      } else if( 0 <= idx && idx < dvsrDigs ) { 
            int jdx = idx;
            String whatFun = "chooseDivThis( event, " + jdx + ", 'dvsrDp' )"; 
            if( dsdpsettled ) {
                whatFun = "null";
            } %>
            <td class="t2">
                <span name="dvsrDp" onclick="<%=whatFun%>" class="dp" >_</span>
            </td>
 
<%      } else if( dvsrDigs < idx && idx < dvsrDigs + dvdDigs + 1 ) { 
            int jdx = idx - dvsrDigs - 1; 
            String whatFun = "chooseDivThis( event, " + jdx + ", 'dvdDp' )";
            if( dsdpsettled ) {
                whatFun = "null";
            } %>
            <td class="t2">
                <span name="dvdDp" onclick="<%=whatFun%>" class="dp" >_</span>
            </td>
<%      } else { %>
            <td class="t2"></td>
<%      }

    } %>
</tr>
<%  
    for( sbx = 0; sbx <= nsubs; ++sbx ) {
    int rdx = sbx + 1; %>

    <tr class="oprand">
        <td class="t2"></td>
    <%  for( int idx = 0; idx <= SZ2_MX; idx++ ) { 
            if( idx < spacesb4Op[sbx][0] ) { %>
                <td class="t1"></td>
<%          } else if ( idx == spacesb4Op[sbx][0] ){ 
                String minusName="minus" + sbx; %>
                <td class="t3" id="<%=minusName%>" > - </td>
    <%      } else if( idx <= spacesb4Op[sbx][0] + wcDig[sbx][0]) {          
                int col = spacesb4Op[sbx][0] + wcDig[sbx][0] - idx;
                String name = "op" + sbx + "_0";
                String whattype = lbtype;
                //System.out.println(" product sbx =  " + sbx + " idx = " + idx + " col = " + col);
                %>
                <td class="t1">
                <input type="<%=whattype%>" name="<%=name%>" class="a1" size="1" 
                onkeyup="multiply( <%=col%>, <%=sbx%> )" onclick="setDivFocus()">
                </td>
 <%         } else { %>
                <td class="t1"></td>
<%          } %>
            <td class="t2"></td>
    <%      } 
        String barName = "cspan" + sbx; %>
    </tr>
    <tr><th class="th-id1" colspan="<%=bspan[sbx]%>"></th>
        <th id="<%=barName%>" class="th-id1" colspan="<%=cspan[sbx]%>"></th>
        <th class="th-id1" colspan="<%=dspan[sbx]%>"></th>
    </tr>

<%  if( rdx <= nsubs && nacarries[rdx] > 0 ) {  %>
	    <tr>
        <td class="s2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) {
            int col = spacesb4Op[sbx][1] + wcDig[sbx][1]  + numBringDn[sbx] - idx - 2;
            int ocol = col + 1;
            String name = "boca" + rdx;
            //System.out.println("col = " + col + " rdx = " + rdx + " ocol = " + ocol + " quotDigs = " + quotDigs);
            if( 0 <= col && col <= SZ2_MX && 0 <= rdx && rdx <= quotDigs && ncarries[rdx][col] != 0 ) { 
                String bid = "bo" + ocol + "_" + rdx;
                //System.out.println("bid = " + bid);
                if( ocol < 0 || ocol > SZ2_MX ) {
                         //System.out.println("bo col = " + col + "being reduced to 0");
                         col = 0;
                } %>
                <td class="s1">
                    <input type="<%=browType%>" name="<%=name%>" id="<%=bid%>" 
                    class="f1" onkeyup="checkNewDivVal(<%=ocol%>, <%=rdx%>)">
                </td>
<%          } else { %>
                    <td class="s1"></td>
<%          } 
            if( col >= 0 &&
                    spacesb4Op[sbx][1] < idx && 
                    col < wcDig[sbx][1] + numBringDn[sbx] && 
                    ncarries[rdx][col] != 0 ) {  

                String cid = "ca" + col + "_" + rdx; 
                //System.out.println("cid = " + cid); %>
                <td class="s2">
                        <input type="<%=browType%>" name="<%=name%>" id="<%=cid%>"
                        class="f2" onkeyup="checkDivBorrow(<%=col%>, <%=rdx%>)"
                        onclick="promptDivBorrow( event )">
                </td>
<%          } else { %>
                <td class="s2"></td>
<%          } 

         } %>
<%  } else { %>
        <td class="s2"></td>
<%      // these are fake to fill space
        String filler = "boca" + rdx;
        for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="s1"><input type="<%=browType%>" class="f1" name="<%=filler%>"></td>
            <td class="s2"><input type="<%=browType%>" class="f2" name="<%=filler%>"></td>
<%      } %>
    </tr>  
<%  } %>
        <tr class="oprand">
        <td class="t2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { 
            String whattype = lbtype; 
            int col = spacesb4Op[sbx][1] + wcDig[sbx][1] - idx;
            int ocol = spacesb4Op[sbx][1] + wcDig[sbx][1] + numBringDn[sbx] - idx - 1;
            int maxBDcol = wcDig[sbx][1] + numBringDn[sbx];
            if( idx <= spacesb4Op[sbx][1] ) { %>
                <td class="t1"></td>
<%          } else if( idx <= spacesb4Op[sbx][1] + wcDig[sbx][1] ) { 
                String name = "op" + sbx + "_1";  
                String oid = "op" + ocol + "_" + rdx; %>
                <td class="t1">
                <input type="<%=whattype%>" name="<%=name%>" id="<%=oid%>" class="a1" size="1" 
                onkeyup="subtract( <%=col%>, <%=sbx%> )" 
                onclick="promptDivBorrow( event )">
                </td>
    <%      } else if( 0 <= ocol && ocol <  maxBDcol ) { 
                String name = "bd" + sbx; 
                String bid = "bd" + ocol + "_" + rdx; %>
                <td class="t1">
                <input type="<%=whattype%>" name="<%=name%>" id="<%=bid%>" class="a1" size="1" 
                onkeyup="bringdown( <%=sbx%> )"
                onclick="promptDivBorrow( event )">
                </td>
 <%         } else { %>
                <td class="t1"></td>
<%          } %>
            <td class="t2"></td>
<%      } %>
    </tr>
<% } 
    // these are filler
    for( ; sbx < SZ2_MX - 2; ++sbx ) { 
        String rid = "r" + sbx; %>
        <tr>
        <td class="t2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            
                <td class="t1"></td>
                <td class="t2"></td>   
<%      } %>
        </tr>
        <tr>
            <th class="th-id1" colspan="<%=colspan%>"></th>
        </tr>
        <tr>
        <td class="s2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="s1">
                <input type="<%=browType%>" class="f1" >
            </td>
            <td class="s2">
                <input type="<%=browType%>" class="f2" >
            </td>
<%      } %>
        </tr>
        <tr>
        <td class="t2"></td>
<%      for( int idx = 0; idx <= SZ2_MX; idx++ ) { %>
            <td class="t1"></td>
            <td class="t2"></td>   
<%      } %>
        </tr>
<%  } %>
</table>
</td>
<td class="d7">
<div class="d3">
<% if( cmdebug ) { %>
<label>whatbox</label>
<% } %>

<input type="<%=lbtype%>" id="whatbox" value="<%=whatBx%>" class="shortbox">

<% for( int i = 0; i < 0; ++i ) {
    String sid = "statusBox" + i; %>
    <div id="<%=sid%>"></div>
<% } %>
</div>
<div class="d3">
<% boolean thereAreCarries = false;
for( int idx = 0; idx <= nsubs; ++ idx ) { 
    if( nacarries[idx] > 0 ) {
        thereAreCarries = true;
        break;
    }
}

if( thereAreCarries && showBrowsCk ) { %>
    <label id="dispBo">Click on a digit to borrow from it</label>    
<%  } %>
</div>
<div class="d3">
<% if( recDpCk ) { %>
    <label id="dispRec">
    When decimal part of quotient starts to repeat, drag mouse to draw a line over the repeat pattern
    </label>
<%  } else if( rndOffCk ) { %>
    <label id="dispRnd">
    <%=roundString%>
    </label>
<%  } %>
</div>
<div class="d6">
<!--this is where error messages get displayed//-->
<%  if( exDpCk || recDpCk || rndOffCk) {
        if( !dsdpsettled ) { %>
            <label id="msg">Count how many places the decimal point needs to move to make the divisor an integer and click there</label>
<%      } else if( !qtdpsettled ) { %>
            <label id="msg">Click directly above the dividend decimal point to place the quotient decimal point</label>
<%      } else { %>
            <label id="msg">Click where first quotient digit should be</label>
<%      }
    } else { %>
        <label id="msg">Click where first quotient digit should be</label>
<% } %>
</div>

<div class="d5">
<table>
<tr>    
    <td>
    <button type="reset" onclick="startDivAgain()" >Next Problem</button>
    </td>
    <td></td>
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
</div>  
<div class="d4">
    <table>
    <tr><td><input type="checkbox" value="Show Borrows" name="showborrows" 
                   <%=isShowBrows%> onclick="zeroDivCounts()">
            <label>Show Borrows</label>
        </td>
    </tr>
    <tr>
        <td><input type="checkbox" value="Show Multiplication Carries" name="showmcarries" 
                   <%=isShowMcarries%> onclick="zeroDivCounts()">
            <label>Show Multiplication Carries</label>
        </td></tr>
    </table>
</div>

<div class="d5">  
<table>
    <tr><th colspan="1">Highest Difficulty Level</th></tr>
    <tr><td>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Immediate Feedback" 
            <%=isImmFeedBk%> onclick="zeroDivCounts()">
        <label>Immediate Feedback</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Estimation Required"
            <%=isEstRequired%> onclick="zeroDivCounts()">
        <label>Estimation Required</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Remainders" 
               id="Remainders"
            <%=isRemainders%> onclick="zeroDivCounts()"> 
        <label>Remainders</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Exact Decimals" 
            <%=isExDp%> onclick="zeroDivCounts()">
        <label>Exact Decimals</label>
    </td></tr>
    <tr><td>
        <input type="radio" name="difflvl" value="Recurring Decimals"
               id="Recurring Decimals"
            <%=isRecDp%> onclick="zeroDivCounts()">
        <label>Recurring Decimals</label>
    </td></tr>
        <tr><td>
        <input type="radio" name="difflvl" value="Round Off"
               id="Round Off"
            <%=isRndOff%> onclick="zeroDivCounts()">
        <label>Round Off</label>
    </td></tr>
</table>
</div>

              
<input type="<%=lbtype%>" name="startAgain" id="startAgain" >
<input type="<%=lbtype%>" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="<%=lbtype%>" id="quotDp" value="<%=expQuotDp%>" class="shortbox">
<input type="<%=lbtype%>" id="dvsrDp" value="1" class="shortbox">
<input type="<%=lbtype%>" id="dvdDp" value="<%=expDvdDp%>" class="shortbox"> 
<input type="<%=lbtype%>" id="dvs" name="decsettled" value="<%=dsdpsettled%>" class="shortbox">
<input type="<%=lbtype%>" id="dvd" name="decsettled" value="<%=dddpsettled%>" class="shortbox">
<input type="<%=lbtype%>" id="quo" name="decsettled" value="<%=qtdpsettled%>" class="shortbox">

<input type="<%=lbtype%>" id="divisor" value="<%=divisor%>" >
<input type="<%=lbtype%>" id="quotDigs" value="<%=quotDigs%>" >
<input type="<%=lbtype%>" id="quotient" value="<%=quotient%>" >
<input type="<%=lbtype%>" id="nSigDig" value="<%=nSigDig%>" >

<input type="<%=lbtype%>" id="dividend" value="<%=dividnd%>" >
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
    <td></td>
</tr>
</tbody>
</table>
</form>

</div>

</body>
</html>

