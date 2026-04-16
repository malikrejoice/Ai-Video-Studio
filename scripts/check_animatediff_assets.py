import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv('.env.local')

DEFAULT_DREAMBOOTH_FILENAME = 'realisticVisionV60B1_v51VAE.safetensors'
DEFAULT_MOTION_MODULE_FILENAME = 'v3_sd15_mm.ckpt'


def find_first_file(directory, suffixes):
    if not directory.exists():
        return None

    for child in sorted(directory.iterdir()):
        if child.is_file() and child.suffix.lower() in suffixes:
            return child

    return None


def main():
    root = os.environ.get('ANIMATEDIFF_ROOT')
    if root:
        animatediff_root = Path(root)
    else:
        animatediff_root = Path(__file__).resolve().parents[1] / 'AnimateDiff'

    print(f'AnimateDiff root: {animatediff_root}')

    if not animatediff_root.exists():
        print('ERROR: AnimateDiff root does not exist.')
        return 1

    script_path = animatediff_root / 'scripts' / 'animate.py'
    if not script_path.is_file():
        print(f'ERROR: AnimateDiff CLI not found at {script_path}')
        return 1

    dreambooth_file = find_first_file(
        animatediff_root / 'models' / 'DreamBooth_LoRA',
        {'.safetensors', '.ckpt', '.bin'},
    )
    motion_module_file = find_first_file(
        animatediff_root / 'models' / 'Motion_Module',
        {'.safetensors', '.ckpt', '.bin'},
    )

    if not dreambooth_file:
        print(
            'WARNING: No local DreamBooth checkpoint found in models/DreamBooth_LoRA. '
            f'The runtime can attempt to auto-download {DEFAULT_DREAMBOOTH_FILENAME}.'
        )
    else:
        print(f'Found DreamBooth checkpoint: {dreambooth_file.name}')

    if not motion_module_file:
        print(
            'WARNING: No local motion module checkpoint found in models/Motion_Module. '
            f'The runtime can attempt to auto-download {DEFAULT_MOTION_MODULE_FILENAME}.'
        )
    else:
        print(f'Found motion module checkpoint: {motion_module_file.name}')

    if not dreambooth_file or not motion_module_file:
        print('Local assets are incomplete, but the runtime is configured with downloadable defaults.')
        return 0

    print('AnimateDiff asset check passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
