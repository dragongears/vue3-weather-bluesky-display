<template>
  <ul v-if="images.length > 0" class="slides">
    <li
      v-for="(image, index) in images"
      :key="image.post.embed.images[0].fullsize"
      class="slide"
      :class="{ 'slide--showing' : index === showing }"
    >
      <video
        v-if="isVideo(image.media_type)"
        class="slide__video"
        muted
        :ref="el => { slides[index] = el }"
        @ended="videoEnded"
      >
        <source :src="image.media_url" type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>

      <img v-else class="slide__img" :ref="el => { slides[index] = el }" :src="image.post.embed.images[0].fullsize" alt="" />
    </li>
  </ul>
  <div v-else>
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

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

      // console.log('>>>> responseData.feed', responseData.feed);
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
      console.log('>>>> response', response);
      const edges = response.feed.filter(f => f.post.embed?.$type === 'app.bsky.embed.images#view' && f.post.record.text.includes('#pidisplay'));
      console.log('>>>> edges', edges);

      if (edges.length) {
        images.value = edges;

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

function isVideo(type) {
  return type === 'VIDEO';
}

function nextSlide() {
  showing.value = showing.value <= 0 ? max.value - 1 : showing.value - 1;
  const typeShowing = images.value[showing.value].media_type;

  if (isVideo(typeShowing)) {
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
