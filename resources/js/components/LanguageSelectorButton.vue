<template>
  <b-dropdown
    :id="id"
    variant="link"
    toggle-class="text-decoration-none p-0"
    no-caret
    right
  >
    <template #button-content>
      <span class="text-uppercase">{{ currentLabel }}</span>
      <i class="fas fa-globe ml-1" />
    </template>
    <b-dropdown-item
      v-for="lang in languages"
      :key="lang.code"
      :active="lang.code === currentCode"
      @click="selectLanguage(lang.code)"
    >
      {{ lang.label }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
const LANGUAGES = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
];

export default {
  name: "LanguageSelectorButton",
  props: {
    id: {
      type: String,
      default: "language-selector",
    },
    type: {
      type: String,
      default: "navbar",
    },
    showLanguageCode: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      languages: LANGUAGES,
    };
  },
  computed: {
    currentCode() {
      if (this.language) {
        return this.language;
      }
      return document.documentElement.lang || "fa";
    },
    currentLabel() {
      const match = this.languages.find((l) => l.code === this.currentCode);
      if (!match) {
        return this.currentCode;
      }
      return this.showLanguageCode ? match.code : match.label;
    },
    isLoggedIn() {
      return Boolean(window.ProcessMaker?.userId);
    },
  },
  methods: {
    selectLanguage(code) {
      if (code === this.currentCode) {
        return;
      }

      if (this.isLoggedIn) {
        window.ProcessMaker.apiClient
          .put("users/update_language", { language: { code } })
          .then(() => {
            window.location.reload();
          })
          .catch(() => {
            this.setGuestLanguage(code);
          });
      } else {
        this.setGuestLanguage(code);
      }
    },
    setGuestLanguage(code) {
      document.cookie = `language=${code};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      window.location.reload();
    },
  },
};
</script>
