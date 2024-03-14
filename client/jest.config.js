module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    reporters: [ "default", "jest-junit" ],
};