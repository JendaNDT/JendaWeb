"""Compatibility entry point: rebuild all production outputs, not just combined.jsx."""
import subprocess
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
subprocess.run(['node', str(PROJECT_DIR / 'build_site.cjs')], cwd=PROJECT_DIR, check=True)
