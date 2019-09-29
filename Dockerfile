FROM node:10.16
COPY . /sirius
RUN cd /sirius && yarn
CMD node /sirius/dist/main.js