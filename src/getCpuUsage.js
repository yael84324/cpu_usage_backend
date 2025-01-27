const { getMetricDataFromCloudWatch, getInstanceIdFromIP } = require('./awsService');

async function getCpuUsage(req) {
    const { ipAddress, startTime, endTime, period } = req.query;
    
    const instanceId = await getInstanceIdFromIP(ipAddress);

    const data = await getMetricDataFromCloudWatch(
        instanceId,
        new Date(startTime),
        new Date(endTime),
        period
    );

    return {
      Timestamps: data.Timestamps,
      Values: data.Values,
    };
}

module.exports = { getCpuUsage };