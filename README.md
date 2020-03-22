# Notification API

This is a notification API for the myTelenor mobile application.

## Framework

1. Coding Standard Strictly - which TS strictly follows
2. Error Handling - Getting the right error to understand
3. Logger - To keep the application logs for debugging
4. Middleware - to save you before the business logic
5. TDD - Testing Platform ready
6. Structured routes
7. Constant config for easy config change
8. In built API documentation - Swagger
9. Clustering of application for full performance gain form CPU

Here in this framework I tried to cater all the requirements to make this as the best possible framework to start with.

## Structure


## Building the app

You need to run the following command to start the application for development. There is one post npm installing command the first one, later you can run only the second one.

```
npm run postinstall
npm run dev
```

## Cluster

For Clustering I have used pm2 global package, which is very useful for utilizing the full capacity of the CPU and helps you to run fast node single thread applications. I have make a few commands to manage the pm2 easily with the application.

### Starting the cluster
```
npm run start
```

### Checking the list of instances of the cluster
```
npm run list
```

### Stopping the cluster
```
npm run stop
```

### Clear the stopped cluster from the list
```
npm run clear
```

### Check the cluster instance logs
```
npm run logs
```