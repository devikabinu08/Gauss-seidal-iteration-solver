/* ==========================================
   GET INPUT VALUE
========================================== */

function getValue(id) {

    const value = document.getElementById(id).value;

    if (value === "") {
        return null;
    }

    return Number(value);
}


/* ==========================================
   FORMAT EQUATION TERM
========================================== */

function formatTerm(coefficient, variable, isFirst) {

    if (coefficient === 0) {
        return "";
    }

    const absValue = Math.abs(coefficient);

    let coefficientText = "";

    /*
        Don't display coefficient 1.

        1x  → x
        1y  → y
        1z  → z
    */

    if (absValue !== 1) {
        coefficientText = absValue;
    }

    let sign = "";

    if (isFirst) {

        if (coefficient < 0) {
            sign = "-";
        }

    } else {

        if (coefficient < 0) {
            sign = " − ";
        } else {
            sign = " + ";
        }

    }

    return sign + coefficientText + variable;
}


/* ==========================================
   FORMAT COMPLETE EQUATION
========================================== */

function formatEquation(row, rhs) {

    const variables = ["x", "y", "z"];

    let equation = "";
    let hasTerm = false;

    for (let i = 0; i < 3; i++) {

        if (row[i] !== 0) {

            equation += formatTerm(
                row[i],
                variables[i],
                !hasTerm
            );

            hasTerm = true;
        }
    }

    /*
        If all coefficients are zero
    */

    if (!hasTerm) {
        equation = "0";
    }

    return equation + " = " + rhs;
}


/* ==========================================
   DISPLAY MESSAGE
========================================== */

function showMessage(text, type) {

    const message = document.getElementById("message");

    message.innerHTML = text;

    message.className = "message " + type;
}


/* ==========================================
   GAUSS-SEIDEL SOLVER
========================================== */

function solveGaussSeidel() {

    /* --------------------------------------
       GET MATRIX A
    -------------------------------------- */

    const A = [

        [
            getValue("a11"),
            getValue("a12"),
            getValue("a13")
        ],

        [
            getValue("a21"),
            getValue("a22"),
            getValue("a23")
        ],

        [
            getValue("a31"),
            getValue("a32"),
            getValue("a33")
        ]

    ];


    /* --------------------------------------
       GET RHS VECTOR B
    -------------------------------------- */

    const B = [

        getValue("b1"),
        getValue("b2"),
        getValue("b3")

    ];


    /* --------------------------------------
       VALIDATE MATRIX
    -------------------------------------- */

    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

            if (
                A[i][j] === null ||
                isNaN(A[i][j])
            ) {

                showMessage(
                    "❌ Please enter all 9 coefficient values.",
                    "error"
                );

                return;
            }
        }
    }


    /* --------------------------------------
       VALIDATE B
    -------------------------------------- */

    for (let i = 0; i < 3; i++) {

        if (
            B[i] === null ||
            isNaN(B[i])
        ) {

            showMessage(
                "❌ Please enter all 3 RHS constants.",
                "error"
            );

            return;
        }
    }


    /* --------------------------------------
       CHECK DIAGONAL ELEMENTS
    -------------------------------------- */

    for (let i = 0; i < 3; i++) {

        if (A[i][i] === 0) {

            showMessage(
                "❌ A diagonal coefficient cannot be zero. " +
                "Gauss–Seidel cannot directly use this equation.",
                "error"
            );

            return;
        }
    }


    /* ======================================
       CONVERGENCE CHECK
    ====================================== */

    let diagonallyDominant = true;

    for (let i = 0; i < 3; i++) {

        const diagonal =
            Math.abs(A[i][i]);

        const offDiagonal =
            Math.abs(A[i][0]) +
            Math.abs(A[i][1]) +
            Math.abs(A[i][2]) -
            diagonal;


        if (diagonal <= offDiagonal) {

            diagonallyDominant = false;

        }
    }


    if (diagonallyDominant) {

        showMessage(

            "✅ <strong>Convergence condition satisfied.</strong><br>" +
            "The matrix is strictly diagonally dominant, " +
            "which is a sufficient condition for Gauss–Seidel convergence.",

            "success"
        );

    } else {

        showMessage(

            "⚠️ <strong>Warning:</strong> The matrix is not strictly " +
            "diagonally dominant. Gauss–Seidel may not converge " +
            "for this system. The calculation will still be attempted.",

            "warning"
        );
    }


    /* ======================================
       DISPLAY EQUATIONS
    ====================================== */

    document
        .getElementById("equationCard")
        .classList.remove("hidden");


    document
        .getElementById("equations")
        .innerHTML =

        formatEquation(A[0], B[0]) +
        "<br>" +

        formatEquation(A[1], B[1]) +
        "<br>" +

        formatEquation(A[2], B[2]);


    /* ======================================
       INITIAL GUESS
    ====================================== */

    let x = getValue("x0");
    let y = getValue("y0");
    let z = getValue("z0");


    /*
        Optional initial guess.

        Blank → 0
    */

    if (x === null) {
        x = 0;
    }

    if (y === null) {
        y = 0;
    }

    if (z === null) {
        z = 0;
    }


    /* ======================================
       CLEAR OLD ITERATIONS
    ====================================== */

    const tbody =
        document.getElementById("iterationBody");

    tbody.innerHTML = "";


    /* ======================================
       INITIAL GUESS ROW
    ====================================== */

    addIterationRow(
        "Initial",
        x,
        y,
        z
    );


    /* ======================================
       GAUSS-SEIDEL ITERATIONS
    ====================================== */

    for (
        let iteration = 1;
        iteration <= 10;
        iteration++
    ) {

        /*
            Gauss-Seidel method:

            The newly calculated value
            is immediately used.
        */


        /* Calculate x */

        x =
            (
                B[0]
                - A[0][1] * y
                - A[0][2] * z
            )
            / A[0][0];


        /* Calculate y */

        y =
            (
                B[1]
                - A[1][0] * x
                - A[1][2] * z
            )
            / A[1][1];


        /* Calculate z */

        z =
            (
                B[2]
                - A[2][0] * x
                - A[2][1] * y
            )
            / A[2][2];


        addIterationRow(
            iteration,
            x,
            y,
            z
        );
    }


    /* ======================================
       DISPLAY ITERATION SECTION
    ====================================== */

    document
        .getElementById("iterationCard")
        .classList.remove("hidden");


    /* ======================================
       DISPLAY FINAL SOLUTION
    ====================================== */

    document
        .getElementById("solutionCard")
        .classList.remove("hidden");


    /*
        Final values are displayed
        as whole numbers.
    */

    document
        .getElementById("finalX")
        .textContent = Math.round(x);


    document
        .getElementById("finalY")
        .textContent = Math.round(y);


    document
        .getElementById("finalZ")
        .textContent = Math.round(z);
}


/* ==========================================
   ADD ITERATION ROW
========================================== */

function addIterationRow(
    iteration,
    x,
    y,
    z
) {

    const tbody =
        document.getElementById("iterationBody");

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>${iteration}</td>

        <td>${formatNumber(x)}</td>

        <td>${formatNumber(y)}</td>

        <td>${formatNumber(z)}</td>

    `;


    tbody.appendChild(row);
}


/* ==========================================
   FORMAT DECIMAL VALUES
========================================== */

function formatNumber(value) {

    if (!Number.isFinite(value)) {

        return "Undefined";
    }

    /*
        Iteration values are displayed
        with decimal precision.

        Example:
        1 → 1.000000
        0.5 → 0.500000
    */

    return value.toFixed(6);
}


/* ==========================================
   RESET EVERYTHING
========================================== */

function resetAll() {

    const inputs =
        document.querySelectorAll("input");


    inputs.forEach(input => {

        input.value = "";

    });


    document
        .getElementById("message")
        .className = "message";


    document
        .getElementById("message")
        .innerHTML = "";


    document
        .getElementById("equationCard")
        .classList.add("hidden");


    document
        .getElementById("iterationCard")
        .classList.add("hidden");


    document
        .getElementById("solutionCard")
        .classList.add("hidden");

}
