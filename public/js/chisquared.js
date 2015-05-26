$(function(window) {
    var approxGamma;
    var igf;

    function chisqr(Dof, Cv) {
        'use strict';
        var PValue, K, X;
        var gamma = approxGamma;
        if (Cv < 0 || Dof < 1) {
            return 0.0;
        }
        K = Dof * 0.5;
        X = Cv * 0.5;
        if (Dof === 2) {
            return Math.exp(-1.0 * X);
        }
        PValue = igf(K, X);
        if (isNaN(PValue) || !isFinite(PValue) || PValue <= 1e-8) {
            return 1e-14;
        }
        PValue /= gamma(K);
        //PValue /= tgamma(K);
        return (1.0 - PValue);
    }

    igf = function (S, Z) {
        'use strict';
        var Sum, Nom, Denom, Sc;
        if (Z < 0.0) {
            return 0.0;
        }
        Sc = (1.0 / S);
        Sc *= Math.pow(Z, S);
        Sc *= Math.exp(-Z);
        Sum = 1.0;
        Nom = 1.0;
        Denom = 1.0;
        for (var I = 0; I < 200; I++) {
            Nom *= Z;
            S++;
            Denom *= S;
            Sum += (Nom / Denom);
        }
        return Sum * Sc;
    };
    approxGamma = function (Z) {
        'use strict';
        var RECIP_E = 0.36787944117144232159552377016147; // RECIP_E = (E^-1) = (1.0 / E)
        var TWOPI = 6.283185307179586476925286766559; // TWOPI = 2.0 * PI
        var D = 1.0 / (10.0 * Z);
        D = 1.0 / ((12 * Z) - D);
        D = (D + Z) * RECIP_E;
        D = Math.pow(D, Z);
        D *= Math.sqrt(TWOPI / Z);
        return D;
    };
    function criticalValue(n, os, es) {
        var o, e, sum = 0.0;
        for (var i = 0; i < n; i++) {
            var next;
            o = os[i];
            e = es[i];
            next = (o - e) * (o - e) / e;
            sum += next;
        }
        return sum;
    }

    window.fairness = function(n, os, es) {
        return chisqr(n - 1, criticalValue(n, os, es));
    };

    window.sum = function(xs) {
        return xs.reduce(function (x, y) {
            return x + y;
        }, 0);
    };

    window.scale = function(xs, s) {
        return xs.map(function (x) {
            return x * s;
        });
    };

    window.isSignificant = function (os) {
        console.log("scale", sum(os) / 100);
        console.log(fairness(4, os, scale([25, 25, 25, 25], sum(os) / 100)));
        return 0.05 > fairness(4, os, scale([25, 25, 25, 25], sum(os) / 100));
    };

    function _scaleMinimal(os) {
        var _os = scale(os, 1/sum(os));
        var _scale = 1;
        /*SolveWithNewton(
            aFunction, aTarget, aGuess, aPrecision, aErrFunction );*/
        function aFunction(s){
            return 0.05 - fairness(4, scale(_os, s),
                scale([0.25, 0.25, 0.25, 0.25], s));
        }

        return SolveWithNewton(aFunction, 0, 100, 0.01);
    }

    window.scaleMinimal= function(os) {
        return _scaleMinimal(os) * (1 / sum(os));
    };
    window.minimalRequired = function(os) {
        return Math.ceil(sum(os)* scaleMinimal(os))
    }
}(window));
