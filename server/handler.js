// handler.js

const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_API_ENDPOINT,
});

module.exports.onOrder = async (event) => {
  const connectionId = event.requestContext.connectionId;

  try {
    // Perform any additional logic you need when 'onOrder' is triggered
    console.log(`'onOrder' triggered for connection ${connectionId}`);

    // Start the Step Functions state machine
    await startProgressStateMachine(connectionId);

    return { statusCode: 200, body: "Steps started." };
  } catch (error) {
    console.error("Error handling onOrder:", error);
    return { statusCode: 500, body: "Error handling onOrder." };
  }
};

module.exports.connect = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  // Save connectionId to DynamoDB or any other data store
  await dynamoDB
    .put({
      TableName: process.env.CONNECTIONS_TABLE_NAME,
      Item: { connectionId, domainName, stage },
    })
    .promise();

  return { statusCode: 200, body: "Connected." };
};

module.exports.disconnect = async (event) => {
  const connectionId = event.connectionId;

  // Remove connectionId from DynamoDB or any other data store
  await dynamoDB
    .delete({
      TableName: process.env.CONNECTIONS_TABLE_NAME,
      Key: { connectionId },
    })
    .promise();
  await disconnectClient(connectionId);
  return { statusCode: 200, body: "Disconnected." };
};

module.exports.progress = async (event) => {
  const connectionId = event.connectionId;
  const progressBody = {
    message: event.Message,
    progress: event.Progress,
  };

  // Perform progress update logic
  await postToConnection(connectionId, progressBody);

  return { statusCode: 200, body: "Progress updated.", connectionId };
};

module.exports.error = async (event) => {
  const connectionId = event.connectionId;

  try {
    // Perform error handling logic, if needed
    console.error("Error occurred:", event.Error);

    // Notify the client about the error
    await sendErrorMessage(connectionId, "An error occurred.");

    // Disconnect the client from the WebSocket
    await disconnectClient(connectionId);

    // Remove connectionId from DynamoDB or any other data store
    await dynamoDB
      .delete({
        TableName: process.env.CONNECTIONS_TABLE_NAME,
        Key: { connectionId },
      })
      .promise();

    return { statusCode: 200, body: "Error handled and client disconnected." };
  } catch (error) {
    console.error("Error handling error:", error);
    return { statusCode: 500, body: "Error handling error." };
  }
};

async function sendErrorMessage(connectionId, errorMessage) {
  try {
    // Construct the payload for the error message
    const payload = JSON.stringify({
      event: "error",
      message: errorMessage,
    });

    // Send the error message to the client
    await apiGatewayManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: payload,
      })
      .promise();
  } catch (error) {
    console.error("Error sending error message:", error);
    throw error;
  }
}

async function disconnectClient(connectionId) {
  try {
    // Use the API Gateway Management API to disconnect the client
    await apiGatewayManagementApi
      .deleteConnection({
        ConnectionId: connectionId,
      })
      .promise();
  } catch (error) {
    console.error("Error disconnecting client:", error);
    throw error;
  }
}

async function startProgressStateMachine(connectionId) {
  const stepFunctions = new AWS.StepFunctions();

  // Start the Step Function
  await stepFunctions
    .startExecution({
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: JSON.stringify({ connectionId }),
    })
    .promise();
}

async function postToConnection(connectionId, data) {
  try {
    const params = {
      ConnectionId: connectionId,
      Data: JSON.stringify(data),
    };
    await apiGatewayManagementApi.postToConnection(params).promise();
  } catch (error) {
    console.log("Error posting to connection", error);
    if (error.statusCode === 410) {
      console.log("Deleting stale connection");
      await dynamoDB
        .delete({
          TableName: "parceltracker-demo-connections",
          Key: { connectionId },
        })
        .promise();
    }
  }
}
