import React from 'react';
import data from 'crawler/output.json';

const App = () => {
    let packages = data.reduce((prev, { name, packages }) => {
        const deps = packages
            .flatMap(({ dependencies, devDependencies }) => [
                ...Object.keys(dependencies),
                ...Object.keys(devDependencies)
            ])
            .filter((s, i, a) => a.indexOf(s) === i)
            .filter(
                (s, i, a) =>
                    s.startsWith('nav-frontend-') && s.endsWith('-style') && a.indexOf(s.replace('-style', '')) === -1
            );
        if (deps.length) {
            return { ...prev, [name]: deps };
        } else {
            return prev;
        }
    }, {});
    return (
        <ul>
            {Object.entries(packages).map(([name, deps]) => (
                <li key={name}>
                    <a href={`https://github.com/${name}`} target="_black">
                        {name}
                    </a>
                    <ul>
                        {deps.map((dep) => (
                            <li key={dep}>{dep}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

export default App;
