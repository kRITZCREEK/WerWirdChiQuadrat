function CNewtonSolver() {
    this.Reset();
}

CNewtonSolver.prototype.Reset = function() {
    this.F = function(X) { return X; }
    this.Target = 0.0;
    this.Guess = 0.0;
    this.Precision = 0.0001;
    this.Eps = this.Precision / 2.0;
    this.Result = 0.0;
    this.MaxLoops = 1000;
    this.Status = 'not solved';
    this.NLoops = 0;
}

CNewtonSolver.prototype.CheckValue = function( v ) {
    if (!isFinite(v)) {
        this.Status = 'Infinite function value';
        return false;
    }
    if (isNaN(v)) {
        this.Status = 'Not a Number (NaN) returned from function';
        return false;
    }
    return true;
}

CNewtonSolver.prototype.Solve = function( aFunction, aTarget, aGuess, aPrecision ) {
    var dx, X, Y, Y1, Y2, Xnew, slope;
    this.Result = aGuess;
    if (typeof(aFunction)  !='undefined') { this.F         = aFunction;  }
    if (typeof(aTarget)    !='undefined') { this.Target    = aTarget;  }
    if (typeof(aGuess)     !='undefined') { this.Guess     = aGuess;     }
    if (typeof(aPrecision) !='undefined') { this.Precision = aPrecision; }
    if (this.MaxLoops == 0) {
        this.Status = 'MaxLoops = 0 not allowed';
        return this.Result;
    }
    if (isNaN(this.MaxLoops)) {
        this.Status = 'MaxLoops is Not a Number (NaN)';
        return this.Result;
    }
    if (!isFinite(this.MaxLoops)) {
        this.Status = 'MaxLoops is infinite';
        return this.Result;
    }
    if (this.Precision == 0) {
        this.Status = 'Precision = 0 not allowed';
        return this.Result;
    }
    if (isNaN(this.Precision)) {
        this.Status = 'Precision is Not a Number (NaN)';
        return this.Result;
    }
    if (!isFinite(this.Precision)) {
        this.Status = 'Precision is infinite';
        return this.Result;
    }
    if (isNaN(this.Target)) {
        this.Status = 'Target is Not a Number (NaN)';
        return this.Result;
    }
    if (!isFinite(this.Target)) {
        this.Status = 'Target is infinite';
        return this.Result;
    }
    if (isNaN(this.Guess)) {
        this.Status = 'Guess is Not a Number (NaN)';
        return this.Result;
    }
    if (!isFinite(this.Guess)) {
        this.Status = 'Guess is infinite';
        return this.Result;
    }
    this.NLoops = 0;
    this.Status = '';
    this.Eps = this.Precision / 2.0;
    var Eps2 = this.Eps / 2;
    Xnew = this.Guess;
    do {
        X = Xnew;
        try {
            Y = this.F(X) - this.Target;
            if (!this.CheckValue(Y)) break;
            if (Y == 0) break; // exact solution found

            Y1 = this.F(X - Eps2) - this.Target;
            if (!this.CheckValue(Y1)) break;
            if (Y1 == 0) { // exact solution found
                Xnew = X - Eps2;
                break;
            }

            Y2 = this.F(X + Eps2) - this.Target;
            if (!this.CheckValue(Y2)) break;
            if (Y2 == 0) { // exact solution found
                Xnew = X + Eps2;
                break;
            }

            slope = (Y2 - Y1) / this.Eps;
            if (slope == 0) { // slope zero, cant find a solution
                this.Status = 'extremum found';
                break;
            }

            Xnew = X - (Y / slope);

        } catch(err) {
            this.Status = err.message;
            break;
        }

        this.NLoops++;
        dx = Math.abs( Xnew - X );

    } while ((dx > this.Precision) && (this.NLoops < this.MaxLoops));

    this.Result = Xnew;

    if (this.Status == '' && this.NLoops >= this.MaxLoops) this.Status = 'max loops exceedet';
    return this.Result;
}

function SolveWithNewton( aFunction, aTarget, aGuess, aPrecision, aErrFunction ) {
    // function aFunction( X )
    // function aErrFunction( aMessage )
    var solver = NewtonSolver;
    // create a new solver for recursion
    NewtonSolver = new CNewtonSolver();
    solver.Solve( aFunction, aTarget, aGuess, aPrecision );
    if (solver.Status != '' && aErrFunction) aErrFunction( solver.Status );
    NewtonSolver = solver;
    return solver.Result;
}

var NewtonSolver = new CNewtonSolver();