# Orders

The keplr tickets managing tool (exercise)

---
## Requirements

For development, you will need Node.js, npm and Docker installed.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Docker installation
  Just follow the instructions on the official website of [Docker](https://docs.docker.com/get-docker/)

---

## Install

    $ git https://github.com/bryneTane/orders.git
    $ cd orders
    $ npm install

## launch database

Then create the database using the command

    $ docker-compose up
It will launc the database and the database admin tool as specified in docker-compose.yml file.

## Running the project in dev

    $ npm run start:dev

## Running the project in production

    $ npm run start

## Simple build for production

    $ npm run build


## Using the tool

### Adding an order

The `/ticket` webhook is used to add an order in the database.
the ticket format is

    Order: 323456
    VAT: 3.20
    Total: 16.90

    product,product_id,price
    Formule(s) midi,dZde,14.90
    Café,dZ8z,2

If a ticket doesn't have all these fields it will be considered as inconsistent and stored in the `inconsistent.csv` file. Somebody will be able to manage them manually later (using the oder endpoints of the tool).

If the ticket has all the required fields it is added to the PostgreSQL database.

To manage the large amount of requests, a queue is implemented (with p-queue) so that there will not be any concurrency during the execution. An oerder is added in the database only if the previous order has been added.

### Manage the tickets manually

The rejectes items are stored in `inconsisted.csv` file. Then we can process them and manage the database using the `CRUD` methods.

#### Create

Method : POST

    /ticket

Data format

    Order: 323456
    VAT: 3.20
    Total: 16.90

    product,product_id,price
    Formule(s) midi,dZde,14.90
    Café,dZ8z,2

#### Update

Method : PUT

    /orders/:orderId

Data format

    Order: 323456
    VAT: 3.20
    Total: 16.90

    product,product_id,price
    Formule(s) midi,dZde,14.90
    Café,dZ8z,2

#### Get

Method : GET

    /orders/:orderId

#### Delete

Method : DELETE

    /orders/:orderId

#### Get all

Method : GET

    /orders