// Custom Expo config plugin to add Notifee's Maven repo to android/build.gradle
const { withProjectBuildGradle } = require("@expo/config-plugins"); //Getting access to the androids root build.gradle file so the plugin can modify it

const NOTIFEE_MAVEN_LINE =
  'maven { url "../../node_modules/@notifee/react-native/android/libs" }';

/**
 * Ensures the Notifee Maven repository is present in the root build.gradle.
 * Handles both legacy allprojects { repositories { ... } } and
 * dependencyResolutionManagement { repositories { ... } } structures.
 */
const withNotifeeMavenRepo = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const original = config.modResults.contents;
    let contents = original;

    if (contents.includes(NOTIFEE_MAVEN_LINE)) {
      //Checking if the above line is already present in the file
      config.modResults.contents = contents;
      return config;
    }

    // Below the plugin tries to insert it in the right place by looking for common repository sections in your Gradle file:

    // 1. allprojects { repositories { ... } } — used in older Gradle setups

    // 2. dependencyResolutionManagement { repositories { ... } } — used in newer setups

    // 3. any generic repositories { ... } block as a fallback

    // Try to inject into allprojects { repositories { ... } }
    const allProjectsRepoRegex = /allprojects\s*\{\s*repositories\s*\{\s*/m;
    if (allProjectsRepoRegex.test(contents)) {
      contents = contents.replace(
        allProjectsRepoRegex,
        (match) => `${match}    ${NOTIFEE_MAVEN_LINE}\n`
      ); //logic to add the line in the build.gradle file
    }

    // If still missing, try dependencyResolutionManagement block
    if (!contents.includes(NOTIFEE_MAVEN_LINE)) {
      const drmRepoRegex =
        /dependencyResolutionManagement\s*\{[\s\S]*?repositories\s*\{\s*/m;
      if (drmRepoRegex.test(contents)) {
        contents = contents.replace(
          drmRepoRegex,
          (match) => `${match}    ${NOTIFEE_MAVEN_LINE}\n`
        );
      }
    }

    // As a final fallback, attempt a more general injection inside the first repositories block found
    if (!contents.includes(NOTIFEE_MAVEN_LINE)) {
      const genericReposRegex = /repositories\s*\{\s*/m;
      if (genericReposRegex.test(contents)) {
        contents = contents.replace(
          genericReposRegex,
          (match) => `${match}    ${NOTIFEE_MAVEN_LINE}\n`
        );
      }
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withNotifeeMavenRepo;
