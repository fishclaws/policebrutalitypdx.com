<template>
  <div>
    <toggle-button
      :width="120"
      :height="50"
      :labels="{checked: 'zoom', unchecked: 'overview'}"
      id="zoom-toggle" 
      color="#FF4500" 
      v-model="zoom"/>
    <div id="tweet-container">
      <!-- <vue-core-video-player :src="currentUrl"></vue-core-video-player> -->
      <!-- <video ref="vid" controls autoplay @ended="shuffle()">
        <source :src="currentUrl" type="video/mp4">
        Sorry, your browser doesn't support embedded videos.
      </video> -->
    <Tweet :key="currentTweet" :id="currentTweet" v-if="currentTweet" :options="{ theme: 'dark', conversation: 'none' }"></Tweet>
    </div>
    <div id="map-container">
      <div id="mapid"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Navbar from "./navbar.vue";
import Help from "./help.vue";
import { Watch } from "vue-property-decorator";
import { Action, State, Getter } from "vuex-class";
// import VueCoreVideoPlayer from 'vue-core-video-player'
const VueCoreVideoPlayer = require('vue-core-video-player').default
// const mapboxgl = require('mapbox-gl')
// import { Tweet, Moment, Timeline } from 'vue-tweet-embed'
const { Tweet, Moment, Timeline } = require('vue-tweet-embed')
import axios from 'axios';
const GSheetReader = require('g-sheets-api');
// const { ToggleButton } = require('vue-js-toggle-button');
import { ToggleButton } from 'vue-js-toggle-button'

Vue.use(VueCoreVideoPlayer);

declare const mapboxgl: any;

@Component({
  components: {
    Tweet,
    ToggleButton
  }
})
export default class App extends Vue {
  map: any = {}
  events: {
    latitude: string,
    longitude: string,
    'tweet url': string
  }[] = []
  curr = 0;
  currentTweet = ''
  geojson = {
    type: 'FeatureCollection',
    features: []
  };
  zoom = true;
  center = [-122.7050, 45.5351];
  cityCenter = [-122.6850, 45.5151];

  loadData() {
    // axios({
    //         url: 'https://spreadsheets.google.com/feeds/cells/1BW83j9gNCQkArHCR66VwGiGlXzBcoUJ_RWOqmyoZnGY/1/public/values?alt=json-in-script'
    //     }).then((response: any) => {
    //       this.events = response['feed']['entry']
    //     }, (error) => {
            
    //     });
    const options = {
      sheetId: '1BW83j9gNCQkArHCR66VwGiGlXzBcoUJ_RWOqmyoZnGY',
      sheetNumber: 1,
      returnAllResults: true,
      // filter: {
      // },
      // filterOptions: {
      // }
    }
    GSheetReader(options, (results: any) => {
      // do something with the results here
      this.events = results;
      for(let i = 0; i < this.events.length; i++) {
        const event = this.events[i];
        if (event.longitude && event.latitude) {
          // create a HTML element for each feature
          var el = document.createElement('div');
          el.className = 'marker';
          el.onclick = () => {
            el.style.color = '#ffffff';
            this.curr = i;
            this.update();
          }
          // make a marker for each feature and add to the map
          new mapboxgl.Marker(el)
            .setLngLat([event.longitude, event.latitude])
            .addTo(this.map);
        }
      }
      this.update();
      // setInterval(this.shuffle, 5000);
      this.onChangeZoom();
    })
  }

  extractId(url: string) {
    const tokens = url.split('/');
    return tokens[tokens.length - 1];
  }

  update() {
    const event = this.events[this.curr];
    this.currentTweet = this.extractId(event['tweet url']);
  }

  shuffle() {
    this.update();
    // this.map.flyTo({
    //   center: [event['longitude'], event['latitude']],
    //   essential: true // this animation is considered essential with respect to prefers-reduced-motion
    //   });
    this.curr = (this.curr + 1) % this.events.length;
    // const vid = (this.$refs.vid as any);
    // vid.currentTime = 0;
    // vid.play();
    
  }

  @Watch('zoom')
  onChangeZoom() {
    if (!this.zoom) {
      this.map.flyTo({
        center: this.center,
        zoom: 12,
        });
    } else {
      this.map.flyTo({
        center: this.cityCenter,
        zoom: 14,
      })
    }
  }

    mounted() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibXNnc2x1dCIsImEiOiJja2NvZmFpbjAwMW84MnJvY3F1d2hzcW5nIn0.xMAHVsdszfolXUOk9_XI4g';
      this.map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/msgslut/ckcofib0z065x1ime0b5glwdk', // stylesheet location
        center: this.center, // starting position [lng, lat]
        zoom: 12 // starting zoom
      });
      this.loadData();
    }
  }
</script>
<style>
  /* #mapid { height: 180px; } */
  #mapid {
    height: 100vh;
    width: 100%;
    /* position: absolute;
    top: 0;
    left: 50%;
    width: 60%;
    height: 100%; */
  }

  #map-container {
    display: flex;
    position: relative;
  }

  #tweet-container {
    position: absolute;
    z-index: 10;
    width: 60%;
    height: 100%
  }

  #zoom-toggle {
    position: absolute;
    z-index: 11;
    right: 5%;
    top: 5%;
    width: 100px;
    height: 100px;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: small;
  }

  .marker {
    background-image: url('/assets/marker.png');
    background-size: cover;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 100;
  }

  @media only screen and (max-device-width: 480px) {
      #tweet-container {
          width: 100%;
      }
    }
</style>