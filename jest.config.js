module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
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
    testMatch: [
        '<rootDir>/shared/**/__tests__/*.test.ts',
        '<rootDir>/server/**/__tests__/*.test.ts'
    ],
    collectCoverage: false,
    collectCoverageFrom: ['server/crawler', 'server/src'],
    coveragePathIgnorePatterns: ['node_modules', 'build', 'navikt-repos', 'output']
};
