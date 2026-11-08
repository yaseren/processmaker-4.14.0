import Vue from "vue";

window.ProcessMaker.languageSelector = new Vue({
  el: "#language-selector",
  components: {
    LanguageSelectorButton: (resolve) => {
      require("../common/resolveLanguageSelector").default(resolve);
    },
  },
});
