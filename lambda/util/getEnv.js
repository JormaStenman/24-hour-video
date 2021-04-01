module.exports = (...variables) => variables.reduce((env, key) => {
    const value = process.env[key];
    if (!value) {
        env.missing.add(key);
    } else {
        env[key] = value;
    }
    return env;
}, {missing: new Set()});