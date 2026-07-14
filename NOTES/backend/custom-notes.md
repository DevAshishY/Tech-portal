## express 
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## env 
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
## gitignore 
add files that not need to push Live like node module or dotenv file
### how to handle CORS 
Need to handle with backend whitelist url 

Add proxy from frotend 

### Middleware 

app.use(exxpress.static('dist') 
for serve static files 


### Moon Modeler 
Schema Design Tool for MongoDB and noSQL Data Modeling

### mongoose 
Elegant MongoDB object modeling for Node.js

## when we make schema in mongoose , it will save on mongo db with purals 

```
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

const Product = mongoose.model("Product", productSchema);

Collection created:

products

```

### Interview 

write syntax axios and fetch 

how to handle CORS frontend and backend



