import sys
import json
import subprocess
import argparse

def create_docker_file(project: str) -> bool:
    ''' Creates the docker file.

    Parameters
    ----------
    project: str
        The name of the project directory on the server.

    Returns
    -------
    bool
        Whether the dockerfile creation completed successfully. 
    '''

    dockerfile = [
        'FROM nginx:1.21.0-alpine as production',
        'ENV NODE_ENV production',
        f'RUN mkdir -p /data/shared/{project}',
        'COPY ./build /usr/share/nginx/html',
        'COPY nginx.conf /etc/nginx/conf.d/default.conf',
        'EXPOSE 80',
        'CMD [\"nginx\", \"-g\", \"daemon off;\"]'
    ]

    try:
        with open('Dockerfile', 'w') as f:
            f.write('\n\n'.join(dockerfile))
    except Exception as e:
        print(f'Error: {e}')
        return False

    return True

def main():

    parser = argparse.ArgumentParser(
        prog = 'create_app_container.py',
        usage = 'python create_app_container.py --server'
    )
    parser.add_argument('-s', '--server', help = 'tst/prd')
    options = parser.parse_args()
    if not options.server:
        parser.print_help()
        sys.exit(1)
    server = options.server.lower().strip()

    with open('config.json', 'r') as f:
        conf = json.load(f)
    if not create_docker_file(conf['project']):
        sys.exit(1)

    image_name = f"{conf['project']}_frontend"
    container = f'{image_name}_container'
    ports = conf['app_port']
    if server == 'tst':
        port = ports['tst']
    elif server == 'prd':
        port = ports['prd']
    else:
        print('Invalid server passed.')
        sys.exit(1)

    cmds = [
        'npm run build',
        f'docker build -t {image_name} .'
    ]
    existing_container = subprocess.getoutput(f'docker ps -a | grep {container}').split(' ')[0].strip()
    if existing_container.strip() != '':
        cmds.append(f'docker rm -f {existing_container}')
    cmds.append(f'docker create --name {container} -p 127.0.0.1:{port}:80 {image_name}')

    for cmd in cmds:
        try:
            x = subprocess.getoutput(cmd)
            print(x)
        except subprocess.CalledProcessError as e:
            print(f'Error running command: {cmd}: {e}')

if __name__ == "__main__":
    main()
