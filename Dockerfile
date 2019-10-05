FROM node:10.16
COPY . /sirius
RUN cd /sirius && yarn
RUN cd /sirius && npx lerna bootstrap
CMD node /sirius/dist/main.js