from flask import Flask, request, jsonify, send_from_directory
import subprocess
import threading
import uuid
import os
import base64
import re
import sys
import time

app = Flask(__name__)

OUTPUT_DIR = 'outputs'
INPUT_DIR = 'input_images'

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(INPUT_DIR, exist_ok=True)

IMAGE_REGEX = re.compile(r'data:(image/[^;]+);base64,(.+)')
jobs = {}
job_lock = threading.Lock()


def save_image(base64_string, index):
    match = IMAGE_REGEX.match(base64_string)
    if match:
        mime_type = match.group(1)
        encoded = match.group(2)
    else:
        mime_type = 'image/png'
        encoded = base64_string

    extension = mime_type.split('/')[-1]
    image_path = os.path.join(INPUT_DIR, f'image_{index}.{extension}')

    with open(image_path, 'wb') as image_file:
        image_file.write(base64.b64decode(encoded))

    return image_path


def update_job(job_id, **kwargs):
    with job_lock:
        if job_id in jobs:
            jobs[job_id].update(kwargs)


def build_output_path(filename):
    return os.path.join(OUTPUT_DIR, filename)


def generate_job(job_id, prompt, duration, aspect_ratio, style, images):
    update_job(job_id, status='running', progress=20)

    try:
        saved_images = []
        for index, image_data in enumerate(images[:5]):
            saved_image = save_image(image_data, index)
            saved_images.append(saved_image)

        output_filename = f'{uuid.uuid4()}.mp4'
        output_path = build_output_path(output_filename)

        command = [
            sys.executable,
            'scripts/animate.py',
            '--prompt', prompt,
            '--output', output_path,
            '--duration', str(duration),
            '--resolution', '512',
            '--steps', '20',
        ]

        for image_path in saved_images:
            command.extend(['--init_image', image_path])

        update_job(job_id, progress=35)
        time.sleep(1)

        subprocess.run(command, check=True, capture_output=True, text=True)

        update_job(job_id, status='completed', progress=100, video=output_filename)
    except subprocess.CalledProcessError as exc:
        update_job(
            job_id,
            status='failed',
            progress=0,
            error='AnimateDiff generation failed.',
            details=exc.stderr or exc.stdout,
        )
    except Exception as exc:
        update_job(job_id, status='failed', progress=0, error=str(exc))


@app.route('/generate', methods=['POST'])
def generate():
    payload = request.get_json(force=True)
    prompt = payload.get('prompt')
    duration = payload.get('duration', 10)
    aspect_ratio = payload.get('aspectRatio', '16:9')
    style = payload.get('style', 'Cinematic')
    images = payload.get('images', []) or []

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    job_id = uuid.uuid4().hex
    jobs[job_id] = {
        'jobId': job_id,
        'status': 'queued',
        'progress': 5,
        'prompt': prompt,
        'duration': duration,
        'aspectRatio': aspect_ratio,
        'style': style,
        'video': None,
        'error': None,
        'details': None,
    }

    thread = threading.Thread(
        target=generate_job,
        args=(job_id, prompt, duration, aspect_ratio, style, images),
        daemon=True,
    )
    thread.start()

    return jsonify({'jobId': job_id, 'status': 'queued', 'progress': 5})


@app.route('/status/<job_id>', methods=['GET'])
def status(job_id):
    with job_lock:
        job = jobs.get(job_id)

    if not job:
        return jsonify({'error': 'Job not found.'}), 404

    response = {
        'jobId': job['jobId'],
        'status': job['status'],
        'progress': job['progress'],
        'prompt': job['prompt'],
        'duration': job['duration'],
        'aspectRatio': job['aspectRatio'],
        'style': job['style'],
    }

    if job['status'] == 'completed':
        response['video'] = job['video']

    if job['status'] == 'failed':
        response['error'] = job.get('error', 'Generation failed.')
        response['details'] = job.get('details')

    return jsonify(response)


@app.route('/outputs/<path:filename>', methods=['GET'])
def serve_output(filename):
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=False)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
