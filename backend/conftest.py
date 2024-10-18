# conftest.py
def pytest_assertion_pass(item, lineno, orig, expl):
    print(f"Test Passed {lineno}: {orig}, {item}, {expl}")
