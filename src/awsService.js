const { CloudWatchClient, GetMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const awsConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
};

const cloudWatchClient = new CloudWatchClient(awsConfig);
const ec2Client = new EC2Client(awsConfig);

async function getInstanceIdFromIP(ipAddress) {
    const params = {
        Filters: [
            {
                Name: 'private-ip-address', 
                Values: [ipAddress],
            },
        ],
    };

    try {
        const data = await ec2Client.send(new DescribeInstancesCommand(params));

        if(!data.Reservations[0].Instances || !data.Reservations[0].Instances.length || !data.Reservations[0].Instances[0].InstanceId){
            throw new Error('Not found any instance');
        }

        const instanceId = data.Reservations[0].Instances[0].InstanceId;

        return instanceId;
    } catch (err) {
        console.error(`Error fetching instance ID from IP: ${ipAddress}, error: ${err}`);
        throw err;
    }
}

async function getMetricDataFromCloudWatch(instanceId, startTime, endTime, period) {
    const params = {
        StartTime: startTime,
        EndTime: endTime,
        MetricDataQueries: [
            {
                Id: 'cpuUtilization',
                MetricStat: {
                    Metric: {
                        Namespace: 'AWS/EC2',
                        MetricName: 'CPUUtilization',
                        Dimensions: [
                            {
                                Name: 'InstanceId',
                                Value: instanceId,
                            },
                        ],
                    },
                    Period: period,
                    Stat: 'Average'
                },
                ReturnData: true,
            },
        ],
    };

    try {
        const data = await cloudWatchClient.send(
            new GetMetricDataCommand(params)
        );

        return data.MetricDataResults[0];
    } catch (err) {
        console.error("Error fetching CloudWatch data:", err);
        throw err;
    }
}

module.exports = { getInstanceIdFromIP, getMetricDataFromCloudWatch };