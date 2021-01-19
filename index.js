const fs = require("fs");

const path = "./bpmai/models/";

const measuresStream = fs.createWriteStream("measures.csv");
const thresholdsStream = fs.createWriteStream("thresholds.csv");
const predicatesStream = fs.createWriteStream("predicates.csv");
const aggregatesStream = fs.createWriteStream("aggregates.csv");
const trainingStream = fs.createWriteStream("training.csv");

let measures = [];

// Extract measures
fs.readdirSync(path).forEach(file => {

    if (file.includes(".meta.json")) {

        console.log("Processing " + file + " ...");

        let modelMeta = fs.readFileSync(path + file, "utf8");
        let modelMetaObj = JSON.parse(modelMeta);

        let modelingLanguage = modelMetaObj.model.modelingLanguage;

        if (modelingLanguage === "bpmn20") {

            let modelMeasures = {
                total: 0,
                EndMessageEvent: 0,
                Lane: 0,
                IntermediateMessageEventCatching: 0,
                Pool: 0,
                MessageFlow: 0,
                TextAnnotation: 0,
                Association_Undirected: 0,
                SequenceFlow: 0,
                Task: 0,
                CollapsedPool: 0,
                BPMNDiagram: 0,
                Exclusive_Databased_Gateway: 0,
                EndNoneEvent: 0,
                ParallelGateway: 0,
                InclusiveGateway: 0,
                StartMessageEvent: 0,
                StartNoneEvent: 0,
                StartTimerEvent: 0,
                DataObject: 0,
                IntermediateMessageEventThrowing: 0,
                Association_Unidirectional: 0,
                IntermediateTimerEvent: 0,
                DataStore: 0,
                ITSystem: 0,
                EndTerminateEvent: 0,
                EventbasedGateway: 0,
                CollapsedSubprocess: 0,
                IntermediateSignalEventCatching: 0,
                Subprocess: 0,
                Message: 0,
                IntermediateLinkEventCatching: 0,
                IntermediateErrorEvent: 0,
                ComplexGateway: 0,
                StartEscalationEvent: 0,
                EndEscalationEvent: 0,
                IntermediateConditionalEvent: 0,
                IntermediateCompensationEventThrowing: 0,
                EndCompensationEvent: 0,
                IntermediateCompensationEventCatching: 0,
                EventSubprocess: 0,
                StartCompensationEvent: 0,
                EndCancelEvent: 0,
                processparticipant: 0,
                StartSignalEvent: 0,
                IntermediateEscalationEvent: 0,
                StartConditionalEvent: 0,
                EndErrorEvent: 0,
                IntermediateLinkEventThrowing: 0,
                Group: 0,
                Association_Bidirectional: 0,
                IntermediateMultipleEventCatching: 0,
                IntermediateEscalationEventThrowing: 0,
                IntermediateEvent: 0,
                StartErrorEvent: 0,
                StartMultipleEvent: 0,
                EndSignalEvent: 0,
                IntermediateSignalEventThrowing: 0,
                IntermediateCancelEvent: 0,
                CollapsedEventSubprocess: 0,
                StartParallelMultipleEvent: 0,
                VerticalLane: 0,
                VerticalPool: 0,
                IntermediateParallelMultipleEventCatching: 0,
                EndMultipleEvent: 0,
                IntermediateMultipleEventThrowing: 0,
                ChoreographyTask: 0,
                ChoreographyParticipant: 0,
                ChoreographySubprocessExpanded: 0,
                ChoreographySubprocessCollapsed: 0,
                CollapsedVerticalPool: 0
            };

            modelMeasures["fileName"] = file;

            for (const [key, value] of Object.entries(modelMetaObj.revision.elementCounts)) {
                modelMeasures[key] = value;
            }

            measures.push(modelMeasures);
        }
    }
});

// Save measures
measuresStream.once("open", function(fd) {

    for (const [key, value] of Object.entries(measures[0])) {

        measuresStream.write(key + ",");
    }

    measuresStream.write("\n");

    for (let i = 0; i < measures.length; i++) {

        for (const [key, value] of Object.entries(measures[i])) {

            measuresStream.write(value + ",");
        }

        measuresStream.write("\n");
    }

    measuresStream.end();
});

let thresholds = [];

// Extract thresholds
for (let i = 0; i < measures.length; i++) {

    let modelThresholds = {
        elements: 0,
        activities: 0,
        events: 0,
        startEvents: 0,
        endEvents: 0,
        gateways: 0,
        lanesAndPools: 0,
        sequenceFlows: 0
    };

    modelThresholds["fileName"] = measures[i].fileName;
    modelThresholds.elements += measures[i].total;
    modelThresholds.sequenceFlows += measures[i].SequenceFlow;

    for (const [key, value] of Object.entries(measures[i])) {

        if (key.toLowerCase().includes("task") || key.toLowerCase().includes("subprocess")) {
            modelThresholds.activities += value;
        }

        if (key.toLowerCase().includes("event")) {
            modelThresholds.events += value;
        }

        if (key.toLowerCase().includes("start")) {
            modelThresholds.startEvents += value;
        }

        if (key.toLowerCase().includes("end")) {
            modelThresholds.endEvents += value;
        }

        if (key.toLowerCase().includes("gateway")) {
            modelThresholds.gateways += value;
        }

        if (key.toLowerCase().includes("lane") || key.toLowerCase().includes("pool")) {
            modelThresholds.lanesAndPools += value;
        }
    }

    thresholds.push(modelThresholds);
}

// Save thresholds
thresholdsStream.once("open", function(fd) {

    for (const [key, value] of Object.entries(thresholds[0])) {

        thresholdsStream.write(key + ",");
    }

    thresholdsStream.write("\n");

    for (let i = 0; i < thresholds.length; i++) {

        for (const [key, value] of Object.entries(thresholds[i])) {

            thresholdsStream.write(value + ",");
        }

        thresholdsStream.write("\n");
    }

    thresholdsStream.end();
});

// Describe predicates
const thresholdPredicates = {
    elements: x => x <= 37 ? 1 : 0,
    activities: x => x <= 31 ? 1 : 0,
    events: x => x <= 7 ? 1 : 0,
    startEvents: x => x === 1 ? 1 : 0,
    endEvents: x => x === 1 ? 1 : 0,
    gateways: x => x <= 18 ? 1 : 0,
    lanesAndPools: x => x <= 4 ? 1 : 0,
    sequenceFlows: x => x <= 34 ? 1 : 0
};

// Save predicates
predicatesStream.once("open", function(fd) {

    for (const [key, value] of Object.entries(thresholds[0])) {

        predicatesStream.write(key + ",");
    }

    predicatesStream.write("\n");

    for (let i = 0; i < thresholds.length; i++) {

        for (const [key, value] of Object.entries(thresholds[i])) {

            if (key === "fileName") {

                predicatesStream.write(value + ",");
            } else {

                predicatesStream.write(thresholdPredicates[key](value) + ",");
            }
        }

        predicatesStream.write("\n");
    }

    predicatesStream.end();
});

// Aggregate functions
const aggregateFunctions = {
    maximin: function(predicates) {
        let values = [];

        for (const [key, value] of Object.entries(predicates)) {

            if (key !== "fileName") {

                values.push(thresholdPredicates[key](value));
            }
        }

        return Math.min(...values);
    },

    normalization: function(predicates) {
        let sum = 0;

        for (const [key, value] of Object.entries(predicates)) {

            if (key !== "fileName") {

                sum += thresholdPredicates[key](value);
            }
        }

        return sum / 8;
    }
}

// Save aggregates
aggregatesStream.once("open", function(fd) {

    aggregatesStream.write("fileName,min,normalized\n");

    for (let i = 0; i < thresholds.length; i++) {

        aggregatesStream.write(thresholds[i].fileName + ",");
        aggregatesStream.write(aggregateFunctions.maximin(thresholds[i]) + ",");
        aggregatesStream.write(aggregateFunctions.normalization(thresholds[i]) + ",");

        aggregatesStream.write("\n");
    }

    aggregatesStream.end();
});

// Prepare training dataset
trainingStream.once("open", function(fd) {

    for (const [key, value] of Object.entries(thresholds[0])) {

        trainingStream.write(key + ",");
    }

    trainingStream.write("min,normalized,\n");

    for (let i = 0; i < thresholds.length; i++) {

        for (const [key, value] of Object.entries(thresholds[i])) {

            trainingStream.write(value + ",");
        }

        trainingStream.write(aggregateFunctions.maximin(thresholds[i]) + ",");
        trainingStream.write(aggregateFunctions.normalization(thresholds[i]) + ",");

        trainingStream.write("\n");
    }

    trainingStream.end();
});