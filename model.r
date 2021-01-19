library(e1071)
library(caret)

data <- read.csv("GitHub/bpmodels-statistical-analysis/training.csv", 
                          header = TRUE)

partition <- createDataPartition(y = data$hasError, p = 0.80, list = FALSE)

training_data <- data[partition, ]
test_data  <- data[-partition, ]

model <- glm(hasError ~ elements + activities + events + 
                 startEvents + endEvents + gateways + lanesAndPools + 
                 sequenceFlows, 
             data = training_data, 
             family=binomial())

summary(model)

prediction <- predict(model, newdata = test_data, type = "response")

confusionMatrix(as.factor(prediction < 0.5), 
                as.factor(test_data$hasError < 1))
