Mini-demo using Node-Red with Vuetify
=====================================

This is a mini Node-Red demo using uibuilder, Vue.js, and Vuetify.
The demo shows a light switch. The light switch can be toggled in the
web browser as well as using two inject nodes in node-red. In all cases
the changes trigger messages in node-red that can output some control
requests to actually turn the light on/off, and the web UI always shows
the current state.

## Quick start

The node-red installation need to include uibuilder, however, it needs a
small patch to support CORS which is described in
https://github.com/TotallyInformation/node-red-contrib-uibuilder/pull/131
Until that gets merged, the easiest is to install
`tve/node-red-contrib-uibuilder` in node-red instead of
TotallyInformation's version.

To bring this project to life, install vue-cli (e.g. `apt install vue-cli`
on Ubuntu) and install all the dependencies of this repo locally.
```
npm install
```

Now there are two hostnames to possibly configure. In the end there will be three pieces:
- your web browser running on your laptop/desktop
- the vue-cli development server that serves up the UI files
- the node-red server that runs the flow.js and to which uibuilder connects

Edit `.env.development` and set `DEV_SERVER` to the hostname of the machine that
will run vue-cli, i.e. where you installed this repo, most likely your laptop,
thus `http://localhost:8080.` Then set `VUE_APP_NR_SERVER` to the hostname:port of the
machine that runs node-red, most likely also your laptop thus `http://localhost:1880`

Open your node-red admin UI and import `flow.js` and start the flow.

Finally, start the dev server using `npm run serve` or `vue-cli-service serve`
and point your web browser at the `DEV_SERVER` url.
