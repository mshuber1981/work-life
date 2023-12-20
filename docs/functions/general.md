# General Stuff

## Required Function Parameters

One way to deal with required function parameters in JavaScript - [CSS-tricks.com Code Snippets](https://css-tricks.com/snippets/javascript/required-parameters-for-functions-in-javascript/)

[isRequired (general.js line 4)](https://github.com/mshuber1981/work-life/blob/main/utils/general.js#L4)

### Example isRequired usage

```javascript
const logName = (name = isRequired("Name")) => console.log(name);

logName();
```

### Example isRequired output

```bash
file:///home/mike/GitHub/personal/work-life/present/functions/General.js:6
  throw new Error(`${param} is required!`);
        ^

Error: Name is required!
```

## Terminal commands with Node.js

I needed a way to run a terminal command in Node and wait for the results. This leads me to Node's [Child process](https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html).

[execPromise (general.js line 10)](https://github.com/mshuber1981/work-life/blob/main/present/functions/general.js#L10)

### Example execPromise usage

```javascript
const whoAmI = (command) =>
  execPromise(command).then((response) => console.log(response));

whoAmI("whoami");
```

### Example execPromise output

```bash
mike
```
