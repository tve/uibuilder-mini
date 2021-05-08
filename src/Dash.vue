<template>
  <v-app>
    <v-main>
      <v-container class="d-flex">
        <v-card class="mr-auto d-flex flex-column">
          <v-card-title>Light Switch</v-card-title>
          <v-switch class="mx-auto"
                    v-bind:value="nr.light" true-value="ON" false-value="OFF"
                    @change="send({light:$event})"
          ></v-switch>
        </v-card>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import uibuilder from '../public/uibuilderfe.js'

export default {
  name: 'Dash',

  data() { return {
    nr: {}, // data coming in from node-red
    msgCount: 0,
  }},

  watch: {
    nr: { // watcher for debug purposes, all it does is print to the console
      deep: true,
      handler: function(newValue, oldValue) {
        console.log("nr.light changed from", oldValue.light, "to", newValue.light)
      },
    },
  },

  methods: {
    // send a state change to node-red, should be called from UI event handlers
    // ev is an object where the property names are msg.topic and value msg.payload
    send(ev) {
      for (let topic in ev) uibuilder.send({topic: topic, payload: ev[topic]})
    },
  },

  // Called after the Vue app has been created.
  created() {
    console.log("uibuilder.ioConnected=", uibuilder.get('ioConnected'))
    if (!uibuilder.get('ioConnected')) {
      // there's no way to stop uibuilder, so for now we accept that it's active for the
      // duration of hte page, though hot-reloads in development.
      let nodered = process.env.VUE_APP_NR_SERVER + "/" + process.env.VUE_APP_UIB_NAME
      // start uibuilder loaded from installed npm package
      uibuilder.debug(true)
      uibuilder.start({
        namespace: nodered, ioPath: "/uibuilder/vendor/socket.io", vueApp: null,
      })
    }
  },

  // Called after vue components are loaded and DOM built.
  // (Everything below here is boiler-plate)
  mounted: function() {
    const self = this;

    // Register to process messages from node-red.
    uibuilder.onChange('msg', function(msg) {
      // Stash away the data as long as the message has a topic and a payload.
      if (!('topic' in msg && 'payload' in msg)) return;

      // Interpret the topic string as a hierarchy of object "levels" separated by dots.
      let tt = msg.topic.split("."); // split levels of hierarchy
      let nr = self.nr; // start at root
      let t = tt.pop(); // separate off last level
      tt.forEach(function(v) {
        if (!(v in nr)) self.$set(nr, v, {});
        if (typeof nr[v] !== Object) {
          console.log(`Level '${v}' of topic ${msg.topic} is not an object`);
          return;
        }
        nr = nr[v];
      });
      // now nr[t] is the field to update

      // perform the update
      let pIsArray = Array.isArray(msg.payload);
      if (pIsArray && (!(t in nr) || nr[t] === null)) {
        self.$set(nr, t, []);
      }
      if (pIsArray && Array.isArray(nr[t])) {
        // We got arrays: append and trim
        let excess = nr[t].length + msg.payload.length - 1000;
        if (excess <= 0)
          nr[t] = nr[t].concat(msg.payload);
        else
          nr[t] = nr[t].slice(excess).concat(msg.payload);
        let l = nr[t].length;
        console.log(`Appended ${msg.payload.length} to ${t}, now ${l}`)
      } else {
        // Use Vue.set 'cause we will add new props to nr.
        self.$set(nr, t, msg.payload);
        console.log(`Updating ${t} with: ${msg.payload}`)
      }

      self.msgCount++;
    });
  },
};
</script>
