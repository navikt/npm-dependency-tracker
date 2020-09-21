module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/server/build/',
        '<rootDir>/shared/lib/',
        '<rootDir>/server/crawler/navikt-repos/'
    ],
    modulePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/server/build/',
        '<rootDir>/shared/lib/',
        '<rootDir>/server/crawler/navikt-repos/'
    ],
    testMatch: ['<rootDir>/shared/types/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['server/crawler', 'server/src'],
    coveragePathIgnorePatterns: ['node_modules', 'build', 'navikt-repos', 'output']
};
