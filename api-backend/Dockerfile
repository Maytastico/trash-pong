# Set the base image from Docker repository to build our app. In this case we want to use node image to run our node app
FROM node:18.16.0-alpine as base

# Then, we need to copy our package.json and .env file into the image root folder.
COPY package.json ./

# Then, we need to install the dependencies inside the base image
RUN npm install

# After installing the dependencies, we need to copy the src folder from our local file into the base image
COPY source ./source

# Copy tsconfig.json to base image too
COPY tsconfig.json ./tsconfig.json

# Then, run the build command, this will compile the ts files into javascript files
RUN npm run build

# After using base image for build process, we can create another image for the production build
# Start production image build, we will use the same node image
FROM node:18.16.0-alpine

# Copy node modules and build directory from base image to new image
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base /dist /dist

# Expose port 3000, and start the app.
EXPOSE 3000
CMD ["npm", "run", "start"]
