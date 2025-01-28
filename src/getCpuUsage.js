const { getMetricDataFromCloudWatch, getInstanceIdForIPAddress } = require('./awsService');

async function getCpuUsage(req) {
    const { ipAddress, periodDays, period } = req.query;
    
    const instanceId = await getInstanceIdForIPAddress(ipAddress);

    const currentTime = new Date();

    const startTime = new Date(currentTime.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const data = await getMetricDataFromCloudWatch(
        instanceId,
        startTime,
        currentTime,
        period
    );

    return {
      Timestamps: data.Timestamps,
      Values: data.Values,
    };
}

module.exports = { getCpuUsage };