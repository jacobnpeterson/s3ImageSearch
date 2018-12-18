import json
import boto3

def lambda_handler(event, context):
    # # TODO implement

    dynamo = boto3.resource('dynamodb')

    table = dynamo.Table('group-project')

    response = table.query(
        KeyConditionExpression = "tag = :t",
        ExpressionAttributeValues = {
            ":t": event['tag']
        }
    )

    return {
        'statusCode': 200,
        'body': response['Items']
    }
