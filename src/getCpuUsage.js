const { getMetricDataFromCloudWatch, getInstanceIdFromIP } = require('./awsService');

async function getCpuUsage(req) {
    const { ipAddress, periodDays, period } = req.query;
    
    const instanceId = await getInstanceIdFromIP(ipAddress);

    const currentTime = new Date();

    const endTime = new Date(currentTime.getTime() + periodDays * 24 * 60 * 60 * 1000);

    const data = await getMetricDataFromCloudWatch(
        instanceId,
        currentTime,
        endTime,
        period
    );

    return {
      Timestamps: data.Timestamps,
      Values: data.Values,
    };
}

module.exports = { getCpuUsage };