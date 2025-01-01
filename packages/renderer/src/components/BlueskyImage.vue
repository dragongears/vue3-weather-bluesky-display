<template>
  <ul v-if="images.length > 0" class="slides">
    <li
      v-for="(image, index) in images"
      :key="image.post.cid"
      class="slide"
      :class="{ 'slide--showing' : index === showing }"
    >
      <video
        v-if="isVideo(image)"
        class="slide__video"
        muted
        :ref="el => slides[index] = el"
        @ended="videoEnded"
      >
        Sorry, your browser doesn't support embedded videos.
      </video>

      <img v-else class="slide__img" :ref="el => slides[index] = el" :src="image.post.embed.images[0].fullsize" alt="" />
    </li>
  </ul>
  <div v-else>
    {{ message }}
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import Hls from 'hls.js';

const props = defineProps({
  slideshowInterval: {
    type: Number,
    default: 3600,
  },
  slideshowMaxImages: {
    type: Number,
    default: 10,
  },
  token: {
    type: String,
    required: true,
  },
  updateInterval: {
    type: Number,
    default: 3600,
  },
});
const emit = defineEmits(['updated']);

let showing = ref(0);
let images = ref([]);
let max = ref(0);
let message = ref('Waiting for Bluesky data');
let videoTimeout = ref(null);
const slides = ref([]);

function attachHls(edges) {
  edges.forEach((edge, idx) => {
    if (edge.post.embed.$type === 'app.bsky.embed.video#view') {
      const hls = new Hls();
      hls.loadSource(edge.post.embed.playlist);
      hls.attachMedia(slides.value[idx]);

      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log("Manifest parsed!");
      });

      hls.on(Hls.Events.ERROR, function(event, data) {
        console.error("HLS.js error", event, data);
      });
    }
  })
}

async function fetchImages() {
  return new Promise((resolve, reject) => {
    fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${props.token}&filter=posts_with_media`)
    .then(async (response) => {
      let responseData = null;

      if (response.status === 200) {
        responseData = await response.json();
      } else {
        reject(new Error(`${response.status}: ${response.statusText}`));
      }

      resolve(responseData);
    })
    .catch (error => {
      console.error('Error fetching Bluesky feed:', error.message);
      reject(error);
    })
  })
}
function getImages() {
  fetchImages()
    .then((response) => {
      const edges = response.feed.filter(f =>
        (f.post.embed?.$type === 'app.bsky.embed.images#view'
        || (Hls.isSupported() && f.post.embed?.$type === 'app.bsky.embed.video#view'))
        && f.post.record.text.includes('#pidisplay')
      );

      if (edges.length) {
        images.value = edges;

        nextTick(() => {
          attachHls(edges);
        })

        if (
          props.slideshowMaxImages > images.value.length ||
          props.slideshowMaxImages === 0
        ) {
          max.value = images.value.length;
        } else {
          max.value = props.slideshowMaxImages;
        }

        if (showing.value > max.value) {
          showing.value = max.value - 1;
        }

        emit('updated', Date.now());
      }

      if (props.updateInterval) {
        setTimeout(getImages, props.updateInterval * 1000);
      }
    })
    .catch((e) => {
      message.value = `${e.message} - ${new Date().toString()}`;

      if (props.updateInterval) {
        setTimeout(getImages, props.updateInterval * 1000);
      }
    });
}

function isVideo(image) {
  return image.post.embed.$type === 'app.bsky.embed.video#view';
}

function nextSlide() {
  showing.value = showing.value <= 0 ? max.value - 1 : showing.value - 1;

  if (isVideo(images.value[showing.value])) {
    videoTimeout.value = setTimeout(videoEnded, 3 * 60 * 1000);
    slides.value[showing.value].play();
  } else {
    setTimeout(nextSlide, props.slideshowInterval);
  }
}

function startSlideshow() {
  nextSlide();
}

function videoEnded() {
  clearTimeout(videoTimeout.value);
  nextSlide();
}

watch(images, (newVal, oldVal) => {
  if (oldVal.length === 0) {
    startSlideshow();
  }
})

onMounted(() =>{
  getImages()
});
</script>

<style lang="scss">
.slides {
  list-style-type: none;
  position: relative;
}

.slide {
  left: 0px;
  opacity: 0;
  position: absolute;
  text-align: center;
  top: 0px;
  transition: opacity 1s;
  width: 100%;
  z-index: 1;
}

.slide--showing {
  opacity: 1;
  z-index: 2;
}

.slide__video {
  margin-top: 20px;
  max-height: 440px;
  max-width: 100%;
  width: 100%;
}

.slide__img {
  height: auto;
  max-height: 448px;
  max-width: 100%;
}

</style>
