const { getMetricDataFromCloudWatch, getInstanceIdForIPAddress } = require('./awsService');

async function getCpuUsage(req) {
    const { ipAddress, periodDays, period } = req.query;
    
    const instanceId = await getInstanceIdForIPAddress(ipAddress);

    console.log(instanceId);
    const currentTime = new Date();

    const startTime = new Date(currentTime.getTime() - (periodDays * 24 * 60 * 60 * 1000));
    console.log(startTime);
    const data = await getMetricDataFromCloudWatch(
        instanceId,
        startTime,
        currentTime,
        period
    );
    console.log(currentTime, startTime, period);
    console.log(data);
    return {
      Timestamps: data.Timestamps,
      Values: data.Values,
    };
}

module.exports = { getCpuUsage };