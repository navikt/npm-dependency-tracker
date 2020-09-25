module.exports = {
    preset: 'ts-jest/presets/js-with-babel',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.js?$': 'babel-jest'
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/app/server/build/',
        '<rootDir>/shared/lib/',
        '<rootDir>/app/server/repositories/',
        '<rootDir>/app/server/crawler/__mock__/'
    ],
    modulePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/app/server/build/',
        '<rootDir>/shared/lib/',
        '<rootDir>/app/server/repositories/',
        '<rootDir>/app/server/crawler/__mock__/'
    ],
    testMatch: [
        '<rootDir>/shared/**/*.test.ts',
        '<rootDir>/app/server/**/*.test.ts'
    ],
    collectCoverage: false,
    collectCoverageFrom: ['server/crawler', 'server/src'],
    coveragePathIgnorePatterns: [
        'node_modules',
        'build',
        'repositories',
        'output',
        '__mock__',
        '__tests__'
    ]
};
