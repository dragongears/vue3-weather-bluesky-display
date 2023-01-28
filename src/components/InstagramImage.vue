<template>
  <ul v-if="images.length > 0" class="slides">
    <li
      v-for="(image, index) in images"
      :key="image.media_url"
      class="slide"
      :class="{ 'slide--showing' : index === showing }"
    >
      <video
        v-if="isVideo(image.media_type)"
        class="slide__video"
        :ref="`refImg${index}`"
        muted
        @ended="videoEnded"
      >
        <source :src="image.media_url" type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>

      <img v-else class="slide__img" :ref="`refImg${index}`" :src="image.media_url" alt="" />
    </li>
  </ul>
  <div v-else>
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

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
let message = ref('Waiting for Instagram data');
let videoTimeout = ref(null);

function getImages() {
  const fields =
    'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username';
  const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${props.token}`;

  axios
    .get(url)
    .then((response) => {
      if (response.status === 200) {
        const edges = response.data.data;

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
      } else {
        message.value = `${response.status}: ${response.statusText}`;
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
  const imgRef = `refImg${showing.value}`;

  if (isVideo(typeShowing)) {
    videoTimeout.value = setTimeout(videoEnded, 3 * 60 * 1000);
    this.$refs[imgRef][0].play();
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
  max-height: 440px;
  max-width: 100%;
}

</style>
