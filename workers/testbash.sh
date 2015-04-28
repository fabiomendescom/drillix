#!/bin/bash
for i in {1..340}
do
   aws kinesis put-record --stream-name Foo --data "SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=" --partition-key shardId-000000000000 --region us-east-1
done
