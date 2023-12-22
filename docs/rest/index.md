# REST APIs - Getting Started

What is a REST API? - [https://restfulapi.net/](https://restfulapi.net/)

## HTTP Request Lingo

When you are looking for answers, it helps to ask the right questions. If you want to get information from a REST API then you need to understand [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

## HTTP Requests in JavaScript

I made my first API request with [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) from a browser. Since then I have been learning more about [Node](https://nodejs.org/en) and using [Axios](https://axios-http.com/) to interact with REST APIs.

### Example Usage ([GitHub REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28))

```javascript
const projectNames = [];

try {
  console.log("Fetching GitHub projects...");
  const result = await axios.get(process.env.API_URL);
  result.data.forEach((element) => {
    projectNames.push(element.name);
  });
  console.log(`My GitHub project names:\n${projectNames.join(", ")}`);
} catch (error) {
  console.log(error);
}
```

### Example output

```bash
Fetching GitHub projects...
My GitHub project names:
CRA-Starter, FCC-Front-End-Libraries-Projects, FCC-JavaScript-Algorithms-and-Data-Structures-Projects, FCC-Responsive-Web-Design-Projects, github-react-portfolio-template, mshuber1981, next-starter, Portfolio, react-contact-form, work-life
```

## My work life in JSON

I have to look at it so often now, when people start describing problems to me at work now I catch myself thinking about key-value pairs and what things might be objects vs arrays. This is a great resource to understand what JSON is and why it is important.

[A beginner’s guide to JSON, the data format for the internet](https://stackoverflow.blog/2022/06/02/a-beginners-guide-to-json-the-data-format-for-the-internet/)
