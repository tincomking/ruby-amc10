#!/usr/bin/env python3
"""Convert AMC10 markdown problems to JSON for the web app."""

import os
import re
import json
import html

SOURCE_DIR = os.path.expanduser("~/.openclaw/workspace/RubyAMC10")
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "exams.json")


def clean_latex(text):
    r"""Convert \($...$\) notation to $...$ and fix HTML entities."""
    if not text:
        return text
    text = html.unescape(text)
    # \($...$\) -> $...$
    text = text.replace(r'\($', '$').replace(r'$\)', '$')
    # \(\[...\]\) -> $$...$$
    text = text.replace(r'\(\[', '$$').replace(r'\]\)', '$$')
    # \(\begin{...} -> $$\begin{...}
    text = re.sub(r'\\\(\\begin\{', r'$$\\begin{', text)
    text = re.sub(r'\\end\{([^}]+)\}\\\)', r'\\end{\1}$$', text)
    # Remaining \(...\) -> $$...$$
    text = re.sub(r'(?<!\\)\\\(', '$$', text)
    text = re.sub(r'(?<!\\)\\\)', '$$', text)
    # Fix triple+ dollar signs
    text = re.sub(r'\${3,}', '$$', text)
    # Remove [asy] blocks
    text = re.sub(r'\[asy\].*?\[/asy\]', '[Diagram]', text, flags=re.DOTALL)
    return text.strip()


def extract_correct_answer(content):
    """Extract the correct answer letter from solution text."""
    # Try multiple patterns, from most specific to least
    # Pattern: \boxed{\textbf{(A) }2}
    m = re.search(r'\\boxed\{[^}]*\\textbf\{[^}]*\(([A-E])\)', content)
    if m:
        return m.group(1)
    # Pattern: \boxed{\text{(A) 671}}
    m = re.search(r'\\boxed\{[^}]*\\text\{[^}]*\(([A-E])\)', content)
    if m:
        return m.group(1)
    # Pattern: \boxed{(A)}
    m = re.search(r'\\boxed\{[^}]*\(([A-E])\)', content)
    if m:
        return m.group(1)
    # Pattern: answer is \textbf{(A)}
    m = re.search(r'answer is[^\\]*\\textbf\{\(?([A-E])\)?', content)
    if m:
        return m.group(1)
    # Fallback: first \boxed with a letter
    m = re.search(r'\\boxed\{[^}]*?([A-E])[^A-E}]*\}', content[:2000])
    if m:
        return m.group(1)
    return None


def extract_choices(text):
    """Extract A-E choices from the choices line."""
    choices = []
    # Find the line that has \textbf{(A)} or similar
    for line in text.split('\n'):
        if '(A)' not in line and '(A}' not in line:
            continue
        # Split by \qquad or similar separators
        # First try to extract with regex
        parts = re.findall(r'\\textbf\{[(\[]?([A-E])[)\]]?\s*\}[~\s]*([^\\$]*?)(?=\\qquad|\\textbf|$)', line)
        if len(parts) >= 4:
            for letter, val in parts:
                val = val.strip().rstrip('~').strip()
                choices.append(f"({letter}) ${val}$" if val else f"({letter})")
            break
        # Try alternative format: \textbf{(A) }~value
        parts = re.findall(r'\\textbf\{[(\[]?([A-E])[)\]]?\s*\}\s*[~\s]?\s*([^\\]*?)(?=\\qquad|\\textbf|$)', line)
        if len(parts) >= 4:
            for letter, val in parts:
                val = val.strip().rstrip('~').strip()
                choices.append(f"({letter}) ${val}$" if val else f"({letter})")
            break
        # Simpler: just extract anything between (A) and the next letter
        parts = re.findall(r'\(([A-E])\)[~\s]*([^(\\]*?)(?=\([A-E]\)|$)', line)
        if len(parts) >= 4:
            for letter, val in parts:
                val = val.strip().rstrip('~').rstrip('$').strip()
                choices.append(f"({letter}) {val}" if val else f"({letter})")
            break

    # Pad to 5 if needed
    existing = {c[1] for c in choices if len(c) > 1}
    for letter in 'ABCDE':
        if letter not in existing and len(choices) < 5:
            choices.append(f"({letter}) ?")

    return choices[:5]


def parse_solutions(content):
    """Parse solutions from markdown content."""
    solutions = []
    # Split by "## Solution" headers
    parts = content.split('## Solution')
    for i, part in enumerate(parts[1:], 1):  # Skip everything before first solution
        text = part.strip()
        # Extract solution number and optional title
        m = re.match(r'\s*(\d+)\s*(?:\(([^)]*)\))?\s*\n', text)
        if m:
            num = m.group(1)
            title = m.group(2) or f"Solution {num}"
            text = text[m.end():]
        else:
            # Handle "## Solution" without number
            m2 = re.match(r'\s*\n', text)
            title = f"Solution {i}"
            if m2:
                text = text[m2.end():]

        # Stop at next ## header
        next_header = re.search(r'\n##\s', text)
        if next_header:
            text = text[:next_header.start()]

        # Remove author attribution lines (lines starting with ~)
        lines = []
        for line in text.split('\n'):
            stripped = line.strip()
            if stripped.startswith('~') and len(stripped) < 100:
                continue
            if stripped.startswith('Solution by ') and len(stripped) < 80:
                continue
            if stripped.startswith('-') and len(stripped) < 50 and not stripped.startswith('- '):
                continue  # Author like "-apex304"
            lines.append(line)

        cleaned = '\n'.join(lines).strip()
        if cleaned and len(cleaned) > 10:
            solutions.append({
                'title': title.strip(),
                'text': clean_latex(cleaned)
            })

    return solutions


def parse_problem_file(filepath, year, test_type, prob_num):
    """Parse a single problem markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find problem section
    problem_match = re.search(r'## Problem\s*\n([\s\S]*?)(?=\n## )', content)
    if not problem_match:
        return None

    problem_full = problem_match.group(1).strip()

    # Separate problem text from choices
    # Choices line contains \textbf{(A)} or similar
    lines = problem_full.split('\n')
    prob_lines = []
    choice_lines = []
    found_choices = False
    for line in lines:
        if not found_choices and ('textbf{(A)' in line or 'text{(A)' in line or
                                   re.search(r'\$[^$]*\(A\)', line)):
            found_choices = True
        if found_choices:
            choice_lines.append(line)
        else:
            prob_lines.append(line)

    problem_text = clean_latex('\n'.join(prob_lines).strip())
    choices_text = '\n'.join(choice_lines).strip()
    choices = extract_choices(choices_text) if choices_text else []
    choices = [clean_latex(c) for c in choices]

    # Extract correct answer
    correct = extract_correct_answer(content)

    # Parse solutions
    solutions = parse_solutions(content)

    if not problem_text:
        return None

    return {
        'year': year,
        'test': test_type,
        'number': prob_num,
        'problem': problem_text,
        'choices': choices,
        'correctAnswer': correct,
        'solutions': solutions,
        'id': f"{year}-{test_type}-{prob_num}"
    }


def main():
    exams = {}
    total = 0
    errors = 0

    for year_dir in sorted(os.listdir(SOURCE_DIR)):
        year_path = os.path.join(SOURCE_DIR, year_dir)
        if not os.path.isdir(year_path) or not year_dir.isdigit():
            continue
        year = int(year_dir)

        for test_dir in sorted(os.listdir(year_path)):
            test_path = os.path.join(year_path, test_dir)
            if not os.path.isdir(test_path):
                continue

            test_name = test_dir.replace('AMC_', '')
            exam_key = f"{year} AMC {test_name}"

            problems = []
            for prob_file in sorted(os.listdir(test_path)):
                if not prob_file.endswith('.md'):
                    continue
                m = re.search(r'Problem_(\d+)', prob_file)
                if not m:
                    continue
                prob_num = int(m.group(1))

                try:
                    prob = parse_problem_file(
                        os.path.join(test_path, prob_file),
                        year, test_name, prob_num
                    )
                    if prob and prob['problem']:
                        problems.append(prob)
                        total += 1
                except Exception as e:
                    errors += 1
                    if errors <= 5:
                        print(f"Error: {year}/{test_dir}/{prob_file}: {e}")

            if problems:
                problems.sort(key=lambda p: p['number'])
                exams[exam_key] = {
                    'year': year,
                    'test': test_name,
                    'label': exam_key,
                    'problems': problems,
                    'count': len(problems)
                }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    output = {
        'exams': exams,
        'totalProblems': total,
        'examCount': len(exams),
        'years': sorted(set(e['year'] for e in exams.values()))
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False)

    print(f"Done! {total} problems from {len(exams)} exams. ({errors} errors)")
    size = os.path.getsize(OUTPUT_FILE)
    print(f"Output: {OUTPUT_FILE} ({size / 1024:.0f} KB)")


if __name__ == '__main__':
    main()
