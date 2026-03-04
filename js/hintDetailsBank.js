// Detailed explanations for each hint step
// Keyed by problem text (first 60 chars) → array of detail strings
// Used when a student taps a step to get a deeper explanation

var HINT_DETAILS_BANK = {

  // ===================== ALGEBRA - POLYNOMIALS =====================

  "If $x^2 - 5x + 6 = 0$, what is the product of the solutions": [
    "When a problem asks for the product or sum of roots, it's a huge clue to use Vieta's formulas instead of solving the quadratic. This saves time on the AMC!",
    "Vieta's formulas come from expanding $(x - r_1)(x - r_2) = x^2 - (r_1+r_2)x + r_1 r_2$. Comparing with $x^2 + \\frac{b}{a}x + \\frac{c}{a}$, the product of roots is $\\frac{c}{a}$. This works for ANY quadratic.",
    "When the leading coefficient $a = 1$, the constant term $c$ IS the product of the roots. So you can read it directly from the equation!",
    "Factoring is another way to find the roots. Look for two numbers that multiply to $6$ and add to $-5$: those are $-2$ and $-3$.",
    "Always verify your answer when possible — especially on AMC where a wrong answer costs points. Both methods give $6$, confirming our answer."
  ],

  "What is the remainder when $x^{100} + x^{99} + \\cdots + x": [
    "The key insight is recognizing this as a Remainder Theorem problem. Whenever you see 'remainder when divided by $(x - a)$', immediately think: just plug in $x = a$!",
    "The Remainder Theorem is one of the most powerful tools in polynomial algebra. It says: $f(x) \\div (x - a)$ has remainder $f(a)$. This completely avoids long division!",
    "Every power of $1$ is just $1$: $1^{100} = 1^{99} = \\cdots = 1^0 = 1$. This makes the calculation trivially easy.",
    "Careful with counting! The terms go from $x^{100}$ down to $x^0 = 1$. That's $101$ terms (from power $0$ to power $100$ inclusive), not $100$.",
    "This sum is actually the geometric series $\\frac{x^{101} - 1}{x - 1}$, which equals $101$ when $x = 1$ (by L'Hôpital or direct counting)."
  ],

  "If $p(x) = x^3 - 3x^2 + 4$, what is $p(-1)$?": [
    "Direct substitution is the simplest approach here. Just replace every $x$ with $-1$ and compute carefully.",
    "The #1 mistake with negative numbers is forgetting that odd powers stay negative while even powers become positive. $(-1)^3 = -1$ because three negatives multiply to give a negative.",
    "Watch the signs carefully: $-3(-1)^2 = -3(1) = -3$, NOT $+3$. The coefficient $-3$ stays negative since $(-1)^2 = 1$.",
    "Add step by step: $-1 + (-3) + 4 = -4 + 4 = 0$. When the answer is $0$, that tells us something special!",
    "By the Factor Theorem (a consequence of the Remainder Theorem), $p(a) = 0$ means $(x - a)$ divides $p(x)$ evenly. So $(x + 1)$ is a factor of $x^3 - 3x^2 + 4$."
  ],

  "The polynomial $x^3 + ax + b$ has $x = 2$ as a root and le": [
    "This problem gives us two conditions, which will create a system of two equations. Each condition about a polynomial is an equation in disguise!",
    "When $x = 2$ is a root, that means $f(2) = 0$. Plugging in: $8 + 2a + b = 0$. Notice there's no $x^2$ term in the original polynomial (its coefficient is $0$).",
    "The Remainder Theorem again! '$f(x)$ divided by $(x-1)$ leaves remainder $5$' just means $f(1) = 5$.",
    "Now we have a system: $2a + b = -8$ and $a + b = 4$. Subtract the second from the first to eliminate $b$.",
    "The problem asks for $a + b$, NOT for $a$ and $b$ individually. Sometimes you can find the combination directly without solving for each variable — always check before doing extra work!"
  ],

  "How many real solutions does $x^4 - 4x^2 + 3 = 0$ have?": [
    "Whenever you see $x^4$ and $x^2$ (but no $x^3$ or $x$), try the substitution $u = x^2$. This turns a scary quartic into a friendly quadratic!",
    "After substituting, you get a standard quadratic in $u$. Use any method: factoring, quadratic formula, or completing the square.",
    "The factoring $(u-1)(u-3) = 0$ means either $u = 1$ or $u = 3$. Since $u = x^2$, we need $u \\geq 0$. Both values are positive, so both are valid!",
    "Each equation $x^2 = k$ (where $k > 0$) gives TWO solutions: $x = \\sqrt{k}$ and $x = -\\sqrt{k}$. If $k = 0$, you'd get only one solution ($x = 0$). If $k < 0$, no real solutions.",
    "Total count: $x^2 = 1$ gives $\\pm 1$ (2 solutions) and $x^2 = 3$ gives $\\pm\\sqrt{3}$ (2 solutions). That's $2 + 2 = 4$ real solutions."
  ],

  "If $(x+y)^2 = 100$ and $xy = 20$, what is $x^2 + y^2$?": [
    "This is a classic example of an algebraic identity problem. You don't need to find $x$ and $y$ individually — just manipulate the given expressions.",
    "The identity $(x+y)^2 = x^2 + 2xy + y^2$ is one of the most important identities in algebra. Make sure you have it memorized!",
    "Rearranging: $x^2 + y^2 = (x+y)^2 - 2xy$. This 'extraction' technique lets you find $x^2 + y^2$ from the sum and product.",
    "Plugging in the numbers: $100 - 2(20) = 100 - 40 = 60$. The subtraction of $2xy$ is because $(x+y)^2$ double-counts the cross term.",
    "This identity appears frequently on AMC/AIME. The related identity $(x-y)^2 = x^2 - 2xy + y^2$ is equally useful. Together they let you find $x^2 + y^2$ and $(x-y)^2$ from $x+y$ and $xy$."
  ],

  "What is the sum of the coefficients of $(2x - 3)^5$?": [
    "The sum of coefficients equals $p(1)$ because setting $x = 1$ makes every power of $x$ equal to $1$, leaving just the coefficients added together.",
    "You don't need to expand $(2x-3)^5$ using the binomial theorem! That would give 6 terms and be very tedious. The $p(1)$ shortcut avoids all that work.",
    "$(2(1) - 3)^5 = (2 - 3)^5 = (-1)^5$. Simple arithmetic is all you need.",
    "For odd exponents, $(-1)^n = -1$. For even exponents, $(-1)^n = 1$. Since $5$ is odd, the result is $-1$.",
    "Remember these shortcuts: sum of coefficients $= p(1)$, and alternating sum of coefficients $= p(-1)$. Both are useful AMC tricks."
  ],

  "If $f(x) = x^2 + bx + c$ and $f(f(1)) = f(f(2)) = 0$, an": [
    "If $f(\\text{something}) = 0$, that 'something' must be a root of $f$. So $f(1)$ is a root, and $f(2)$ is a root. Since $f$ is quadratic, it has at most 2 roots.",
    "Since $f(1) \\neq f(2)$, these are TWO DISTINCT roots. A quadratic has exactly 2 roots, so $f(1)$ and $f(2)$ are the complete set of roots of $f$.",
    "Beautiful connection: $f(0) = 0^2 + b(0) + c = c$. By Vieta's formulas, the product of roots of $f$ is also $c$. So $f(0) = f(1) \\cdot f(2)$!",
    "Now use Vieta's for the sum: $f(1) + f(2) = -b$. Compute $f(1) = 1 + b + c$ and $f(2) = 4 + 2b + c$. Adding: $5 + 3b + 2c = -b$.",
    "The system of equations is challenging but solvable. The key insight $f(0) = c = $ product of roots simplifies things enormously."
  ],

  "Simplify: $\\frac{x^3 - 8}{x - 2}$ for $x \\neq 2$.": [
    "Recognizing special forms is crucial. $x^3 - 8 = x^3 - 2^3$ is a 'difference of cubes.' Just like $a^2 - b^2$ factors, so does $a^3 - b^3$!",
    "The difference of cubes formula: $a^3 - b^3 = (a-b)(a^2 + ab + b^2)$. Note the PLUS signs in the second factor — this is different from the sum of cubes: $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$.",
    "With $a = x$ and $b = 2$: $x^3 - 8 = (x-2)(x^2 + 2x + 4)$. The second factor is $x^2 + 2x + 4$, not $x^2 - 2x + 4$.",
    "After canceling $(x-2)$, we get $x^2 + 2x + 4$. The condition $x \\neq 2$ ensures we're not dividing by zero.",
    "You could also verify by polynomial long division: divide $x^3 - 8$ by $(x - 2)$ step by step. Both methods give the same answer."
  ],

  "The equation $x^2 + 2kx + k + 6 = 0$ has exactly one real": [
    "A quadratic has exactly one real solution when the discriminant $\\Delta = b^2 - 4ac = 0$. This means the parabola just touches the x-axis (tangent).",
    "Be careful identifying $a$, $b$, $c$: $a = 1$, $b = 2k$ (NOT just $k$!), and $c = k + 6$. A common mistake is using $b = k$.",
    "Setting $\\Delta = 0$ gives us ANOTHER quadratic — this time in $k$! That's the beauty of the discriminant approach: it converts the problem into a solvable equation.",
    "$(k-3)(k+2) = 0$ gives $k = 3$ or $k = -2$. Both values make the original discriminant zero, so both are valid.",
    "The problem asks for the SUM of all possible values, not just one value. When a problem says 'sum of all,' always check for multiple solutions. Here: $3 + (-2) = 1$."
  ],

  // ===================== ALGEBRA - EQUATIONS =====================

  "How many ordered pairs $(x, y)$ of real numbers satisfy bot": [
    "When given a system with a linear equation and a quadratic, the symmetric functions approach (using $x+y$ and $xy$) is often the cleanest method.",
    "The identity $(x+y)^2 = x^2 + 2xy + y^2$ connects the sum, product, and sum of squares. We know two of these, so we can find the third.",
    "Finding $xy = 2$ transforms the problem: $x$ and $y$ are roots of $t^2 - (x+y)t + xy = 0$, i.e., $t^2 - 4t + 2 = 0$.",
    "The discriminant tells us the number of solutions: $\\Delta > 0$ means 2 distinct real roots (2 ordered pairs), $\\Delta = 0$ means 1 (a repeated root), $\\Delta < 0$ means none.",
    "$\\Delta = 16 - 8 = 8 > 0$, confirming 2 distinct real solutions. The ordered pairs are different because $x$ and $y$ can swap roles."
  ],

  "If $\\sqrt{x + 7} = x - 5$, what is $x$?": [
    "Before squaring, note the domain restriction: $\\sqrt{x+7} \\geq 0$, so $x - 5 \\geq 0$, meaning $x \\geq 5$. This will help eliminate extraneous solutions later.",
    "Squaring both sides is necessary to remove the radical, but it can introduce extraneous solutions. Always check your answers in the ORIGINAL equation.",
    "$(x-5)^2 = x^2 - 10x + 25$, not $x^2 - 25$! Remember to expand correctly using $(a-b)^2 = a^2 - 2ab + b^2$.",
    "Extraneous solutions arise because squaring is not reversible: $(-3)^2 = 3^2 = 9$, but $-3 \\neq 3$. When $x = 2$, the right side is $-3$, but $\\sqrt{9} = 3 \\neq -3$.",
    "Only $x = 9$ satisfies both the original equation AND the domain restriction $x \\geq 5$. Always substitute back to verify!"
  ],

  "What is the sum of all real values of $x$ satisfying $|x -": [
    "For absolute value equations, identify the 'critical points' where the expressions inside change sign. Here: $x = -1$ (where $x+1 = 0$) and $x = 3$ (where $x-3 = 0$).",
    "In this region ($x \\geq 3$), both $x - 3$ and $x + 1$ are non-negative, so the absolute values just 'disappear.' The equation becomes purely linear.",
    "In the middle region ($-1 \\leq x < 3$), the two absolute values cancel each other! The left side equals $4$ regardless of $x$. Since $4 \\neq 8$, there's no solution here.",
    "In the leftmost region ($x < -1$), both expressions inside the absolute values are negative, so both flip sign. Again a linear equation.",
    "The two solutions are symmetric around the midpoint of $-1$ and $3$, which is $1$. Their average is $1$, sum is $2$. This symmetry can sometimes provide shortcuts."
  ],

  "If $2^x = 3^y = 6^z$, which of the following is true?": [
    "Setting all three equal to a common value $k$ is a standard technique for these 'chain equality' problems. It gives each variable a clean expression in terms of $k$.",
    "Taking logarithms converts exponentials to linear expressions. $a^n = k$ becomes $n = \\frac{\\log k}{\\log a} = \\log_a k$.",
    "The factorization $6 = 2 \\times 3$ is the crucial connection. In terms of logs: $\\log 6 = \\log(2 \\cdot 3) = \\log 2 + \\log 3$.",
    "The reciprocal relationship $\\frac{1}{z} = \\frac{1}{x} + \\frac{1}{y}$ is called the harmonic mean relationship. It appears whenever you multiply the bases!",
    "This is a beautiful result: if $a^x = b^y = (ab)^z$, then $\\frac{1}{z} = \\frac{1}{x} + \\frac{1}{y}$ ALWAYS holds. It generalizes to any number of factors."
  ],

  "The equation $x^2 + |x| - 6 = 0$ has how many real soluti": [
    "The key observation is $x^2 = |x|^2$. This means the entire equation depends only on $|x|$, making the substitution $u = |x|$ natural.",
    "After substituting, you get a standard quadratic in $u$. But remember the constraint: $u = |x| \\geq 0$. Any negative solution for $u$ must be rejected.",
    "$u = -3$ violates $u \\geq 0$. Absolute values are NEVER negative, so this is impossible. Only $u = 2$ survives.",
    "$|x| = 2$ means $x$ could be $2$ or $-2$. Every positive solution for $u$ gives exactly TWO values of $x$ (positive and negative).",
    "Shortcut: since the equation only involves $|x|$, the solution set is always symmetric around $0$. If $x = a$ is a solution, then $x = -a$ is too."
  ],

  "If $\\log_2(x-1) + \\log_2(x+1) = 3$, what is $x$?": [
    "The log property $\\log_b a + \\log_b c = \\log_b(ac)$ lets you combine two logarithms into one. This is the product rule for logarithms.",
    "Converting $\\log_2(\\text{stuff}) = 3$ to exponential form: $\\text{stuff} = 2^3 = 8$. The 'undo' of $\\log_2$ is raising $2$ to that power.",
    "$(x-1)(x+1)$ is a difference of squares pattern: $(x-1)(x+1) = x^2 - 1$. Recognize this to simplify quickly.",
    "Don't forget to check the domain! Logarithms require POSITIVE arguments: $x - 1 > 0$ means $x > 1$, and $x + 1 > 0$ means $x > -1$. The binding constraint is $x > 1$.",
    "$x = -3$ fails the domain check ($x > 1$), so it's extraneous. Domain restrictions with logarithms are a common source of AMC wrong answers."
  ],

  "Find the number of integer solutions to $x^2 < 50$.": [
    "$x^2 < 50$ is equivalent to $|x| < \\sqrt{50}$. This means $x$ must be between $-\\sqrt{50}$ and $\\sqrt{50}$.",
    "We need to estimate $\\sqrt{50}$. Since $7^2 = 49$ and $8^2 = 64$, $\\sqrt{50}$ is just slightly more than $7$. So $|x| \\leq 7$.",
    "The integers satisfying $|x| \\leq 7$ range from $-7$ to $7$ inclusive.",
    "A quick way to count: from $-7$ to $7$ is $7 - (-7) + 1 = 15$ integers. Or: $7$ negative + $1$ zero + $7$ positive = $15$.",
    "Common mistake: forgetting $x = 0$ or counting only positive integers. Always consider all cases: negative, zero, and positive."
  ],

  "Solve for $x$: $3^{2x} - 4 \\cdot 3^x + 3 = 0$.": [
    "This is called a 'quadratic in exponential form.' The pattern $a^{2x} = (a^x)^2$ means you can substitute $u = a^x$ to reduce to a standard quadratic.",
    "After substituting $u = 3^x$, you get a simple factorable quadratic. This substitution technique works for any equation of the form $a^{2x} + ba^x + c = 0$.",
    "Both factors $(u-1)$ and $(u-3)$ give non-negative values of $u$. Since $3^x > 0$ for all real $x$, negative solutions for $u$ would be rejected (but there are none here).",
    "$3^x = 1$ means $x = 0$ (any base to the power $0$ is $1$). $3^x = 3 = 3^1$ means $x = 1$. Both are straightforward.",
    "You could verify by plugging back: $3^0 - 4(3^0) + 3 = 1 - 4 + 3 = 0$ and $3^2 - 4(3^1) + 3 = 9 - 12 + 3 = 0$. Both check out!"
  ],

  "If $a + \\frac{1}{a} = 5$, what is $a^2 + \\frac{1}{a^2}$": [
    "The 'squaring trick' is one of the most elegant techniques in algebra. By squaring the given equation, you naturally produce the expression you want, plus an extra term you can handle.",
    "When you expand $\\left(a + \\frac{1}{a}\\right)^2$, the cross term $2 \\cdot a \\cdot \\frac{1}{a} = 2$ is a constant. This is the key — the $a$ cancels!",
    "$(a + \\frac{1}{a})^2 = a^2 + 2 + \\frac{1}{a^2}$. So $a^2 + \\frac{1}{a^2} = (a + \\frac{1}{a})^2 - 2$. This is a direct formula you can memorize.",
    "Similarly, if you wanted $a^2 + \\frac{1}{a^2}$ and knew $a - \\frac{1}{a}$, you'd use $(a - \\frac{1}{a})^2 = a^2 - 2 + \\frac{1}{a^2}$.",
    "You can extend this pattern: knowing $a^2 + \\frac{1}{a^2} = 23$, square again to find $a^4 + \\frac{1}{a^4} = 23^2 - 2 = 527$!"
  ],

  "What is the value of $\\sum_{k=1}^{10} (2k-1)$?": [
    "Write out the first few terms to see the pattern: $k=1$ gives $1$, $k=2$ gives $3$, $k=3$ gives $5$, etc. These are consecutive odd numbers starting from $1$.",
    "The $n$-th odd number is $2n - 1$. So this sum is $1 + 3 + 5 + \\cdots + 19$ (ten terms).",
    "This is one of the most beautiful results in math: the sum of the first $n$ odd numbers is $n^2$. Try it: $1 = 1^2$, $1+3 = 4 = 2^2$, $1+3+5 = 9 = 3^2$, ...",
    "For 10 odd numbers: $10^2 = 100$. You can also use the arithmetic series formula: $S = \\frac{n(a_1 + a_n)}{2} = \\frac{10(1 + 19)}{2} = 100$.",
    "The pairing method: $1+19 = 20$, $3+17 = 20$, $5+15 = 20$, $7+13 = 20$, $9+11 = 20$. Five pairs of $20$ gives $100$. Young Gauss would approve!"
  ],

  // ===================== ALGEBRA - INEQUALITIES =====================

  "How many integers satisfy $|2x - 5| \\leq 7$?": [
    "The absolute value inequality $|A| \\leq B$ (where $B > 0$) means $-B \\leq A \\leq B$. Think of it as '$A$ is within $B$ units of zero.'",
    "Adding $5$ to all three parts of the compound inequality is the standard technique. You can add/subtract the same number across all parts.",
    "Dividing by $2$ gives the clean interval $-1 \\leq x \\leq 6$. Since we divided by a positive number, the inequality direction stays the same.",
    "To count integers in $[a, b]$: the count is $b - a + 1$. Here: $6 - (-1) + 1 = 8$. The '$+1$' accounts for including both endpoints.",
    "Common mistakes: forgetting to divide ALL parts by $2$, or miscounting (off-by-one error). Always list the integers to double-check when possible."
  ],

  "For how many real numbers $x$ is $\\sqrt{-x^2 + 6x - 8}$ ": [
    "A square root is real only when the expression inside (the 'radicand') is $\\geq 0$. This converts the problem into solving an inequality.",
    "Multiplying by $-1$ flips the inequality direction: $\\geq$ becomes $\\leq$. This is a critical rule! Forgetting to flip is a very common error.",
    "$(x-2)(x-4) \\leq 0$ means the product is non-positive. Draw a sign chart or test values in each interval: $(-\\infty, 2)$, $(2, 4)$, $(4, \\infty)$.",
    "A product of two factors is $\\leq 0$ when the factors have opposite signs (or one is zero). This happens between the roots: $2 \\leq x \\leq 4$.",
    "The interval $[2, 4]$ contains infinitely many real numbers (like $2.5$, $\\pi - 0.86$, $3.999$, etc.). Don't confuse 'how many integers' with 'how many reals'!"
  ],

  "If $x > 0$ and $x + \\frac{4}{x} \\geq k$ for all positiv": [
    "We need to find the MINIMUM value of $f(x) = x + \\frac{4}{x}$. The largest $k$ that works is exactly this minimum.",
    "AM-GM (Arithmetic Mean ≥ Geometric Mean) states: for positive numbers $a, b$: $\\frac{a+b}{2} \\geq \\sqrt{ab}$, or equivalently $a + b \\geq 2\\sqrt{ab}$.",
    "Applying AM-GM with $a = x$ and $b = \\frac{4}{x}$: the product $ab = x \\cdot \\frac{4}{x} = 4$ is constant. So $x + \\frac{4}{x} \\geq 2\\sqrt{4} = 4$.",
    "Equality in AM-GM holds when $a = b$, i.e., $x = \\frac{4}{x}$, which gives $x^2 = 4$ and $x = 2$ (positive root).",
    "You can also solve this with calculus: $f'(x) = 1 - \\frac{4}{x^2} = 0$ gives $x = 2$, and $f(2) = 2 + 2 = 4$. AM-GM avoids calculus entirely!"
  ],

  // ===================== ALGEBRA - SEQUENCES =====================

  "In an arithmetic sequence, the 3rd term is 10 and the 7th": [
    "In an arithmetic sequence, $a_n = a_1 + (n-1)d$. The key formula relating any two terms is: $a_m - a_n = (m - n)d$.",
    "From term 3 to term 7 is $7 - 3 = 4$ steps of size $d$. So $4d = a_7 - a_3$. Always count the number of GAPS between terms, not the number of terms.",
    "Once you know $d = 3$, you can find any term. From the 7th term to the 10th term is $10 - 7 = 3$ more steps.",
    "$a_{10} = a_7 + 3d = 22 + 9 = 31$. You could also use $a_{10} = a_3 + 7d = 10 + 21 = 31$ as a check.",
    "Tip: you don't even need to find $a_1$ here. Just use the given terms and count the steps. Efficiency matters on timed tests!"
  ],

  "The first three terms of a geometric sequence are $2, 6, 1": [
    "In a geometric sequence, each term is multiplied by a constant ratio $r$. Find $r$ by dividing any term by the previous one: $r = \\frac{6}{2} = 3$.",
    "The geometric sum formula $S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}$ works when $r \\neq 1$. For $r = 1$, the sum is just $n \\cdot a_1$.",
    "Here we need $S_5$ with $a_1 = 2$ and $r = 3$. The formula avoids having to compute and add all 5 terms individually.",
    "$3^5 = 243$. Powers of $3$: $3, 9, 27, 81, 243$. Knowing small powers by heart speeds up AMC calculations.",
    "Cross-check by direct addition: $2 + 6 + 18 + 54 + 162 = 242$. Both methods agree, confirming the answer."
  ],

  "A sequence is defined by $a_1 = 1$, $a_2 = 2$, and $a_n =": [
    "Recursive sequences require you to compute each term in order. There's no shortcut here — you must build up from the base cases.",
    "This is the same recurrence as the Fibonacci sequence, just with different starting values ($1, 2$ instead of $1, 1$). It's sometimes called the Lucas sequence.",
    "Keep careful track: $a_6 = a_5 + a_4 = 8 + 5 = 13$, and $a_7 = a_6 + a_5 = 13 + 8 = 21$. Double-check each addition.",
    "$a_8 = 21 + 13 = 34$. On the AMC, write each term neatly in a list to avoid arithmetic errors.",
    "The Fibonacci-like pattern grows roughly exponentially (by a factor of about $1.618$, the golden ratio). This helps you sanity-check: $34$ is about $1.6 \\times 21$."
  ],

  // ===================== ALGEBRA - FUNCTIONS =====================

  "If $f(x) = 2x + 1$ and $g(x) = x^2$, what is $f(g(3))$?": [
    "Function composition $f(g(x))$ means 'first apply $g$, then apply $f$ to the result.' Always work from the inside out!",
    "$g(3) = 3^2 = 9$. This is the input to $f$.",
    "$f(9) = 2(9) + 1 = 19$. Be careful: $f(g(3)) \\neq g(f(3))$! Composition is generally not commutative. Here $g(f(3)) = g(7) = 49$.",
    "Tip: if the problem asked for $g(f(3))$, you'd compute $f(3) = 7$ first, then $g(7) = 49$. The ORDER matters!"
  ],

  "The function $f$ satisfies $f(x) + f(1-x) = 10$ for all r": [
    "The functional equation $f(x) + f(1-x) = 10$ tells us that complementary inputs (inputs summing to $1$) always produce outputs summing to $10$.",
    "Check: $0.3 + 0.7 = 1$, so $0.7 = 1 - 0.3$. The inputs are complementary! We can apply the functional equation directly with $x = 0.3$.",
    "Substituting $x = 0.3$: $f(0.3) + f(1-0.3) = f(0.3) + f(0.7) = 10$. Done! No need to determine $f$ itself.",
    "The beauty of functional equations is that you often don't need to find the function — just use the given property strategically.",
    "This technique generalizes: for ANY inputs $a$ and $b$ with $a + b = 1$, we know $f(a) + f(b) = 10$. Watch for similar patterns in contest problems."
  ],

  "If $f(x) = \\frac{x}{x+1}$, what is $f(f(f(2)))$?": [
    "Iterated function application means applying the function repeatedly. Start from the inside and work your way out.",
    "Computing $f$ of a fraction: $f\\left(\\frac{a}{b}\\right) = \\frac{a/b}{a/b + 1} = \\frac{a/b}{(a+b)/b} = \\frac{a}{a+b}$. This simplification helps see the pattern.",
    "The pattern becomes clear: $f(2) = \\frac{2}{3}$, $f(\\frac{2}{3}) = \\frac{2}{5}$, $f(\\frac{2}{5}) = \\frac{2}{7}$. The numerator stays $2$, and the denominators are $3, 5, 7$ (increasing by $2$)!",
    "In general, $f^{(n)}(2) = \\frac{2}{2n+1}$ where $f^{(n)}$ means $f$ applied $n$ times. For $n = 3$: $\\frac{2}{7}$.",
    "Recognizing patterns in iterated functions is a powerful technique. If you see a pattern forming, state it and verify with one more step."
  ],

  // ===================== GEOMETRY - TRIANGLES =====================

  "In triangle $ABC$, $AB = 5$, $BC = 12$, and $AC = 13$. Wh": [
    "Whenever you see three specific side lengths, immediately check if they form a Pythagorean triple. Common triples: $(3,4,5)$, $(5,12,13)$, $(8,15,17)$, $(7,24,25)$.",
    "$5^2 + 12^2 = 25 + 144 = 169 = 13^2$. Since the sum of squares of the two shorter sides equals the square of the longest, it's a right triangle!",
    "For a right triangle, the area formula is simple: $\\frac{1}{2} \\times \\text{leg}_1 \\times \\text{leg}_2$. The hypotenuse is NOT used directly in the area calculation.",
    "The two legs (sides adjacent to the right angle) are $5$ and $12$. The hypotenuse (opposite the right angle) is $13$.",
    "Memorize common Pythagorean triples and their multiples! $(5,12,13)$ is a primitive triple. Multiples like $(10,24,26)$ are also Pythagorean triples."
  ],

  "An equilateral triangle has side length 6. What is its are": [
    "The height of an equilateral triangle splits it into two 30-60-90 right triangles. The height is opposite the $60°$ angle.",
    "In a 30-60-90 triangle, the sides are in ratio $1 : \\sqrt{3} : 2$. The half-base is $\\frac{s}{2} = 3$ (opposite $30°$), so the height is $3\\sqrt{3}$ (opposite $60°$).",
    "Area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height}$. This fundamental formula works for ALL triangles, not just right triangles.",
    "The direct formula $\\frac{s^2\\sqrt{3}}{4}$ is worth memorizing for competitions. It's derived from the $\\frac{1}{2}bh$ formula but saves a step.",
    "Don't confuse $\\sqrt{3}$ with $\\sqrt{2}$! $\\sqrt{3} \\approx 1.732$ appears in equilateral triangle and 30-60-90 problems. $\\sqrt{2} \\approx 1.414$ appears in 45-45-90 problems."
  ],

  "In a triangle with angles in the ratio $2:3:4$, what is th": [
    "Ratio problems are solved by introducing a variable: if the ratio is $2:3:4$, call the angles $2x$, $3x$, and $4x$.",
    "The angle sum property ($180°$) gives us one equation in one unknown: $2x + 3x + 4x = 9x = 180°$.",
    "$x = 20°$ is the 'unit' of the ratio. Each part of the ratio corresponds to $20°$.",
    "The largest angle corresponds to the largest ratio part: $4x = 4 \\times 20° = 80°$.",
    "Note: this triangle is NOT a right triangle ($80° < 90°$), but it IS an obtuse... wait, no — $80° < 90°$, so actually all angles are acute. It's an acute triangle."
  ],

  // ===================== GEOMETRY - CIRCLES =====================

  "Two circles with radii 3 and 5 are externally tangent. Wha": [
    "'Externally tangent' means the circles touch from the outside — they don't overlap. The tangent point lies on the line segment connecting the centers.",
    "Picture the two circles sitting side by side, just barely touching. The distance from center to tangent point equals each circle's radius.",
    "Distance = $r_1 + r_2$ for external tangency. This is intuitive: the centers are separated by the sum of their radii.",
    "$3 + 5 = 8$. Simple addition!",
    "Compare with internal tangency (one circle inside the other, touching at one point): distance $= |r_1 - r_2| = |5-3| = 2$. If circles overlap at two points, the distance is between $|r_1 - r_2|$ and $r_1 + r_2$."
  ],

  "A chord of length 8 is 3 units from the center of a circl": [
    "The perpendicular from the center to a chord ALWAYS bisects the chord. This is a fundamental theorem of circle geometry.",
    "Half the chord is $4$, and the distance from center to chord is $3$. These form two legs of a right triangle with the radius as hypotenuse.",
    "The right triangle has legs $3$ and $4$. Even before computing, you might recognize $3$-$4$-$5$!",
    "$r = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$. The Pythagorean theorem in action.",
    "This configuration — perpendicular from center to chord — appears constantly in AMC geometry. Always draw this perpendicular as your first step when dealing with chords!"
  ],

  "A sector of a circle has central angle $60°$ and radius $6": [
    "A sector is a 'pizza slice' — a region bounded by two radii and an arc. Its area is a fraction of the full circle's area.",
    "The fraction equals $\\frac{\\text{central angle}}{360°}$. Here, $\\frac{60°}{360°} = \\frac{1}{6}$, so the sector is one-sixth of the full circle.",
    "Full circle area: $\\pi r^2 = \\pi(6)^2 = 36\\pi$. Memorize $\\pi r^2$ — it's the most fundamental circle formula.",
    "Sector area $= \\frac{1}{6} \\times 36\\pi = 6\\pi$. Alternatively, use the formula $\\frac{\\theta}{360°} \\pi r^2$ directly.",
    "For arc length (not area), use a similar fraction: $\\frac{\\theta}{360°} \\times 2\\pi r$. Here that would be $\\frac{1}{6} \\times 12\\pi = 2\\pi$."
  ],

  // ===================== GEOMETRY - COORDINATE =====================

  "What is the distance between the points $(1, 3)$ and $(4,": [
    "The distance formula $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ is just the Pythagorean theorem applied to the horizontal and vertical distances.",
    "Compute the differences first: $\\Delta x = 4 - 1 = 3$ (horizontal distance) and $\\Delta y = 7 - 3 = 4$ (vertical distance).",
    "$d = \\sqrt{9 + 16} = \\sqrt{25} = 5$. The $3$-$4$-$5$ Pythagorean triple appears yet again!",
    "If you spot a Pythagorean triple, you don't even need to compute $\\sqrt{9+16}$ — just recognize $3$-$4$-$5$ directly."
  ],

  "The line $3x + 4y = 24$ intersects the $x$-axis at $A$ an": [
    "To find where a line crosses an axis, set the other coordinate to $0$. $x$-intercept: $y = 0$. $y$-intercept: $x = 0$.",
    "$x$-intercept: $3x + 4(0) = 24 \\Rightarrow x = 8$. So $A = (8, 0)$ is on the positive $x$-axis.",
    "$y$-intercept: $3(0) + 4y = 24 \\Rightarrow y = 6$. So $B = (0, 6)$ is on the positive $y$-axis.",
    "Triangle $AOB$ has the origin at the right angle (the axes are perpendicular). The legs lie along the axes with lengths $8$ and $6$.",
    "For a right triangle with legs along the axes, the area is simply $\\frac{1}{2} \\times |x\\text{-intercept}| \\times |y\\text{-intercept}|$. This is a quick formula worth remembering."
  ],

  "What is the slope of a line perpendicular to $2x - 3y = 7": [
    "First, rewrite in slope-intercept form $y = mx + b$ to identify the slope. Move the $x$ term to the right and divide by the $y$ coefficient.",
    "Dividing by $-3$: $y = \\frac{2}{3}x - \\frac{7}{3}$. The slope is $m = \\frac{2}{3}$.",
    "Perpendicular lines have slopes that are NEGATIVE RECIPROCALS: if one slope is $\\frac{a}{b}$, the perpendicular slope is $-\\frac{b}{a}$. The product of perpendicular slopes is $-1$.",
    "$m_\\perp = -\\frac{3}{2}$. Check: $\\frac{2}{3} \\times (-\\frac{3}{2}) = -1$. Confirmed!",
    "Common mistakes: forgetting the negative sign (giving $\\frac{3}{2}$) or just negating without reciprocating (giving $-\\frac{2}{3}$). You need BOTH the negative AND the reciprocal."
  ],

  // ===================== GEOMETRY - AREA/VOLUME =====================

  "A rectangular box has dimensions $3 \\times 4 \\times 12$. ": [
    "The space diagonal goes from one corner of the box to the opposite corner, passing through the interior. Think of it as the longest possible straight line inside the box.",
    "The formula $d = \\sqrt{a^2 + b^2 + c^2}$ extends the 2D Pythagorean theorem to 3D. You can derive it by first finding the face diagonal, then using it with the third dimension.",
    "$d = \\sqrt{9 + 16 + 144} = \\sqrt{169}$. It's helpful to add the perfect squares step by step: $9 + 16 = 25$, then $25 + 144 = 169$.",
    "$\\sqrt{169} = 13$. Recognize $169 = 13^2$. Knowing perfect squares up to at least $20^2 = 400$ is very helpful for AMC.",
    "Notice that answer choices (C) $13$ and (E) $\\sqrt{169}$ are actually the same value! This is a reminder to simplify before selecting."
  ],

  "A cylinder has radius 3 and height 7. What is its volume?": [
    "Volume of a cylinder = area of the circular base × height. The base is a circle with area $\\pi r^2$.",
    "$r = 3$, $h = 7$. These are given directly — no need to compute anything else.",
    "$V = \\pi(3)^2(7) = \\pi \\cdot 9 \\cdot 7 = 63\\pi$. Leave the answer in terms of $\\pi$ unless asked for a decimal.",
    "Cylinder volume is related to prism volume: both are (base area × height). A cylinder is essentially a 'circular prism'!"
  ],

  // ===================== GEOMETRY - SIMILARITY =====================

  "Two similar triangles have corresponding sides in ratio $2": [
    "For similar figures, areas scale as the SQUARE of the linear scale factor. If sides are $k$ times bigger, the area is $k^2$ times bigger.",
    "The scale factor from smaller to larger is $\\frac{3}{2}$. Squaring: $(\\frac{3}{2})^2 = \\frac{9}{4}$.",
    "Area ratio = $\\frac{9}{4}$, so larger area = smaller area × $\\frac{9}{4}$.",
    "$20 \\times \\frac{9}{4} = \\frac{180}{4} = 45$. You can also compute: $20 \\times 2.25 = 45$.",
    "This 'square of the ratio' rule also works for volumes of similar 3D figures, but with the CUBE of the ratio: $k^3$."
  ],

  "Triangle $ABC$ has $DE \\parallel BC$ with $D$ on $AB$ and": [
    "When a line parallel to one side of a triangle cuts the other two sides, it creates a smaller triangle similar to the original (by the AA similarity criterion).",
    "$AB = AD + DB = 3 + 2 = 5$. This gives us the full length of side $AB$, which we need for the ratio.",
    "The similarity ratio $\\frac{AD}{AB} = \\frac{3}{5}$ tells us how the smaller triangle compares to the larger one. All corresponding lengths scale by this ratio.",
    "$DE$ corresponds to $BC$ in the similar triangles: $\\frac{DE}{BC} = \\frac{3}{5}$, so $DE = 10 \\times \\frac{3}{5} = 6$.",
    "This result is also called the 'Basic Proportionality Theorem' or 'Thales' theorem': a parallel line divides the sides proportionally."
  ],

  // ===================== NUMBER THEORY - DIVISIBILITY =====================

  "What is the largest power of 2 that divides $20!$?": [
    "Legendre's formula counts how many times a prime $p$ divides $n!$. Each division by $p$ counts multiples of $p$, $p^2$, $p^3$, etc.",
    "$\\lfloor 20/2 \\rfloor = 10$ counts how many multiples of $2$ are in $\\{1, 2, \\ldots, 20\\}$. But multiples of $4$ contribute an EXTRA factor of $2$, so we add them too.",
    "$\\lfloor 20/4 \\rfloor = 5$ adds the extra factors from multiples of $4$. Similarly, $\\lfloor 20/8 \\rfloor = 2$ for multiples of $8$, and $\\lfloor 20/16 \\rfloor = 1$ for $16$ itself.",
    "$10 + 5 + 2 + 1 = 18$. The sum stops when $p^i > n$ (here $32 > 20$).",
    "The largest power of $2$ dividing $20!$ is $2^{18}$. This technique is essential for problems involving factorials and divisibility."
  ],

  "How many positive divisors does $360$ have?": [
    "The first step in divisor-counting problems is ALWAYS to find the prime factorization. Break the number down to its prime building blocks.",
    "The divisor count formula: if $n = p_1^{a_1} \\cdot p_2^{a_2} \\cdots p_k^{a_k}$, then the number of divisors is $(a_1+1)(a_2+1)\\cdots(a_k+1)$.",
    "Each divisor is formed by choosing a power of each prime factor independently. For $2^3$: choose $2^0, 2^1, 2^2,$ or $2^3$ (4 choices).",
    "$(3+1)(2+1)(1+1) = 4 \\times 3 \\times 2 = 24$. The '$+1$' accounts for the option of using $p^0 = 1$ (not including that prime at all).",
    "To verify, you could list all $24$ divisors: $1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360$."
  ],

  "What is the remainder when $7^{100}$ is divided by $5$?": [
    "When computing remainders of large powers, first reduce the base modulo the divisor: $7 \\equiv 2 \\pmod{5}$.",
    "Powers of $2$ mod $5$ cycle: $2, 4, 3, 1, 2, 4, 3, 1, \\ldots$ This is called the 'order' of $2$ modulo $5$, which is $4$.",
    "The cycle length (period) is $4$. To find $2^{100} \\pmod{5}$, just find $100 \\pmod{4}$.",
    "$100 = 4 \\times 25$, so $100 \\equiv 0 \\pmod{4}$. This means $2^{100}$ is at the END of a complete cycle, corresponding to $2^4 \\equiv 1$.",
    "Fermat's Little Theorem also gives this: for prime $p$ and $\\gcd(a,p) = 1$: $a^{p-1} \\equiv 1 \\pmod{p}$. Here $2^4 \\equiv 1 \\pmod{5}$, so $2^{100} = (2^4)^{25} \\equiv 1$."
  ],

  // ===================== NUMBER THEORY - PRIMES =====================

  "How many prime numbers are between 30 and 50?": [
    "To check if a number $n$ is prime, you only need to test divisibility by primes up to $\\sqrt{n}$. For numbers under $50$, test primes $2, 3, 5, 7$.",
    "Eliminate even numbers immediately (all > 2 are composite). Also eliminate multiples of $5$ ($35, 45$).",
    "For the remaining candidates, test divisibility by $3$ and $7$. For example, $33 = 3 \\times 11$ and $39 = 3 \\times 13$ and $49 = 7 \\times 7$.",
    "The survivors — $31, 37, 41, 43, 47$ — can't be divided by $2, 3, 5,$ or $7$, and since $8^2 = 64 > 50$, no larger primes need to be checked.",
    "Knowing primes up to $50$ is very useful for AMC: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47$."
  ],

  "What is the sum of the prime factors of $2310$?": [
    "$2310$ is even, so $2$ is a factor. Always start with the smallest primes and work upward.",
    "After dividing by $2$: $1155$. Check divisibility by $3$: $1+1+5+5 = 12$, which is divisible by $3$. So $1155 = 3 \\times 385$.",
    "$385$ ends in $5$, so it's divisible by $5$: $385 = 5 \\times 77$. Then $77 = 7 \\times 11$.",
    "$2310 = 2 \\times 3 \\times 5 \\times 7 \\times 11$ is the product of the first FIVE consecutive primes! This is called a 'primorial,' written $5\\#$.",
    "The sum is $2 + 3 + 5 + 7 + 11 = 28$. Note: we sum each prime factor ONCE, not counting multiplicity (which doesn't apply here since all exponents are $1$)."
  ],

  "If $n$ is a positive integer such that $n^2 + n + 41$ is N": [
    "This is Euler's famous prime-generating polynomial, discovered in 1772. It produces primes for $n = 0, 1, 2, \\ldots, 39$ — an amazing $40$ primes in a row!",
    "The polynomial must eventually fail because no polynomial can produce only primes. When does $41$ divide $n^2 + n + 41$? When $41 | n(n+1)$, i.e., $n \\equiv 0$ or $n \\equiv 40 \\pmod{41}$.",
    "Try $n = 40$: $40^2 + 40 + 41 = 1600 + 40 + 41 = 1681$. Is this a known perfect square?",
    "$41^2 = 1681$. Yes! So $n^2 + n + 41 = 41^2$ when $n = 40$. We can also see this algebraically: $40 \\times 41 + 41 = 41(40 + 1) = 41^2$.",
    "No polynomial of degree $\\geq 1$ can produce only primes. This is because if $p(n_0) = p$ is prime, then $p(n_0 + kp)$ is divisible by $p$ for all integers $k$."
  ],

  // ===================== NUMBER THEORY - MODULAR =====================

  "What is $17 \\cdot 23 \\pmod{10}$?": [
    "Working modulo $10$ means we only care about the LAST DIGIT. This simplifies everything enormously.",
    "Reduce each number mod $10$ first: $17 \\to 7$ and $23 \\to 3$. Only the last digits matter for multiplication mod $10$.",
    "$7 \\times 3 = 21$. The last digit of $21$ is $1$.",
    "So $17 \\times 23 \\equiv 1 \\pmod{10}$. You can verify: $17 \\times 23 = 391$, and indeed the last digit is $1$.",
    "In modular arithmetic, you can reduce at ANY step: before multiplication, during, or after. Reducing early keeps numbers small and calculations easy."
  ],

  "What is the last two digits of $3^{20}$?": [
    "'Last two digits' = reduce modulo $100$. This is harder than mod $10$ but the same principle applies: reduce intermediate results to keep numbers manageable.",
    "Repeated squaring is the key technique for computing large powers modulo $m$: compute $3^2, 3^4, 3^8, 3^{16}$, then combine.",
    "$3^8 = (3^4)^2 = 81^2 = 6561$. Modulo $100$: $6561 \\bmod 100 = 61$. Only keep the last two digits!",
    "$3^{16} \\equiv 61^2 = 3721 \\equiv 21 \\pmod{100}$. Then $3^{20} = 3^{16} \\cdot 3^4 \\equiv 21 \\times 81 = 1701 \\equiv 01 \\pmod{100}$.",
    "The result $3^{20} \\equiv 1 \\pmod{100}$ means $3^{20} - 1$ is divisible by $100$. By Euler's theorem, $3^{\\phi(100)} = 3^{40} \\equiv 1$, but here the order divides $40$ and equals $20$."
  ],

  "Find the remainder when $2^{2026}$ is divided by $7$.": [
    "First find the cycle of $2^n \\pmod{7}$. Compute successive powers until you see a repeat.",
    "The cycle is $2, 4, 1, 2, 4, 1, \\ldots$ with period $3$. After every $3$ steps, we're back to the start.",
    "To find where $2^{2026}$ falls in the cycle, compute $2026 \\bmod 3$. Since $2026 = 3 \\times 675 + 1$, we get $2026 \\equiv 1 \\pmod{3}$.",
    "Position $1$ in the cycle corresponds to $2^1 = 2$. So $2^{2026} \\equiv 2 \\pmod{7}$.",
    "By Fermat's Little Theorem: $2^6 \\equiv 1 \\pmod{7}$ (since $7$ is prime). The actual order ($3$) divides $6$. Either way, $2026 \\equiv 1 \\pmod{3}$ gives the answer."
  ],

  // ===================== NUMBER THEORY - GCD/LCM =====================

  "What is $\\gcd(48, 180)$?": [
    "Method 1: Prime factorization. Write each number as a product of prime powers, then take the minimum exponent for each prime.",
    "For GCD, take the MINIMUM power: $\\min(4,2) = 2$ for $2$, and $\\min(1,2) = 1$ for $3$. The prime $5$ appears only in $180$, so it's not in the GCD.",
    "$\\gcd = 2^2 \\cdot 3 = 12$. The GCD only includes primes that appear in BOTH factorizations.",
    "$\\gcd = 12$. Method 2 (Euclidean algorithm): $180 = 3 \\times 48 + 36$; $48 = 1 \\times 36 + 12$; $36 = 3 \\times 12 + 0$. So $\\gcd = 12$.",
    "The Euclidean algorithm is often faster for large numbers. It's based on the property $\\gcd(a,b) = \\gcd(b, a \\bmod b)$."
  ],

  "If $\\gcd(a, b) = 6$ and $\\text{lcm}(a, b) = 180$, what": [
    "The identity $\\gcd(a,b) \\times \\text{lcm}(a,b) = a \\times b$ is fundamental. It works because GCD takes min exponents and LCM takes max exponents, which sum to the total.",
    "Think of it in terms of prime factorizations: for each prime, $\\min(\\alpha, \\beta) + \\max(\\alpha, \\beta) = \\alpha + \\beta$.",
    "$ab = 6 \\times 180 = 1080$. Simple multiplication!",
    "Note: knowing $ab = 1080$ doesn't uniquely determine $a$ and $b$. For example, $(a,b)$ could be $(12, 90)$ or $(18, 60)$ or $(36, 30)$, etc."
  ],

  // ===================== NUMBER THEORY - DIGITS =====================

  "What is the sum of the digits of $10^{100} - 1$?": [
    "Think about what $10^n - 1$ looks like in decimal: $10^1 - 1 = 9$, $10^2 - 1 = 99$, $10^3 - 1 = 999$, etc.",
    "$10^{100} - 1$ is a number written as $100$ nines: $\\underbrace{999\\ldots9}_{100}$.",
    "Each of the $100$ digits is $9$. The digit sum is simply the count times the digit value.",
    "$100 \\times 9 = 900$. This is straightforward once you see the pattern.",
    "This type of problem tests pattern recognition. Always try small cases first ($10^1 - 1$, $10^2 - 1$, $10^3 - 1$) to spot the pattern before tackling the large case."
  ],

  "How many three-digit numbers have the property that the di": [
    "A three-digit number $\\overline{abc}$ has $a \\in \\{1,...,9\\}$ (hundreds digit can't be $0$) and $b, c \\in \\{0,...,9\\}$. We need $a + b + c = 5$.",
    "The substitution $a' = a - 1$ converts the constraint $a \\geq 1$ to $a' \\geq 0$, making all three variables non-negative with sum $a' + b + c = 4$.",
    "Since $a' + b + c = 4$ and all variables are $\\leq 9$, the upper bound constraints are automatically satisfied (no variable can exceed $4$, which is $\\leq 9$).",
    "Stars and bars counts non-negative integer solutions to $x_1 + x_2 + \\cdots + x_k = n$: the answer is $\\binom{n+k-1}{k-1}$.",
    "$\\binom{4+2}{2} = \\binom{6}{2} = \\frac{6 \\times 5}{2} = 15$. You can verify by listing: $(1,0,4), (1,1,3), (1,2,2), (1,3,1), (1,4,0), (2,0,3), \\ldots$ — there are indeed $15$."
  ],

  // ===================== COMBINATORICS - COUNTING =====================

  "How many ways can 5 books be arranged on a shelf?": [
    "When ALL objects are distinct and order matters, it's a straight permutation: $n!$ (n factorial).",
    "Think of filling each position left to right: $5$ choices for slot 1, then $4$ for slot 2 (one book is used), then $3$, $2$, $1$.",
    "$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$. Memorize small factorials: $1! = 1$, $2! = 2$, $3! = 6$, $4! = 24$, $5! = 120$, $6! = 720$.",
    "If some books were IDENTICAL, we'd need to divide by the factorial of the repeat count. But here all books are distinct."
  ],

  "In how many ways can a committee of 3 be chosen from 8 peo": [
    "The key question: does ORDER matter? For a committee, choosing {Alice, Bob, Carol} is the same as {Carol, Alice, Bob}. So order doesn't matter → use combinations.",
    "$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$. This is 'n choose k': the number of ways to select $k$ items from $n$ without regard to order.",
    "$\\frac{8 \\times 7 \\times 6}{3!} = \\frac{336}{6} = 56$. The denominator $3! = 6$ divides out the $6$ ways to arrange $3$ people (since order doesn't matter).",
    "If we were choosing a president, VP, and secretary (roles matter), it would be $P(8,3) = 8 \\times 7 \\times 6 = 336$ — six times larger!"
  ],

  "How many 4-digit numbers can be formed using digits $\\{1, ": [
    "No repetition + order matters → permutation. We're selecting AND arranging $4$ digits from $5$.",
    "The multiplication principle: $5$ choices for the first digit, $4$ for the second (can't reuse), $3$ for the third, $2$ for the fourth.",
    "$5 \\times 4 \\times 3 \\times 2 = 120$. This is $P(5,4) = \\frac{5!}{(5-4)!} = \\frac{120}{1} = 120$.",
    "This equals $\\frac{5!}{1!}$. The formula $P(n,k) = \\frac{n!}{(n-k)!}$ counts 'ordered selections' of $k$ items from $n$.",
    "Note: since the digit set $\\{1,2,3,4,5\\}$ doesn't include $0$, there's no issue with leading zeros. If $0$ were included, we'd need to subtract cases starting with $0$."
  ],

  // ===================== COMBINATORICS - PROBABILITY =====================

  "Two dice are rolled. What is the probability that the sum": [
    "The sample space for two dice has $6 \\times 6 = 36$ equally likely outcomes. Each die is independent.",
    "List pairs that sum to $7$: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$. Notice each pair sums to $7$ with one number from $1$-$6$ and the other being $7$ minus it.",
    "There are exactly $6$ favorable outcomes. For a sum of $s$, there are $6 - |s - 7|$ ways (maximum at $s = 7$).",
    "$P = \\frac{6}{36} = \\frac{1}{6} \\approx 16.7\\%$.",
    "$7$ is the most likely sum because it has the most combinations. Sums of $2$ and $12$ are least likely (only $1$ way each). This is the 'bell curve' of dice sums."
  ],

  "A bag has 4 red and 6 blue marbles. Two marbles are drawn": [
    "'Without replacement' means the first marble is NOT put back before drawing the second. This changes the probabilities for the second draw.",
    "P(1st red) $= \\frac{4}{10} = \\frac{2}{5}$. After removing one red marble, there are $3$ red and $6$ blue remaining ($9$ total).",
    "P(2nd red | 1st red) $= \\frac{3}{9} = \\frac{1}{3}$. The '|' means 'given that' — this is conditional probability.",
    "Multiply: $P(\\text{both red}) = \\frac{2}{5} \\times \\frac{1}{3} = \\frac{2}{15}$. Always reduce fractions to lowest terms.",
    "Compare with 'WITH replacement': P would be $\\frac{4}{10} \\times \\frac{4}{10} = \\frac{16}{100} = \\frac{4}{25}$. Without replacement gives a smaller probability because removing a red marble reduces the chance of getting another."
  ],

  "A fair coin is flipped 6 times. What is the probability of": [
    "This is a binomial probability problem: fixed number of trials ($n = 6$), two outcomes per trial (H or T), constant probability ($p = \\frac{1}{2}$).",
    "We need to choose WHICH $2$ of the $6$ flips are heads. The number of ways is $\\binom{6}{2}$.",
    "$\\binom{6}{2} = \\frac{6!}{2!4!} = \\frac{6 \\times 5}{2} = 15$. There are $15$ different ways to get exactly $2$ heads.",
    "Each specific sequence (like HHTTTT) has probability $(\\frac{1}{2})^6 = \\frac{1}{64}$.",
    "$P = 15 \\times \\frac{1}{64} = \\frac{15}{64} \\approx 23.4\\%$. The binomial formula: $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$."
  ],

  // ===================== COMBINATORICS - PERMUTATIONS =====================

  "How many ways can the letters in BANANA be arranged?": [
    "BANANA has $6$ letters but some are repeated: B×1, A×3, N×2. Identical letters are indistinguishable from each other.",
    "If all $6$ letters were different, there'd be $6! = 720$ arrangements.",
    "Swapping identical letters doesn't create a new arrangement. Divide by the factorial of each letter's count to remove these 'phantom duplicates.'",
    "$\\frac{6!}{1! \\cdot 3! \\cdot 2!} = \\frac{720}{1 \\cdot 6 \\cdot 2} = \\frac{720}{12} = 60$. This is the multinomial coefficient.",
    "This formula generalizes to any word with repeated letters: $\\frac{n!}{n_1! \\cdot n_2! \\cdots n_k!}$ where $n_i$ is the count of each distinct letter."
  ],

  "In how many ways can 3 identical red balls and 2 identical": [
    "Since the balls of each color are identical, only the POSITIONS of each color matter, not which specific ball goes where.",
    "Choosing $2$ positions out of $5$ for blue balls automatically determines where the $3$ red balls go. So it's just $\\binom{5}{2}$.",
    "$\\binom{5}{2} = \\frac{5 \\times 4}{2} = 10$.",
    "Equivalently: $\\binom{5}{3} = 10$ (choosing positions for red). Both give the same answer because $\\binom{n}{k} = \\binom{n}{n-k}$.",
    "This is the same as the multinomial coefficient $\\frac{5!}{3!2!} = 10$. Multinomials and combinations are two sides of the same coin."
  ],

  // ===================== COMBINATORICS - PIGEONHOLE =====================

  "In a group of 13 people, at least how many must share the": [
    "The Pigeonhole Principle: if you put $n$ objects into $k$ boxes and $n > k$, at least one box contains $\\geq 2$ objects.",
    "Here the 'pigeonholes' are the $12$ months, and the 'pigeons' are the $13$ people. Since $13 > 12$, at least one month has $\\geq 2$ people.",
    "$\\lceil 13/12 \\rceil = \\lceil 1.083 \\rceil = 2$. The ceiling function rounds up because you can't have a fraction of a person.",
    "Note: this says 'at least $2$.' It's possible that MORE share a month, but $2$ is GUARANTEED.",
    "The Pigeonhole Principle doesn't tell you WHICH month has duplicates — only that at least one does. It's an existence argument, not constructive."
  ],

  "From the integers $1, 2, 3, \\ldots, 20$, how many must be": [
    "The Pigeonhole Principle needs us to identify the 'pigeonholes.' Group numbers into pairs that differ by exactly $5$.",
    "The $10$ pairs: $(1,6), (2,7), (3,8), (4,9), (5,10), (11,16), (12,17), (13,18), (14,19), (15,20)$. Every number from $1$-$20$ belongs to exactly one pair.",
    "Each pair is a 'pigeonhole.' If we pick BOTH numbers from any pair, we have two numbers differing by $5$.",
    "To avoid a pair, pick at most one from each of the $10$ pairs. Maximum safe selection: $10$ numbers.",
    "The $11$th number must come from a pair that already has one number chosen — guaranteeing a difference of $5$. So the answer is $11$."
  ],

  // ===================== COMBINATORICS - INCLUSION-EXCLUSION =====================

  "In a class of 40 students, 25 take math, 18 take science,": [
    "Without inclusion-exclusion, adding $25 + 18 = 43$ overcounts the $8$ students who take BOTH subjects (they get counted twice).",
    "$|A \\cup B| = |A| + |B| - |A \\cap B|$ corrects for the double-counting. This is the inclusion-exclusion principle for two sets.",
    "$25 + 18 - 8 = 35$ students take at least one of math or science.",
    "'Neither' means the complement: $40 - 35 = 5$ students take neither subject.",
    "Drawing a Venn diagram helps visualize: $25 - 8 = 17$ take only math, $18 - 8 = 10$ take only science, $8$ take both, and $5$ take neither. Check: $17 + 10 + 8 + 5 = 40$."
  ],

  "How many integers from 1 to 100 are divisible by 2 or 3?": [
    "Inclusion-exclusion: $|A \\cup B| = |A| + |B| - |A \\cap B|$. The '$-|A \\cap B|$' removes the overlap (numbers divisible by BOTH $2$ and $3$).",
    "Multiples of $2$ up to $100$: $\\lfloor \\frac{100}{2} \\rfloor = 50$. These are $2, 4, 6, \\ldots, 100$.",
    "Multiples of $3$ up to $100$: $\\lfloor \\frac{100}{3} \\rfloor = 33$. The floor function handles the fact that $100/3$ isn't an integer.",
    "Multiples of BOTH $2$ and $3$ = multiples of $\\text{lcm}(2,3) = 6$: $\\lfloor \\frac{100}{6} \\rfloor = 16$.",
    "$50 + 33 - 16 = 67$. For three or more sets, inclusion-exclusion alternates: add singles, subtract pairs, add triples, etc."
  ],

  "How many permutations of $\\{1,2,3,4,5\\}$ have no fixed p": [
    "A 'fixed point' (or 'fixed element') is an element that stays in its original position: $\\sigma(i) = i$. A derangement has ZERO fixed points.",
    "The formula uses inclusion-exclusion to subtract permutations WITH fixed points. Let $A_i$ = permutations fixing element $i$, then $D_n = n! - |A_1 \\cup \\cdots \\cup A_n|$.",
    "After inclusion-exclusion, the beautiful formula emerges: $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$. The alternating sum approximates $\\frac{n!}{e}$.",
    "The partial sum $\\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120} = \\frac{60 - 20 + 5 - 1}{120} = \\frac{44}{120}$. Common denominator is $120 = 5!$.",
    "$D_5 = 120 \\times \\frac{44}{120} = 44$. Fun fact: $D_n / n!$ approaches $1/e \\approx 0.3679$ as $n \\to \\infty$. So about $36.8\\%$ of all permutations are derangements!"
  ]
};

// Lookup function: match problem text to hintDetails
function getHintDetails(problemText) {
  if (!problemText) return null;
  var key = problemText.substring(0, 60);
  for (var k in HINT_DETAILS_BANK) {
    if (key.indexOf(k.substring(0, 40)) === 0 || k.indexOf(key.substring(0, 40)) === 0) {
      return HINT_DETAILS_BANK[k];
    }
  }
  return null;
}
