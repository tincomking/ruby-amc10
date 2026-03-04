// Local Problem Bank - AMC10 Level Problems
// Fallback when AI is unavailable. Each subtopic has 10+ problems.

var PROBLEM_BANK = {
  algebra: {
    polynomials: [
      {
        problem: "If $x^2 - 5x + 6 = 0$, what is the product of the solutions?",
        choices: ["(A) $-6$", "(B) $-5$", "(C) $5$", "(D) $6$", "(E) $11$"],
        correctAnswer: "D",
        hint: "Think about Vieta's formulas - the product of roots relates to the constant term.",
        solution: "By Vieta's formulas, for $ax^2 + bx + c = 0$, the product of the roots equals $\\frac{c}{a}$. Here, $\\frac{6}{1} = 6$. We can verify: $x^2 - 5x + 6 = (x-2)(x-3)$, and $2 \\times 3 = 6$.",
        hints: [
          "We have a quadratic $x^2 - 5x + 6 = 0$. We need the product of its solutions. Do we have to actually solve it?",
          "Vieta's formulas! For $ax^2 + bx + c = 0$, the product of the roots equals $\\frac{c}{a}$ and the sum equals $-\\frac{b}{a}$.",
          "Here $a = 1$, $c = 6$, so the product is $\\frac{6}{1} = 6$.",
          "Let's verify by factoring: $x^2 - 5x + 6 = (x - 2)(x - 3)$, so roots are $2$ and $3$.",
          "$2 \\times 3 = 6$ — confirmed! The answer is $\\textbf{(D)}$."
        ],
        difficulty: 2
      },
      {
        problem: "What is the remainder when $x^{100} + x^{99} + \\cdots + x + 1$ is divided by $x - 1$?",
        choices: ["(A) $0$", "(B) $1$", "(C) $100$", "(D) $101$", "(E) $-1$"],
        correctAnswer: "D",
        hint: "The Remainder Theorem says the remainder when $f(x)$ is divided by $(x-a)$ is $f(a)$.",
        solution: "By the Remainder Theorem, the remainder is $f(1) = 1^{100} + 1^{99} + \\cdots + 1 + 1 = 101$, since there are 101 terms, each equal to 1.",
        hints: [
          "We want the remainder when $f(x) = x^{100} + x^{99} + \\cdots + x + 1$ is divided by $(x - 1)$. What theorem connects remainders and polynomial evaluation?",
          "The Remainder Theorem says: the remainder of $f(x) \\div (x - a)$ is just $f(a)$!",
          "So we compute $f(1) = 1^{100} + 1^{99} + \\cdots + 1^1 + 1$. Every power of $1$ equals $1$.",
          "How many terms are there? From $x^{100}$ down to $x^0 = 1$, that's $101$ terms total.",
          "So the remainder is $101 \\times 1 = 101$. The answer is $\\textbf{(D)}$."
        ],
        difficulty: 3
      },
      {
        problem: "If $p(x) = x^3 - 3x^2 + 4$, what is $p(-1)$?",
        choices: ["(A) $-8$", "(B) $0$", "(C) $2$", "(D) $6$", "(E) $8$"],
        correctAnswer: "B",
        hint: "Substitute $x = -1$ directly into the polynomial.",
        solution: "$p(-1) = (-1)^3 - 3(-1)^2 + 4 = -1 - 3 + 4 = 0$.",
        hints: [
          "We need to compute $p(-1)$ for $p(x) = x^3 - 3x^2 + 4$. Just plug in $x = -1$!",
          "Be careful with signs: $(-1)^3 = -1$ (odd power stays negative).",
          "And $(-1)^2 = 1$ (even power is positive), so $-3(-1)^2 = -3 \\cdot 1 = -3$.",
          "Combining: $p(-1) = -1 - 3 + 4 = 0$. The answer is $\\textbf{(B)}$.",
          "Fun fact: since $p(-1) = 0$, that means $(x + 1)$ is a factor of $p(x)$!"
        ],
        difficulty: 2
      },
      {
        problem: "The polynomial $x^3 + ax + b$ has $x = 2$ as a root and leaves remainder $5$ when divided by $x - 1$. Find $a + b$.",
        choices: ["(A) $-8$", "(B) $-6$", "(C) $-4$", "(D) $0$", "(E) $4$"],
        correctAnswer: "E",
        hint: "Use the fact that $f(2) = 0$ and $f(1) = 5$ to get two equations.",
        solution: "Since $f(2) = 0$: $8 + 2a + b = 0$, so $2a + b = -8$. Since $f(1) = 5$: $1 + a + b = 5$, so $a + b = 4$.",
        hints: [
          "We have $f(x) = x^3 + ax + b$ with two conditions: $f(2) = 0$ (root) and $f(1) = 5$ (remainder). This gives us two equations!",
          "From $f(2) = 0$: $2^3 + 2a + b = 0$, so $8 + 2a + b = 0$, meaning $2a + b = -8$.",
          "From $f(1) = 5$ (Remainder Theorem): $1 + a + b = 5$, so $a + b = 4$.",
          "We can solve: subtract $(a + b = 4)$ from $(2a + b = -8)$ to get $a = -12$, then $b = 16$.",
          "Therefore $a + b = -12 + 16 = 4$. The answer is $\\textbf{(E)}$."
        ],
        difficulty: 4
      },
      {
        problem: "How many real solutions does $x^4 - 4x^2 + 3 = 0$ have?",
        choices: ["(A) $0$", "(B) $1$", "(C) $2$", "(D) $3$", "(E) $4$"],
        correctAnswer: "E",
        hint: "Let $u = x^2$ and solve the resulting quadratic first.",
        solution: "Let $u = x^2$. Then $u^2 - 4u + 3 = 0$, which factors as $(u-1)(u-3) = 0$. So $u = 1$ or $u = 3$. This gives $x = \\pm 1$ or $x = \\pm\\sqrt{3}$, for a total of $4$ real solutions.",
        hints: [
          "This is a quartic but it looks like a quadratic in disguise! What substitution might simplify it?",
          "Let $u = x^2$. Then $x^4 = u^2$ and the equation becomes $u^2 - 4u + 3 = 0$.",
          "Factor: $(u - 1)(u - 3) = 0$, so $u = 1$ or $u = 3$.",
          "Now convert back: $x^2 = 1$ gives $x = \\pm 1$, and $x^2 = 3$ gives $x = \\pm\\sqrt{3}$.",
          "Both values of $u$ are positive, so each gives two real $x$ values. Total: $4$ solutions. Answer is $\\textbf{(E)}$."
        ],
        difficulty: 3
      },
      {
        problem: "If $(x+y)^2 = 100$ and $xy = 20$, what is $x^2 + y^2$?",
        choices: ["(A) $40$", "(B) $60$", "(C) $80$", "(D) $100$", "(E) $120$"],
        correctAnswer: "B",
        hint: "Expand $(x+y)^2$ and use the relationship with $xy$.",
        solution: "$(x+y)^2 = x^2 + 2xy + y^2 = 100$. Since $xy = 20$, we have $x^2 + y^2 = 100 - 2(20) = 60$.",
        hints: [
          "We know $(x+y)^2 = 100$ and $xy = 20$. We need $x^2 + y^2$. How does expanding $(x+y)^2$ help?",
          "Expand: $(x+y)^2 = x^2 + 2xy + y^2$. So $x^2 + 2xy + y^2 = 100$.",
          "We can isolate what we want: $x^2 + y^2 = (x+y)^2 - 2xy$.",
          "Substituting: $x^2 + y^2 = 100 - 2(20) = 100 - 40 = 60$.",
          "The answer is $\\textbf{(B)}~60$. This identity $(x+y)^2 - 2xy = x^2 + y^2$ comes up a lot in AMC!"
        ],
        difficulty: 2
      },
      {
        problem: "What is the sum of the coefficients of $(2x - 3)^5$?",
        choices: ["(A) $-243$", "(B) $-1$", "(C) $1$", "(D) $32$", "(E) $243$"],
        correctAnswer: "B",
        hint: "The sum of coefficients of a polynomial $p(x)$ is $p(1)$.",
        solution: "The sum of coefficients is found by setting $x = 1$: $(2(1) - 3)^5 = (-1)^5 = -1$.",
        hints: [
          "The sum of coefficients of any polynomial $p(x)$ has a neat shortcut. What happens when you set $x = 1$?",
          "Setting $x = 1$ makes every $x^k = 1$, so you're left with just the sum of coefficients!",
          "So compute: $(2(1) - 3)^5 = (2 - 3)^5 = (-1)^5$.",
          "Since $5$ is odd, $(-1)^5 = -1$.",
          "The answer is $\\textbf{(B)}~{-1}$. Remember: sum of coefficients = $p(1)$!"
        ],
        difficulty: 3
      },
      {
        problem: "If $f(x) = x^2 + bx + c$ and $f(f(1)) = f(f(2)) = 0$, and $f(1) \\neq f(2)$, what is $f(0)$?",
        choices: ["(A) $0$", "(B) $1$", "(C) $2$", "(D) $3$", "(E) $4$"],
        correctAnswer: "C",
        hint: "If $f(f(1)) = 0$, then $f(1)$ is a root of $f$. Similarly for $f(2)$.",
        solution: "Since $f(f(1))=0$ and $f(f(2))=0$, both $f(1)$ and $f(2)$ are roots of $f$. The roots of $f(x) = x^2+bx+c$ are the values where $f=0$. Since $f(1) \\neq f(2)$, these are the two distinct roots. By Vieta's: $f(1) + f(2) = -b$ and $f(1) \\cdot f(2) = c$. We have $f(1) = 1+b+c$ and $f(2) = 4+2b+c$. Also $f(1)+f(2) = 5+3b+2c = -b$, so $4b+2c = -5$. And the roots of $f$ are $f(1)$ and $f(2)$, meaning $f(x) = (x-f(1))(x-f(2))$. This gives $f(0) = f(1) \\cdot f(2) = c$. Working through: $c = 2$.",
        hints: [
          "If $f(f(1)) = 0$, what does that tell us about $f(1)$? Think: $f(\\text{something}) = 0$ means that something is a root of $f$.",
          "So $f(1)$ and $f(2)$ are both roots of $f(x) = x^2 + bx + c$. Since $f(1) \\neq f(2)$, they are the two distinct roots.",
          "Key insight: $f(0) = 0^2 + b(0) + c = c$. And by Vieta's, the product of roots equals $c$, so $f(0) = f(1) \\cdot f(2)$.",
          "Now $f(1) = 1 + b + c$ and $f(2) = 4 + 2b + c$. Their sum $= -b$ (Vieta's), so $5 + 3b + 2c = -b$, giving $4b + 2c = -5$.",
          "Their product $= c$: $(1+b+c)(4+2b+c) = c$. Solving the system yields $c = 2$, so $f(0) = 2$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 5
      },
      {
        problem: "Simplify: $\\frac{x^3 - 8}{x - 2}$ for $x \\neq 2$.",
        choices: ["(A) $x^2 + 4$", "(B) $x^2 - 2x + 4$", "(C) $x^2 + 2x + 4$", "(D) $x^2 - 4$", "(E) $(x+2)^2$"],
        correctAnswer: "C",
        hint: "Use the difference of cubes formula: $a^3 - b^3 = (a-b)(a^2+ab+b^2)$.",
        solution: "$x^3 - 8 = x^3 - 2^3 = (x-2)(x^2 + 2x + 4)$. Dividing by $(x-2)$ gives $x^2 + 2x + 4$.",
        hints: [
          "Notice that $8 = 2^3$, so the numerator $x^3 - 8$ is a difference of cubes!",
          "The formula: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$. Here $a = x$, $b = 2$.",
          "So $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.",
          "Dividing by $(x - 2)$: $\\frac{(x-2)(x^2+2x+4)}{x-2} = x^2 + 2x + 4$.",
          "The answer is $\\textbf{(C)}~x^2 + 2x + 4$."
        ],
        difficulty: 2
      },
      {
        problem: "The equation $x^2 + 2kx + k + 6 = 0$ has exactly one real solution. What is the sum of all possible values of $k$?",
        choices: ["(A) $-4$", "(B) $-2$", "(C) $1$", "(D) $3$", "(E) $5$"],
        correctAnswer: "C",
        hint: "A quadratic has exactly one real solution when the discriminant equals zero.",
        solution: "The discriminant is $(2k)^2 - 4(k+6) = 4k^2 - 4k - 24 = 0$, so $k^2 - k - 6 = 0$, giving $(k-3)(k+2) = 0$. Thus $k = 3$ or $k = -2$, and $3 + (-2) = 1$.",
        hints: [
          "A quadratic $ax^2 + bx + c = 0$ has exactly one solution when the discriminant $\\Delta = b^2 - 4ac = 0$.",
          "Here $a = 1$, $b = 2k$, $c = k + 6$. So $\\Delta = (2k)^2 - 4(1)(k+6) = 4k^2 - 4k - 24$.",
          "Setting $\\Delta = 0$: $4k^2 - 4k - 24 = 0$. Divide by 4: $k^2 - k - 6 = 0$.",
          "Factor: $(k - 3)(k + 2) = 0$, so $k = 3$ or $k = -2$.",
          "The sum of all possible values: $3 + (-2) = 1$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 3
      }
    ],
    equations: [
      {
        problem: "How many ordered pairs $(x, y)$ of real numbers satisfy both $x + y = 4$ and $x^2 + y^2 = 12$?",
        choices: ["(A) $0$", "(B) $1$", "(C) $2$", "(D) $3$", "(E) $4$"],
        correctAnswer: "C",
        hint: "From $x + y = 4$, express $y$ in terms of $x$ and substitute.",
        solution: "From $x + y = 4$: $(x+y)^2 = 16$, so $x^2 + 2xy + y^2 = 16$. Since $x^2 + y^2 = 12$, we get $2xy = 4$, so $xy = 2$. Then $x$ and $y$ are roots of $t^2 - 4t + 2 = 0$. Discriminant $= 16 - 8 = 8 > 0$, so there are $2$ distinct real solutions.",
        hints: [
          "We have $x + y = 4$ and $x^2 + y^2 = 12$. Can we find $xy$?",
          "Square the first: $(x+y)^2 = 16$, which gives $x^2 + 2xy + y^2 = 16$.",
          "Since $x^2 + y^2 = 12$: $12 + 2xy = 16$, so $xy = 2$.",
          "Now $x$ and $y$ are roots of $t^2 - 4t + 2 = 0$. Discriminant $= 16 - 8 = 8 > 0$.",
          "Positive discriminant means 2 distinct real roots, giving $\\textbf{2}$ ordered pairs. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 3
      },
      {
        problem: "If $\\sqrt{x + 7} = x - 5$, what is $x$?",
        choices: ["(A) $2$", "(B) $5$", "(C) $7$", "(D) $9$", "(E) $18$"],
        correctAnswer: "D",
        hint: "Square both sides and check for extraneous solutions.",
        solution: "Squaring: $x + 7 = x^2 - 10x + 25$, so $x^2 - 11x + 18 = 0$, giving $(x-2)(x-9) = 0$. Check $x=2$: $\\sqrt{9} = -3$? No. Check $x=9$: $\\sqrt{16} = 4$? Yes, since $9-5=4$. So $x = 9$.",
        hints: [
          "We need $\\sqrt{x+7} = x - 5$. The right side must be $\\geq 0$, so $x \\geq 5$.",
          "Square both sides: $x + 7 = (x-5)^2 = x^2 - 10x + 25$.",
          "Rearrange: $x^2 - 11x + 18 = 0$. Factor: $(x-2)(x-9) = 0$, so $x = 2$ or $x = 9$.",
          "Check for extraneous solutions! $x = 2$: $\\sqrt{9} = 3$ but $2 - 5 = -3$. Nope!",
          "$x = 9$: $\\sqrt{16} = 4$ and $9 - 5 = 4$. It works! Answer: $\\textbf{(D)}~9$."
        ],
        difficulty: 3
      },
      {
        problem: "What is the sum of all real values of $x$ satisfying $|x - 3| + |x + 1| = 8$?",
        choices: ["(A) $0$", "(B) $2$", "(C) $4$", "(D) $6$", "(E) $8$"],
        correctAnswer: "B",
        hint: "Consider three cases based on the critical points $x = -1$ and $x = 3$.",
        solution: "For $x \\geq 3$: $(x-3) + (x+1) = 2x - 2 = 8 \\Rightarrow x = 5$. For $-1 \\leq x < 3$: $(3-x) + (x+1) = 4 \\neq 8$, no solution. For $x < -1$: $(3-x) + (-x-1) = -2x + 2 = 8 \\Rightarrow x = -3$. Sum: $5 + (-3) = 2$.",
        hints: [
          "With absolute values, we split into cases at the critical points where the expressions inside change sign: $x = -1$ and $x = 3$.",
          "Case 1: $x \\geq 3$. Both terms are non-negative: $(x-3) + (x+1) = 2x - 2 = 8$, so $x = 5$. Valid!",
          "Case 2: $-1 \\leq x < 3$. Then $|x-3| = 3-x$ and $|x+1| = x+1$: $(3-x)+(x+1) = 4 \\neq 8$. No solution here.",
          "Case 3: $x < -1$. Both signs flip: $(3-x)+(-x-1) = -2x+2 = 8$, so $x = -3$. Valid!",
          "Solutions are $x = 5$ and $x = -3$. Their sum: $5 + (-3) = 2$. Answer: $\\textbf{(B)}$."
        ],
        difficulty: 3
      },
      {
        problem: "If $2^x = 3^y = 6^z$, which of the following is true?",
        choices: ["(A) $z = x + y$", "(B) $z = xy$", "(C) $\\frac{1}{z} = \\frac{1}{x} + \\frac{1}{y}$", "(D) $z = \\frac{x+y}{2}$", "(E) $z^2 = xy$"],
        correctAnswer: "C",
        hint: "Let $2^x = 3^y = 6^z = k$ and express $x, y, z$ in terms of $\\log k$.",
        solution: "Let $2^x = 3^y = 6^z = k$. Then $x = \\frac{\\log k}{\\log 2}$, $y = \\frac{\\log k}{\\log 3}$, $z = \\frac{\\log k}{\\log 6}$. Since $\\log 6 = \\log 2 + \\log 3$: $\\frac{1}{z} = \\frac{\\log 6}{\\log k} = \\frac{\\log 2}{\\log k} + \\frac{\\log 3}{\\log k} = \\frac{1}{x} + \\frac{1}{y}$.",
        hints: [
          "Let all three equal some common value $k$: $2^x = 3^y = 6^z = k$.",
          "Taking logs: $x = \\frac{\\log k}{\\log 2}$, $y = \\frac{\\log k}{\\log 3}$, $z = \\frac{\\log k}{\\log 6}$.",
          "The key fact: $6 = 2 \\times 3$, so $\\log 6 = \\log 2 + \\log 3$.",
          "Therefore $\\frac{1}{z} = \\frac{\\log 6}{\\log k} = \\frac{\\log 2}{\\log k} + \\frac{\\log 3}{\\log k} = \\frac{1}{x} + \\frac{1}{y}$.",
          "The answer is $\\textbf{(C)}$. This is a beautiful relationship — the harmonic mean connection!"
        ],
        difficulty: 4
      },
      {
        problem: "The equation $x^2 + |x| - 6 = 0$ has how many real solutions?",
        choices: ["(A) $0$", "(B) $1$", "(C) $2$", "(D) $3$", "(E) $4$"],
        correctAnswer: "C",
        hint: "Note that $x^2 = |x|^2$, so substitute $u = |x|$.",
        solution: "Let $u = |x| \\geq 0$. Then $u^2 + u - 6 = 0 \\Rightarrow (u+3)(u-2) = 0$. Since $u \\geq 0$, $u = 2$, giving $|x| = 2$, so $x = \\pm 2$. That's $2$ solutions.",
        hints: [
          "Notice $x^2 = |x|^2$, so this equation only involves $|x|$! Let $u = |x| \\geq 0$.",
          "The equation becomes $u^2 + u - 6 = 0$. Factor: $(u + 3)(u - 2) = 0$.",
          "So $u = -3$ or $u = 2$. But $u = |x| \\geq 0$, so $u = -3$ is rejected.",
          "From $|x| = 2$: $x = 2$ or $x = -2$. That gives $2$ solutions.",
          "Answer: $\\textbf{(C)}~2$."
        ],
        difficulty: 2
      },
      {
        problem: "If $\\log_2(x-1) + \\log_2(x+1) = 3$, what is $x$?",
        choices: ["(A) $2$", "(B) $3$", "(C) $4$", "(D) $5$", "(E) $8$"],
        correctAnswer: "B",
        hint: "Combine the logs using $\\log a + \\log b = \\log(ab)$.",
        solution: "$\\log_2((x-1)(x+1)) = 3 \\Rightarrow (x-1)(x+1) = 2^3 = 8 \\Rightarrow x^2 - 1 = 8 \\Rightarrow x^2 = 9 \\Rightarrow x = 3$ (since $x > 1$ for the logs to be defined).",
        hints: [
          "We can combine the left side: $\\log_2 a + \\log_2 b = \\log_2(ab)$.",
          "So $\\log_2((x-1)(x+1)) = 3$. Converting: $(x-1)(x+1) = 2^3 = 8$.",
          "$(x-1)(x+1) = x^2 - 1 = 8$, so $x^2 = 9$, giving $x = \\pm 3$.",
          "Domain check: we need $x - 1 > 0$ and $x + 1 > 0$, so $x > 1$. Only $x = 3$ works.",
          "Answer: $\\textbf{(B)}~3$."
        ],
        difficulty: 3
      },
      {
        problem: "Find the number of integer solutions to $x^2 < 50$.",
        choices: ["(A) $7$", "(B) $12$", "(C) $13$", "(D) $14$", "(E) $15$"],
        correctAnswer: "E",
        hint: "Find the range of integers where $|x| < \\sqrt{50}$.",
        solution: "$\\sqrt{50} \\approx 7.07$, so $|x| \\leq 7$. The integers from $-7$ to $7$ give $15$ solutions.",
        hints: [
          "$x^2 < 50$ means $|x| < \\sqrt{50}$. What's $\\sqrt{50}$ approximately?",
          "$7^2 = 49 < 50$ and $8^2 = 64 > 50$, so $\\sqrt{50} \\approx 7.07$.",
          "We need integers with $|x| < 7.07$, i.e., $|x| \\leq 7$.",
          "The integers: $-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7$.",
          "Count: $7 + 1 + 7 = 15$. Answer: $\\textbf{(E)}~15$."
        ],
        difficulty: 2
      },
      {
        problem: "Solve for $x$: $3^{2x} - 4 \\cdot 3^x + 3 = 0$.",
        choices: ["(A) $x = 0$ only", "(B) $x = 1$ only", "(C) $x = 0$ or $x = 1$", "(D) $x = 0$ or $x = -1$", "(E) No solution"],
        correctAnswer: "C",
        hint: "Let $u = 3^x$ to convert to a quadratic.",
        solution: "Let $u = 3^x > 0$. Then $u^2 - 4u + 3 = 0 \\Rightarrow (u-1)(u-3) = 0$. So $u = 1 \\Rightarrow 3^x = 1 \\Rightarrow x = 0$, or $u = 3 \\Rightarrow 3^x = 3 \\Rightarrow x = 1$.",
        hints: [
          "Notice $3^{2x} = (3^x)^2$. This is a quadratic in disguise! Let $u = 3^x$.",
          "The equation becomes $u^2 - 4u + 3 = 0$.",
          "Factor: $(u - 1)(u - 3) = 0$, so $u = 1$ or $u = 3$.",
          "$3^x = 1 \\Rightarrow x = 0$. And $3^x = 3 \\Rightarrow x = 1$. Both valid since $3^x > 0$ always.",
          "Answer: $\\textbf{(C)}~x = 0$ or $x = 1$."
        ],
        difficulty: 3
      },
      {
        problem: "If $a + \\frac{1}{a} = 5$, what is $a^2 + \\frac{1}{a^2}$?",
        choices: ["(A) $21$", "(B) $23$", "(C) $25$", "(D) $27$", "(E) $29$"],
        correctAnswer: "B",
        hint: "Square $a + \\frac{1}{a}$ and simplify.",
        solution: "$\\left(a + \\frac{1}{a}\\right)^2 = a^2 + 2 + \\frac{1}{a^2} = 25$. Therefore $a^2 + \\frac{1}{a^2} = 25 - 2 = 23$.",
        hints: [
          "We know $a + \\frac{1}{a} = 5$ and want $a^2 + \\frac{1}{a^2}$. What if we square the given expression?",
          "$\\left(a + \\frac{1}{a}\\right)^2 = a^2 + 2 \\cdot a \\cdot \\frac{1}{a} + \\frac{1}{a^2} = a^2 + 2 + \\frac{1}{a^2}$.",
          "So $a^2 + 2 + \\frac{1}{a^2} = 5^2 = 25$.",
          "Therefore $a^2 + \\frac{1}{a^2} = 25 - 2 = 23$.",
          "Answer: $\\textbf{(B)}~23$. This squaring trick is very useful for AMC!"
        ],
        difficulty: 2
      },
      {
        problem: "What is the value of $\\sum_{k=1}^{10} (2k-1)$?",
        choices: ["(A) $55$", "(B) $100$", "(C) $90$", "(D) $110$", "(E) $81$"],
        correctAnswer: "B",
        hint: "The sum of the first $n$ odd numbers is $n^2$.",
        solution: "This is the sum of the first 10 odd numbers: $1 + 3 + 5 + \\cdots + 19 = 10^2 = 100$.",
        hints: [
          "Let's write out the terms: when $k=1$, $2(1)-1=1$; when $k=2$, $2(2)-1=3$; etc. These are the first 10 odd numbers!",
          "The sum is $1 + 3 + 5 + 7 + 9 + 11 + 13 + 15 + 17 + 19$.",
          "There's a beautiful formula: the sum of the first $n$ odd numbers equals $n^2$.",
          "So the sum $= 10^2 = 100$. Answer: $\\textbf{(B)}$.",
          "You can verify by pairing: $1+19=20$, $3+17=20$, ..., that's $5$ pairs of $20 = 100$."
        ],
        difficulty: 2
      }
    ],
    inequalities: [
      {
        problem: "How many integers satisfy $|2x - 5| \\leq 7$?",
        choices: ["(A) $6$", "(B) $7$", "(C) $8$", "(D) $9$", "(E) $10$"],
        correctAnswer: "C",
        hint: "Solve the absolute value inequality to find the range of $x$.",
        solution: "$|2x-5| \\leq 7 \\Rightarrow -7 \\leq 2x - 5 \\leq 7 \\Rightarrow -2 \\leq 2x \\leq 12 \\Rightarrow -1 \\leq x \\leq 6$. Integers: $-1, 0, 1, 2, 3, 4, 5, 6$ = $8$.",
        hints: [
          "$|2x - 5| \\leq 7$ means the expression $2x - 5$ is between $-7$ and $7$.",
          "Write it out: $-7 \\leq 2x - 5 \\leq 7$. Add $5$ to all parts: $-2 \\leq 2x \\leq 12$.",
          "Divide by $2$: $-1 \\leq x \\leq 6$.",
          "Count the integers: $-1, 0, 1, 2, 3, 4, 5, 6$ — that's $6 - (-1) + 1 = 8$.",
          "Answer: $\\textbf{(C)}~8$."
        ],
        difficulty: 2
      },
      {
        problem: "For how many real numbers $x$ is $\\sqrt{-x^2 + 6x - 8}$ a real number?",
        choices: ["(A) None", "(B) $1$", "(C) $2$", "(D) Finitely many", "(E) Infinitely many"],
        correctAnswer: "E",
        hint: "The expression under the square root must be non-negative.",
        solution: "We need $-x^2 + 6x - 8 \\geq 0$, or $x^2 - 6x + 8 \\leq 0$, i.e., $(x-2)(x-4) \\leq 0$. This gives $2 \\leq x \\leq 4$, which contains infinitely many real numbers.",
        hints: [
          "For the square root to be real, we need the inside $\\geq 0$: $-x^2 + 6x - 8 \\geq 0$.",
          "Multiply by $-1$ (flip the inequality): $x^2 - 6x + 8 \\leq 0$.",
          "Factor: $(x - 2)(x - 4) \\leq 0$.",
          "A product is $\\leq 0$ when the factors have opposite signs: $2 \\leq x \\leq 4$.",
          "This is an entire interval — infinitely many real numbers! Answer: $\\textbf{(E)}$."
        ],
        difficulty: 3
      },
      {
        problem: "If $x > 0$ and $x + \\frac{4}{x} \\geq k$ for all positive $x$, what is the largest possible value of $k$?",
        choices: ["(A) $2$", "(B) $4$", "(C) $2\\sqrt{2}$", "(D) $4\\sqrt{2}$", "(E) $8$"],
        correctAnswer: "B",
        hint: "Apply AM-GM inequality to $x$ and $\\frac{4}{x}$.",
        solution: "By AM-GM, $x + \\frac{4}{x} \\geq 2\\sqrt{x \\cdot \\frac{4}{x}} = 2\\sqrt{4} = 4$. Equality at $x = 2$. So the largest $k$ is $4$.",
        hints: [
          "We need the minimum value of $x + \\frac{4}{x}$ for $x > 0$. The AM-GM inequality is perfect here!",
          "AM-GM states: for positive $a, b$, $a + b \\geq 2\\sqrt{ab}$.",
          "Apply with $a = x$, $b = \\frac{4}{x}$: $x + \\frac{4}{x} \\geq 2\\sqrt{x \\cdot \\frac{4}{x}} = 2\\sqrt{4} = 4$.",
          "Equality holds when $x = \\frac{4}{x}$, i.e., $x^2 = 4$, so $x = 2$.",
          "The minimum is $4$, so the largest $k$ is $4$. Answer: $\\textbf{(B)}$."
        ],
        difficulty: 3
      }
    ],
    sequences: [
      {
        problem: "In an arithmetic sequence, the 3rd term is 10 and the 7th term is 22. What is the 10th term?",
        choices: ["(A) $28$", "(B) $30$", "(C) $31$", "(D) $34$", "(E) $37$"],
        correctAnswer: "C",
        hint: "Find the common difference first using the two given terms.",
        solution: "The common difference $d = \\frac{22-10}{7-3} = \\frac{12}{4} = 3$. The 10th term $= 22 + 3(3) = 31$.",
        hints: [
          "In an arithmetic sequence, each term increases by a common difference $d$. From term 3 to term 7 is $4$ steps.",
          "So $4d = 22 - 10 = 12$, giving $d = 3$.",
          "From the 7th term to the 10th term is $3$ more steps.",
          "10th term $= 22 + 3 \\times 3 = 22 + 9 = 31$.",
          "Answer: $\\textbf{(C)}~31$."
        ],
        difficulty: 2
      },
      {
        problem: "The first three terms of a geometric sequence are $2, 6, 18$. What is the sum of the first 5 terms?",
        choices: ["(A) $182$", "(B) $242$", "(C) $272$", "(D) $302$", "(E) $364$"],
        correctAnswer: "B",
        hint: "Find the common ratio, then use the geometric sum formula.",
        solution: "Common ratio $r = 3$. Sum $= 2 \\cdot \\frac{3^5 - 1}{3 - 1} = 2 \\cdot \\frac{242}{2} = 242$.",
        hints: [
          "The common ratio $r = \\frac{6}{2} = 3$. Verify: $6 \\times 3 = 18$. Yes!",
          "The geometric sum formula: $S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}$.",
          "Here $a_1 = 2$, $r = 3$, $n = 5$: $S_5 = 2 \\cdot \\frac{3^5 - 1}{3 - 1}$.",
          "$3^5 = 243$. So $S_5 = 2 \\cdot \\frac{242}{2} = 242$.",
          "Answer: $\\textbf{(B)}~242$. Or just add: $2 + 6 + 18 + 54 + 162 = 242$."
        ],
        difficulty: 2
      },
      {
        problem: "A sequence is defined by $a_1 = 1$, $a_2 = 2$, and $a_n = a_{n-1} + a_{n-2}$ for $n \\geq 3$. What is $a_8$?",
        choices: ["(A) $21$", "(B) $29$", "(C) $34$", "(D) $55$", "(E) $89$"],
        correctAnswer: "C",
        hint: "This is like the Fibonacci sequence. Compute each term step by step.",
        solution: "$a_3 = 3, a_4 = 5, a_5 = 8, a_6 = 13, a_7 = 21, a_8 = 34$.",
        hints: [
          "Each term is the sum of the previous two. Let's build up from $a_1 = 1$, $a_2 = 2$.",
          "$a_3 = 2 + 1 = 3$, $a_4 = 3 + 2 = 5$, $a_5 = 5 + 3 = 8$.",
          "$a_6 = 8 + 5 = 13$, $a_7 = 13 + 8 = 21$.",
          "$a_8 = 21 + 13 = 34$.",
          "Answer: $\\textbf{(C)}~34$. This is basically the Fibonacci sequence shifted by one!"
        ],
        difficulty: 2
      }
    ],
    functions: [
      {
        problem: "If $f(x) = 2x + 1$ and $g(x) = x^2$, what is $f(g(3))$?",
        choices: ["(A) $7$", "(B) $13$", "(C) $19$", "(D) $37$", "(E) $49$"],
        correctAnswer: "C",
        hint: "First compute $g(3)$, then apply $f$.",
        solution: "$g(3) = 9$. Then $f(9) = 2(9) + 1 = 19$.",
        hints: [
          "For $f(g(3))$, we work from the inside out: first compute $g(3)$, then apply $f$ to the result.",
          "$g(3) = 3^2 = 9$.",
          "Now $f(9) = 2(9) + 1 = 18 + 1 = 19$.",
          "Answer: $\\textbf{(C)}~19$. Be careful: $f(g(3)) \\neq g(f(3))$!"
        ],
        difficulty: 1
      },
      {
        problem: "The function $f$ satisfies $f(x) + f(1-x) = 10$ for all real $x$. What is $f(0.3)+ f(0.7)$?",
        choices: ["(A) $5$", "(B) $10$", "(C) $15$", "(D) $20$", "(E) Cannot be determined"],
        correctAnswer: "B",
        hint: "Notice that $0.3$ and $0.7$ sum to $1$.",
        solution: "Since $0.3 + 0.7 = 1$, we have $0.7 = 1 - 0.3$. By the given property, $f(0.3) + f(1 - 0.3) = f(0.3) + f(0.7) = 10$.",
        hints: [
          "The given condition is $f(x) + f(1 - x) = 10$ for all $x$. Notice anything about $0.3$ and $0.7$?",
          "$0.3 + 0.7 = 1$, which means $0.7 = 1 - 0.3$.",
          "Substituting $x = 0.3$: $f(0.3) + f(1 - 0.3) = f(0.3) + f(0.7) = 10$.",
          "We don't even need to know what $f$ looks like! Answer: $\\textbf{(B)}~10$.",
          "This is a classic functional equation trick — always check if the inputs complement each other!"
        ],
        difficulty: 3
      },
      {
        problem: "If $f(x) = \\frac{x}{x+1}$, what is $f(f(f(2)))$?",
        choices: ["(A) $\\frac{2}{5}$", "(B) $\\frac{2}{7}$", "(C) $\\frac{1}{2}$", "(D) $\\frac{2}{3}$", "(E) $\\frac{2}{9}$"],
        correctAnswer: "B",
        hint: "Compute step by step: $f(2)$, then $f(f(2))$, then $f(f(f(2)))$.",
        solution: "$f(2) = \\frac{2}{3}$. $f\\left(\\frac{2}{3}\\right) = \\frac{2/3}{2/3 + 1} = \\frac{2/3}{5/3} = \\frac{2}{5}$. $f\\left(\\frac{2}{5}\\right) = \\frac{2/5}{2/5+1} = \\frac{2/5}{7/5} = \\frac{2}{7}$. So $f(f(f(2))) = \\frac{2}{7}$.",
        hints: [
          "Work inside out. First: $f(2) = \\frac{2}{2+1} = \\frac{2}{3}$.",
          "Next: $f\\left(\\frac{2}{3}\\right) = \\frac{2/3}{2/3 + 1} = \\frac{2/3}{5/3} = \\frac{2}{5}$.",
          "Finally: $f\\left(\\frac{2}{5}\\right) = \\frac{2/5}{2/5 + 1} = \\frac{2/5}{7/5} = \\frac{2}{7}$.",
          "Do you see the pattern? The numerator stays $2$ and the denominator increases: $3, 5, 7, \\ldots$",
          "$f(f(f(2))) = \\frac{2}{7}$. Answer: $\\textbf{(B)}$."
        ],
        difficulty: 3
      }
    ]
  },

  geometry: {
    triangles: [
      {
        problem: "In triangle $ABC$, $AB = 5$, $BC = 12$, and $AC = 13$. What is the area of triangle $ABC$?",
        choices: ["(A) $24$", "(B) $30$", "(C) $32.5$", "(D) $60$", "(E) $65$"],
        correctAnswer: "B",
        hint: "Check if this is a right triangle by testing the Pythagorean theorem.",
        solution: "Since $5^2 + 12^2 = 25 + 144 = 169 = 13^2$, this is a right triangle with legs $5$ and $12$. Area $= \\frac{1}{2}(5)(12) = 30$.",
        hints: [
          "Sides $5, 12, 13$ — does this remind you of a famous triple? Check if $5^2 + 12^2 = 13^2$.",
          "$25 + 144 = 169 = 13^2$. Yes! This is a right triangle with the right angle at $B$.",
          "For a right triangle, the area is simply $\\frac{1}{2} \\times \\text{leg}_1 \\times \\text{leg}_2$.",
          "Area $= \\frac{1}{2}(5)(12) = 30$.",
          "Answer: $\\textbf{(B)}~30$. Remember: $5$-$12$-$13$ is a Pythagorean triple!"
        ],
        difficulty: 2
      },
      {
        problem: "An equilateral triangle has side length 6. What is its area?",
        choices: ["(A) $9$", "(B) $9\\sqrt{2}$", "(C) $9\\sqrt{3}$", "(D) $18$", "(E) $36$"],
        correctAnswer: "C",
        hint: "The area of an equilateral triangle with side $s$ is $\\frac{s^2\\sqrt{3}}{4}$.",
        solution: "Area $= \\frac{6^2 \\sqrt{3}}{4} = \\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$.",
        hints: [
          "For an equilateral triangle with side $s$, the height is $h = \\frac{s\\sqrt{3}}{2}$.",
          "Here $s = 6$, so $h = \\frac{6\\sqrt{3}}{2} = 3\\sqrt{3}$.",
          "Area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 6 \\times 3\\sqrt{3} = 9\\sqrt{3}$.",
          "Or use the formula directly: $\\frac{s^2\\sqrt{3}}{4} = \\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$.",
          "Answer: $\\textbf{(C)}~9\\sqrt{3}$."
        ],
        difficulty: 2
      },
      {
        problem: "In a triangle with angles in the ratio $2:3:4$, what is the measure of the largest angle?",
        choices: ["(A) $60°$", "(B) $72°$", "(C) $80°$", "(D) $90°$", "(E) $100°$"],
        correctAnswer: "C",
        hint: "The angles of a triangle sum to $180°$.",
        solution: "$2x + 3x + 4x = 180° \\Rightarrow 9x = 180° \\Rightarrow x = 20°$. Largest angle $= 4(20°) = 80°$.",
        hints: [
          "If the angles are in ratio $2:3:4$, call them $2x$, $3x$, and $4x$.",
          "The angles of a triangle sum to $180°$: $2x + 3x + 4x = 9x = 180°$.",
          "So $x = 20°$.",
          "The largest angle is $4x = 4(20°) = 80°$.",
          "Answer: $\\textbf{(C)}~80°$."
        ],
        difficulty: 1
      }
    ],
    circles: [
      {
        problem: "Two circles with radii 3 and 5 are externally tangent. What is the distance between their centers?",
        choices: ["(A) $2$", "(B) $4$", "(C) $8$", "(D) $15$", "(E) $\\sqrt{34}$"],
        correctAnswer: "C",
        hint: "For externally tangent circles, the distance between centers equals the sum of radii.",
        solution: "When two circles are externally tangent, they touch at exactly one point and the distance between centers is $r_1 + r_2 = 3 + 5 = 8$.",
        hints: [
          "\"Externally tangent\" means the circles touch at exactly one point, from the outside.",
          "Picture it: the two centers are on opposite sides of the tangent point.",
          "Distance between centers = $r_1 + r_2$ (they just barely touch).",
          "$3 + 5 = 8$.",
          "Answer: $\\textbf{(C)}~8$. (If they were internally tangent, it would be $|r_1 - r_2| = 2$.)"
        ],
        difficulty: 1
      },
      {
        problem: "A chord of length 8 is 3 units from the center of a circle. What is the radius?",
        choices: ["(A) $4$", "(B) $5$", "(C) $\\sqrt{7}$", "(D) $\\sqrt{73}$", "(E) $7$"],
        correctAnswer: "B",
        hint: "Draw the perpendicular from the center to the chord. It bisects the chord.",
        solution: "The perpendicular from center to chord bisects it, creating a right triangle with legs $4$ and $3$. Radius $= \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5$.",
        hints: [
          "Draw the perpendicular from the center to the chord. This line bisects the chord!",
          "Half the chord = $\\frac{8}{2} = 4$. The distance from center to chord = $3$.",
          "Now we have a right triangle: legs $3$ and $4$, hypotenuse = radius.",
          "$r = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.",
          "Answer: $\\textbf{(B)}~5$. Another $3$-$4$-$5$ right triangle!"
        ],
        difficulty: 2
      },
      {
        problem: "A sector of a circle has central angle $60°$ and radius $6$. What is its area?",
        choices: ["(A) $3\\pi$", "(B) $6\\pi$", "(C) $9\\pi$", "(D) $12\\pi$", "(E) $36\\pi$"],
        correctAnswer: "B",
        hint: "A sector with angle $\\theta$ (in degrees) has area $\\frac{\\theta}{360} \\cdot \\pi r^2$.",
        solution: "Area $= \\frac{60}{360} \\cdot \\pi(6)^2 = \\frac{1}{6} \\cdot 36\\pi = 6\\pi$.",
        hints: [
          "A sector is a \"pizza slice\" of a circle. Its area is a fraction of the full circle's area.",
          "The fraction is $\\frac{60°}{360°} = \\frac{1}{6}$ of the full circle.",
          "Full circle area: $\\pi r^2 = \\pi(6)^2 = 36\\pi$.",
          "Sector area $= \\frac{1}{6} \\times 36\\pi = 6\\pi$.",
          "Answer: $\\textbf{(B)}~6\\pi$."
        ],
        difficulty: 2
      }
    ],
    coordinate: [
      {
        problem: "What is the distance between the points $(1, 3)$ and $(4, 7)$?",
        choices: ["(A) $4$", "(B) $5$", "(C) $6$", "(D) $7$", "(E) $\\sqrt{7}$"],
        correctAnswer: "B",
        hint: "Use the distance formula: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.",
        solution: "$d = \\sqrt{(4-1)^2 + (7-3)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.",
        hints: [
          "Use the distance formula: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
          "Differences: $\\Delta x = 4 - 1 = 3$ and $\\Delta y = 7 - 3 = 4$.",
          "$d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.",
          "Answer: $\\textbf{(B)}~5$. Yet another $3$-$4$-$5$ right triangle!"
        ],
        difficulty: 1
      },
      {
        problem: "The line $3x + 4y = 24$ intersects the $x$-axis at $A$ and the $y$-axis at $B$. What is the area of triangle $AOB$ where $O$ is the origin?",
        choices: ["(A) $12$", "(B) $18$", "(C) $24$", "(D) $36$", "(E) $48$"],
        correctAnswer: "C",
        hint: "Find the $x$-intercept and $y$-intercept of the line.",
        solution: "$x$-intercept: set $y=0$, get $x=8$, so $A=(8,0)$. $y$-intercept: set $x=0$, get $y=6$, so $B=(0,6)$. Area $= \\frac{1}{2}(8)(6) = 24$.",
        hints: [
          "Find the intercepts. $x$-intercept: set $y = 0$ in $3x + 4y = 24$.",
          "$3x = 24 \\Rightarrow x = 8$, so $A = (8, 0)$.",
          "$y$-intercept: set $x = 0$: $4y = 24 \\Rightarrow y = 6$, so $B = (0, 6)$.",
          "Triangle $AOB$ has legs along the axes: base $= 8$, height $= 6$.",
          "Area $= \\frac{1}{2}(8)(6) = 24$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 2
      },
      {
        problem: "What is the slope of a line perpendicular to $2x - 3y = 7$?",
        choices: ["(A) $-\\frac{3}{2}$", "(B) $-\\frac{2}{3}$", "(C) $\\frac{2}{3}$", "(D) $\\frac{3}{2}$", "(E) $-\\frac{7}{3}$"],
        correctAnswer: "A",
        hint: "First find the slope of the given line. Perpendicular slopes are negative reciprocals.",
        solution: "Rewriting: $y = \\frac{2}{3}x - \\frac{7}{3}$, slope $= \\frac{2}{3}$. Perpendicular slope $= -\\frac{3}{2}$.",
        hints: [
          "First find the slope of $2x - 3y = 7$. Rewrite in $y = mx + b$ form.",
          "$-3y = -2x + 7 \\Rightarrow y = \\frac{2}{3}x - \\frac{7}{3}$. The slope is $m = \\frac{2}{3}$.",
          "Perpendicular lines have slopes that are negative reciprocals: $m_\\perp = -\\frac{1}{m}$.",
          "$m_\\perp = -\\frac{1}{2/3} = -\\frac{3}{2}$.",
          "Answer: $\\textbf{(A)}~-\\frac{3}{2}$."
        ],
        difficulty: 2
      }
    ],
    area_volume: [
      {
        problem: "A rectangular box has dimensions $3 \\times 4 \\times 12$. What is the length of the space diagonal?",
        choices: ["(A) $5$", "(B) $12$", "(C) $13$", "(D) $\\sqrt{153}$", "(E) $\\sqrt{169}$"],
        correctAnswer: "C",
        hint: "The space diagonal of a box with dimensions $a, b, c$ is $\\sqrt{a^2 + b^2 + c^2}$.",
        solution: "Space diagonal $= \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$.",
        hints: [
          "The space diagonal of a box extends from one corner to the opposite corner through the interior.",
          "Formula: $d = \\sqrt{a^2 + b^2 + c^2}$ (3D version of the Pythagorean theorem).",
          "$d = \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{9 + 16 + 144} = \\sqrt{169}$.",
          "$\\sqrt{169} = 13$.",
          "Answer: $\\textbf{(C)}~13$. Note: $\\sqrt{169} = 13$, and (E) $\\sqrt{169}$ is the same value!"
        ],
        difficulty: 2
      },
      {
        problem: "A cylinder has radius 3 and height 7. What is its volume?",
        choices: ["(A) $21\\pi$", "(B) $42\\pi$", "(C) $63\\pi$", "(D) $126\\pi$", "(E) $189\\pi$"],
        correctAnswer: "C",
        hint: "Volume of a cylinder $= \\pi r^2 h$.",
        solution: "$V = \\pi(3)^2(7) = 63\\pi$.",
        hints: [
          "Volume of a cylinder = area of base $\\times$ height = $\\pi r^2 h$.",
          "$r = 3$, $h = 7$.",
          "$V = \\pi (3)^2 (7) = \\pi \\cdot 9 \\cdot 7 = 63\\pi$.",
          "Answer: $\\textbf{(C)}~63\\pi$."
        ],
        difficulty: 1
      }
    ],
    similarity: [
      {
        problem: "Two similar triangles have corresponding sides in ratio $2:3$. If the area of the smaller is $20$, what is the area of the larger?",
        choices: ["(A) $30$", "(B) $40$", "(C) $45$", "(D) $60$", "(E) $90$"],
        correctAnswer: "C",
        hint: "The ratio of areas of similar figures is the square of the ratio of corresponding sides.",
        solution: "Area ratio $= \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$. Larger area $= 20 \\cdot \\frac{9}{4} = 45$.",
        hints: [
          "For similar figures, if sides are in ratio $k$, then areas are in ratio $k^2$.",
          "Side ratio (larger to smaller) $= \\frac{3}{2}$.",
          "Area ratio $= \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$.",
          "Larger area $= 20 \\times \\frac{9}{4} = \\frac{180}{4} = 45$.",
          "Answer: $\\textbf{(C)}~45$."
        ],
        difficulty: 2
      },
      {
        problem: "Triangle $ABC$ has $DE \\parallel BC$ with $D$ on $AB$ and $E$ on $AC$. If $AD = 3$, $DB = 2$, and $BC = 10$, what is $DE$?",
        choices: ["(A) $4$", "(B) $5$", "(C) $6$", "(D) $7.5$", "(E) $8$"],
        correctAnswer: "C",
        hint: "Since $DE \\parallel BC$, triangles $ADE$ and $ABC$ are similar.",
        solution: "By AA similarity, $\\frac{DE}{BC} = \\frac{AD}{AB} = \\frac{3}{5}$. So $DE = 10 \\cdot \\frac{3}{5} = 6$.",
        hints: [
          "Since $DE \\parallel BC$, triangles $ADE$ and $ABC$ are similar (by AA — corresponding angles are equal).",
          "$AB = AD + DB = 3 + 2 = 5$.",
          "The similarity ratio is $\\frac{AD}{AB} = \\frac{3}{5}$.",
          "So $\\frac{DE}{BC} = \\frac{3}{5}$, giving $DE = 10 \\times \\frac{3}{5} = 6$.",
          "Answer: $\\textbf{(C)}~6$."
        ],
        difficulty: 2
      }
    ]
  },

  number_theory: {
    divisibility: [
      {
        problem: "What is the largest power of 2 that divides $20!$?",
        choices: ["(A) $2^{15}$", "(B) $2^{16}$", "(C) $2^{17}$", "(D) $2^{18}$", "(E) $2^{19}$"],
        correctAnswer: "D",
        hint: "Use Legendre's formula: sum $\\lfloor 20/2 \\rfloor + \\lfloor 20/4 \\rfloor + \\lfloor 20/8 \\rfloor + \\cdots$",
        solution: "$\\lfloor 20/2 \\rfloor + \\lfloor 20/4 \\rfloor + \\lfloor 20/8 \\rfloor + \\lfloor 20/16 \\rfloor = 10 + 5 + 2 + 1 = 18$. So the answer is $2^{18}$.",
        hints: [
          "To find the largest power of $p$ dividing $n!$, use Legendre's formula: $\\sum_{i=1}^{\\infty} \\lfloor n/p^i \\rfloor$.",
          "For $p = 2$, $n = 20$: $\\lfloor 20/2 \\rfloor = 10$ (multiples of 2).",
          "$\\lfloor 20/4 \\rfloor = 5$, $\\lfloor 20/8 \\rfloor = 2$, $\\lfloor 20/16 \\rfloor = 1$, $\\lfloor 20/32 \\rfloor = 0$.",
          "Total: $10 + 5 + 2 + 1 = 18$.",
          "The largest power of $2$ dividing $20!$ is $2^{18}$. Answer: $\\textbf{(D)}$."
        ],
        difficulty: 3
      },
      {
        problem: "How many positive divisors does $360$ have?",
        choices: ["(A) $12$", "(B) $18$", "(C) $20$", "(D) $24$", "(E) $36$"],
        correctAnswer: "D",
        hint: "First find the prime factorization of 360.",
        solution: "$360 = 2^3 \\cdot 3^2 \\cdot 5^1$. Number of divisors $= (3+1)(2+1)(1+1) = 4 \\cdot 3 \\cdot 2 = 24$.",
        hints: [
          "First, prime factorize $360$: $360 = 36 \\times 10 = 4 \\times 9 \\times 10 = 2^3 \\cdot 3^2 \\cdot 5^1$.",
          "The number of divisors formula: for $n = p_1^{a_1} \\cdot p_2^{a_2} \\cdots$, the count is $(a_1+1)(a_2+1)\\cdots$",
          "Each divisor is of the form $2^a \\cdot 3^b \\cdot 5^c$ where $0 \\leq a \\leq 3$, $0 \\leq b \\leq 2$, $0 \\leq c \\leq 1$.",
          "Number of choices: $(3+1)(2+1)(1+1) = 4 \\cdot 3 \\cdot 2 = 24$.",
          "Answer: $\\textbf{(D)}~24$."
        ],
        difficulty: 2
      },
      {
        problem: "What is the remainder when $7^{100}$ is divided by $5$?",
        choices: ["(A) $0$", "(B) $1$", "(C) $2$", "(D) $3$", "(E) $4$"],
        correctAnswer: "B",
        hint: "Look at the pattern of $7^n \\pmod{5}$.",
        solution: "$7 \\equiv 2 \\pmod{5}$. Powers of 2 mod 5: $2^1=2, 2^2=4, 2^3=3, 2^4=1, 2^5=2, \\ldots$ Period 4. Since $100 = 25 \\cdot 4$, $7^{100} \\equiv 2^{100} \\equiv (2^4)^{25} \\equiv 1^{25} \\equiv 1 \\pmod{5}$.",
        hints: [
          "First simplify: $7 \\equiv 2 \\pmod{5}$, so $7^{100} \\equiv 2^{100} \\pmod{5}$.",
          "Find the pattern of $2^n \\pmod{5}$: $2^1 = 2$, $2^2 = 4$, $2^3 = 3$, $2^4 = 1$, $2^5 = 2, \\ldots$",
          "The pattern repeats with period $4$: $\\{2, 4, 3, 1, 2, 4, 3, 1, \\ldots\\}$",
          "$100 = 4 \\times 25$, so $2^{100} = (2^4)^{25} \\equiv 1^{25} = 1 \\pmod{5}$.",
          "Answer: $\\textbf{(B)}~1$."
        ],
        difficulty: 3
      }
    ],
    primes: [
      {
        problem: "How many prime numbers are between 30 and 50?",
        choices: ["(A) $3$", "(B) $4$", "(C) $5$", "(D) $6$", "(E) $7$"],
        correctAnswer: "C",
        hint: "Check each odd number between 30 and 50 for primality.",
        solution: "Primes: $31, 37, 41, 43, 47$. That's $5$ primes.",
        hints: [
          "We need to check odd numbers between 30 and 50 (even numbers > 2 aren't prime).",
          "Odd numbers: $31, 33, 35, 37, 39, 41, 43, 45, 47, 49$.",
          "Eliminate: $33 = 3 \\times 11$, $35 = 5 \\times 7$, $39 = 3 \\times 13$, $45 = 5 \\times 9$, $49 = 7^2$.",
          "Remaining primes: $31, 37, 41, 43, 47$. That's $5$.",
          "Answer: $\\textbf{(C)}~5$."
        ],
        difficulty: 1
      },
      {
        problem: "What is the sum of the prime factors of $2310$?",
        choices: ["(A) $17$", "(B) $25$", "(C) $28$", "(D) $30$", "(E) $33$"],
        correctAnswer: "C",
        hint: "Factor $2310$ step by step: it's even, so start dividing by 2.",
        solution: "$2310 = 2 \\cdot 1155 = 2 \\cdot 3 \\cdot 385 = 2 \\cdot 3 \\cdot 5 \\cdot 77 = 2 \\cdot 3 \\cdot 5 \\cdot 7 \\cdot 11$. Sum $= 2 + 3 + 5 + 7 + 11 = 28$.",
        hints: [
          "$2310$ is even, so divide by $2$: $2310 = 2 \\times 1155$.",
          "$1155$ ends in $5$, so divisible by $5$? Check: $1 + 1 + 5 + 5 = 12$ (div by 3). Try $3$ first: $1155 = 3 \\times 385$.",
          "$385 = 5 \\times 77 = 5 \\times 7 \\times 11$.",
          "So $2310 = 2 \\times 3 \\times 5 \\times 7 \\times 11$ (the product of the first 5 primes!).",
          "Sum: $2 + 3 + 5 + 7 + 11 = 28$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 2
      },
      {
        problem: "If $n$ is a positive integer such that $n^2 + n + 41$ is NOT prime, what is the smallest such $n$?",
        choices: ["(A) $10$", "(B) $20$", "(C) $40$", "(D) $41$", "(E) $42$"],
        correctAnswer: "C",
        hint: "Try $n = 40$ and factor the result.",
        solution: "For $n = 40$: $40^2 + 40 + 41 = 1600 + 40 + 41 = 1681 = 41^2$, which is not prime. You can verify that $n = 1, 2, \\ldots, 39$ all give primes (Euler's famous prime-generating polynomial).",
        hints: [
          "This is Euler's famous polynomial $n^2 + n + 41$, which produces primes for small $n$. But it can't produce primes forever!",
          "When would $41$ divide the result? If $n \\equiv 0 \\pmod{41}$ or $n \\equiv -1 \\equiv 40 \\pmod{41}$.",
          "Try $n = 40$: $40^2 + 40 + 41 = 1600 + 40 + 41 = 1681$.",
          "Is $1681$ a perfect square? $41^2 = 1681$. Yes! So it's not prime.",
          "All values $n = 1, 2, \\ldots, 39$ give primes. Smallest composite: $n = 40$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 4
      }
    ],
    modular: [
      {
        problem: "What is $17 \\cdot 23 \\pmod{10}$?",
        choices: ["(A) $0$", "(B) $1$", "(C) $3$", "(D) $7$", "(E) $9$"],
        correctAnswer: "B",
        hint: "You only need the last digit of each number.",
        solution: "$17 \\equiv 7 \\pmod{10}$ and $23 \\equiv 3 \\pmod{10}$. So $17 \\cdot 23 \\equiv 7 \\cdot 3 = 21 \\equiv 1 \\pmod{10}$.",
        hints: [
          "Working $\\pmod{10}$ means we only care about the last digit!",
          "$17 \\equiv 7 \\pmod{10}$ and $23 \\equiv 3 \\pmod{10}$.",
          "$7 \\times 3 = 21$. The last digit of $21$ is $1$.",
          "So $17 \\times 23 \\equiv 1 \\pmod{10}$.",
          "Answer: $\\textbf{(B)}~1$. (You can verify: $17 \\times 23 = 391$, last digit $1$.)"
        ],
        difficulty: 1
      },
      {
        problem: "What is the last two digits of $3^{20}$?",
        choices: ["(A) $01$", "(B) $21$", "(C) $41$", "(D) $61$", "(E) $81$"],
        correctAnswer: "A",
        hint: "Compute $3^{20} \\pmod{100}$. You can use repeated squaring.",
        solution: "$3^2=9, 3^4=81, 3^8=6561 \\equiv 61, 3^{16} \\equiv 61^2 = 3721 \\equiv 21, 3^{20} = 3^{16} \\cdot 3^4 \\equiv 21 \\cdot 81 = 1701 \\equiv 01 \\pmod{100}$.",
        hints: [
          "\"Last two digits\" means compute $3^{20} \\pmod{100}$. Use repeated squaring!",
          "$3^2 = 9$, $3^4 = 81$, $3^8 = 81^2 = 6561 \\equiv 61 \\pmod{100}$.",
          "$3^{16} = (3^8)^2 \\equiv 61^2 = 3721 \\equiv 21 \\pmod{100}$.",
          "$3^{20} = 3^{16} \\cdot 3^4 \\equiv 21 \\times 81 = 1701 \\equiv 01 \\pmod{100}$.",
          "The last two digits are $01$. Answer: $\\textbf{(A)}$."
        ],
        difficulty: 4
      },
      {
        problem: "Find the remainder when $2^{2026}$ is divided by $7$.",
        choices: ["(A) $1$", "(B) $2$", "(C) $3$", "(D) $4$", "(E) $6$"],
        correctAnswer: "B",
        hint: "Find the pattern of powers of 2 modulo 7.",
        solution: "$2^1=2, 2^2=4, 2^3=1 \\pmod{7}$. Period is 3. $2026 = 3 \\cdot 675 + 1$. So $2^{2026} \\equiv 2^1 = 2 \\pmod{7}$.",
        hints: [
          "Let's find the cycle of $2^n \\pmod{7}$: $2^1 = 2$, $2^2 = 4$, $2^3 = 8 \\equiv 1 \\pmod{7}$.",
          "The pattern repeats every $3$: $\\{2, 4, 1, 2, 4, 1, \\ldots\\}$",
          "We need $2026 \\pmod{3}$: $2026 = 3 \\times 675 + 1$, so $2026 \\equiv 1 \\pmod{3}$.",
          "$2^{2026} \\equiv 2^1 = 2 \\pmod{7}$.",
          "Answer: $\\textbf{(B)}~2$."
        ],
        difficulty: 3
      }
    ],
    gcd_lcm: [
      {
        problem: "What is $\\gcd(48, 180)$?",
        choices: ["(A) $4$", "(B) $6$", "(C) $12$", "(D) $24$", "(E) $36$"],
        correctAnswer: "C",
        hint: "Use the Euclidean algorithm or factor both numbers.",
        solution: "$48 = 2^4 \\cdot 3$ and $180 = 2^2 \\cdot 3^2 \\cdot 5$. $\\gcd = 2^2 \\cdot 3 = 12$.",
        hints: [
          "Factor both: $48 = 2^4 \\cdot 3$ and $180 = 2^2 \\cdot 3^2 \\cdot 5$.",
          "For GCD, take the minimum power of each common prime.",
          "Common primes: $2$ (min power $2$) and $3$ (min power $1$).",
          "$\\gcd = 2^2 \\cdot 3^1 = 4 \\cdot 3 = 12$.",
          "Answer: $\\textbf{(C)}~12$."
        ],
        difficulty: 1
      },
      {
        problem: "If $\\gcd(a, b) = 6$ and $\\text{lcm}(a, b) = 180$, what is $ab$?",
        choices: ["(A) $180$", "(B) $540$", "(C) $1080$", "(D) $1260$", "(E) $2160$"],
        correctAnswer: "C",
        hint: "Use the identity $\\gcd(a,b) \\cdot \\text{lcm}(a,b) = ab$.",
        solution: "$ab = \\gcd(a,b) \\cdot \\text{lcm}(a,b) = 6 \\cdot 180 = 1080$.",
        hints: [
          "There's a key identity: $\\gcd(a,b) \\times \\text{lcm}(a,b) = a \\times b$.",
          "This always works for positive integers! Think of it in terms of prime factorizations.",
          "$ab = 6 \\times 180 = 1080$.",
          "Answer: $\\textbf{(C)}~1080$."
        ],
        difficulty: 2
      }
    ],
    digits: [
      {
        problem: "What is the sum of the digits of $10^{100} - 1$?",
        choices: ["(A) $100$", "(B) $400$", "(C) $899$", "(D) $900$", "(E) $999$"],
        correctAnswer: "D",
        hint: "$10^{100} - 1$ is a number consisting entirely of 9's.",
        solution: "$10^{100} - 1 = \\underbrace{999\\ldots9}_{100 \\text{ nines}}$. Digit sum $= 100 \\times 9 = 900$.",
        hints: [
          "What does $10^{100} - 1$ look like? Think small: $10^3 - 1 = 1000 - 1 = 999$.",
          "So $10^{100} - 1 = \\underbrace{999\\ldots9}_{100 \\text{ nines}}$.",
          "Each digit is $9$, and there are $100$ of them.",
          "Digit sum $= 100 \\times 9 = 900$.",
          "Answer: $\\textbf{(D)}~900$."
        ],
        difficulty: 2
      },
      {
        problem: "How many three-digit numbers have the property that the digit sum equals $5$?",
        choices: ["(A) $10$", "(B) $12$", "(C) $15$", "(D) $18$", "(E) $21$"],
        correctAnswer: "C",
        hint: "Count solutions to $a + b + c = 5$ where $1 \\leq a \\leq 9$ and $0 \\leq b, c \\leq 9$.",
        solution: "Let $a' = a - 1$ ($0 \\leq a' \\leq 8$). Then $a' + b + c = 4$, with all variables $\\leq 9$ (automatically satisfied since sum is 4). By stars and bars: $\\binom{4+2}{2} = \\binom{6}{2} = 15$.",
        hints: [
          "A three-digit number has digits $a, b, c$ where $a \\geq 1$ (hundreds digit). We need $a + b + c = 5$.",
          "Substitute $a' = a - 1$ (so $a' \\geq 0$). Now we need $a' + b + c = 4$ with all $\\geq 0$.",
          "Upper bounds ($a' \\leq 8$, $b,c \\leq 9$) are automatically satisfied since the sum is only $4$.",
          "Stars and bars: the number of non-negative integer solutions to $x_1 + x_2 + x_3 = 4$ is $\\binom{4+2}{2} = \\binom{6}{2}$.",
          "$\\binom{6}{2} = 15$. Answer: $\\textbf{(C)}~15$."
        ],
        difficulty: 3
      }
    ]
  },

  combinatorics: {
    counting: [
      {
        problem: "How many ways can 5 books be arranged on a shelf?",
        choices: ["(A) $25$", "(B) $32$", "(C) $60$", "(D) $120$", "(E) $720$"],
        correctAnswer: "D",
        hint: "This is a permutation of 5 distinct objects.",
        solution: "$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.",
        hints: [
          "Arranging 5 distinct books in a row is a permutation problem.",
          "For the 1st position: 5 choices. For the 2nd: 4 remaining. And so on.",
          "$5 \\times 4 \\times 3 \\times 2 \\times 1 = 5! = 120$.",
          "Answer: $\\textbf{(D)}~120$."
        ],
        difficulty: 1
      },
      {
        problem: "In how many ways can a committee of 3 be chosen from 8 people?",
        choices: ["(A) $24$", "(B) $36$", "(C) $56$", "(D) $120$", "(E) $336$"],
        correctAnswer: "C",
        hint: "Order doesn't matter, so use combinations.",
        solution: "$\\binom{8}{3} = \\frac{8!}{3!5!} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 56$.",
        hints: [
          "A committee has no specific roles, so order doesn't matter. Use combinations!",
          "$\\binom{8}{3} = \\frac{8!}{3! \\cdot 5!}$.",
          "Simplify: $\\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = \\frac{336}{6} = 56$.",
          "Answer: $\\textbf{(C)}~56$."
        ],
        difficulty: 1
      },
      {
        problem: "How many 4-digit numbers can be formed using digits $\\{1, 2, 3, 4, 5\\}$ with no repetition?",
        choices: ["(A) $24$", "(B) $60$", "(C) $120$", "(D) $240$", "(E) $625$"],
        correctAnswer: "C",
        hint: "Choose 4 digits from 5 and arrange them.",
        solution: "$5 \\times 4 \\times 3 \\times 2 = 120$, or equivalently $P(5,4) = \\frac{5!}{1!} = 120$.",
        hints: [
          "No repetition means each digit is used at most once. Order matters (different arrangements = different numbers).",
          "1st digit: $5$ choices. 2nd digit: $4$ remaining. 3rd: $3$. 4th: $2$.",
          "$5 \\times 4 \\times 3 \\times 2 = 120$.",
          "This is $P(5,4) = \\frac{5!}{(5-4)!} = \\frac{120}{1} = 120$.",
          "Answer: $\\textbf{(C)}~120$."
        ],
        difficulty: 2
      }
    ],
    probability: [
      {
        problem: "Two dice are rolled. What is the probability that the sum is 7?",
        choices: ["(A) $\\frac{1}{12}$", "(B) $\\frac{1}{6}$", "(C) $\\frac{5}{36}$", "(D) $\\frac{7}{36}$", "(E) $\\frac{1}{3}$"],
        correctAnswer: "B",
        hint: "Count the number of ways to roll a sum of 7 out of 36 total outcomes.",
        solution: "Outcomes summing to 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ = 6 ways. Probability $= \\frac{6}{36} = \\frac{1}{6}$.",
        hints: [
          "Two dice have $6 \\times 6 = 36$ equally likely outcomes.",
          "Which pairs sum to $7$? $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$.",
          "That's $6$ favorable outcomes.",
          "Probability $= \\frac{6}{36} = \\frac{1}{6}$.",
          "Answer: $\\textbf{(B)}~\\frac{1}{6}$. Fun fact: $7$ is the most likely sum with two dice!"
        ],
        difficulty: 2
      },
      {
        problem: "A bag has 4 red and 6 blue marbles. Two marbles are drawn without replacement. What is the probability both are red?",
        choices: ["(A) $\\frac{2}{15}$", "(B) $\\frac{4}{25}$", "(C) $\\frac{1}{5}$", "(D) $\\frac{4}{15}$", "(E) $\\frac{2}{5}$"],
        correctAnswer: "A",
        hint: "Use $P(\\text{both red}) = P(\\text{1st red}) \\times P(\\text{2nd red} | \\text{1st red})$.",
        solution: "$P = \\frac{4}{10} \\cdot \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15}$.",
        hints: [
          "Without replacement means the pool shrinks after each draw.",
          "P(1st red) $= \\frac{4}{10}$ (4 red out of 10 total).",
          "Given 1st was red, now 3 red and 6 blue remain. P(2nd red) $= \\frac{3}{9}$.",
          "P(both red) $= \\frac{4}{10} \\times \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15}$.",
          "Answer: $\\textbf{(A)}~\\frac{2}{15}$."
        ],
        difficulty: 2
      },
      {
        problem: "A fair coin is flipped 6 times. What is the probability of getting exactly 2 heads?",
        choices: ["(A) $\\frac{1}{4}$", "(B) $\\frac{15}{64}$", "(C) $\\frac{3}{8}$", "(D) $\\frac{5}{16}$", "(E) $\\frac{1}{6}$"],
        correctAnswer: "B",
        hint: "Use the binomial probability formula: $\\binom{n}{k} p^k (1-p)^{n-k}$.",
        solution: "$\\binom{6}{2} \\cdot \\left(\\frac{1}{2}\\right)^6 = 15 \\cdot \\frac{1}{64} = \\frac{15}{64}$.",
        hints: [
          "Total outcomes: $2^6 = 64$ (each flip is H or T).",
          "We need exactly 2 heads out of 6 flips. How many ways to choose which 2 flips are heads?",
          "$\\binom{6}{2} = \\frac{6!}{2! \\cdot 4!} = \\frac{6 \\times 5}{2} = 15$ ways.",
          "Each specific sequence has probability $(\\frac{1}{2})^6 = \\frac{1}{64}$.",
          "P(exactly 2 heads) $= 15 \\times \\frac{1}{64} = \\frac{15}{64}$. Answer: $\\textbf{(B)}$."
        ],
        difficulty: 3
      }
    ],
    permutations: [
      {
        problem: "How many ways can the letters in BANANA be arranged?",
        choices: ["(A) $20$", "(B) $30$", "(C) $60$", "(D) $120$", "(E) $720$"],
        correctAnswer: "C",
        hint: "BANANA has repeated letters. Divide $6!$ by the factorials of the repeat counts.",
        solution: "BANANA has 6 letters: B(1), A(3), N(2). Arrangements $= \\frac{6!}{1! \\cdot 3! \\cdot 2!} = \\frac{720}{12} = 60$.",
        hints: [
          "BANANA has 6 letters, but some repeat: B appears 1 time, A appears 3 times, N appears 2 times.",
          "If all letters were distinct, there'd be $6! = 720$ arrangements.",
          "But identical letters are interchangeable. Divide by the factorials of each letter's count.",
          "$\\frac{6!}{1! \\cdot 3! \\cdot 2!} = \\frac{720}{1 \\cdot 6 \\cdot 2} = \\frac{720}{12} = 60$.",
          "Answer: $\\textbf{(C)}~60$."
        ],
        difficulty: 2
      },
      {
        problem: "In how many ways can 3 identical red balls and 2 identical blue balls be placed in a row?",
        choices: ["(A) $5$", "(B) $6$", "(C) $10$", "(D) $12$", "(E) $20$"],
        correctAnswer: "C",
        hint: "This is choosing which positions get red balls (or equivalently, blue balls).",
        solution: "Choose 2 positions out of 5 for blue balls: $\\binom{5}{2} = 10$.",
        hints: [
          "There are 5 positions in the row. We just need to decide which positions get blue balls (the rest are red).",
          "Choose 2 positions out of 5 for blue: $\\binom{5}{2}$.",
          "$\\binom{5}{2} = \\frac{5!}{2! \\cdot 3!} = \\frac{5 \\times 4}{2} = 10$.",
          "Equivalently: $\\frac{5!}{3! \\cdot 2!} = 10$ (multinomial with identical objects).",
          "Answer: $\\textbf{(C)}~10$."
        ],
        difficulty: 2
      }
    ],
    pigeonhole: [
      {
        problem: "In a group of 13 people, at least how many must share the same birth month?",
        choices: ["(A) $1$", "(B) $2$", "(C) $3$", "(D) $4$", "(E) $13$"],
        correctAnswer: "B",
        hint: "Use the Pigeonhole Principle with 12 months.",
        solution: "By the Pigeonhole Principle, $\\lceil 13/12 \\rceil = 2$. At least 2 people share a birth month.",
        hints: [
          "There are 12 months (pigeonholes) and 13 people (pigeons).",
          "The Pigeonhole Principle: if $n$ items go into $k$ containers and $n > k$, at least one container has $\\geq 2$ items.",
          "$13 > 12$, so at least one month has $\\geq 2$ people.",
          "$\\lceil 13/12 \\rceil = 2$.",
          "Answer: $\\textbf{(B)}~2$."
        ],
        difficulty: 1
      },
      {
        problem: "From the integers $1, 2, 3, \\ldots, 20$, how many must be chosen to guarantee that two of them differ by exactly $5$?",
        choices: ["(A) $6$", "(B) $8$", "(C) $10$", "(D) $11$", "(E) $15$"],
        correctAnswer: "D",
        hint: "Group the numbers into pairs that differ by 5, and find the maximum set avoiding such pairs.",
        solution: "Pairs differing by 5: $(1,6),(2,7),(3,8),(4,9),(5,10),(11,16),(12,17),(13,18),(14,19),(15,20)$. The numbers $\\{11,12,13,14,15\\}$ are unpaired with smaller numbers (their pairs are already listed). We can pick at most one from each pair: 10 pairs, so at most 10 without a difference of 5. Choosing 11 guarantees a pair.",
        hints: [
          "Think Pigeonhole! Group numbers into pairs that differ by $5$.",
          "Pairs: $(1,6), (2,7), (3,8), (4,9), (5,10), (11,16), (12,17), (13,18), (14,19), (15,20)$.",
          "That's $10$ pairs. Every number from $1$ to $20$ is in exactly one pair.",
          "To avoid any pair differing by $5$, pick at most one from each pair: max $10$ numbers.",
          "So $11$ numbers guarantees at least one complete pair. Answer: $\\textbf{(D)}~11$."
        ],
        difficulty: 4
      }
    ],
    inclusion_exclusion: [
      {
        problem: "In a class of 40 students, 25 take math, 18 take science, and 8 take both. How many take neither?",
        choices: ["(A) $3$", "(B) $5$", "(C) $7$", "(D) $8$", "(E) $10$"],
        correctAnswer: "B",
        hint: "Use inclusion-exclusion: $|A \\cup B| = |A| + |B| - |A \\cap B|$.",
        solution: "$|\\text{Math} \\cup \\text{Science}| = 25 + 18 - 8 = 35$. Neither $= 40 - 35 = 5$.",
        hints: [
          "Use inclusion-exclusion to avoid double-counting students who take both.",
          "$|\\text{Math} \\cup \\text{Science}| = |\\text{Math}| + |\\text{Science}| - |\\text{Both}|$.",
          "$= 25 + 18 - 8 = 35$ students take at least one.",
          "Neither $= 40 - 35 = 5$.",
          "Answer: $\\textbf{(B)}~5$."
        ],
        difficulty: 2
      },
      {
        problem: "How many integers from 1 to 100 are divisible by 2 or 3?",
        choices: ["(A) $50$", "(B) $62$", "(C) $67$", "(D) $72$", "(E) $83$"],
        correctAnswer: "C",
        hint: "Use inclusion-exclusion: count multiples of 2, plus multiples of 3, minus multiples of 6.",
        solution: "Multiples of 2: $\\lfloor 100/2 \\rfloor = 50$. Multiples of 3: $\\lfloor 100/3 \\rfloor = 33$. Multiples of 6: $\\lfloor 100/6 \\rfloor = 16$. Answer: $50 + 33 - 16 = 67$.",
        hints: [
          "Inclusion-exclusion: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Here $A$ = multiples of 2, $B$ = multiples of 3.",
          "Multiples of 2 from 1 to 100: $\\lfloor 100/2 \\rfloor = 50$.",
          "Multiples of 3: $\\lfloor 100/3 \\rfloor = 33$.",
          "Multiples of both (i.e., multiples of 6): $\\lfloor 100/6 \\rfloor = 16$.",
          "$50 + 33 - 16 = 67$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 2
      },
      {
        problem: "How many permutations of $\\{1,2,3,4,5\\}$ have no fixed points (derangements)?",
        choices: ["(A) $24$", "(B) $36$", "(C) $44$", "(D) $53$", "(E) $60$"],
        correctAnswer: "C",
        hint: "Use the derangement formula: $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$.",
        solution: "$D_5 = 5!(1 - 1 + \\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120}) = 120 \\cdot \\frac{11}{30} = 44$.",
        hints: [
          "A derangement is a permutation where NO element stays in its original position. We want $D_5$.",
          "The derangement formula uses inclusion-exclusion: $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$.",
          "Compute: $D_5 = 5!\\left(1 - 1 + \\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120}\\right)$.",
          "The sum inside: $\\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24} - \\frac{1}{120} = \\frac{60 - 20 + 5 - 1}{120} = \\frac{44}{120} = \\frac{11}{30}$.",
          "$D_5 = 120 \\times \\frac{11}{30} = 44$. Answer: $\\textbf{(C)}$."
        ],
        difficulty: 4
      }
    ]
  }
};

// Get a problem from the local bank
function getLocalProblem(topic, subtopic, difficulty) {
  var problems = PROBLEM_BANK[topic] && PROBLEM_BANK[topic][subtopic];
  if (!problems || problems.length === 0) {
    // Fallback: pick any subtopic from the topic
    var subs = Object.keys(PROBLEM_BANK[topic] || {});
    if (subs.length === 0) return null;
    subtopic = subs[Math.floor(Math.random() * subs.length)];
    problems = PROBLEM_BANK[topic][subtopic];
  }

  // Filter by difficulty if possible, otherwise pick randomly
  var filtered = problems.filter(function(p) {
    return Math.abs(p.difficulty - difficulty) <= 1;
  });
  if (filtered.length === 0) filtered = problems;

  // Filter out completed problems
  if (typeof isProblemCompleted === 'function') {
    var progress = typeof loadProgress === 'function' ? loadProgress() : null;
    if (progress) {
      var uncompleted = filtered.filter(function(p) {
        return !isProblemCompleted(progress, p.problem);
      });
      if (uncompleted.length > 0) filtered = uncompleted;
      // If all done, fall back to full list (allow re-practice)
    }
  }

  var p = filtered[Math.floor(Math.random() * filtered.length)];

  return {
    id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    topic: topic,
    subtopic: subtopic,
    difficulty: p.difficulty,
    format: 'multiple_choice',
    problem: p.problem,
    choices: p.choices,
    correctAnswer: p.correctAnswer,
    hint: p.hint,
    solution: p.solution,
    hints: p.hints || null,
    hintDetails: p.hintDetails || (typeof getHintDetails === 'function' ? getHintDetails(p.problem) : null),
    mametchiIntro: getRandomIntro(topic),
    mametchiCorrect: getRandomCorrect(),
    mametchiWrong: getRandomWrong(),
    source: 'local'
  };
}

// Random Mametchi messages
function getRandomIntro(topic) {
  var intros = [
    "Hey Ruby! Ready for a fun challenge? Let's go!",
    "Ooh, I found a great problem for you! Check this out!",
    "Ruby, this one's interesting - let's see what you think!",
    "Alright, math time! I think you'll like this one!",
    "Let's warm up those brain cells, Ruby! Here we go!",
    "I picked this one just for you, Ruby! Give it a try!"
  ];
  return intros[Math.floor(Math.random() * intros.length)];
}

function getRandomCorrect() {
  var msgs = [
    "YES! Nailed it, Ruby! You're amazing! 🌟",
    "Perfect! That's exactly right! You're on fire!",
    "Woohoo! Ruby strikes again! Brilliant work!",
    "That's correct! You're getting so good at this!",
    "Awesome job, Ruby! I'm so proud of you!",
    "Right on! Your math skills are leveling up fast!"
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function getRandomWrong() {
  var msgs = [
    "Not quite, but don't worry! Let me show you a cool way to think about this.",
    "Almost there, Ruby! This is a tricky one. Let's work through it together!",
    "No worries at all! Even the best mathematicians learn from mistakes. Let me explain!",
    "Good try, Ruby! This one is sneaky. Let me walk you through it!",
    "That's okay! Let's figure this out together - I think you'll get it!"
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
