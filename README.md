# PriceMyData
[In Development] Project to crowdfund data valuations<br>
Development version live <a href="https://www.pricemydata.com">here</a>

## Running the project

Ensure that you have the npm package mananger installed, along with NodeJS > 10.16

Then, navigate to the root folder of the project and run: 

```bash
npm install --save
```

This project requies an .env file at the root level to run. The default env configuration for local development is as follows:
```
NODE_ENV=development
PORT=3000
MONGO=mongodb://localhost:27017/
```
To run the project locally:

```bash
npm run dev
```

To build the project for production:

```bash
npm run build
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
N/A

## Contact
Please contact Raghav Mecheri for more details.

## References
Ref: https://dev.to/kedar9/creating-a-node-app-with-react-webpack-4-babel-7-express-and-sass-3mae for project setup details
