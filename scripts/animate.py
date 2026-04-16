import argparse
import glob
import importlib.util
import math
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import tempfile

import imageio.v2 as imageio
from dotenv import load_dotenv

# Load local environment variables from .env.local
load_dotenv('.env.local')

DEFAULT_NEGATIVE_PROMPT = (
    "worst quality, low quality, blurry, distorted, deformed, disfigured, "
    "text, watermark, logo, cropped, duplicate, extra limbs, bad anatomy"
)


def _resolve_animatediff_root(command):
    if len(command) >= 2 and command[1].endswith('scripts/animate.py'):
        return Path(command[1]).resolve().parents[1]
    return None


def _find_first_file(directory, patterns):
    if not directory.exists():
        return None

    for pattern in patterns:
        matches = sorted(directory.glob(pattern))
        if matches:
            return matches[0]

    return None


def _find_model_paths(root):
    models_dir = root / 'models'
    dreambooth_path = _find_first_file(
        models_dir / 'DreamBooth_LoRA',
        ['*.safetensors', '*.ckpt', '*.bin'],
    )
    motion_module_path = _find_first_file(
        models_dir / 'Motion_Module',
        ['*.ckpt', '*.safetensors', '*.bin'],
    )

    if not dreambooth_path or not motion_module_path:
        raise EnvironmentError(
            'AnimateDiff model checkpoints are missing. Add a Stable Diffusion model file to '
            f'"{models_dir / "DreamBooth_LoRA"}" and a motion module checkpoint to '
            f'"{models_dir / "Motion_Module"}".'
        )

    return dreambooth_path, motion_module_path


def _write_runtime_config(root, prompt, duration, resolution, steps, init_images):
    dreambooth_path, motion_module_path = _find_model_paths(root)
    inference_config = root / 'configs' / 'inference' / 'inference-v3.yaml'

    if not inference_config.is_file():
        raise EnvironmentError(
            f'AnimateDiff inference config not found at "{inference_config}".'
        )

    frame_count = max(8, min(32, int(math.ceil(float(duration) * 4))))
    controlnet_lines = ''
    if init_images:
        controlnet_config = root / 'configs' / 'inference' / 'sparsectrl' / 'image_condition.yaml'
        controlnet_images = '\n'.join(f'    - "{Path(image).resolve().as_posix()}"' for image in init_images)
        controlnet_lines = (
            f'  controlnet_path: ""\n'
            f'  controlnet_config: "{controlnet_config.as_posix()}"\n'
            f'  controlnet_images:\n{controlnet_images}\n'
        )

    config_text = f'''- dreambooth_path: "{dreambooth_path.resolve().as_posix()}"
  lora_model_path: ""

  inference_config: "{inference_config.resolve().as_posix()}"
  motion_module: "{motion_module_path.resolve().as_posix()}"

  steps: {int(steps)}
  guidance_scale: 8
  W: {int(resolution)}
  H: {int(resolution)}
  L: {frame_count}
{controlnet_lines}  prompt:
    - "{prompt.replace('"', '\\"')}"

  n_prompt:
    - "{DEFAULT_NEGATIVE_PROMPT}"
'''

    runtime_dir = Path(tempfile.mkdtemp(prefix='animatediff-run-'))
    config_path = runtime_dir / 'runtime-prompt.yaml'
    config_path.write_text(config_text, encoding='utf-8')
    return runtime_dir, config_path


def _find_generated_gif(root, config_stem):
    sample_dirs = sorted(
        glob.glob(str(root / 'samples' / f'{config_stem}-*')),
        key=os.path.getmtime,
    )
    if not sample_dirs:
        raise FileNotFoundError('AnimateDiff completed without creating a samples directory.')

    latest_dir = Path(sample_dirs[-1])
    sample_dir = latest_dir / 'sample'
    gif_candidates = sorted(sample_dir.glob('*.gif'))
    if gif_candidates:
        return gif_candidates[0]

    sample_gif = latest_dir / 'sample.gif'
    if sample_gif.is_file():
        return sample_gif

    raise FileNotFoundError('AnimateDiff completed, but no GIF output was found in samples/.')


def _convert_gif_to_output(gif_path, output_path):
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    if output.suffix.lower() == '.gif':
        shutil.copyfile(gif_path, output)
        return

    frames = imageio.mimread(gif_path)
    if not frames:
        raise RuntimeError(f'No frames found in generated GIF "{gif_path}".')

    with imageio.get_writer(output, fps=8) as writer:
        for frame in frames:
            writer.append_data(frame)

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


def run_command(prompt, output, duration=10, resolution=512, steps=20, init_images=None):
    command = find_animatediff_command()
    animatediff_root = _resolve_animatediff_root(command)
    init_images = init_images or []

    if animatediff_root and (animatediff_root / 'configs').is_dir():
        runtime_dir = None
        try:
            runtime_dir, config_path = _write_runtime_config(
                animatediff_root,
                prompt=prompt,
                duration=duration,
                resolution=resolution,
                steps=steps,
                init_images=init_images,
            )
            official_command = command + ['--config', str(config_path)]

            print('Running AnimateDiff command:')
            print(' '.join(shlex.quote(part) for part in official_command))

            completed = subprocess.run(
                official_command,
                capture_output=True,
                text=True,
                cwd=animatediff_root,
            )
            if completed.returncode != 0:
                print('AnimateDiff failed with stderr:', file=sys.stderr)
                print(completed.stderr, file=sys.stderr)
                print('AnimateDiff stdout:', file=sys.stderr)
                print(completed.stdout, file=sys.stderr)
                sys.exit(completed.returncode)

            generated_gif = _find_generated_gif(animatediff_root, config_path.stem)
            _convert_gif_to_output(generated_gif, output)

            print('AnimateDiff finished successfully.')
            print(completed.stdout)
            print(f'Converted output saved to {output}')
            return
        finally:
            if runtime_dir and runtime_dir.exists():
                shutil.rmtree(runtime_dir, ignore_errors=True)

    command = build_command(
        prompt=prompt,
        output=output,
        duration=duration,
        resolution=resolution,
        steps=steps,
        init_images=init_images,
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

    run_command(
        prompt=args.prompt,
        output=args.output,
        duration=args.duration,
        resolution=args.resolution,
        steps=args.steps,
        init_images=args.init_image,
    )


if __name__ == '__main__':
    main()
