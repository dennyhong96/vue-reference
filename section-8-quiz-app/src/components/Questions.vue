<template>
  <div class="questions-ctr">
    <div class="progress">
      <div class="bar" :style="{ width: progress }"></div>
      <div class="status">
        {{ questionsAnswered }} out of 3 questions answered
      </div>
    </div>

    <transition name="fade">
      <div :key="activeQuestion.q" class="single-question">
        <div class="question">{{ activeQuestion.q }}</div>
        <div class="answers">
          <div
            v-for="(answer, index) in activeQuestion.answers"
            :key="answer.text"
            class="answer"
            @click="handleClick(index)"
          >
            {{ answer.text }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { IQuestion } from "@/App.vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Questions",

  props: {
    activeQuestion: {
      required: true,
      type: Object as PropType<IQuestion>,
    },

    questionsAnswered: {
      required: true,
      type: Number as PropType<number>,
    },

    progress: {
      required: true,
      type: String as PropType<string>,
    },
  },

  methods: {
    handleClick(answerIndex: number) {
      this.$emit("answerClicked", answerIndex);
    },
  },

  emits: ["answerClicked"],
});
</script>
