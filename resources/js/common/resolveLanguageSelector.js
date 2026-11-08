import CoreLanguageSelectorButton from "../components/LanguageSelectorButton.vue";

export default function resolveLanguageSelector(resolve) {
  if (window.ProcessMaker.languageSelectorButtonComponent) {
    resolve(window.ProcessMaker.languageSelectorButtonComponent);
  } else {
    resolve(CoreLanguageSelectorButton);
  }

  if (window.ProcessMaker.languageSelectorButtonComponentResolve) {
    window.ProcessMaker.languageSelectorButtonComponentResolve(
      window.ProcessMaker.languageSelectorButtonComponent || CoreLanguageSelectorButton,
    );
    window.ProcessMaker.languageSelectorButtonComponentResolve = null;
  }
}
