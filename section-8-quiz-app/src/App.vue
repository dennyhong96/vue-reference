<template>
  <div class="ctr">
    <transition name="fade" mode="out-in">
      <Questions
        v-if="questionsAnswered < questions.length"
        :activeQuestion="activeQuestion"
        :progress="progress"
        :questionsAnswered="questionsAnswered"
        @answerClicked="handleAnswer"
      />
      <Results v-else :result="result" />
    </transition>

    <button
      v-if="questionsAnswered === questions.length"
      @click.prevent="handleReset"
      type="button"
      class="reset-btn"
    >
      Reset
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Questions from "@/components/Questions.vue";
import Results from "@/components/Results.vue";

export interface IQuestion {
  q: string;
  answers: {
    text: string;
    is_correct: boolean;
  }[];
}

export interface IResult {
  min: number;
  max: number;
  title: string;
  desc: string;
}

export default defineComponent({
  name: "App",

  components: {
    Questions,
    Results,
  },

  methods: {
    handleAnswer(answerIndex: number) {
      if (
        this.questions[this.questionsAnswered].answers[answerIndex].is_correct
      ) {
        this.correctAnswers++;
      }
      this.questionsAnswered++;
    },

    handleReset() {
      this.questionsAnswered = 0;
      this.correctAnswers = 0;
    },
  },

  computed: {
    result(): IResult | undefined {
      const r = this.results.find(
        (result) =>
          this.correctAnswers >= result.min && this.correctAnswers <= result.max
      );
      return r;
    },

    activeQuestion(): IQuestion {
      return this.questions[this.questionsAnswered];
    },

    progress(): string {
      return `${(this.questionsAnswered / this.questions.length) * 100}%`;
    },
  },

  data() {
    return {
      questionsAnswered: 0,

      correctAnswers: 0,

      questions: [
        {
          q: "What is 2 + 2?",
          answers: [
            {
              text: "4",
              is_correct: true,
            },
            {
              text: "3",
              is_correct: false,
            },
            {
              text: "Fish",
              is_correct: false,
            },
            {
              text: "5",
              is_correct: false,
            },
          ],
        },
        {
          q: 'How many letters are in the word "Banana"?',
          answers: [
            {
              text: "5",
              is_correct: false,
            },
            {
              text: "7",
              is_correct: false,
            },
            {
              text: "6",
              is_correct: true,
            },
            {
              text: "12",
              is_correct: false,
            },
          ],
        },
        {
          q: "Find the missing letter: C_ke",
          answers: [
            {
              text: "e",
              is_correct: false,
            },
            {
              text: "a",
              is_correct: true,
            },
            {
              text: "i",
              is_correct: false,
            },
          ],
        },
      ] as IQuestion[],

      results: [
        {
          min: 0,
          max: 2,
          title: "Try again!",
          desc: "Do a little more studying and you may succeed!",
        },
        {
          min: 3,
          max: 3,
          title: "Wow, you're a genius!",
          desc: "Studying has definitely paid off for you!",
        },
      ] as IResult[],
    };
  },
});
</script>
