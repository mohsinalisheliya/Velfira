import os
import shutil
import signal
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"


def backend_python():
    virtual_env_python = BACKEND / "venv" / (
        "Scripts/python.exe" if os.name == "nt" else "bin/python"
    )
    if virtual_env_python.is_file():
        return str(virtual_env_python)
    return sys.executable


def start_processes():
    if not (BACKEND / "manage.py").is_file():
        raise FileNotFoundError(f"Backend entry point not found: {BACKEND / 'manage.py'}")
    if not (FRONTEND / "package.json").is_file():
        raise FileNotFoundError(f"Frontend package file not found: {FRONTEND / 'package.json'}")

    windows_options = (
        {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP} if os.name == "nt" else {}
    )
    unix_options = {"start_new_session": True} if os.name != "nt" else {}

    backend = subprocess.Popen(
        [backend_python(), "manage.py", "runserver", "127.0.0.1:8000"],
        cwd=BACKEND,
        **windows_options,
        **unix_options,
    )

    try:
        if os.name == "nt":
            frontend_command = "npm.cmd run dev -- --host 127.0.0.1"
            frontend = subprocess.Popen(
                frontend_command,
                cwd=FRONTEND,
                shell=True,
                **windows_options,
            )
        else:
            npm = shutil.which("npm")
            if npm is None:
                raise FileNotFoundError("npm was not found. Install Node.js and npm, then try again.")
            frontend = subprocess.Popen(
                [npm, "run", "dev", "--", "--host", "127.0.0.1"],
                cwd=FRONTEND,
                **unix_options,
            )
    except Exception:
        stop_processes([backend])
        raise

    return [backend, frontend]


def stop_processes(processes):
    running = [process for process in processes if process.poll() is None]
    for process in running:
        try:
            if os.name == "nt":
                process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                os.killpg(process.pid, signal.SIGTERM)
        except (OSError, ValueError):
            process.terminate()

    for process in running:
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()


def main():
    try:
        processes = start_processes()
    except (FileNotFoundError, OSError) as error:
        print(f"Could not start Velfira: {error}", file=sys.stderr)
        return 1

    print("Velfira development servers are starting.")
    print("Frontend: http://127.0.0.1:5173")
    print("Backend:  http://127.0.0.1:8000")
    print("Press Ctrl+C to stop both servers.")

    try:
        while True:
            for name, process in zip(("Backend", "Frontend"), processes):
                exit_code = process.poll()
                if exit_code is not None:
                    print(f"{name} server stopped with exit code {exit_code}.")
                    return exit_code or 1
            time.sleep(0.25)
    except KeyboardInterrupt:
        print("\nStopping both servers...")
    finally:
        stop_processes(processes)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
