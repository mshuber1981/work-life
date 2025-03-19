# Functions - Getting Started

> Don't reinvent the wheel, just realign it.

— Anthony J. D'Angelo

Here are three things I end up doing a lot.

1. Using [Node.js](https://nodejs.org/en) to read csv or Excel files

2. Using a [JSON Web Token](https://jwt.io/) and a library like [Axios](https://axios-http.com/) to interact with [REST APIs](https://restfulapi.net/)

3. Formatting and exporting [JSON](https://www.json.org/json-en.html) based data to csv or Excel files

## The Loop and Iteration

I got interested in programming because I hate long, annoying, repetitive tasks. Being able to iterate over a large list of things and let my code find what I am looking for, usally while I am drinking coffee, makes me feel like a super hero.

### [Meet my friend the for loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

#### Example code

```javascript
// A list of things
const list = [
  "Thing 1",
  "Thing 2",
  "Some special thing",
  "Thing 3",
  "Thing 4",
  "Thing 5",
];

// Loop over the list and find the thing you care about
for (let index = 0; index < list.length; index++) {
  const element = list[index];
  const special = "Some special thing";

  if (element === special) {
    console.log(`Alert! Match found for item ${index + 1} (${special}).`);
  } else {
    console.log(`No match for item ${index + 1}.`);
  }
}
```

#### Output

```bash
No match for item 1.
No match for item 2.
Alert! Match found for item 3 (Some special thing).
No match for item 4.
No match for item 5.
No match for item 6.
```
