from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
import json
from kazoo.client import KazooClient

CONNECTION_STRING = 'localhost:2181'
DEBUG = True

# configure flask
app = Flask(__name__)
app.config.from_object(__name__)


# configure kazoo
zk = KazooClient(hosts=CONNECTION_STRING)
zk.start()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/path')
def api_get_path():
    paths = request.args.getlist('path')

    result = {}
    for path in paths:
        data, stat = zk.get(path)
        children = zk.get_children(path)

        path_result = {
            # "version": stat.version,
            "data": data,
            "children": children
        }

        result[path] = path_result

    return json.dumps(result)

@app.route('/api/path/new', methods=['POST'])
def api_create_path():
    path = request.form['path']
    ephemeral = request.form['ephemeral'] == 'true'
    sequence = request.form['sequence'] == 'true'
    content = bytes(request.form['content'])

    print("attempting to create: " + path + " ephemeral? " + str(ephemeral) + " sequential? " + str(sequence))

    real_path = zk.create(path=path, value=content, makepath=True, ephemeral=ephemeral, sequence=sequence)

    # last_index = real_path.rfind('/')
    # real_path = real_path[last_index+1:]

    return real_path

@app.route('/api/path', methods=['DELETE'])
def api_delete_path():
    paths = request.args.getlist('path')

    for path in paths:
        print("attempting to delete: " + path)
        zk.delete(path=path, recursive=True)

    return "success"

def main():
    app.run(host="0.0.0.0")
    zk.stop()


if __name__ == "__main__":
    main()
