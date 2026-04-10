#!/usr/bin/env python3
"""
Demo/mock version of AnimateDiff for testing the video generation pipeline.
This creates a simple animated video from text without requiring the full AnimateDiff installation.
"""

import argparse
import os
import random
import time
from moviepy import TextClip, ColorClip, CompositeVideoClip

def create_demo_video(prompt, output_path, duration=10, resolution=512):
    """Create a simple demo video with the prompt text animated on screen."""

    # Create a background clip
    bg_color = (random.randint(20, 50), random.randint(20, 50), random.randint(50, 80))  # Dark blue-ish
    background = ColorClip(size=(resolution, resolution), color=bg_color, duration=duration)

    # Create animated text
    text_clip = TextClip(
        prompt[:100] + "..." if len(prompt) > 100 else prompt,
        fontsize=min(resolution//20, 50),
        color='white',
        font='Arial-Bold',
        size=(resolution * 0.8, None)
    ).set_position('center').set_duration(duration)

    # Add some simple animation - fade in/out and slight movement
    text_clip = text_clip.crossfadein(1).crossfadeout(1)

    # Combine clips
    final_clip = CompositeVideoClip([background, text_clip])

    # Write the video
    final_clip.write_videofile(
        output_path,
        fps=24,
        codec='libx264',
        audio=False,
        verbose=False,
        logger=None
    )

    final_clip.close()
    print(f"Demo video created: {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Demo AnimateDiff for testing')
    parser.add_argument('--prompt', required=False)  # Not required for --help
    parser.add_argument('--output', required=False)  # Not required for --help
    parser.add_argument('--duration', type=float, default=10)
    parser.add_argument('--resolution', type=int, default=512)
    parser.add_argument('--steps', type=int, default=20)  # Ignored in demo
    parser.add_argument('--init_image', action='append', default=[])  # Ignored in demo

    args = parser.parse_args()

    # If --help was used, just exit (argparse handles it)
    if not args.prompt or not args.output:
        # This means --help was used or required args missing
        if len(sys.argv) == 1 or '--help' in sys.argv or '-h' in sys.argv:
            parser.print_help()
            sys.exit(0)
        else:
            parser.error("the following arguments are required: --prompt, --output")

    # Ensure output directory exists
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    print(f"Creating demo video for prompt: {args.prompt}")
    print(f"Duration: {args.duration}s, Resolution: {args.resolution}x{args.resolution}")

    create_demo_video(args.prompt, args.output, args.duration, args.resolution)

    print("Demo video generation complete!")