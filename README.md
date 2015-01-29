A simple web app writen in python/flask using Kazoo to browse and create Zookeeper znodes.

Setup / Run
-----------

- Open cow-wrangler.py
- Change CONNECTION_STRING and DEBUG to the appropriate values
- From the root of the project run `python cow-wrangler.py`
- Go to http://localhost:5000 in your browser.

To Use
------

Using the app is pretty straight forward. You can browse existing znodes just by clicking on the children of the current znode or clicking the breadcrumb items near the bottom.

In the text box on the bottom you can type in existing or non-existing paths and hit enter and it will navigate you to that new path (relative to the current path). Duplicate slashes are automatically cleaned and trailing/leading slashes are removed. You can input full paths or just individual node names at a time. If you have navigated to a non-existing path, a form to create a node there will appear.

If any data is present, the data will appear in a blue box. It will attempt to format JSON data.

Todo
----

- Make CONNECTION_STRING and DEBUG parameters
- Set the current path in the URL so you can share links
- Allow the UI to use multiple paths at once so the user can track various paths
