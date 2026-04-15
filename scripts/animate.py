import argparse
import importlib.util
import os
import shlex
import subprocess
import sys
from dotenv import load_dotenv

# Load local environment variables from .env.local
load_dotenv('.env.local')

def find_animatediff_command():
    env_cmd = os.environ.get('ANIMATEDIFF_CMD')
    if env_cmd:
        return shlex.split(env_cmd)

    env_root = os.environ.get('ANIMATEDIFF_ROOT')
    if env_root:
        candidate = os.path.join(env_root, 'scripts', 'animate.py')
        if os.path.isfile(candidate):
            return [sys.executable, candidate]

    for module_name in ['animatediff', 'animediff', 'AnimateDiff']:
        # If the module exists as a subdirectory with scripts/animate.py, use that directly
        local_script = os.path.join(os.path.dirname(os.path.dirname(__file__)), module_name, 'scripts', 'animate.py')
        if os.path.isfile(local_script):
            return [sys.executable, local_script]
            
        if importlib.util.find_spec(module_name) is not None:
            return [sys.executable, '-m', module_name]

    # Fall back to demo mode if AnimateDiff is not available
    if os.environ.get('DEMO_MODE', '').lower() in ('1', 'true', 'yes'):
        demo_script = os.path.join(os.path.dirname(__file__), 'animate_demo.py')
        if os.path.isfile(demo_script):
            return [sys.executable, demo_script]

    raise EnvironmentError(
        'AnimateDiff CLI not found. Please install AnimateDiff from https://github.com/guoyww/AnimateDiff '
        'and set ANIMATEDIFF_ROOT=C:\\path\\to\\AnimateDiff or ANIMATEDIFF_CMD=python C:\\path\\to\\AnimateDiff\\scripts\\animate.py\n'
        'For testing, you can set DEMO_MODE=1 to use a demo video generator.'
    )


def build_command(prompt, output, duration=10, resolution=512, steps=20, init_images=None):
    command = find_animatediff_command()
    command.extend([
        '--prompt', prompt,
        '--output', output,
        '--duration', str(duration),
        '--resolution', str(resolution),
        '--steps', str(steps),
    ])

    if init_images:
        for image_path in init_images:
            command.extend(['--init_image', image_path])

    return command


def main():
    parser = argparse.ArgumentParser(description='AnimateDiff wrapper for local video generation.')
    parser.add_argument('--prompt', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--duration', type=float, default=10)
    parser.add_argument('--resolution', type=int, default=512)
    parser.add_argument('--steps', type=int, default=20)
    parser.add_argument('--init_image', action='append', default=[])
    args = parser.parse_args()

    OUTPUT_DIR = os.path.dirname(args.output)
    if OUTPUT_DIR:
        os.makedirs(OUTPUT_DIR, exist_ok=True)

    command = build_command(
        prompt=args.prompt,
        output=args.output,
        duration=args.duration,
        resolution=args.resolution,
        steps=args.steps,
        init_images=args.init_image
    )

    print('Running AnimateDiff command:')
    print(' '.join(shlex.quote(part) for part in command))

    completed = subprocess.run(command, capture_output=True, text=True)

    if completed.returncode != 0:
        print('AnimateDiff failed with stderr:', file=sys.stderr)
        print(completed.stderr, file=sys.stderr)
        print('AnimateDiff stdout:', file=sys.stderr)
        print(completed.stdout, file=sys.stderr)
        sys.exit(completed.returncode)

    print('AnimateDiff finished successfully.')
    print(completed.stdout)


if __name__ == '__main__':
    main()
