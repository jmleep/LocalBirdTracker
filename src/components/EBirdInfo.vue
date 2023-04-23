<template>
  <div class="ebird-info" @click="toggleExpanded()">
    <div class="title-row">
      <div class="title">Where does this data come from?</div>
      <div class="expand-button">{{ buttonText }}</div>
    </div>
    <div class="expanded-content" v-if="isExpanded">
      <div class="separator"></div>
      <div>
        Data is sourced from Cornell University's bird tracking software eBird.
        <a :href="eBirdLink" target="_blank">
          Enter your own sightings and track birds in more detail using their application
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
const buttonText = ref('+')

let eBirdLink = ref('https://ebird.org/home')
const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
if (/android/i.test(userAgent)) {
  eBirdLink.value =
    'https://play.google.com/store/apps/details?id=edu.cornell.birds.ebird&hl=en_US&gl=US'
}

// iOS detection from: http://stackoverflow.com/a/9039885/177710
if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
  eBirdLink.value = 'https://apps.apple.com/us/app/ebird/id988799279'
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  buttonText.value = isExpanded.value ? '-' : '+'
}
</script>

<style scoped>
.ebird-info {
  display: flex;
  flex-flow: column;
  border: 1px dashed #3b597d;
  transition: all 1s;
}

.ebird-info:hover {
  cursor: pointer;
  border: 1px solid #567eaf;
}

.title-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px;
}

.title {
  padding-right: 5px;
  font-size: 0.9em;
  align-self: center;
}

.expanded-title {
  padding: 5px;
  border: 1px solid #3b597d;
}

.expand-button {
  font-size: 1.5em;
  color: #567eaf;
  align-self: flex-end;
}

.expanded-content {
  padding: 0px 20px 20px 20px;
}

.expanded-content a:hover {
  color: #567eaf;
}

.separator {
  margin: 0px 0px 15px 0px;
  border: 1px solid #3b597d;
}
</style>
