#!/usr/bin/env python

"""Run isort, black and flake8 on given files

    Example: ./blacksort toot/titi/file.py tutu/tata/test.py
"""

import subprocess
import sys

SUCCESS = "\033[92m"
FAIL = "\033[91m"
ENDC = "\033[0m"


def print_success(msg):
    """Print msg in SUCCESS color."""
    print(f"{SUCCESS}{msg}{ENDC}")


def print_error(msg):
    """Print msg in FAIL color."""
    print(f"{FAIL}{msg}{ENDC}")


def isort_main(fn):
    """Sort imports of a given file."""
    ret = subprocess.call(["isort"] + [fn])

    if ret:
        print_error(
            "isort failed: Some modules have incorrectly ordered imports. Fix by running `isort --recursive .`"
        )
    else:
        print_success("Isort passed")

    return ret


def black_main(fn):
    """Format python file with black."""
    ret = subprocess.call(["black"] + [fn])

    if ret:
        print_error("black failed")
    else:
        print_success("Black passed")
    return ret


def flake8_main(fn):
    """Check pep8 with flake8."""
    ret = subprocess.call(["flake8"] + [fn])

    if ret:
        print_error("flake8 failed")
    else:
        print_success("flake8 passed")
    return ret


if __name__ == "__main__":
    args = sys.argv[1:]
    for fn in args:
        if not fn.endswith(".py"):
            continue
        print("Processing {}".format(fn))
        isort_main(fn)
        black_main(fn)
        flake8_main(fn)
