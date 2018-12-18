from __future__ import print_function

import boto3

print("Loading Fucntion...")

def lambda_handler(event, context):
#Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)

    print(event)

    bucket='group-project-images'
    photo=event['Records'][0]['s3']['object']['key']


    
    client=boto3.client('rekognition')
    dyndb = boto3.client('dynamodb')


    response = client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}},
        MaxLabels=10)

    print('Detected labels for ' + photo) 
    print()   
    for label in response['Labels']:
        print ("Label: " + label['Name'])
        print ("Confidence: " + str(label['Confidence']))
        print("-------")
        dyndb.put_item(
            TableName='group-project',
            Item = {
                'tag': {'S':label['Name']},
                'image': {'S':event['Records'][0]['s3']['object']['key']},
                'confidence': {'S':str(label['Confidence'])}
            }
        )
        
    