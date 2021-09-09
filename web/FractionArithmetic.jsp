<%-- 
    Document   : FractionArithmetic
    Created on : Jun 1, 2021, 2:28:58 PM
    Author     : irene
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Fraction Arithmetic</title>
        <link rel="stylesheet" href="FractionArithmetic.css" type="text/css">
        <script src="FractionArithmetic.js"></script>
        <script src="Reduce.js"></script>
</head>
<body>
<form id="th-id2">
<% 
    
    String instrs = "blank";
    String instr2 = "blank";
    String instr3 = "";//Click 'done' when finished";
    final int MAXROWS = 4;
    final int MAXCOLS = 3;
    final int MAXDEN = 25;
    int[] num = new int[MAXROWS];
    int[] den = new int[MAXROWS];
    int whol = 1;
    int maxwhol = 9;
    int nrows = 1;
    int ncols = 1;
    int ntwos = 7; // 6; // one more than actual max
    int nthrees = 4;
    int nfives = 3;
    int nittwos = 7; // 6; // one more than actual max
    int nitthrees = 4;
    int nitfives = 3;
    String whatOp = "&divide";
    boolean isDivide = true;
    final double EXP = 2.4; //4.4;
    int twogen = 0;
    int threegen = 0;
    int fivegen = 0;
    int gran = 100;
    int[] acttwos = new int[2];
    int[] actthrees = new int[2];
    int[] actfives = new int[2];
    int[] actbigs = new int[2];
    int d2fact = 1;
    int d3fact = 1;
    int d5fact = 1;
    double max2;
    double max3;
    double max5;
    int numtwos;
    int numthrees;
    int numfives;
    int n2fact = 1;
    int n3fact = 1;
    int n5fact = 1;
    
    boolean addCk = true;
    String isAdd = "checked";

    boolean subCk = false;
    String isCommonDenom = "";
    
    boolean mulCk = false;
    String isMul = "";
    
    boolean divCk = true;
    String isDiv = "checked";
    
    // checks is null on first rendition of page, will contain
    // last settings after that so they can be carried forward
    String[] checks = request.getParameterValues("selected");
    int len = 0;
    if( checks != null ) {
        len = checks.length;
        addCk = false;
        isAdd = "";
        subCk = false;
        isCommonDenom = "";
        mulCk = false;
        isMul = "";
        divCk = false;
        isDiv = "";
    }
    for( int i = 0; i < len; ++i ) {
        //System.out.println("checks[" + i + "]: " + checks[i]);
        if( checks[i].compareTo("Add") == 0 ) {
            addCk = true;
            isAdd = "checked";
        } else if( checks[i].compareTo("Sub") == 0 ) {
            subCk = true;
            isCommonDenom = "checked";
        } else if( checks[i].compareTo("Mul") == 0 ) {
            mulCk = true;
            isMul = "checked";       
        } else if( checks[i].compareTo("Div") == 0 ) {
            divCk = true;
            isDiv = "checked";
        }
    }
    
    boolean running = false;
    int indcatr = 0;
    String startHere = "d0_4";
    int lcm = 1;
    int minind = 0;
    int maxind = 4;
    if( !addCk ) {
    	minind = 1;
    	if( !subCk ) {
    		minind = 2;
    		if( !mulCk ) {
    			minind = 3;
    		}
    	}
    } 
    if( !divCk ) {
    	maxind = 3;
    	if( !mulCk ) {
    		maxind = 2;
    		if( !subCk ) {
    			maxind = 1;
    		}
    	}
    }
    
    genNumbers:
    while( !running ) {
        indcatr = (int)(minind + (maxind - minind)*StrictMath.random());
        System.out.println("minind: " + minind + " maxind: " + maxind + " indcatr: " + indcatr);
        if( indcatr == 0 && addCk ) {
            running = true;
            instrs = "Add these Fractions.";
            whatOp = "+";
            boolean sameden = (10*Math.random() > 8 );
            //int whatBig = 11;
            for( int i = 0; i < 2; ++i ) {
            	if( i == 1 && sameden ) {
            		acttwos[1] = acttwos[0];
            		actthrees[1] = actthrees[0];
            		actfives[1] = actfives[0];
            	} else {
            		/*
            		int bigsel = (int)(gran*5*Math.random());
            		
            		switch(bigsel) {
            			case 0:
            				whatBig = 11;
            				break;
            			case 1:
            				whatBig = 13;
            				break;
            			case 2:
            				whatBig = 17;
            				break;
            			case 3:
            				whatBig = 19;
            				break;
            			case 4: 
            				whatBig = 23;
            				break;
            		}
            		int biggen = (int)(gran*2*Math.random()); */
            		actbigs[i] = 0; //biggen > gran? 1 : 0;
            		fivegen = (int)(gran*(nfives-actbigs[i])*Math.random());
		            actfives[i] = fivegen > 2*gran? 2 : fivegen > gran? 1 : 0;
		            threegen = (int)(gran*(nthrees-actbigs[i]-actfives[i])*Math.random());
		            actthrees[i] = threegen > 3*gran? 3 : threegen > 2*gran? 2 : threegen > gran? 1 : 0;
		            twogen = (int)(gran*(ntwos-actbigs[i]-actfives[i]-actthrees[i])*Math.random());
		            acttwos[i] = twogen > 5*gran? 5 : twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;		            
            	}
	            d2fact = (int)(StrictMath.pow(2,acttwos[i]));
	            d3fact = (int)(StrictMath.pow(3,actthrees[i]));
	            d5fact = (int)(StrictMath.pow(5,actfives[i]));
	            //int dbigfact = (int)(StrictMath.pow(whatBig,actbigs[i]));
	            den[i] = d2fact*d3fact*d5fact; //*dbigfact;
	
	            max2 = Double.valueOf((den[0]+1)*(1 - Math.random()));
	            numtwos = (int)(Math.log(max2)/Math.log(2));
	            if( numtwos < 0 ) {
	              numtwos = 0;
	            } else if( numtwos > ntwos - 1 ) {
	              numtwos = ntwos - 1;
	            }
	            n2fact = (int)(StrictMath.pow(2,numtwos));
	            if( n2fact < 1 ) {
	            	n2fact = 1;
	            }
	            System.out.println("add den: " + den[i] + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
	            max3 = Double.valueOf((den[0]/n2fact+1)*(1 - Math.random()));
	            numthrees = (int)(Math.log(max3)/Math.log(3));
	            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
	            //numthrees = (Double.valueOf((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
	            n3fact = (int)(StrictMath.pow(3,numthrees));
	            if( n3fact < 1 ) {
	            	n3fact = 1;
	            }
	            max5 = Double.valueOf((den[0]/(n2fact*n3fact)+1)*(1 - Math.random())) ;
	            numfives = (int)(Math.log(max5)/Math.log(5));
	            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
	            n5fact = (int)(StrictMath.pow(5,numfives));
	            if( n5fact < 1 ) {
	            	n5fact = 1;
	            }
	            num[i] = n2fact*n3fact*n5fact;
	
	            //ncols = (int)(acttwos + actthrees + actfives);
            }
            // how many factor columns required to convert den[0] and den[1] to same denominator
            int twodiff = 0;
            lcm = den[0];
            int tot0diff = 0;
            int tot1diff = 0;
            if( acttwos[0] > acttwos[1] ) {
            	twodiff = acttwos[0] - acttwos[1];
            	tot0diff += twodiff;
            } else {
            	twodiff = acttwos[1] - acttwos[0];
            	lcm *= (int)(StrictMath.pow(2,twodiff));
            	tot1diff += twodiff;
            }
            int threediff = 0;
            if( actthrees[0] > actthrees[1] ) {
            	threediff = actthrees[0] - actthrees[1];
            	tot0diff += threediff;;
            } else {
            	threediff = actthrees[1] - actthrees[0];
            	lcm *= (int)(StrictMath.pow(3,threediff));
            	tot1diff += threediff;
            }
            int fivediff = 0;
            if( actfives[0] > actfives[1] ) {
            	fivediff = actfives[0] - actfives[1];
            	tot0diff += fivediff;
            } else {
            	fivediff = actfives[1] - actfives[0];
            	lcm *= (int)(StrictMath.pow(5,fivediff));
            	tot1diff += fivediff;
            }
            ncols = tot0diff > tot1diff? tot0diff : tot1diff;
            ncols += 8; // fixit 1;
            instr2 = "Are both denominators the same? (Y/N)";
            startHere = "d0_4";
            //instr3 = "If so, copy " + den[0] + ", otherwise click after one of the fractions to insert a multiplying factor.";
        } else if( indcatr == 1 && subCk ) { // infinite loops fixit
            running = true;
            instrs = "Subtract 2nd Fraction from the 1st";
            whatOp = "-";
            boolean sameden = (10*Math.random() > 8 );
            //int whatBig = 11;
            for( int i = 0; i < 2; ++i ) {
            	if( i == 1 && sameden ) {
            		acttwos[1] = acttwos[0];
            		actthrees[1] = actthrees[0];
            		actfives[1] = actfives[0];
            	} else {
            		actbigs[i] = 0; //biggen > gran? 1 : 0;
            		fivegen = (int)(gran*(nfives-actbigs[i])*Math.random());
		            actfives[i] = fivegen > 2*gran? 2 : fivegen > gran? 1 : 0;
		            threegen = (int)(gran*(nthrees-actbigs[i]-actfives[i])*Math.random());
		            actthrees[i] = threegen > 3*gran? 3 : threegen > 2*gran? 2 : threegen > gran? 1 : 0;
		            twogen = (int)(gran*(ntwos-actbigs[i]-actfives[i]-actthrees[i])*Math.random());
		            acttwos[i] = twogen > 5*gran? 5 : twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;		            
            	}
	            d2fact = (int)(StrictMath.pow(2,acttwos[i]));
	            d3fact = (int)(StrictMath.pow(3,actthrees[i]));
	            d5fact = (int)(StrictMath.pow(5,actfives[i]));
	            den[i] = d2fact*d3fact*d5fact; //*dbigfact;
	            max2 = Double.valueOf((den[0]+1)*(1 - Math.random()));
	            numtwos = (int)(Math.log(max2)/Math.log(2));
	            if( numtwos < 0 ) {
	              numtwos = 0;
	            } else if( numtwos > ntwos - 1 ) {
	              numtwos = ntwos - 1;
	            }
	            n2fact = (int)(StrictMath.pow(2,numtwos));
	            if( n2fact < 1 ) {
	            	n2fact = 1;
	            }
	            System.out.println("subtract den: " + den[i] + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
	            max3 = Double.valueOf((den[0]/n2fact+1)*(1 - Math.random()));
	            numthrees = (int)(Math.log(max3)/Math.log(3));
	            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
	            n3fact = (int)(StrictMath.pow(3,numthrees));
	            if( n3fact < 1 ) {
	            	n3fact = 1;
	            }
	            max5 = Double.valueOf((den[0]/(n2fact*n3fact)+1)*(1 - Math.random())) ;
	            numfives = (int)(Math.log(max5)/Math.log(5));
	            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
	            n5fact = (int)(StrictMath.pow(5,numfives));
	            if( n5fact < 1 ) {
	            	n5fact = 1;
	            }

	            num[i] = n2fact*n3fact*n5fact;
	            double frstfrc = (double)num[0]/(double)den[0];
	            if( frstfrc <= 0 ) {
	            	running = false;
	            	continue genNumbers;
	            }
	            boolean toobig = i > 0 && (double)num[1]/(double)den[1] > frstfrc;
	            while( toobig ) {
	            	int whichfact = (int)(3*Math.random());
	            	if( whichfact == 0 && num[1]%2 == 0 ) {
	            		num[1] = num[1]/2;
	            	} else if( whichfact == 1 && num[1]%3 == 0 ) {
	            		num[1] = num[1]/3;
	            	} else if( whichfact == 1 && num[1]%5 == 0 ) {
	            		num[1] = num[1]/5;
	            	}
	            	toobig = (double)num[1]/(double)den[1] > frstfrc;
	            	if( toobig && num[1] == 1 ) {
	            		running = false;
	            		continue genNumbers;
	            	}
	            }
            }
            // how many factor columns required to convert den[0] and den[1] to same denominator
            int twodiff = 0;
            lcm = den[0];
            int tot0diff = 0;
            int tot1diff = 0;
            if( acttwos[0] > acttwos[1] ) {
            	twodiff = acttwos[0] - acttwos[1];
            	tot0diff += twodiff;
            } else {
            	twodiff = acttwos[1] - acttwos[0];
            	lcm *= (int)(StrictMath.pow(2,twodiff));
            	tot1diff += twodiff;
            }
            int threediff = 0;
            if( actthrees[0] > actthrees[1] ) {
            	threediff = actthrees[0] - actthrees[1];
            	tot0diff += threediff;;
            } else {
            	threediff = actthrees[1] - actthrees[0];
            	lcm *= (int)(StrictMath.pow(3,threediff));
            	tot1diff += threediff;
            }
            int fivediff = 0;
            if( actfives[0] > actfives[1] ) {
            	fivediff = actfives[0] - actfives[1];
            	tot0diff += fivediff;
            } else {
            	fivediff = actfives[1] - actfives[0];
            	lcm *= (int)(StrictMath.pow(5,fivediff));
            	tot1diff += fivediff;
            }
            ncols = tot0diff > tot1diff? tot0diff : tot1diff;
            ncols += 8; // fixit 1;
            instr2 = "Are both denominators the same? (Y/N)";
            startHere = "d0_4";
        } else if( indcatr == 2 && mulCk ) {
        	// allow for cancellation fixit
            running = true;
            instrs = "Multiply these Fractions.";
            whatOp = "&times";
            //instr3 = " Click 'done' when reduced.";
            ntwos = nittwos - 3;
            nthrees = nitthrees - 3;
            nfives = nitfives - 2;
            int leaveWhatOut = (int)(3*Math.random());
            for( int i = 0; i < 2; ++i ) {
            	if( leaveWhatOut > 0 ) {
		            twogen = (int)(gran*ntwos*Math.random());
		            acttwos[i] = twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
			        d2fact = (int)(StrictMath.pow(2,acttwos[i]));
	            }
            	if( leaveWhatOut != 1 ) {
		            threegen = (int)(gran*nthrees*Math.random());
		            actthrees[i] = threegen > 2*0.7*gran? 2 : threegen > 0.7*gran? 1 : 0;
		            d3fact = (int)(StrictMath.pow(3,actthrees[i]));
            	}
            	if( leaveWhatOut < 2 ) {
		            fivegen = (int)(gran*nfives*Math.random());
		            actfives[i] = fivegen > 0.7*gran? 1 : 0; // make fives more likely
		            d5fact = (int)(StrictMath.pow(5,actfives[i]));
            	}            	
	            System.out.println("acttwos: " + acttwos[i] + " d2fact: " + d2fact);
	            System.out.println("actthrees: " + actthrees[i] + " d3fact: " + d3fact);
	            System.out.println("actfives: " + actfives[i] + " d5fact: " + d5fact);
	            num[i] = d2fact*d3fact*d5fact;
	            System.out.println("leaveWhatOut: " + leaveWhatOut + " twogen: " + twogen + " threegen: " + threegen + " fivegen: " + fivegen + " den[" + i + "]: " + den[i]);            		            
	            int nextnum = 1;
	            numtwos = acttwos[i] > 0? 0 : ntwos;
	            numthrees = actthrees[i] > 0? 0 : nthrees;
	            numfives = actfives[i] > 0? 0 : nfives;
	            int min = 0;
	            int max = 3;
	            if( numtwos == 0 ) {
	            	min = 1;
	            	if( numthrees == 0 ) {
	            		min = 2;
	            	}
	            }
	            if( numfives == 0 ) {
	            	max = 2;
	            	if( numthrees == 0 ) {
	            		max = 1;
	            	}
	            }
	            System.out.println("numtwos: " + numtwos + " numthrees: " + numthrees + " numfives: " + numfives + " min: " + min + " max: " + max);
	            den[i] = 1;
	            while( den[i] < num[i] && (numtwos > 0 || numthrees > 0 || numfives > 0) ) {
	            	int whatsnext = (int)(min + (max - min)*Math.random());
	            	if( whatsnext < 1 && numtwos > 0 ) {
	            		den[i] *= 2;
	            		numtwos -= 1;
	            		if( numtwos == 0 ) {
	            			min = 1;
	            		}
	            	} else if( whatsnext < 2 && numthrees > 0 ) {
	            		den[i] *= 3;
	            		numthrees -= 1;
	            		if( numthrees == 0 ) {
	            			if( numtwos == 0 ) {
	            				min = 2;
	            			}
	            			if( numfives == 0 ) {
	            				max = 1;
	            			}
	            		}
	            	} else if( numfives > 0 ) {
	            		den[i] *= 5;
	            		numfives -= 1;
	            		if( numfives == 0 ) {
	            			max = 2;
	            		}
	            	}
	            	System.out.println("whatsnext: " + whatsnext + " num[" + i + "]: " + num[i]);
	            }
	            System.out.println("num[" + i + "]: " + num[i]);
	            if( den[i] == 1 ) {
	            	running = false;
	           }
            }

         	// how many factor columns required to convert den[0] and den[1] to same denominator
            int twodiff = 0;
            lcm = den[0];
            int tot0diff = 0;
            int tot1diff = 0;
            if( acttwos[0] > acttwos[1] ) {
            	twodiff = acttwos[0] - acttwos[1];
            	tot0diff += twodiff;
            } else {
            	twodiff = acttwos[1] - acttwos[0];
            	lcm *= (int)(StrictMath.pow(2,twodiff));
            	tot1diff += twodiff;
            }
            int threediff = 0;
            if( actthrees[0] > actthrees[1] ) {
            	threediff = actthrees[0] - actthrees[1];
            	tot0diff += threediff;;
            } else {
            	threediff = actthrees[1] - actthrees[0];
            	lcm *= (int)(StrictMath.pow(3,threediff));
            	tot1diff += threediff;
            }
            int fivediff = 0;
            if( actfives[0] > actfives[1] ) {
            	fivediff = actfives[0] - actfives[1];
            	tot0diff += fivediff;
            } else {
            	fivediff = actfives[1] - actfives[0];
            	lcm *= (int)(StrictMath.pow(5,fivediff));
            	tot1diff += fivediff;
            }
            ncols = tot0diff > tot1diff? tot0diff : tot1diff;
            ncols += 8; // fixit 1;
            instr2 = "Multiply the denominators: " + den[0] + " times " + den[1];
           	startHere = "d0_4";
        } else if( indcatr == 3 && divCk ) {
            running = true;
            instrs = "Divide first Fraction by second fraction.";
            whatOp = "&times";
            //instr3 = " Click 'done' when reduced.";
            ntwos = nittwos - 3;
            nthrees = nitthrees - 3;
            nfives = nitfives - 2;
            int leaveWhatOut = (int)(3*Math.random());
            for( int i = 0; i < 2; ++i ) {
            	if( leaveWhatOut > 0 ) {
		            twogen = (int)(gran*ntwos*Math.random());
		            acttwos[i] = twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
			        d2fact = (int)(StrictMath.pow(2,acttwos[i]));
	            }
            	if( leaveWhatOut != 1 ) {
		            threegen = (int)(gran*nthrees*Math.random());
		            actthrees[i] = threegen > 2*0.7*gran? 2 : threegen > 0.7*gran? 1 : 0;
		            d3fact = (int)(StrictMath.pow(3,actthrees[i]));
            	}
            	if( leaveWhatOut < 2 ) {
		            fivegen = (int)(gran*nfives*Math.random());
		            actfives[i] = fivegen > 0.7*gran? 1 : 0; // make fives more likely
		            d5fact = (int)(StrictMath.pow(5,actfives[i]));
            	}            	
	            System.out.println("acttwos: " + acttwos[i] + " d2fact: " + d2fact);
	            System.out.println("actthrees: " + actthrees[i] + " d3fact: " + d3fact);
	            System.out.println("actfives: " + actfives[i] + " d5fact: " + d5fact);
	            num[i] = d2fact*d3fact*d5fact;
	            System.out.println("leaveWhatOut: " + leaveWhatOut + " twogen: " + twogen + " threegen: " + threegen + " fivegen: " + fivegen + " den[" + i + "]: " + den[i]);            		            
	            int nextnum = 1;
	            numtwos = acttwos[i] > 0? 0 : ntwos;
	            numthrees = actthrees[i] > 0? 0 : nthrees;
	            numfives = actfives[i] > 0? 0 : nfives;
	            int min = 0;
	            int max = 3;
	            if( numtwos == 0 ) {
	            	min = 1;
	            	if( numthrees == 0 ) {
	            		min = 2;
	            	}
	            }
	            if( numfives == 0 ) {
	            	max = 2;
	            	if( numthrees == 0 ) {
	            		max = 1;
	            	}
	            }
	            System.out.println("numtwos: " + numtwos + " numthrees: " + numthrees + " numfives: " + numfives + " min: " + min + " max: " + max);
	            den[i] = 1;
	            while( den[i] < num[i] && (numtwos > 0 || numthrees > 0 || numfives > 0) ) {
	            	int whatsnext = (int)(min + (max - min)*Math.random());
	            	if( whatsnext < 1 && numtwos > 0 ) {
	            		den[i] *= 2;
	            		numtwos -= 1;
	            		if( numtwos == 0 ) {
	            			min = 1;
	            		}
	            	} else if( whatsnext < 2 && numthrees > 0 ) {
	            		den[i] *= 3;
	            		numthrees -= 1;
	            		if( numthrees == 0 ) {
	            			if( numtwos == 0 ) {
	            				min = 2;
	            			}
	            			if( numfives == 0 ) {
	            				max = 1;
	            			}
	            		}
	            	} else if( numfives > 0 ) {
	            		den[i] *= 5;
	            		numfives -= 1;
	            		if( numfives == 0 ) {
	            			max = 2;
	            		}
	            	}
	            	System.out.println("whatsnext: " + whatsnext + " num[" + i + "]: " + num[i]);
	            }
	            System.out.println("num[" + i + "]: " + num[i]);
	            if( den[i] == 1 ) {
	            	running = false;
	           }
            }

         	// how many factor columns required to convert den[0] and den[1] to same denominator
            int twodiff = 0;
            lcm = den[0];
            int tot0diff = 0;
            int tot1diff = 0;
            if( acttwos[0] > acttwos[1] ) {
            	twodiff = acttwos[0] - acttwos[1];
            	tot0diff += twodiff;
            } else {
            	twodiff = acttwos[1] - acttwos[0];
            	lcm *= (int)(StrictMath.pow(2,twodiff));
            	tot1diff += twodiff;
            }
            int threediff = 0;
            if( actthrees[0] > actthrees[1] ) {
            	threediff = actthrees[0] - actthrees[1];
            	tot0diff += threediff;;
            } else {
            	threediff = actthrees[1] - actthrees[0];
            	lcm *= (int)(StrictMath.pow(3,threediff));
            	tot1diff += threediff;
            }
            int fivediff = 0;
            if( actfives[0] > actfives[1] ) {
            	fivediff = actfives[0] - actfives[1];
            	tot0diff += fivediff;
            } else {
            	fivediff = actfives[1] - actfives[0];
            	lcm *= (int)(StrictMath.pow(5,fivediff));
            	tot1diff += fivediff;
            }
            ncols = tot0diff > tot1diff? tot0diff : tot1diff;
            ncols += 8; // fixit 1;
            instr2 = "Copy the second numerator: " + den[1] + " to denominator";
           	startHere = "d0_3";
        }
    }
%>


<div class="d3"><%=instrs%></div>
<div id="instr2" class="d4"><%=instr2%></div>
<div id="instr3" class="d4"><%=instr3%></div>
<div class="d1">
<table>
<%  if( indcatr < 2 && ( addCk || subCk ) ) {
		String nid = "";
		String did = "";
        //for( int i = 0; i < 2; ++i ) { 
            nid = "n0_0";
            did = "d0_0"; 
            String op = whatOp; 
            String oid = "o0_0"; %>
        <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="<%=nid%>" onclick="show()" >  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="<%=did%>" onclick="show()" >
                </td></tr>
            </table>
        </td>
       
<%      String itype = "text";
		String equalSgn = "=";
        
		nid = "n0_1";
        did = "d0_1"; 
        itype = "hidden";
        op = ""; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
		<td>
			
		    <table>
		        <tr><td> 
		            <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" 
		            onkeydown="erase( event )" value="">
		        </td></tr>
		        <tr><td>
		            <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" 
		            onkeydown="erase( event )" value=""> 
		        </td></tr>
		    </table>
		</td>
<% 		itype = "text";
		op = whatOp; 
		oid = "o0_1"; 
		nid = "n0_2";
        did = "d0_2"; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[1]%>" id="<%=nid%>">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[1]%>" id="<%=did%>">
                </td></tr>
            </table>
        </td>
<%  	itype = "hidden";
    	op = ""; //"&times"; 
    	oid = "o0_2"; 
		nid = "n0_3";
        did = "d0_3"; %>
    <td id="<%=oid%>" class="sym"><%=op%></td>
    <td>
        <table>
            <tr><td>
                <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" 
                onkeydown="erase( event )" value="">
            </td></tr>
            <tr><td>
                <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" 
                onkeydown="erase( event )" value="">     
            </td></tr>
        </table>
    </td>

            

<%		itype = "text";
		String ntd = "num";
		for( int j = 0, k = 3; j < ncols; ++j ) {   
    		String eid = "e0" + "_" + k;
            k = k + 1;
            
            nid = "n0_" + k;
            did = "d0_" + k; 
            oid = "o0_" + k; 
            op = ""; // "&times";  %>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
    <%          k = k + 1; 
                nid = "n0" + "_" + k;
                did = "d0" + "_" + k; 
                itype = "hidden";
                ntd = "";
                equalSgn = "";
                oid = "o0_" + k;
                op = ""; // whatOp; %>

        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
    <%          //itype = "text"; //"hidden";
                //equalSgn = "";
                //op = "";
                k = k + 1;
            nid = "n0" + "_" + k;
            did = "d0" + "_" + k; 
                 
            eid = "e0" + "_" + k; 
            oid = "o0_" + k;
            // op = "&times"; %>
        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
		<td id="<%=oid%>" class="sym"><%=op%></td>
    <%          k = k + 1; 
                nid = "n0" + "_" + k;
                did = "d0" + "_" + k; 
                //itype = "text"; //"hidden";
                ntd = "";
                //equalSgn = ""; %>
        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
    <%          //itype = "hidden";
                ntd = "";
                //equalSgn = "";
                //op = "";
            }
    %>
        </tr>
<%  } else if( indcatr == 2 && mulCk ) {
		String nid = "";
		String did = "";
        nid = "n0_0";
        did = "d0_0"; 
        String op = "&times"; 
        String oid = "o0_0"; %>
        <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="<%=nid%>" onclick="show()" >  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="<%=did%>" onclick="show()" >
                </td></tr>
            </table>
        </td>
       
<%      String itype = "text";
		String equalSgn = "="; 
		oid = "o0_1"; 
		nid = "n0_1";
        did = "d0_1"; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[1]%>" id="<%=nid%>">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[1]%>" id="<%=did%>">
                </td></tr>
            </table>
        </td>
<%		String ntd = "num";
		op = "";
		for( int j = 0, k = 3; j < ncols; ++j ) {   
    		String eid = "e0" + "_" + k;
            k = k + 1;
            
            nid = "n0_" + k;
            did = "d0_" + k;
            k = k+ 1;
            oid = "o0_" + k; %>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
<%          itype = "hidden";
			equalSgn = "";
			ntd = "";
            k = k + 1;
            nid = "n0" + "_" + k;
            did = "d0" + "_" + k;              
            eid = "e0" + "_" + k; %>        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" 
                    onkeyup="checkFact( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )"
                    onkeyup="checkFact( event )" value="">     
                </td></tr>
            </table>
        </td>
<%          k = k + 1;
        } %>
        </tr>
<%  } else if( indcatr == 3 && divCk ) {
		String nid = "";
		String did = "";
        nid = "n0_0";
        did = "d0_0"; 
        String op = "&divide"; 
        String oid = "o0_1"; %>
        <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="n0_0" onclick="show()" >  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="d0_0" onclick="show()" >
                </td></tr>
            </table>
        </td>
       
<%      String itype = "text";
		String equalSgn = "="; 
		oid = "o0_1"; 
		nid = "n0_1";
        did = "d0_1"; %>

        <td class="sym" id="o0_1" ><%=op%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=den[1]%>" id="n0_1">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=num[1]%>" id="d0_1">
                </td></tr>
            </table>
        </td>
        <td class="sym" id="e0_2"><%=equalSgn%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="n0_2" onclick="show()" >  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="d0_2" onclick="show()" >
                </td></tr>
            </table>
        </td>
<% 		op = "&times"; %>
        <td id="o0_3" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input type="<%=itype%>" id="n0_3" onkeydown="erase( event )" 
                    onkeyup="checkInv( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="d0_3" onkeydown="erase( event )"
                    onkeyup="checkInv( event )" value="">     
                </td></tr>
            </table>
        </td>
        
<% 		String ntd = "num";
		op = "";
		for( int j = 0, k = 3; j < ncols; ++j ) {   
    		String eid = "e0" + "_" + k;
            k = k + 1;
            
            nid = "n0_" + k;
            did = "d0_" + k;
            k = k+ 1;
            oid = "o0_" + k; %>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
<%          itype = "hidden";
			equalSgn = "";
			ntd = "";
            k = k + 1;
            nid = "n0" + "_" + k;
            did = "d0" + "_" + k;              
            eid = "e0" + "_" + k; %>        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" 
                    onkeyup="checkFact( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )"
                    onkeyup="checkFact( event )" value="">     
                </td></tr>
            </table>
        </td>
<%          k = k + 1;
        } %>
        </tr>
<%  } %> 

<tr>
        <th colspan="8"><button type="button" onclick="skip()" id="chkBx">Skip</button></th>
        <th colspan="1"><button type="button" onclick="checkAll()" id="chkBx">Done</button></th>
</tr>
<tr>
<th colspan="10" id="back">
	<div>
	      <a href="/" class="ndx">Home</a>
	</div>
	<div>
	      <a href="index.html" class="ndx">Back to Practice Index</a>
	</div>
</th>
</tr>
</table>

<table id="statusTable">
<% for( int i = 0, j = 1; i < 0; i += 2, j += 2 ) {
    String whatId = "statusBox" + i; 
    String whatId2 = "statusBox" + j; %>
    <tr>
    	<td><%=i%></td><td><div id="<%=whatId%>" style="color:white"></div></td>
    	<td><%=j%></td><td><div id="<%=whatId2%>" style="color:white"></div></td>
    </tr>
<% } %>
</table>

</div>

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
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="startHere" name="startHere" value="<%=startHere%>" class="shortbox">

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
<tr><td><input type="checkbox" value="Add" name="selected" 
                   <%=isAdd%> onclick="zeroCounts()">
            <label>Add</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Sub" name="selected" 
                   <%=isCommonDenom%> onclick="zeroCounts()">
            <label>Subtract</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Mul" name="selected" 
                   <%=isMul%> onclick="zeroCounts()">
            <label>Multiply</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Div" name="selected" 
                   <%=isDiv%> onclick="zeroCounts()">
            <label>Divide</label>
        </td>
</tr>
</table>
</div>


<input type="hidden" id="indcatr" value="<%=indcatr%>">
<input type="hidden" id="lcm" value="<%=lcm%>">
</form>

</body>
</html>
