#!/usr/bin/env python3
"""
Test script to verify AnimateDiff installation and configuration.
Run this after installing AnimateDiff to ensure everything works.
"""

import os
import sys
import shlex
from dotenv import load_dotenv

# Load local environment variables from .env.local
load_dotenv('.env.local')

def test_animatediff_setup():
    print("Testing AnimateDiff setup...")

    # Test 1: Check environment variables
    env_cmd = os.environ.get('ANIMATEDIFF_CMD')
    env_root = os.environ.get('ANIMATEDIFF_ROOT')

    print(f"ANIMATEDIFF_CMD: {env_cmd}")
    print(f"ANIMATEDIFF_ROOT: {env_root}")
    print(f"DEMO_MODE: {os.environ.get('DEMO_MODE', 'Not set')}")

    # Test 2: Try to find AnimateDiff command (first without demo mode)
    try:
        # Import the function from our animate.py wrapper
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))
        from animate import find_animatediff_command
        command = find_animatediff_command()
        print(f"Found AnimateDiff command: {' '.join(shlex.quote(part) for part in command)}")
        using_demo = 'animate_demo.py' in ' '.join(command)
    except EnvironmentError as e:
        print(f"ERROR: {e}")
        # Try with demo mode enabled
        print("\nTrying with demo mode enabled...")
        os.environ['DEMO_MODE'] = '1'
        try:
            command = find_animatediff_command()
            print(f"Found demo command: {' '.join(shlex.quote(part) for part in command)}")
            using_demo = True
        except EnvironmentError as e2:
            print(f"ERROR even with demo mode: {e2}")
            return False
    except ImportError as e:
        print(f"ERROR: Could not import animate.py script: {e}")
        return False
        print(f"ERROR: Could not import animate.py script: {e}")
        return False

    # Test 3: Try running a simple help/version command
    try:
        import subprocess
        result = subprocess.run(command + ['--help'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            mode = "demo mode" if 'animate_demo.py' in ' '.join(command) else "AnimateDiff"
            print(f"SUCCESS: {mode} command is working")
            return True
        else:
            print(f"WARNING: Command returned non-zero exit code: {result.returncode}")
            print(f"stdout: {result.stdout}")
            print(f"stderr: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print("ERROR: Command timed out")
        return False
    except Exception as e:
        print(f"ERROR: Failed to run command: {e}")
        return False

if __name__ == '__main__':
    success = test_animatediff_setup()
    if success:
        mode = "demo mode" if os.environ.get('DEMO_MODE') else "AnimateDiff"
        print(f"\n[OK] {mode} setup looks good!")
        print("You can now run the AI server with: python ai_server.py")
    else:
        print("\n[ERROR] Setup needs fixing.")
        print("Please check the installation instructions in README.md")
    sys.exit(0 if success else 1)